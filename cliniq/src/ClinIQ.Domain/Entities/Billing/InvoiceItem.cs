using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Billing;

/// <summary>
/// Invoice line item
/// </summary>
public class InvoiceItem : BaseEntity
{
    public Guid InvoiceId { get; set; }
    public Guid? ServiceId { get; set; }
    public Guid? MedicineId { get; set; }
    public Guid? ProcedureId { get; set; }

    // Item Details
    public string ItemType { get; set; } = string.Empty;  // Service, Medicine, Procedure, RoomCharge, BedCharge, etc.
    public string ItemName { get; set; } = string.Empty;
    public string? ItemCode { get; set; }
    public string? Description { get; set; }

    // Quantity and Price
    public decimal Quantity { get; set; } = 1;
    public string? Unit { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Amount { get; set; }

    // Discount
    public decimal DiscountPercent { get; set; }
    public decimal DiscountAmount { get; set; }

    // Tax
    public decimal TaxPercent { get; set; }
    public decimal TaxAmount { get; set; }

    // Total
    public decimal TotalAmount { get; set; }

    // Insurance
    public bool IsCoveredByInsurance { get; set; }
    public decimal InsuranceCoveragePercent { get; set; }
    public decimal InsuranceAmount { get; set; }
    public decimal PatientAmount { get; set; }

    // Reference
    public Guid? ReferenceId { get; set; }  // Order ID, etc.
    public string? ReferenceType { get; set; }

    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual Invoice Invoice { get; set; } = null!;
}
