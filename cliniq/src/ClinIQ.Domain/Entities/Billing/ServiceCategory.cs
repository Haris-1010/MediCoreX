using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Billing;

/// <summary>
/// Service category
/// </summary>
public class ServiceCategory : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual ServiceCategory? ParentCategory { get; set; }
    public virtual ICollection<ServiceCategory> SubCategories { get; set; } = new List<ServiceCategory>();
    public virtual ICollection<Service> Services { get; set; } = new List<Service>();
}
