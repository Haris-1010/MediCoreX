using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Enums;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class BillingController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public BillingController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    [HttpGet("invoices")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingView)]
    public async Task<IActionResult> GetInvoices(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null)
    {
        var query = _context.Invoices.Where(i => !i.IsDeleted);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<InvoiceStatus>(status, true, out var statusEnum))
            query = query.Where(i => i.Status == statusEnum);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(i => i.InvoiceDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(i => new
            {
                i.Id,
                i.InvoiceNumber,
                PatientName = _context.Patients.Where(p => p.Id == i.PatientId).Select(p => p.FirstName + " " + p.LastName).FirstOrDefault() ?? "Unknown",
                i.InvoiceDate,
                i.TotalAmount,
                i.PaidAmount,
                Status = i.Status.ToString()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new
        {
            items,
            totalCount,
            pageNumber,
            pageSize,
            totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            hasPreviousPage = pageNumber > 1,
            hasNextPage = pageNumber * pageSize < totalCount
        }));
    }

    [HttpGet("invoices/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingView)]
    public async Task<IActionResult> GetInvoice(Guid id)
    {
        var invoice = await _context.Invoices
            .Where(i => i.Id == id && !i.IsDeleted)
            .Select(i => new
            {
                i.Id,
                i.InvoiceNumber,
                PatientName = _context.Patients.Where(p => p.Id == i.PatientId).Select(p => p.FirstName + " " + p.LastName).FirstOrDefault() ?? "Unknown",
                i.InvoiceDate,
                i.DueDate,
                Status = i.Status.ToString(),
                i.SubTotal,
                i.DiscountAmount,
                i.DiscountId,
                DiscountName = _context.Discounts.Where(d => d.Id == i.DiscountId).Select(d => d.Name).FirstOrDefault(),
                i.TaxAmount,
                i.TotalAmount,
                i.PaidAmount,
                i.OutstandingAmount,
                Items = _context.InvoiceItems.Where(ii => ii.InvoiceId == i.Id).Select(ii => new
                {
                    ii.Id,
                    ii.Description,
                    ii.Quantity,
                    ii.UnitPrice,
                    ii.TotalAmount
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (invoice == null)
            return NotFound(Result.Failure("Invoice not found"));

        return Ok(Result<object>.Success(invoice));
    }

    [HttpPost("invoices")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingCreate)]
    public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));
        var branchId = _tenantService.GetCurrentBranchId();

        if (request.PatientId == Guid.Empty)
            return BadRequest(Result.Failure("Patient is required."));

        if (request.Items == null || request.Items.Count == 0)
            return BadRequest(Result.Failure("At least one invoice item is required."));

        if (request.DiscountAmount < 0)
            return BadRequest(Result.Failure("Discount amount cannot be negative."));

        if (request.TotalAmount < 0)
            return BadRequest(Result.Failure("Total amount cannot be negative."));

        var tenant = await _context.Tenants.FirstOrDefaultAsync(t => t.Id == tenantId.Value);
        var invoicePrefix = "INV-";
        if (tenant?.Settings != null)
        {
            try
            {
                using var doc = System.Text.Json.JsonDocument.Parse(tenant.Settings);
                if (doc.RootElement.TryGetProperty("invoicePrefix", out var prefixProp))
                    invoicePrefix = prefixProp.GetString() ?? "INV-";
            }
            catch { }
        }

        var lastNumbers = await _context.Invoices
            .IgnoreQueryFilters()
            .Where(i => i.TenantId == tenantId && i.InvoiceNumber.StartsWith(invoicePrefix))
            .Select(i => i.InvoiceNumber)
            .ToListAsync();

        var maxNum = lastNumbers
            .Select(n => int.TryParse(n.Substring(invoicePrefix.Length), out var num) ? num : 0)
            .DefaultIfEmpty(0)
            .Max();

        var nextInvoiceNumber = maxNum + 1;

        var invoice = new Invoice
        {
            InvoiceNumber = $"{invoicePrefix}{nextInvoiceNumber:D4}",
            PatientId = request.PatientId,
            InvoiceDate = request.InvoiceDate ?? DateTime.UtcNow,
            DueDate = request.DueDate ?? DateTime.UtcNow.AddDays(30),
            Status = InvoiceStatus.Draft,
            SubTotal = request.Subtotal,
            DiscountAmount = request.DiscountAmount,
            DiscountId = request.DiscountId,
            TaxPercent = request.TaxPercentage,
            TaxAmount = request.TaxAmount,
            TotalAmount = request.TotalAmount,
            OutstandingAmount = request.TotalAmount,
            Notes = request.Notes,
            TenantId = tenantId,
            BranchId = branchId
        };

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();

        if (request.Items != null)
        {
            foreach (var item in request.Items)
            {
                _context.InvoiceItems.Add(new InvoiceItem
                {
                    InvoiceId = invoice.Id,
                    Description = item.Description,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    TotalAmount = item.Quantity * item.UnitPrice
                });
            }
            await _context.SaveChangesAsync();
        }

        return Ok(Result<object>.Success(new { id = invoice.Id, invoiceNumber = invoice.InvoiceNumber }));
    }

    [HttpPut("invoices/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingEdit)]
    public async Task<IActionResult> UpdateInvoice(Guid id, [FromBody] CreateInvoiceRequest request)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Items)
            .FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted);
        if (invoice == null)
            return NotFound(Result.Failure("Invoice not found"));

        if (invoice.Status is InvoiceStatus.Cancelled or InvoiceStatus.Refunded or InvoiceStatus.WrittenOff)
            return BadRequest(Result.Failure("Cannot edit an invoice with status " + invoice.Status));

        if (request.DiscountAmount < 0)
            return BadRequest(Result.Failure("Discount amount cannot be negative."));

        if (request.TotalAmount < 0)
            return BadRequest(Result.Failure("Total amount cannot be negative."));

        invoice.PatientId = request.PatientId;
        invoice.InvoiceDate = request.InvoiceDate ?? invoice.InvoiceDate;
        invoice.DueDate = request.DueDate ?? invoice.DueDate;
        invoice.SubTotal = request.Subtotal;
        invoice.DiscountAmount = request.DiscountAmount;
        invoice.DiscountId = request.DiscountId;
        invoice.TaxPercent = request.TaxPercentage;
        invoice.TaxAmount = request.TaxAmount;
        invoice.TotalAmount = request.TotalAmount;
        invoice.OutstandingAmount = request.TotalAmount - invoice.PaidAmount;
        invoice.Notes = request.Notes;

        if (invoice.OutstandingAmount <= 0)
            invoice.Status = InvoiceStatus.Paid;
        else if (invoice.PaidAmount > 0)
            invoice.Status = InvoiceStatus.PartiallyPaid;

        if (request.Items != null)
        {
            var existingItems = invoice.Items.ToList();
            _context.InvoiceItems.RemoveRange(existingItems);
            foreach (var item in request.Items)
            {
                _context.InvoiceItems.Add(new InvoiceItem
                {
                    InvoiceId = invoice.Id,
                    Description = item.Description,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    TotalAmount = item.Quantity * item.UnitPrice
                });
            }
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Invoice updated successfully"));
    }

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingView)]
    public async Task<IActionResult> GetBillingStats()
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        var totalRevenue = await _context.Invoices
            .Where(i => !i.IsDeleted && i.Status == InvoiceStatus.Paid)
            .SumAsync(i => i.TotalAmount);

        var pendingAmount = await _context.Invoices
            .Where(i => !i.IsDeleted && i.Status != InvoiceStatus.Paid && i.Status != InvoiceStatus.Cancelled && i.Status != InvoiceStatus.Refunded && i.Status != InvoiceStatus.WrittenOff)
            .SumAsync(i => i.OutstandingAmount);

        var todayRevenue = await _context.Invoices
            .Where(i => !i.IsDeleted && i.InvoiceDate >= today && i.InvoiceDate < tomorrow && i.Status == InvoiceStatus.Paid)
            .SumAsync(i => i.TotalAmount);

        var todayInvoices = await _context.Invoices
            .Where(i => !i.IsDeleted && i.InvoiceDate >= today && i.InvoiceDate < tomorrow)
            .CountAsync();

        var overdueAmount = await _context.Invoices
            .Where(i => !i.IsDeleted && i.DueDate < today && i.Status != InvoiceStatus.Paid && i.Status != InvoiceStatus.Cancelled && i.Status != InvoiceStatus.Refunded && i.Status != InvoiceStatus.WrittenOff)
            .SumAsync(i => i.OutstandingAmount);

        var totalReceivables = await _context.Invoices
            .Where(i => !i.IsDeleted && i.Status != InvoiceStatus.Paid && i.Status != InvoiceStatus.Cancelled && i.Status != InvoiceStatus.Refunded && i.Status != InvoiceStatus.WrittenOff)
            .SumAsync(i => i.OutstandingAmount);

        var invoiceCount = await _context.Invoices.CountAsync(i => !i.IsDeleted);

        return Ok(Result<object>.Success(new
        {
            totalRevenue,
            pendingAmount,
            totalReceivables,
            todayRevenue,
            todayInvoices,
            overdueAmount,
            invoiceCount
        }));
    }
}

public record CreateInvoiceRequest(
    Guid PatientId,
    DateTime? InvoiceDate,
    DateTime? DueDate,
    decimal Subtotal,
    decimal DiscountAmount,
    Guid? DiscountId,
    decimal TaxPercentage,
    decimal TaxAmount,
    decimal TotalAmount,
    string? Notes,
    List<InvoiceItemRequest>? Items
);

public record InvoiceItemRequest(
    string Description,
    int Quantity,
    decimal UnitPrice
);

[ApiController]
[Route("api/v1/invoices")]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public InvoicesController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingView)]
    public async Task<IActionResult> GetInvoices(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? status = null,
        [FromQuery] Guid? patientId = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var query = _context.Invoices.Where(i => !i.IsDeleted);

        if (patientId.HasValue)
            query = query.Where(i => i.PatientId == patientId.Value);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<InvoiceStatus>(status, true, out var statusEnum))
            query = query.Where(i => i.Status == statusEnum);

        if (startDate.HasValue)
            query = query.Where(i => i.InvoiceDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(i => i.InvoiceDate <= endDate.Value);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(i => i.InvoiceDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(i => new
            {
                i.Id,
                i.InvoiceNumber,
                PatientName = _context.Patients.Where(p => p.Id == i.PatientId).Select(p => p.FirstName + " " + p.LastName).FirstOrDefault() ?? "Unknown",
                i.InvoiceDate,
                i.TotalAmount,
                i.PaidAmount,
                i.OutstandingAmount,
                Status = i.Status.ToString()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new
        {
            items,
            totalCount,
            pageNumber,
            pageSize,
            totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            hasPreviousPage = pageNumber > 1,
            hasNextPage = pageNumber * pageSize < totalCount
        }));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingView)]
    public async Task<IActionResult> GetInvoice(Guid id)
    {
        var invoice = await _context.Invoices
            .Where(i => i.Id == id && !i.IsDeleted)
            .Select(i => new
            {
                i.Id,
                i.InvoiceNumber,
                PatientId = i.PatientId,
                PatientName = _context.Patients.Where(p => p.Id == i.PatientId).Select(p => p.FirstName + " " + p.LastName).FirstOrDefault() ?? "Unknown",
                i.InvoiceDate,
                i.DueDate,
                Status = i.Status.ToString(),
                i.SubTotal,
                i.DiscountAmount,
                i.DiscountPercent,
                i.DiscountId,
                DiscountName = _context.Discounts.Where(d => d.Id == i.DiscountId).Select(d => d.Name).FirstOrDefault(),
                i.TaxAmount,
                i.TaxPercent,
                i.TotalAmount,
                i.PaidAmount,
                i.OutstandingAmount,
                i.Notes,
                Items = _context.InvoiceItems.Where(ii => ii.InvoiceId == i.Id).Select(ii => new
                {
                    ii.Id,
                    ii.Description,
                    ii.Quantity,
                    ii.UnitPrice,
                    ii.TotalAmount
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (invoice == null)
            return NotFound(Result.Failure("Invoice not found"));

        return Ok(Result<object>.Success(invoice));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingCreate)]
    public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));
        var branchId = _tenantService.GetCurrentBranchId();

        if (request.PatientId == Guid.Empty)
            return BadRequest(Result.Failure("Patient is required."));

        if (request.Items == null || request.Items.Count == 0)
            return BadRequest(Result.Failure("At least one invoice item is required."));

        var computedSubtotal = request.Items.Sum(i => (decimal)(i.Quantity) * i.UnitPrice);
        if (Math.Abs(request.Subtotal - computedSubtotal) > 0.01m)
            return BadRequest(Result.Failure("Subtotal does not match the sum of line items."));

        if (request.DiscountAmount < 0)
            return BadRequest(Result.Failure("Discount amount cannot be negative."));

        if (request.DiscountAmount > computedSubtotal)
            return BadRequest(Result.Failure("Discount cannot exceed the subtotal."));

        if (request.TaxAmount < 0)
            return BadRequest(Result.Failure("Tax amount cannot be negative."));

        if (request.TotalAmount < 0)
            return BadRequest(Result.Failure("Total amount cannot be negative."));

        var computedTotal = Math.Max(0, computedSubtotal - request.DiscountAmount + request.TaxAmount);
        if (Math.Abs(request.TotalAmount - computedTotal) > 0.01m)
            return BadRequest(Result.Failure("Total amount does not match the calculated total."));

        var tenant = await _context.Tenants.FirstOrDefaultAsync(t => t.Id == tenantId.Value);
        var invoicePrefix = "INV-";
        if (tenant?.Settings != null)
        {
            try
            {
                using var doc = System.Text.Json.JsonDocument.Parse(tenant.Settings);
                if (doc.RootElement.TryGetProperty("invoicePrefix", out var prefixProp))
                    invoicePrefix = prefixProp.GetString() ?? "INV-";
            }
            catch { }
        }

        var lastNumbers = await _context.Invoices
            .IgnoreQueryFilters()
            .Where(i => i.TenantId == tenantId && i.InvoiceNumber.StartsWith(invoicePrefix))
            .Select(i => i.InvoiceNumber)
            .ToListAsync();

        var maxNum = lastNumbers
            .Select(n => int.TryParse(n.Substring(invoicePrefix.Length), out var num) ? num : 0)
            .DefaultIfEmpty(0)
            .Max();

        var nextInvoiceNumber = maxNum + 1;

        var invoice = new Invoice
        {
            InvoiceNumber = $"{invoicePrefix}{nextInvoiceNumber:D4}",
            PatientId = request.PatientId,
            InvoiceDate = request.InvoiceDate ?? DateTime.UtcNow,
            DueDate = request.DueDate ?? DateTime.UtcNow.AddDays(30),
            Status = InvoiceStatus.Draft,
            SubTotal = request.Subtotal,
            DiscountAmount = request.DiscountAmount,
            DiscountId = request.DiscountId,
            TaxPercent = request.TaxPercentage,
            TaxAmount = request.TaxAmount,
            TotalAmount = request.TotalAmount,
            OutstandingAmount = request.TotalAmount,
            Notes = request.Notes,
            TenantId = tenantId,
            BranchId = branchId
        };

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();

        if (request.Items != null)
        {
            foreach (var item in request.Items)
            {
                _context.InvoiceItems.Add(new InvoiceItem
                {
                    InvoiceId = invoice.Id,
                    Description = item.Description,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    TotalAmount = item.Quantity * item.UnitPrice
                });
            }
            await _context.SaveChangesAsync();
        }

        return Ok(Result<object>.Success(new { id = invoice.Id, invoiceNumber = invoice.InvoiceNumber }));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingEdit)]
    public async Task<IActionResult> UpdateInvoice(Guid id, [FromBody] CreateInvoiceRequest request)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Items)
            .FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted);
        if (invoice == null)
            return NotFound(Result.Failure("Invoice not found"));

        if (invoice.Status is InvoiceStatus.Cancelled or InvoiceStatus.Refunded or InvoiceStatus.WrittenOff)
            return BadRequest(Result.Failure("Cannot edit an invoice with status " + invoice.Status));

        if (request.Items == null || request.Items.Count == 0)
            return BadRequest(Result.Failure("At least one invoice item is required."));

        var computedSubtotal = request.Items.Sum(i => (decimal)(i.Quantity) * i.UnitPrice);
        if (request.DiscountAmount < 0)
            return BadRequest(Result.Failure("Discount amount cannot be negative."));

        if (request.DiscountAmount > computedSubtotal)
            return BadRequest(Result.Failure("Discount cannot exceed the subtotal."));

        if (request.TaxAmount < 0)
            return BadRequest(Result.Failure("Tax amount cannot be negative."));

        if (request.TotalAmount < 0)
            return BadRequest(Result.Failure("Total amount cannot be negative."));

        var computedTotal = Math.Max(0, computedSubtotal - request.DiscountAmount + request.TaxAmount);
        if (Math.Abs(request.TotalAmount - computedTotal) > 0.01m)
            return BadRequest(Result.Failure("Total amount does not match the calculated total."));

        invoice.PatientId = request.PatientId;
        invoice.InvoiceDate = request.InvoiceDate ?? invoice.InvoiceDate;
        invoice.DueDate = request.DueDate ?? invoice.DueDate;
        invoice.SubTotal = request.Subtotal;
        invoice.DiscountAmount = request.DiscountAmount;
        invoice.DiscountId = request.DiscountId;
        invoice.TaxPercent = request.TaxPercentage;
        invoice.TaxAmount = request.TaxAmount;
        invoice.TotalAmount = request.TotalAmount;
        invoice.OutstandingAmount = request.TotalAmount - invoice.PaidAmount;
        invoice.Notes = request.Notes;

        if (invoice.OutstandingAmount <= 0)
            invoice.Status = InvoiceStatus.Paid;
        else if (invoice.PaidAmount > 0)
            invoice.Status = InvoiceStatus.PartiallyPaid;

        // Replace items
        if (request.Items != null)
        {
            var existingItems = invoice.Items.ToList();
            _context.InvoiceItems.RemoveRange(existingItems);

            foreach (var item in request.Items)
            {
                _context.InvoiceItems.Add(new InvoiceItem
                {
                    InvoiceId = invoice.Id,
                    Description = item.Description,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    TotalAmount = item.Quantity * item.UnitPrice
                });
            }
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Invoice updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingDelete)]
    public async Task<IActionResult> DeleteInvoice(Guid id)
    {
        var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted);
        if (invoice is null)
            return NotFound(Result.Failure("Invoice not found"));

        invoice.IsDeleted = true;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Invoice deleted successfully"));
    }

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingView)]
    public async Task<IActionResult> GetInvoiceStats(
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? status = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        // Base query for cards (ignores status filter, only applies search/date)
        var baseQuery = _context.Invoices.Where(i => !i.IsDeleted);

        if (startDate.HasValue)
            baseQuery = baseQuery.Where(i => i.InvoiceDate >= startDate.Value);

        if (endDate.HasValue)
            baseQuery = baseQuery.Where(i => i.InvoiceDate <= endDate.Value);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            baseQuery = baseQuery.Where(i =>
                i.InvoiceNumber.Contains(searchTerm) ||
                _context.Patients.Any(p => p.Id == i.PatientId && (p.FirstName + " " + p.LastName).Contains(searchTerm)));
        }

        // Cards use base query (no status filter)
        var totalSale = await baseQuery.SumAsync(i => i.TotalAmount);
        var totalPaid = await baseQuery.SumAsync(i => i.PaidAmount);
        var totalRefunded = await baseQuery.SumAsync(i => i.RefundedAmount);
        var totalReceivable = await baseQuery.Where(i => i.Status != InvoiceStatus.Refunded && i.Status != InvoiceStatus.Cancelled && i.Status != InvoiceStatus.WrittenOff).SumAsync(i => i.OutstandingAmount);
        var totalCount = await baseQuery.CountAsync();
        var paidCount = await baseQuery.CountAsync(i => i.Status == InvoiceStatus.Paid);
        var pendingCount = await baseQuery.CountAsync(i => i.Status != InvoiceStatus.Paid && i.Status != InvoiceStatus.Cancelled && i.Status != InvoiceStatus.Refunded && i.Status != InvoiceStatus.WrittenOff);
        var refundCount = await baseQuery.CountAsync(i => i.Status == InvoiceStatus.Refunded);

        // Table query (applies status filter)
        var tableQuery = baseQuery;
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<InvoiceStatus>(status, true, out var statusEnum))
            tableQuery = tableQuery.Where(i => i.Status == statusEnum);

        return Ok(Result<object>.Success(new
        {
            totalSale,
            totalPaid,
            totalRefunded,
            totalReceivable,
            totalCount,
            paidCount,
            pendingCount,
            refundCount
        }));
    }

    [HttpPost("{id:guid}/payments")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PaymentsCreate)]
    public async Task<IActionResult> AddPayment(Guid id, [FromBody] AddPaymentRequest request)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Payments.Where(p => !p.IsDeleted && !p.IsRefund))
            .FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted);

        if (invoice == null)
            return NotFound(Result.Failure("Invoice not found"));

        if (invoice.Status is InvoiceStatus.Cancelled or InvoiceStatus.Refunded or InvoiceStatus.WrittenOff)
            return BadRequest(Result.Failure("Cannot record payment for an invoice with status " + invoice.Status));

        if (request.Amount <= 0)
            return BadRequest(Result.Failure("Payment amount must be greater than zero."));

        if (request.Amount > invoice.OutstandingAmount)
            return BadRequest(Result.Failure($"Payment amount ({request.Amount:C}) exceeds outstanding balance ({invoice.OutstandingAmount:C})."));

        var tenantId = _tenantService.GetCurrentTenantId();
        var branchId = _tenantService.GetCurrentBranchId();
        var tenant = await _context.Tenants.FirstOrDefaultAsync(t => t.Id == tenantId!.Value);
        var paymentPrefix = "PAY-";
        if (tenant?.Settings != null)
        {
            try
            {
                using var doc = System.Text.Json.JsonDocument.Parse(tenant.Settings);
                if (doc.RootElement.TryGetProperty("paymentPrefix", out var prefixProp))
                    paymentPrefix = prefixProp.GetString() ?? "PAY-";
            }
            catch { }
        }

        var lastPaymentNumbers = await _context.Payments
            .IgnoreQueryFilters()
            .Where(p => p.TenantId == tenantId && p.PaymentNumber.StartsWith(paymentPrefix))
            .Select(p => p.PaymentNumber)
            .ToListAsync();

        var maxPaymentNum = lastPaymentNumbers
            .Select(n => int.TryParse(n.Substring(paymentPrefix.Length), out var num) ? num : 0)
            .DefaultIfEmpty(0)
            .Max();

        Enum.TryParse<PaymentMethod>(request.PaymentMethod, true, out var paymentMethod);

        var payment = new Payment
        {
            PaymentNumber = $"{paymentPrefix}{(maxPaymentNum + 1):D4}",
            InvoiceId = invoice.Id,
            PatientId = invoice.PatientId,
            PaymentDate = DateTime.UtcNow,
            Amount = request.Amount,
            PaymentMethod = paymentMethod,
            Status = PaymentStatus.Completed,
            ReferenceNumber = request.ReferenceNumber,
            Notes = request.Notes,
            TenantId = tenantId,
            BranchId = branchId
        };

        _context.Payments.Add(payment);

        invoice.PaidAmount += request.Amount;
        invoice.OutstandingAmount = Math.Max(0, invoice.TotalAmount - invoice.PaidAmount);

        if (invoice.OutstandingAmount <= 0)
            invoice.Status = InvoiceStatus.Paid;
        else if (invoice.PaidAmount > 0)
            invoice.Status = InvoiceStatus.PartiallyPaid;

        await _context.SaveChangesAsync();
        return Ok(Result<object>.Success(new { id = invoice.Id, paidAmount = invoice.PaidAmount, outstandingAmount = invoice.OutstandingAmount }));
    }

    [HttpGet("recent")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingView)]
    public async Task<IActionResult> GetRecentInvoices()
    {
        var items = await _context.Invoices
            .Where(i => !i.IsDeleted)
            .OrderByDescending(i => i.InvoiceDate)
            .Take(5)
            .Select(i => new
            {
                i.Id,
                i.InvoiceNumber,
                PatientName = _context.Patients.Where(p => p.Id == i.PatientId).Select(p => p.FirstName + " " + p.LastName).FirstOrDefault() ?? "Unknown",
                i.InvoiceDate,
                i.TotalAmount,
                i.PaidAmount,
                Status = i.Status.ToString()
            })
            .ToListAsync();

        return Ok(Result<object[]>.Success(items.ToArray()));
    }

    [HttpGet("payments")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PaymentsView)]
    public async Task<IActionResult> GetPayments(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var query = _context.Payments
            .Where(p => p.TenantId == tenantId && !p.IsDeleted && !p.IsRefund);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(p =>
                p.PaymentNumber.Contains(searchTerm) ||
                p.ReferenceNumber!.Contains(searchTerm) ||
                p.PatientId.ToString().Contains(searchTerm));
        }

        if (startDate.HasValue)
            query = query.Where(p => p.PaymentDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(p => p.PaymentDate <= endDate.Value);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(p => p.PaymentDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.Id,
                p.PaymentNumber,
                p.InvoiceId,
                InvoiceNumber = _context.Invoices.Where(i => i.Id == p.InvoiceId).Select(i => i.InvoiceNumber).FirstOrDefault(),
                p.PatientId,
                PatientName = _context.Patients.Where(pt => pt.Id == p.PatientId).Select(pt => pt.FirstName + " " + pt.LastName).FirstOrDefault() ?? "Unknown",
                p.PaymentDate,
                p.Amount,
                Method = p.PaymentMethod.ToString(),
                Status = p.Status.ToString(),
                p.ReferenceNumber,
                p.IsRefund
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new
        {
            items,
            totalCount,
            pageNumber,
            pageSize,
            totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            hasPreviousPage = pageNumber > 1,
            hasNextPage = pageNumber * pageSize < totalCount
        }));
    }

    [HttpPost("{id:guid}/return")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingRefund)]
    public async Task<IActionResult> ReturnInvoice(Guid id, [FromBody] ReturnInvoiceRequest request)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Payments)
            .FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted);

        if (invoice is null)
            return NotFound(Result.Failure("Invoice not found"));

        if (invoice.Status is InvoiceStatus.Refunded or InvoiceStatus.Cancelled or InvoiceStatus.WrittenOff)
            return BadRequest(Result.Failure("Invoice cannot be returned in its current status."));

        foreach (var payment in invoice.Payments.Where(p => !p.IsDeleted && !p.IsRefund))
        {
            payment.IsRefund = true;
            payment.RefundReason = request.Notes ?? "Invoice refunded";
            payment.Status = PaymentStatus.Refunded;
        }

        invoice.RefundedAmount = invoice.PaidAmount;
        invoice.PaidAmount = 0;
        invoice.OutstandingAmount = invoice.TotalAmount;
        invoice.Status = InvoiceStatus.Refunded;
        invoice.Notes = string.IsNullOrWhiteSpace(request.Notes)
            ? invoice.Notes
            : (invoice.Notes + "\n" + request.Notes).Trim();

        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new
        {
            id = invoice.Id,
            status = invoice.Status.ToString(),
            refundedAmount = invoice.RefundedAmount,
            paidAmount = invoice.PaidAmount,
            outstandingAmount = invoice.OutstandingAmount
        }));
    }
}

public record AddPaymentRequest(decimal Amount, string? PaymentMethod, string? ReferenceNumber, string? Notes);
public record ReturnInvoiceRequest(string? Notes);
