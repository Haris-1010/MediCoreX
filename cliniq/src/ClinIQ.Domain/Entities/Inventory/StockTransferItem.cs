using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Inventory;

/// <summary>
/// Stock transfer line item
/// </summary>
public class StockTransferItem : BaseEntity
{
    public Guid StockTransferId { get; set; }
    public Guid ItemId { get; set; }
    public Guid? StockBatchId { get; set; }

    // Quantities
    public decimal RequestedQuantity { get; set; }
    public decimal DispatchedQuantity { get; set; }
    public decimal ReceivedQuantity { get; set; }
    public decimal DamagedQuantity { get; set; }
    public string? Unit { get; set; }

    // Batch
    public string? BatchNumber { get; set; }
    public DateTime? ExpiryDate { get; set; }

    // Notes
    public string? Notes { get; set; }

    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual StockTransfer StockTransfer { get; set; } = null!;
    public virtual Item Item { get; set; } = null!;
}
