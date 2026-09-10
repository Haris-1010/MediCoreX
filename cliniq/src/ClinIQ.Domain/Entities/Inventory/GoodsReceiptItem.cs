using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Inventory;

/// <summary>
/// Goods receipt line item
/// </summary>
public class GoodsReceiptItem : BaseEntity
{
    public Guid GoodsReceiptId { get; set; }
    public Guid PurchaseOrderItemId { get; set; }
    public Guid ItemId { get; set; }

    // Quantities
    public decimal ReceivedQuantity { get; set; }
    public decimal AcceptedQuantity { get; set; }
    public decimal RejectedQuantity { get; set; }
    public decimal DamagedQuantity { get; set; }
    public string? Unit { get; set; }

    // Batch
    public string? BatchNumber { get; set; }
    public DateTime? ManufactureDate { get; set; }
    public DateTime? ExpiryDate { get; set; }

    // Pricing
    public decimal UnitPrice { get; set; }
    public decimal TotalAmount { get; set; }

    // Quality
    public bool QualityPassed { get; set; }
    public string? QualityNotes { get; set; }

    // Notes
    public string? RejectionReason { get; set; }
    public string? Notes { get; set; }

    // Stock Batch Created
    public Guid? StockBatchId { get; set; }

    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual GoodsReceipt GoodsReceipt { get; set; } = null!;
    public virtual Item Item { get; set; } = null!;
}
