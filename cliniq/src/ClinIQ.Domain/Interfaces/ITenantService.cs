namespace ClinIQ.Domain.Interfaces;

/// <summary>
/// Service for accessing current tenant context
/// </summary>
public interface ITenantService
{
    Guid? GetCurrentTenantId();

    /// <summary>
    /// Specific location for write stamping. Null when the caller has no
    /// resolved branch (e.g. All Locations without a write target).
    /// </summary>
    Guid? GetCurrentBranchId();

    /// <summary>
    /// True when the caller may read every location in the current tenant
    /// (All Locations scope / super admin). When false, branch-scoped reads
    /// are limited to <see cref="GetCurrentBranchId"/>.
    /// </summary>
    bool HasAllLocationAccess();

    void SetCurrentTenant(Guid tenantId);
    void SetCurrentBranch(Guid branchId);

    /// <summary>
    /// Explicit override for All Locations access. Only middleware, seeders
    /// or background jobs may call this — never untrusted input.
    /// </summary>
    void SetAllLocationAccess(bool hasAllLocations);
}
