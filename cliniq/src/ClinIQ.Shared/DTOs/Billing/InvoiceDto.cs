using ClinIQ.Domain.Enums;

namespace ClinIQ.Shared.DTOs.Billing;

public record InvoiceDto(
    Guid Id,
    string InvoiceNumber,
    Guid PatientId,
    string PatientName,
    DateTime InvoiceDate,
    DateTime? DueDate,
    InvoiceStatus Status,
    decimal SubTotal,
    decimal DiscountAmount,
    decimal TaxAmount,
    decimal TotalAmount,
    decimal PaidAmount,
    decimal OutstandingAmount,
    DateTime CreatedAt
);

public record InvoiceDetailDto(
    Guid Id,
    string InvoiceNumber,
    Guid PatientId,
    string PatientName,
    string? PatientPhone,
    Guid? VisitId,
    Guid? AdmissionId,
    DateTime InvoiceDate,
    DateTime? DueDate,
    InvoiceStatus Status,
    decimal SubTotal,
    decimal DiscountAmount,
    decimal DiscountPercent,
    decimal TaxAmount,
    decimal TaxPercent,
    decimal TotalAmount,
    decimal PaidAmount,
    decimal OutstandingAmount,
    decimal RefundedAmount,
    decimal InsuranceAmount,
    decimal PatientResponsibility,
    string? DiscountReason,
    string? Notes,
    DateTime? FinalizedAt,
    DateTime CreatedAt,
    IEnumerable<InvoiceItemDto> Items,
    IEnumerable<PaymentDto> Payments
);

public record InvoiceItemDto(
    Guid Id,
    string ItemType,
    string ItemName,
    string? ItemCode,
    string? Description,
    decimal Quantity,
    string? Unit,
    decimal UnitPrice,
    decimal DiscountPercent,
    decimal DiscountAmount,
    decimal TaxPercent,
    decimal TaxAmount,
    decimal TotalAmount
);


