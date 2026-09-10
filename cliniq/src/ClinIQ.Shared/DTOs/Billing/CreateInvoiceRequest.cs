namespace ClinIQ.Shared.DTOs.Billing;

public record CreateInvoiceRequest(
    Guid PatientId,
    Guid? VisitId,
    Guid? AdmissionId,
    Guid? AppointmentId,
    DateTime? DueDate,
    IEnumerable<CreateInvoiceItemRequest> Items,
    decimal DiscountPercent,
    decimal DiscountAmount,
    string? DiscountReason,
    Guid? InsuranceId,
    Guid? CorporateClientId,
    string? Notes
);

public record CreateInvoiceItemRequest(
    string ItemType,
    Guid? ServiceId,
    Guid? MedicineId,
    string ItemName,
    string? ItemCode,
    string? Description,
    decimal Quantity,
    string? Unit,
    decimal UnitPrice,
    decimal DiscountPercent,
    decimal TaxPercent
);

 
