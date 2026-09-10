namespace ClinIQ.Domain.Interfaces;

/// <summary>
/// Module entitlement checks. Determines what an organization can access
/// based on explicitly configured TenantEntitlement rows.
/// </summary>
public interface IEntitlementService
{
    /// <summary>
    /// Every feature the tenant may currently use. Takes tenantId explicitly
    /// because the permission engine resolves entitlements for a tenant that
    /// may not be the ambient one.
    /// </summary>
    Task<IReadOnlySet<string>> GetEnabledFeaturesAsync(Guid tenantId, CancellationToken cancellationToken = default);

    Task<bool> HasFeatureAsync(string feature, CancellationToken cancellationToken = default);
    Task<bool> CanAccessModuleAsync(string module, CancellationToken cancellationToken = default);
    Task<int> GetLimitAsync(string limitType, CancellationToken cancellationToken = default);
    Task<bool> IsWithinLimitAsync(string limitType, int currentCount, CancellationToken cancellationToken = default);
    Task<bool> IsSubscriptionActiveAsync(CancellationToken cancellationToken = default);

    void Invalidate(Guid tenantId);
}
