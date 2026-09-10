namespace ClinIQ.Domain.Common;

/// <summary>
/// Interface for branch-scoped entities
/// </summary>
public interface IBranchEntity : ITenantEntity
{
    Guid? BranchId { get; set; }
}
