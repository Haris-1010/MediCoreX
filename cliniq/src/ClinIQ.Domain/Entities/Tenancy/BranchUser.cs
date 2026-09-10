using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Tenancy;

/// <summary>
/// Junction table for User-Branch relationship
/// </summary>
public class BranchUser : BaseEntity
{
    public Guid BranchId { get; set; }
    public Guid UserId { get; set; }
    public Guid TenantId { get; set; }
    public bool IsPrimary { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual Branch Branch { get; set; } = null!;
}
