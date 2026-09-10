using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Inventory;

/// <summary>
/// Item category
/// </summary>
public class ItemCategory : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public bool IsMedicineCategory { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual ItemCategory? ParentCategory { get; set; }
    public virtual ICollection<ItemCategory> SubCategories { get; set; } = new List<ItemCategory>();
    public virtual ICollection<Item> Items { get; set; } = new List<Item>();
}
