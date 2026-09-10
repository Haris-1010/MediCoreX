using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Inventory;

/// <summary>
/// Stock movement/transaction history
/// </summary>
public class StockMovement : BranchEntity
{
    public string MovementNumber { get; set; } = string.Empty;
    public Guid ItemId { get; set; }
    public Guid WarehouseId { get; set; }
    public Guid? StockBatchId { get; set; }

    // Movement Details
    public StockMovementType MovementType { get; set; }
    public DateTime MovementDate { get; set; }

    // Quantities
    public decimal Quantity { get; set; }
    public decimal QuantityBefore { get; set; }
    public decimal QuantityAfter { get; set; }

    // Pricing
    public decimal UnitPrice { get; set; }
    public decimal TotalAmount { get; set; }

    // Reference
    public string? ReferenceType { get; set; }  // PurchaseOrder, Sale, Adjustment, etc.
    public Guid? ReferenceId { get; set; }
    public string? ReferenceNumber { get; set; }

    // Transfer
    public Guid? FromWarehouseId { get; set; }
    public Guid? ToWarehouseId { get; set; }

    // Notes
    public string? Reason { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Item Item { get; set; } = null!;
    public virtual Warehouse Warehouse { get; set; } = null!;
    public virtual StockBatch? StockBatch { get; set; }
}
