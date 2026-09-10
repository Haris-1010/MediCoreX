using ClinIQ.Domain.Enums;

namespace ClinIQ.Shared.DTOs.Billing;

public record CreatePaymentRequest(
    Guid? InvoiceId,
    Guid PatientId,
    decimal Amount,
    PaymentMethod PaymentMethod,
    string? ReferenceNumber,
    string? CardLastFour,
    string? CardType,
    string? BankName,
    string? Notes
);
