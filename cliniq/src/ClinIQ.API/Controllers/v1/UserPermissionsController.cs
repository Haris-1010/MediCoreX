using System.Security.Claims;
using ClinIQ.API.Authorization;
using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Infrastructure.Services;
using ClinIQ.Shared.Constants;
using ClinIQ.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinIQ.Domain.Entities.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

/// <summary>
/// Sections 108-111 and 131. Lets a Master User manage child users:
/// granular permission overrides, branch scope, and secure password resets.
/// </summary>
[ApiController]
[Route("api/v1/users")]
[Authorize]
public class UserPermissionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPermissionService _permissions;
    private readonly IEntitlementService _entitlements;
    private readonly ITenantService _tenant;
    private readonly ILogger<UserPermissionsController> _logger;

    public UserPermissionsController(
        ApplicationDbContext context,
        IPermissionService permissions,
        IEntitlementService entitlements,
        ITenantService tenant,
        ILogger<UserPermissionsController> logger)
    {
        _context = context;
        _permissions = permissions;
        _entitlements = entitlements;
        _tenant = tenant;
        _logger = logger;
    }

    private Guid CurrentUserId =>
        Guid.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : Guid.Empty;

    private Guid? CurrentTenantId => _tenant.GetCurrentTenantId();

    /// <summary>
    /// The full permission catalogue grouped by module, with a flag for each
    /// showing whether the target user currently has it and where it came from.
    /// Drives the permission matrix in section 111.
    /// </summary>
    [HttpGet("{userId:guid}/permissions")]
    [RequirePermission(Permissions.UsersView)]
    public async Task<IActionResult> GetUserPermissions(Guid userId, CancellationToken cancellationToken)
    {
        var tenantId = CurrentTenantId;
        if (tenantId is null) return Forbid();

        if (!await _permissions.IsMemberOfTenantAsync(userId, tenantId.Value, cancellationToken))
            return NotFound(new { message = "User is not a member of this organization." });

        var callerUserId = CurrentUserId;
        var callerIsOwner = await _context.TenantUsers.IgnoreQueryFilters()
            .AnyAsync(tu => tu.TenantId == tenantId.Value && tu.UserId == callerUserId && tu.IsOwner && tu.IsActive, cancellationToken);
        var callerIsAdmin = await IsUserAdminAsync(tenantId.Value, callerUserId, cancellationToken);

        if (!callerIsOwner && !callerIsAdmin)
        {
            var targetIsOwner = await _context.TenantUsers.IgnoreQueryFilters()
                .AnyAsync(tu => tu.TenantId == tenantId.Value && tu.UserId == userId && tu.IsOwner, cancellationToken);
            if (targetIsOwner) return Forbid();

            var targetIsAdmin = await IsUserAdminAsync(tenantId.Value, userId, cancellationToken);
            if (targetIsAdmin) return Forbid();
        }

        var effective = await _permissions.GetEffectivePermissionsAsync(userId, tenantId.Value, null, cancellationToken);

        var overrides = await _context.UserPermissions
            .IgnoreQueryFilters().AsNoTracking()
            .Where(up => up.UserId == userId && up.TenantId == tenantId)
            .Join(_context.Permissions.IgnoreQueryFilters(), up => up.PermissionId, p => p.Id,
                  (up, p) => new { p.Name, up.IsGranted, up.BranchId })
            .ToListAsync(cancellationToken);

        var overrideMap = overrides.ToDictionary(o => o.Name, o => o, StringComparer.OrdinalIgnoreCase);

        var enabledFeatures = await _entitlements.GetEnabledFeaturesAsync(tenantId.Value, cancellationToken);

        var groups = PermissionCatalog.All
            .Where(p => IsPermissionAllowed(p.Name, enabledFeatures))
            .GroupBy(p => p.Module)
            .OrderBy(g => g.Key)
            .Select(g => new
            {
                module = g.Key,
                category = g.First().Category,
                permissions = g.OrderBy(p => p.DisplayOrder).Select(p => new
                {
                    name = p.Name,
                    displayName = p.DisplayName,
                    granted = effective.Contains(p.Name),
                    source = overrideMap.TryGetValue(p.Name, out var o)
                        ? (o.IsGranted ? "user-grant" : "user-deny")
                        : effective.Contains(p.Name) ? "role" : "none",
                    branchId = overrideMap.TryGetValue(p.Name, out var ob) ? ob.BranchId : null
                })
            });

        return Ok(new { userId, modules = groups });
    }

    /// <summary>
    /// Replaces this user's overrides. Grants are refused when the actor does
    /// not hold the permission themselves — a child user must never be able to
    /// mint privileges above their own (section 115).
    /// </summary>
    [HttpPut("{userId:guid}/permissions")]
    [RequirePermission(Permissions.UsersEdit)]
    public async Task<IActionResult> SetUserPermissions(
        Guid userId,
        [FromBody] SetUserPermissionsRequest request,
        CancellationToken cancellationToken)
    {
        var tenantId = CurrentTenantId;
        if (tenantId is null) return Forbid();

        if (userId == CurrentUserId)
            return BadRequest(new { message = "You cannot change your own permissions." });

        if (!await _permissions.IsMemberOfTenantAsync(userId, tenantId.Value, cancellationToken))
            return NotFound(new { message = "User is not a member of this organization." });

        var callerUserId = CurrentUserId;
        var callerIsOwner = await _context.TenantUsers.IgnoreQueryFilters()
            .AnyAsync(tu => tu.TenantId == tenantId.Value && tu.UserId == callerUserId && tu.IsOwner && tu.IsActive, cancellationToken);
        var callerIsAdmin = await IsUserAdminAsync(tenantId.Value, callerUserId, cancellationToken);

        if (!callerIsOwner && !callerIsAdmin)
        {
            var targetIsOwner = await _context.TenantUsers.IgnoreQueryFilters()
                .AnyAsync(tu => tu.TenantId == tenantId.Value && tu.UserId == userId && tu.IsOwner, cancellationToken);
            if (targetIsOwner) return Forbid();

            var targetIsAdmin = await IsUserAdminAsync(tenantId.Value, userId, cancellationToken);
            if (targetIsAdmin) return Forbid();
        }

        var grants = request.Grants ?? Array.Empty<string>();
        var denies = request.Denies ?? Array.Empty<string>();

        // Escalation guard.
        var isSuperAdmin = User.FindFirst("is_super_admin")?.Value == "true";
        if (!isSuperAdmin)
        {
            var notGrantable = await _permissions.GetNonGrantablePermissionsAsync(
                CurrentUserId, tenantId.Value, grants, cancellationToken);

            if (notGrantable.Count > 0)
                return BadRequest(new
                {
                    message = "You cannot grant permissions you do not hold yourself.",
                    permissions = notGrantable
                });
        }

        var known = PermissionCatalog.All.Select(p => p.Name).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var unknown = grants.Concat(denies).Where(p => !known.Contains(p)).Distinct().ToList();
        if (unknown.Count > 0)
            return BadRequest(new { message = "Unknown permissions.", permissions = unknown });

        var permissionIds = await _context.Permissions
            .IgnoreQueryFilters()
            .Where(p => p.IsActive)
            .ToDictionaryAsync(p => p.Name, p => p.Id, StringComparer.OrdinalIgnoreCase, cancellationToken);

        await using var tx = await _context.Database.BeginTransactionAsync(cancellationToken);

        var existing = await _context.UserPermissions
            .IgnoreQueryFilters()
            .Where(up => up.UserId == userId && up.TenantId == tenantId)
            .ToListAsync(cancellationToken);

        _context.UserPermissions.RemoveRange(existing);

        foreach (var name in grants.Distinct(StringComparer.OrdinalIgnoreCase))
        {
            if (!permissionIds.TryGetValue(name, out var pid)) continue;
            _context.UserPermissions.Add(new UserPermission
            {
                TenantId = tenantId.Value,
                UserId = userId,
                PermissionId = pid,
                IsGranted = true,
                BranchId = request.BranchId,
                GrantedBy = CurrentUserId,
                GrantedAt = DateTime.UtcNow,
                Reason = request.Reason
            });
        }

        foreach (var name in denies.Distinct(StringComparer.OrdinalIgnoreCase))
        {
            if (!permissionIds.TryGetValue(name, out var pid)) continue;
            _context.UserPermissions.Add(new UserPermission
            {
                TenantId = tenantId.Value,
                UserId = userId,
                PermissionId = pid,
                IsGranted = false,
                BranchId = request.BranchId,
                GrantedBy = CurrentUserId,
                GrantedAt = DateTime.UtcNow,
                Reason = request.Reason
            });
        }

        await _context.SaveChangesAsync(cancellationToken);
        await tx.CommitAsync(cancellationToken);

        _permissions.InvalidateUser(userId, tenantId.Value);

        _logger.LogInformation(
            "User {ActorId} updated permissions for {TargetId} in tenant {TenantId}: {Grants} grants, {Denies} denies.",
            CurrentUserId, userId, tenantId, grants.Length, denies.Length);

        return Ok(new { message = "Permissions updated." });
    }

    /// <summary>Branch scope for a user (section 114).</summary>
    [HttpPut("{userId:guid}/branches")]
    [RequirePermission(Permissions.UsersEdit)]
    public async Task<IActionResult> SetUserBranches(
        Guid userId,
        [FromBody] SetUserBranchesRequest request,
        CancellationToken cancellationToken)
    {
        var tenantId = CurrentTenantId;
        if (tenantId is null) return Forbid();

        if (!await _permissions.IsMemberOfTenantAsync(userId, tenantId.Value, cancellationToken))
            return NotFound(new { message = "User is not a member of this organization." });

        // Only branches that actually belong to this organization.
        var validBranchIds = await _context.Branches
            .IgnoreQueryFilters()
            .Where(b => b.TenantId == tenantId && !b.IsDeleted && request.BranchIds.Contains(b.Id))
            .Select(b => b.Id)
            .ToListAsync(cancellationToken);

        var invalid = request.BranchIds.Except(validBranchIds).ToList();
        if (invalid.Count > 0)
            return BadRequest(new { message = "Some branches do not belong to this organization.", branchIds = invalid });

        await using var tx = await _context.Database.BeginTransactionAsync(cancellationToken);

        var existing = await _context.BranchUsers
            .IgnoreQueryFilters()
            .Where(bu => bu.UserId == userId && bu.TenantId == tenantId)
            .ToListAsync(cancellationToken);

        _context.BranchUsers.RemoveRange(existing);

        var first = true;
        foreach (var branchId in validBranchIds)
        {
            _context.BranchUsers.Add(new BranchUser
            {
                BranchId = branchId,
                UserId = userId,
                TenantId = tenantId.Value,
                IsPrimary = first || branchId == request.PrimaryBranchId,
                IsActive = true
            });
            first = false;
        }

        await _context.SaveChangesAsync(cancellationToken);
        await tx.CommitAsync(cancellationToken);

        _permissions.InvalidateUser(userId, tenantId.Value);
        return Ok(new { message = "Branch access updated." });
    }

    /// <summary>
    /// Section 109/131. Issues a new temporary password and returns it once.
    /// The existing password is never recoverable — only its hash is stored.
    /// </summary>
    [HttpPost("{userId:guid}/reset-password-temp")]
    [RequirePermission(Permissions.UsersEdit)]
    public async Task<IActionResult> IssueTemporaryPassword(Guid userId, CancellationToken cancellationToken)
    {
        var tenantId = CurrentTenantId;
        if (tenantId is null) return Forbid();

        if (!await _permissions.IsMemberOfTenantAsync(userId, tenantId.Value, cancellationToken))
            return NotFound(new { message = "User is not a member of this organization." });

        var user = await _context.Users.IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user is null) return NotFound(new { message = "User not found." });

        // A child user must not be able to reset an owner's password.
        var targetIsOwner = await _context.TenantUsers.IgnoreQueryFilters()
            .AnyAsync(tu => tu.UserId == userId && tu.TenantId == tenantId && tu.IsOwner, cancellationToken);

        var actorIsOwner = await _context.TenantUsers.IgnoreQueryFilters()
            .AnyAsync(tu => tu.UserId == CurrentUserId && tu.TenantId == tenantId && tu.IsOwner, cancellationToken);

        if (targetIsOwner && !actorIsOwner && User.FindFirst("is_super_admin")?.Value != "true")
            return Forbid();

        var tempPassword = OrganizationProvisioningService.GenerateTemporaryPassword();

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword);
        user.MustChangePassword = true;
        user.PasswordChangedAt = DateTime.UtcNow;

        // Kill live sessions issued against the old credential.
        var tokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.RevokedAt == null)
            .ToListAsync(cancellationToken);

        foreach (var t in tokens)
        {
            t.RevokedAt = DateTime.UtcNow;
            t.RevokedByIp = "admin-reset";
        }

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogWarning(
            "User {ActorId} issued a temporary password for {TargetId} in tenant {TenantId}.",
            CurrentUserId, userId, tenantId);

        return Ok(new
        {
            userId = user.Id,
            email = user.Email,
            temporaryPassword = tempPassword,
            mustChangePassword = true,
            notice = "Shown once. The previous password was never stored in plaintext and cannot be recovered."
        });
    }

    /// <summary>The permission catalogue, for building the assignment UI.</summary>
    [HttpGet("permission-catalog")]
    [RequirePermission(Permissions.RolesView)]
    public async Task<IActionResult> GetCatalog()
    {
        var tenantId = CurrentTenantId;
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var enabledFeatures = await _entitlements.GetEnabledFeaturesAsync(tenantId.Value);

        var groups = PermissionCatalog.All
            .Where(p => IsPermissionAllowed(p.Name, enabledFeatures))
            .GroupBy(p => p.Module)
            .OrderBy(g => g.Key)
            .Select(g => new
            {
                module = g.Key,
                category = g.First().Category,
                permissions = g.OrderBy(p => p.DisplayOrder)
                    .Select(p => new { name = p.Name, displayName = p.DisplayName })
            });

        return Ok(groups);
    }

    private static bool IsPermissionAllowed(string permissionName, IReadOnlySet<string> enabledFeatures)
    {
        var dot = permissionName.IndexOf('.');
        if (dot <= 0) return true;

        var prefix = permissionName[..dot];

        if (PermissionCatalog.UngatedPrefixes.Contains(prefix))
            return true;

        return PermissionCatalog.PrefixToFeature.TryGetValue(prefix, out var feature)
            ? enabledFeatures.Contains(feature)
            : true;
    }

    private async Task<bool> IsUserAdminAsync(Guid tenantId, Guid userId, CancellationToken cancellationToken = default)
    {
        var adminRoleName = ClinIQ.Shared.Constants.Roles.OrganizationAdmin.ToUpperInvariant();
        return await _context.UserRoles.IgnoreQueryFilters()
            .AnyAsync(ur => ur.TenantId == tenantId && ur.UserId == userId
                && _context.Roles.IgnoreQueryFilters().Any(r => r.Id == ur.RoleId
                    && r.NormalizedName == adminRoleName && !r.IsDeleted),
                cancellationToken);
    }
}

public record SetUserPermissionsRequest(
    string[]? Grants,
    string[]? Denies,
    Guid? BranchId,
    string? Reason);

public record SetUserBranchesRequest(
    Guid[] BranchIds,
    Guid? PrimaryBranchId);
