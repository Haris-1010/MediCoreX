using ClinIQ.Domain.Enums;

namespace ClinIQ.Shared.DTOs.Billing;

public record PaymentDto(
    Guid Id,
    string PaymentNumber,
    Guid? InvoiceId,
    Guid PatientId,
    string PatientName,
    DateTime PaymentDate,
    decimal Amount,
    PaymentMethod PaymentMethod,
    PaymentStatus Status,
    string? ReferenceNumber,
    bool IsAdvancePayment,
    bool IsRefund,
    string? Notes,
    DateTime CreatedAt
);
