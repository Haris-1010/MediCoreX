using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Billing;

/// <summary>
/// Invoice/Bill entity
/// </summary>
public class Invoice : BranchEntity
{
    public string InvoiceNumber { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid? VisitId { get; set; }
    public Guid? AdmissionId { get; set; }
    public Guid? AppointmentId { get; set; }

    // Invoice Details
    public DateTime InvoiceDate { get; set; }
    public DateTime? DueDate { get; set; }
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Draft;

    // Amounts
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal DiscountPercent { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TaxPercent { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal OutstandingAmount { get; set; }
    public decimal RefundedAmount { get; set; }

    // Insurance
    public Guid? InsuranceId { get; set; }
    public decimal InsuranceAmount { get; set; }
    public decimal PatientResponsibility { get; set; }

    // Corporate
    public Guid? CorporateClientId { get; set; }
    public decimal CorporateAmount { get; set; }

    // Package
    public Guid? PackageId { get; set; }

    // Discount Details
    public Guid? DiscountId { get; set; }
    public string? DiscountReason { get; set; }
    public Guid? DiscountApprovedById { get; set; }

    // Notes
    public string? Notes { get; set; }
    public string? InternalNotes { get; set; }

    // Finalization
    public DateTime? FinalizedAt { get; set; }
    public Guid? FinalizedById { get; set; }

    // Cancellation
    public DateTime? CancelledAt { get; set; }
    public Guid? CancelledById { get; set; }
    public string? CancellationReason { get; set; }

    // Navigation properties
    public virtual ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
