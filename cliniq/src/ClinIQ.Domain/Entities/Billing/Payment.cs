using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Billing;

/// <summary>
/// Payment entity
/// </summary>
public class Payment : BranchEntity
{
    public string PaymentNumber { get; set; } = string.Empty;
    public Guid? InvoiceId { get; set; }
    public Guid PatientId { get; set; }

    // Payment Details
    public DateTime PaymentDate { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;
    public PaymentStatus Status { get; set; } = PaymentStatus.Completed;

    // Payment Method Details
    public string? ReferenceNumber { get; set; }  // Transaction ID, Check Number, etc.
    public string? CardLastFour { get; set; }
    public string? CardType { get; set; }
    public string? BankName { get; set; }
    public string? BankAccountNumber { get; set; }

    // Advance Payment (when no invoice)
    public bool IsAdvancePayment { get; set; }
    public Guid? AdmissionId { get; set; }

    // Refund
    public bool IsRefund { get; set; }
    public Guid? OriginalPaymentId { get; set; }
    public string? RefundReason { get; set; }

    // Notes
    public string? Notes { get; set; }

    // Received By
    public Guid ReceivedById { get; set; }

    // Reversal
    public bool IsReversed { get; set; }
    public DateTime? ReversedAt { get; set; }
    public Guid? ReversedById { get; set; }
    public string? ReversalReason { get; set; }

    // Navigation properties
    public virtual Invoice? Invoice { get; set; }
}
