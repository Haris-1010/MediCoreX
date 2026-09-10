namespace ClinIQ.Domain.Interfaces;

/// <summary>
/// Service for accessing current tenant context
/// </summary>
public interface ITenantService
{
    Guid? GetCurrentTenantId();
    Guid? GetCurrentBranchId();
    void SetCurrentTenant(Guid tenantId);
    void SetCurrentBranch(Guid branchId);
}
