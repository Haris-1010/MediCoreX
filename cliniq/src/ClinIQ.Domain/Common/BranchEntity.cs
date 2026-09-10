namespace ClinIQ.Domain.Common;

/// <summary>
/// Base entity for branch-scoped entities
/// </summary>
public abstract class BranchEntity : TenantEntity, IBranchEntity
{
    public Guid? BranchId { get; set; }
}
