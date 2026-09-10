using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Inventory;

/// <summary>
/// Goods receipt note (GRN)
/// </summary>
public class GoodsReceipt : BranchEntity
{
    public string GRNNumber { get; set; } = string.Empty;
    public Guid PurchaseOrderId { get; set; }
    public Guid SupplierId { get; set; }
    public Guid WarehouseId { get; set; }

    // Receipt Details
    public DateTime ReceiptDate { get; set; }
    public string? SupplierInvoiceNumber { get; set; }
    public DateTime? SupplierInvoiceDate { get; set; }
    public string? DeliveryNoteNumber { get; set; }

    // Amounts
    public decimal TotalAmount { get; set; }

    // Quality Check
    public bool QualityChecked { get; set; }
    public Guid? QualityCheckedById { get; set; }
    public DateTime? QualityCheckedAt { get; set; }
    public string? QualityNotes { get; set; }

    // Receiving
    public Guid ReceivedById { get; set; }
    public string? Notes { get; set; }

    // Status
    public bool IsFinalized { get; set; }
    public DateTime? FinalizedAt { get; set; }

    // Navigation properties
    public virtual PurchaseOrder PurchaseOrder { get; set; } = null!;
    public virtual Supplier Supplier { get; set; } = null!;
    public virtual Warehouse Warehouse { get; set; } = null!;
    public virtual ICollection<GoodsReceiptItem> Items { get; set; } = new List<GoodsReceiptItem>();
}
