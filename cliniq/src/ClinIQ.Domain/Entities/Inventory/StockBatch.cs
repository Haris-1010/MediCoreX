using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Inventory;

/// <summary>
/// Stock batch for tracking expiry and batch numbers
/// </summary>
public class StockBatch : BranchEntity
{
    public Guid ItemId { get; set; }
    public Guid WarehouseId { get; set; }
    public string? BatchNumber { get; set; }
    public DateTime? ManufactureDate { get; set; }
    public DateTime? ExpiryDate { get; set; }

    // Quantities
    public decimal ReceivedQuantity { get; set; }
    public decimal AvailableQuantity { get; set; }
    public decimal SoldQuantity { get; set; }
    public decimal AdjustedQuantity { get; set; }
    public decimal DamagedQuantity { get; set; }
    public decimal ExpiredQuantity { get; set; }

    // Pricing
    public decimal PurchasePrice { get; set; }
    public decimal SellingPrice { get; set; }
    public decimal? MRP { get; set; }

    // Source
    public Guid? PurchaseOrderId { get; set; }
    public Guid? GoodsReceiptId { get; set; }

    // Status
    public bool IsExpired { get; set; }
    public bool IsQuarantined { get; set; }
    public bool IsActive { get; set; } = true;

    // Location within warehouse
    public string? RackNumber { get; set; }
    public string? ShelfNumber { get; set; }

    // Navigation properties
    public virtual Item Item { get; set; } = null!;
    public virtual Warehouse Warehouse { get; set; } = null!;
}
