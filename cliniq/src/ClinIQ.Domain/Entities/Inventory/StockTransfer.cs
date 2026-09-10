using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Inventory;

/// <summary>
/// Stock transfer between warehouses
/// </summary>
public class StockTransfer : BranchEntity
{
    public string TransferNumber { get; set; } = string.Empty;
    public Guid FromWarehouseId { get; set; }
    public Guid ToWarehouseId { get; set; }

    // Transfer Details
    public DateTime TransferDate { get; set; }
    public string Status { get; set; } = "Pending";  // Pending, InTransit, Received, Cancelled

    // Request
    public Guid RequestedById { get; set; }
    public DateTime? RequestedAt { get; set; }
    public string? RequestNotes { get; set; }

    // Approval
    public Guid? ApprovedById { get; set; }
    public DateTime? ApprovedAt { get; set; }

    // Dispatch
    public Guid? DispatchedById { get; set; }
    public DateTime? DispatchedAt { get; set; }

    // Receipt
    public Guid? ReceivedById { get; set; }
    public DateTime? ReceivedAt { get; set; }
    public string? ReceiptNotes { get; set; }

    // Notes
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Warehouse FromWarehouse { get; set; } = null!;
    public virtual Warehouse ToWarehouse { get; set; } = null!;
    public virtual ICollection<StockTransferItem> Items { get; set; } = new List<StockTransferItem>();
}
