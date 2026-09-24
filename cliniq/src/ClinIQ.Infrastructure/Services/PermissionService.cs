using System.Collections.Concurrent;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Constants;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace ClinIQ.Infrastructure.Services;

/// <summary>
/// Effective permission resolution.
///
/// Ordering matters and is deliberate:
///   1. the tenant owner receives every permission the org is entitled to,
///      because their role has an intentionally empty default permission set
///   2. staff start from the union of the permissions across every active role
///      they hold in the tenant (predefined OR custom — whatever is assigned)
///   3. plus explicit user-level grants (UserPermission, IsGranted=true)
///   4. minus explicit user-level denies (deny always wins)
///   5. intersected with the tenant's feature entitlements
///
/// Step 5 is why a user holding "admissions.view" still cannot reach IPD when
/// the organization's package excludes it.
///
/// Permissions are cached per tenant-user. The cache is generation-stamped per
/// tenant, so editing a role, a role assignment, a user permission, or the
/// subscription entitlements invalidates every affected user immediately via
/// InvalidateTenant/InvalidateUser instead of waiting out the 5-minute TTL.
/// </summary>
public class PermissionService : IPermissionService
{
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(5);

    private readonly ApplicationDbContext _context;
    private readonly IEntitlementService _entitlements;
    private readonly IMemoryCache _cache;

    // Per-tenant generation stamp. Bumping it changes every permission cache key
    // for that tenant, which is how a memory cache with no key enumeration can
    // still be invalidated wholesale. In-process scope is fine (IMemoryCache is
    // already per-process); move this to a shared store only for multi-node.
    private readonly ConcurrentDictionary<Guid, int> _generations = new();

    public PermissionService(
        ApplicationDbContext context,
        IEntitlementService entitlements,
        IMemoryCache cache)
    {
        _context = context;
        _entitlements = entitlements;
        _cache = cache;
    }

    private static string CacheKey(Guid tenantId, int generation, Guid userId, Guid? branchId)
        => $"perm:{tenantId:N}:{generation}:{userId:N}:{branchId?.ToString("N") ?? "all"}";

    private int Generation(Guid tenantId) => _generations.GetOrAdd(tenantId, 0);

    public async Task<IReadOnlySet<string>> GetEffectivePermissionsAsync(
        Guid userId, Guid tenantId, Guid? branchId = null, CancellationToken cancellationToken = default)
    {
        var key = CacheKey(tenantId, Generation(tenantId), userId, branchId);
        if (_cache.TryGetValue<IReadOnlySet<string>>(key, out var cached) && cached is not null)
            return cached;

        var empty = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        // Membership is the gate. No active membership row means no permissions,
        // whatever the token asserts.
        var membership = await _context.TenantUsers
            .IgnoreQueryFilters().AsNoTracking()
            .Where(tu => tu.UserId == userId && tu.TenantId == tenantId && tu.IsActive)
            .Select(tu => new { tu.IsOwner })
            .FirstOrDefaultAsync(cancellationToken);

        if (membership is null)
            return empty;

        var enabledFeatures = await _entitlements.GetEnabledFeaturesAsync(tenantId, cancellationToken);

        // Baseline permission set.
        //
        // Owner: every permission the org is entitled to. Their role carries no
        // explicit permissions by design, so treat them as full-access rather
        // than resolving an empty role set.
        //
        // Staff: the union of the permissions from every active role they hold
        // in this tenant. This is what makes custom roles real — a role's
        // permissions are enforced, not cosmetics. A staff member with no role
        // (or only roles with no permissions) ends up with nothing.
        var effective = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        if (membership.IsOwner)
        {
            effective.UnionWith(PermissionCatalog.All.Select(p => p.Name));
        }
        else
        {
            var rolePermissionNames = await _context.UserRoles
                .IgnoreQueryFilters().AsNoTracking()
                .Where(ur => ur.UserId == userId && ur.TenantId == tenantId)
                .Join(_context.Roles.IgnoreQueryFilters()
                          .Where(r => (r.TenantId == null || r.TenantId == tenantId) && r.IsActive && !r.IsDeleted),
                      ur => ur.RoleId, r => r.Id, (_, r) => r.Id)
                .Distinct()
                .Join(_context.RolePermissions.IgnoreQueryFilters(),
                      roleId => roleId, rp => rp.RoleId, (_, rp) => rp.PermissionId)
                .Distinct()
                .Join(_context.Permissions.IgnoreQueryFilters(),
                      permId => permId, p => p.Id, (_, p) => p.Name)
                .Select(p => p)
                .ToListAsync(cancellationToken);

            effective.UnionWith(rolePermissionNames);
        }

        // 2 & 3. User-level overrides, branch-scoped where applicable. On the
        //        owner/everything baseline only explicit denies are meaningful;
        //        on a role baseline both grants and denies apply. Deny always
        //        wins, applied last.
        var now = DateTime.UtcNow;
        var overrides = await _context.UserPermissions
            .IgnoreQueryFilters().AsNoTracking()
            .Where(up => up.UserId == userId
                      && up.TenantId == tenantId
                      && (up.ExpiresAt == null || up.ExpiresAt > now)
                      && (up.BranchId == null || branchId == null || up.BranchId == branchId))
            .Join(_context.Permissions.IgnoreQueryFilters(),
                  up => up.PermissionId, p => p.Id,
                  (up, p) => new { p.Name, up.IsGranted })
            .ToListAsync(cancellationToken);

        foreach (var grant in overrides.Where(o => o.IsGranted))
            effective.Add(grant.Name);

        // Deny last so a role grant cannot re-add it.
        foreach (var deny in overrides.Where(o => !o.IsGranted))
            effective.Remove(deny.Name);

        // 5. Intersect with entitlements.
        effective.RemoveWhere(p => !IsFeatureEnabled(p, enabledFeatures));

        IReadOnlySet<string> result = effective;
        _cache.Set(key, result, CacheTtl);
        return result;
    }

    /// <summary>
    /// Maps "billing.refund" -> the "billing" feature and checks the entitlement
    /// set. Administration permissions are never feature-gated, otherwise an
    /// owner could lock themselves out of their own organization.
    /// </summary>
    private static bool IsFeatureEnabled(string permission, IReadOnlySet<string> enabledFeatures)
    {
        var dot = permission.IndexOf('.');
        if (dot <= 0) return true;

        var prefix = permission[..dot];

        if (PermissionCatalog.UngatedPrefixes.Contains(prefix))
            return true;

        return PermissionCatalog.PrefixToFeature.TryGetValue(prefix, out var feature)
            ? enabledFeatures.Contains(feature)
            : true; // unknown prefix: fail open on entitlement, still gated by permission
    }

    public async Task<bool> HasPermissionAsync(
        Guid userId, Guid tenantId, string permission,
        Guid? branchId = null, CancellationToken cancellationToken = default)
    {
        var perms = await GetEffectivePermissionsAsync(userId, tenantId, branchId, cancellationToken);
        return perms.Contains(permission);
    }

    public async Task<bool> HasAllPermissionsAsync(
        Guid userId, Guid tenantId, IEnumerable<string> permissions,
        Guid? branchId = null, CancellationToken cancellationToken = default)
    {
        var perms = await GetEffectivePermissionsAsync(userId, tenantId, branchId, cancellationToken);
        return permissions.All(perms.Contains);
    }

    public async Task<IReadOnlyList<Guid>> GetAccessibleBranchIdsAsync(
        Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.BranchUsers
            .IgnoreQueryFilters().AsNoTracking()
            .Where(bu => bu.UserId == userId && bu.TenantId == tenantId && bu.IsActive)
            .Select(bu => bu.BranchId)
            .Distinct()
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> IsMemberOfTenantAsync(
        Guid userId, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.TenantUsers
            .IgnoreQueryFilters().AsNoTracking()
            .AnyAsync(tu => tu.UserId == userId && tu.TenantId == tenantId && tu.IsActive, cancellationToken);
    }

    public async Task<IReadOnlyList<string>> GetNonGrantablePermissionsAsync(
        Guid actorUserId, Guid tenantId, IEnumerable<string> requested,
        CancellationToken cancellationToken = default)
    {
        var actorPerms = await GetEffectivePermissionsAsync(actorUserId, tenantId, null, cancellationToken);
        return requested
            .Where(p => !actorPerms.Contains(p))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    public void InvalidateUser(Guid userId, Guid tenantId)
    {
        // A generation bump invalidates this user's cached set along with
        // everyone else's in the tenant. The userId argument is retained to keep
        // the call sites self-documenting and the interface stable.
        BumpGeneration(tenantId);
    }

    public void InvalidateTenant(Guid tenantId) => BumpGeneration(tenantId);

    private void BumpGeneration(Guid tenantId)
        => _generations.AddOrUpdate(tenantId, 1, (_, current) => current + 1);
}
