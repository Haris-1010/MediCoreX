using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Inventory;

/// <summary>
/// Purchase order
/// </summary>
public class PurchaseOrder : BranchEntity
{
    public string PONumber { get; set; } = string.Empty;
    public Guid SupplierId { get; set; }
    public Guid WarehouseId { get; set; }

    // Dates
    public DateTime OrderDate { get; set; }
    public DateTime? ExpectedDeliveryDate { get; set; }
    public DateTime? ReceivedDate { get; set; }

    // Status
    public PurchaseOrderStatus Status { get; set; } = PurchaseOrderStatus.Draft;

    // Amounts
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal DiscountPercent { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }

    // Shipping
    public decimal ShippingCost { get; set; }
    public string? ShippingMethod { get; set; }
    public string? TrackingNumber { get; set; }

    // Payment
    public string? PaymentTerms { get; set; }
    public bool IsPaid { get; set; }
    public decimal PaidAmount { get; set; }

    // Notes
    public string? Notes { get; set; }
    public string? InternalNotes { get; set; }

    // Approval
    public Guid? ApprovedById { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? ApprovalNotes { get; set; }

    // Rejection
    public string? RejectionReason { get; set; }

    // Cancellation
    public DateTime? CancelledAt { get; set; }
    public Guid? CancelledById { get; set; }
    public string? CancellationReason { get; set; }

    // Navigation properties
    public virtual Supplier Supplier { get; set; } = null!;
    public virtual Warehouse Warehouse { get; set; } = null!;
    public virtual ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
    public virtual ICollection<GoodsReceipt> GoodsReceipts { get; set; } = new List<GoodsReceipt>();
}
