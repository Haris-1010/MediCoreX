using ClinIQ.Domain.Enums;
using ClinIQ.Shared.DTOs.Billing;
using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces;

public interface IBillingService
{
    Task<Result<InvoiceDetailDto>> GetInvoiceByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PaginatedResult<InvoiceDto>> GetInvoicesPaginatedAsync(InvoiceQuery query, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<InvoiceDto>>> GetInvoicesByPatientAsync(Guid patientId, CancellationToken cancellationToken = default);
    Task<Result<InvoiceDetailDto>> CreateInvoiceAsync(CreateInvoiceRequest request, CancellationToken cancellationToken = default);
    Task<Result<InvoiceDetailDto>> UpdateInvoiceAsync(Guid id, CreateInvoiceRequest request, CancellationToken cancellationToken = default);
    Task<Result> FinalizeInvoiceAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result> CancelInvoiceAsync(Guid id, string reason, CancellationToken cancellationToken = default);
    Task<Result<PaymentDto>> CreatePaymentAsync(CreatePaymentRequest request, CancellationToken cancellationToken = default);
    Task<Result> RefundPaymentAsync(Guid paymentId, decimal amount, string reason, CancellationToken cancellationToken = default);
    Task<Result<decimal>> ApplyDiscountAsync(Guid invoiceId, decimal discountPercent, decimal discountAmount, string? reason, CancellationToken cancellationToken = default);
    Task<Result<decimal>> CalculateTotalAsync(IEnumerable<CreateInvoiceItemRequest> items, decimal discountPercent, CancellationToken cancellationToken = default);
}

public class InvoiceQuery : PaginationQuery
{
    public Guid? PatientId { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public InvoiceStatus? Status { get; set; }
    public bool? HasOutstanding { get; set; }
}
