using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Tenancy;

/// <summary>
/// Represents a department within a branch
/// </summary>
public class Department : BranchEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? HeadOfDepartmentId { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual Branch Branch { get; set; } = null!;
}
