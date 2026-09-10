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

        var invoice = new Invoice
        {
            InvoiceNumber = $"INV-{(_context.Invoices.Count() + 1):D4}",
            PatientId = request.PatientId,
            InvoiceDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(30),
            Status = InvoiceStatus.Draft,
            SubTotal = request.Items?.Sum(i => i.Quantity * i.UnitPrice) ?? 0,
            TotalAmount = request.Items?.Sum(i => i.Quantity * i.UnitPrice) ?? 0,
            Notes = request.Notes,
            TenantId = tenantId,
            BranchId = branchId
        };

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();

        // Add invoice items
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
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice == null || invoice.IsDeleted)
            return NotFound(Result.Failure("Invoice not found"));

        invoice.PatientId = request.PatientId;
        invoice.Notes = request.Notes;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Invoice updated successfully"));
    }

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingView)]
    public async Task<IActionResult> GetBillingStats()
    {
        var totalRevenue = await _context.Invoices
            .Where(i => !i.IsDeleted && i.Status == InvoiceStatus.Paid)
            .SumAsync(i => i.TotalAmount);

        var pendingAmount = await _context.Invoices
            .Where(i => !i.IsDeleted && i.Status != InvoiceStatus.Paid && i.Status != InvoiceStatus.Cancelled)
            .SumAsync(i => i.OutstandingAmount);

        var todayRevenue = await _context.Invoices
            .Where(i => !i.IsDeleted && i.InvoiceDate.Date == DateTime.Today && i.Status == InvoiceStatus.Paid)
            .SumAsync(i => i.TotalAmount);

        var invoiceCount = await _context.Invoices.CountAsync(i => !i.IsDeleted);

        return Ok(Result<object>.Success(new
        {
            totalRevenue,
            pendingAmount,
            todayRevenue,
            invoiceCount
        }));
    }
}

public record CreateInvoiceRequest(
    Guid PatientId,
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
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var query = _context.Invoices.Where(i => !i.IsDeleted);

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

        var invoice = new Invoice
        {
            InvoiceNumber = $"INV-{(_context.Invoices.Count() + 1):D4}",
            PatientId = request.PatientId,
            InvoiceDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(30),
            Status = InvoiceStatus.Draft,
            SubTotal = request.Items?.Sum(i => i.Quantity * i.UnitPrice) ?? 0,
            TotalAmount = request.Items?.Sum(i => i.Quantity * i.UnitPrice) ?? 0,
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
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice == null || invoice.IsDeleted)
            return NotFound(Result.Failure("Invoice not found"));

        invoice.PatientId = request.PatientId;
        invoice.Notes = request.Notes;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Invoice updated successfully"));
    }

    [HttpPost("{id:guid}/payments")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PaymentsCreate)]
    public async Task<IActionResult> AddPayment(Guid id, [FromBody] AddPaymentRequest request)
    {
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice == null || invoice.IsDeleted)
            return NotFound(Result.Failure("Invoice not found"));

        invoice.PaidAmount += request.Amount;
        invoice.OutstandingAmount = invoice.TotalAmount - invoice.PaidAmount;

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
}

public record AddPaymentRequest(decimal Amount, string? PaymentMethod, string? Notes);
