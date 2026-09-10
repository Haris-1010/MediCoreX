using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Inventory;

/// <summary>
/// Inventory item (medicine, consumable, equipment, etc.)
/// </summary>
public class Item : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Barcode { get; set; }
    public string? Description { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? SubCategoryId { get; set; }

    // For Medicines
    public bool IsMedicine { get; set; }
    public string? GenericName { get; set; }
    public string? BrandName { get; set; }
    public Guid? ManufacturerId { get; set; }
    public string? Strength { get; set; }
    public string? Form { get; set; }  // Tablet, Capsule, Syrup, etc.
    public string? PackSize { get; set; }
    public bool RequiresPrescription { get; set; }
    public bool IsControlledSubstance { get; set; }
    public string? StorageInstructions { get; set; }

    // Units
    public string? PurchaseUnit { get; set; }
    public string? SaleUnit { get; set; }
    public decimal ConversionFactor { get; set; } = 1;

    // Pricing
    public decimal PurchasePrice { get; set; }
    public decimal SellingPrice { get; set; }
    public decimal? MRP { get; set; }
    public decimal? CostPrice { get; set; }
    public decimal TaxPercent { get; set; }
    public bool IsTaxInclusive { get; set; }

    // Stock
    public decimal CurrentStock { get; set; }
    public decimal MinimumStock { get; set; }
    public decimal MaximumStock { get; set; }
    public decimal ReorderLevel { get; set; }
    public decimal ReorderQuantity { get; set; }

    // Expiry
    public bool TracksExpiry { get; set; }
    public bool TracksBatches { get; set; }
    public int? ExpiryWarningDays { get; set; }

    // Location
    public string? DefaultLocation { get; set; }
    public Guid? DefaultWarehouseId { get; set; }

    // Status
    public bool IsActive { get; set; } = true;
    public bool IsDiscontinued { get; set; }

    // Navigation properties
    public virtual ItemCategory? Category { get; set; }
    public virtual Manufacturer? Manufacturer { get; set; }
    public virtual ICollection<StockBatch> StockBatches { get; set; } = new List<StockBatch>();
}
