namespace ClinIQ.Domain.Interfaces;

/// <summary>
/// Centralised effective-permission engine. Controllers never resolve
/// permissions themselves; they go through the authorization handler, which
/// comes here.
/// </summary>
public interface IPermissionService
{
    /// <summary>
    /// Effective permissions for a user in one tenant, optionally narrowed to a
    /// branch. Resolution order:
    ///   (owner: all entitlements; staff: union of their roles' permissions)
    ///   -> + user grants -> - user denies -> intersect entitlements
    /// </summary>
    Task<IReadOnlySet<string>> GetEffectivePermissionsAsync(
        Guid userId, Guid tenantId, Guid? branchId = null, CancellationToken cancellationToken = default);

    Task<bool> HasPermissionAsync(
        Guid userId, Guid tenantId, string permission, Guid? branchId = null, CancellationToken cancellationToken = default);

    Task<bool> HasAllPermissionsAsync(
        Guid userId, Guid tenantId, IEnumerable<string> permissions, Guid? branchId = null, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Guid>> GetAccessibleBranchIdsAsync(
        Guid userId, Guid tenantId, CancellationToken cancellationToken = default);

    Task<bool> IsMemberOfTenantAsync(
        Guid userId, Guid tenantId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Privilege-escalation guard: an actor may only grant what they hold.
    /// Returns the subset the actor is NOT allowed to grant.
    /// </summary>
    Task<IReadOnlyList<string>> GetNonGrantablePermissionsAsync(
        Guid actorUserId, Guid tenantId, IEnumerable<string> requested, CancellationToken cancellationToken = default);

    void InvalidateUser(Guid userId, Guid tenantId);

    /// <summary>
    /// Drops the cached effective-permission set for every user in a tenant.
    /// Call after role create/update/delete, role assignments, or any change to
    /// the org's subscription entitlements so grants change immediately.
    /// </summary>
    void InvalidateTenant(Guid tenantId);
}
