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
public class PharmacyController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public PharmacyController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    [HttpGet("prescriptions")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PharmacyView)]
    public async Task<IActionResult> GetPrescriptions(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] bool? dispensed = null)
    {
        var query = _context.Prescriptions
            .Where(p => !p.IsDeleted);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(p =>
                p.PrescriptionNumber.ToLower().Contains(term) ||
                (p.Patient != null && (p.Patient.FirstName + " " + p.Patient.LastName).ToLower().Contains(term)));
        }

        if (dispensed.HasValue)
            query = query.Where(p => p.IsDispensed == dispensed.Value);

        var totalCount = await query.CountAsync();
        var prescriptions = await query
            .OrderByDescending(p => p.PrescriptionDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.Id,
                p.PrescriptionNumber,
                PatientName = p.Patient != null ? p.Patient.FirstName + " " + p.Patient.LastName : null,
                p.PatientId,
                p.DoctorId,
                DoctorName = _context.Users.Where(u => u.Id == p.DoctorId)
                    .Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                p.PrescriptionDate,
                p.ValidUntil,
                p.Diagnosis,
                p.IsDispensed,
                p.DispensedAt,
                CreatedAt = p.PrescriptionDate,
                ItemCount = p.Items.Count,
                PendingItems = p.Items.Count(i => !i.IsDispensed)
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new { items = prescriptions, totalCount, pageNumber, pageSize }));
    }

    [HttpGet("prescriptions/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PharmacyView)]
    public async Task<IActionResult> GetPrescription(Guid id)
    {
        var prescription = await _context.Prescriptions
            .Where(p => p.Id == id && !p.IsDeleted)
            .Select(p => new
            {
                p.Id,
                p.PrescriptionNumber,
                PatientName = p.Patient != null ? p.Patient.FirstName + " " + p.Patient.LastName : null,
                p.PatientId,
                p.DoctorId,
                DoctorName = _context.Users.Where(u => u.Id == p.DoctorId)
                    .Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                p.PrescriptionDate,
                p.ValidUntil,
                p.GeneralInstructions,
                p.DietaryAdvice,
                p.LifestyleAdvice,
                p.Diagnosis,
                p.IsDispensed,
                p.DispensedAt,
                Items = p.Items.Select(i => new
                {
                    i.Id,
                    i.MedicineId,
                    i.MedicineName,
                    i.GenericName,
                    i.Strength,
                    i.Form,
                    i.Dosage,
                    Frequency = i.Frequency.ToString(),
                    i.FrequencyText,
                    Route = i.Route.ToString(),
                    i.DurationDays,
                    i.DurationText,
                    i.Quantity,
                    i.Instructions,
                    i.SpecialInstructions,
                    i.Warnings,
                    i.Morning,
                    i.Afternoon,
                    i.Evening,
                    i.Night,
                    i.AllowSubstitution,
                    i.IsDispensed,
                    i.DispensedQuantity,
                    UnitPrice = i.MedicineId.HasValue
                        ? _context.Items.Where(it => it.Id == i.MedicineId.Value)
                            .Select(it => it.SellingPrice).FirstOrDefault()
                        : 0m
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (prescription == null)
            return NotFound(Result.Failure("Prescription not found"));

        return Ok(Result<object>.Success(prescription));
    }

    [HttpPost("dispense")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PharmacyDispense)]
    public async Task<IActionResult> Dispense([FromBody] DispenseRequest request)
    {
        if (request.PrescriptionId == Guid.Empty)
            return BadRequest(Result.Failure("PrescriptionId is required"));

        var prescription = await _context.Prescriptions
            .Include(p => p.Items)
            .FirstOrDefaultAsync(p => p.Id == request.PrescriptionId && !p.IsDeleted);
        if (prescription == null)
            return NotFound(Result.Failure("Prescription not found"));

        var tenantId = _tenantService.GetCurrentTenantId();
        var branchId = _tenantService.GetCurrentBranchId();

        decimal totalAmount = 0;
        var invoiceItems = new List<InvoiceItem>();

        if (request.Items?.Any() == true)
        {
            foreach (var dispensedItem in request.Items)
            {
                var item = await _context.PrescriptionItems
                    .FirstOrDefaultAsync(i => i.Id == dispensedItem.PrescriptionItemId);
                if (item == null) continue;

                item.IsDispensed = true;
                item.DispensedQuantity = dispensedItem.Quantity ?? item.Quantity;
                item.DispensedBatchId = dispensedItem.BatchId;

                decimal unitPrice = dispensedItem.UnitPrice ?? 0;
                if (item.MedicineId.HasValue && dispensedItem.Quantity.HasValue)
                {
                    var inventoryItem = await _context.Items.FirstOrDefaultAsync(i => i.Id == item.MedicineId.Value);
                    if (inventoryItem != null)
                    {
                        inventoryItem.CurrentStock -= dispensedItem.Quantity.Value;
                        unitPrice = dispensedItem.UnitPrice ?? inventoryItem.SellingPrice;
                    }
                }

                var lineTotal = unitPrice * (dispensedItem.Quantity ?? item.Quantity ?? 0);
                totalAmount += lineTotal;

                invoiceItems.Add(new InvoiceItem
                {
                    ItemType = "Medicine",
                    ItemName = item.MedicineName,
                    Description = $"{item.MedicineName} {item.Strength} {item.Form}".Trim(),
                    Quantity = dispensedItem.Quantity ?? item.Quantity ?? 0,
                    UnitPrice = unitPrice,
                    Amount = lineTotal,
                    TotalAmount = lineTotal,
                    MedicineId = item.MedicineId,
                    DisplayOrder = invoiceItems.Count + 1
                });
            }
        }

        prescription.IsDispensed = prescription.Items.All(i => i.IsDispensed);
        if (prescription.IsDispensed)
            prescription.DispensedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Create invoice for dispensed medicines
        Invoice? invoice = null;
        if (invoiceItems.Any() && totalAmount > 0 && tenantId.HasValue)
        {
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

            invoice = new Invoice
            {
                InvoiceNumber = $"{invoicePrefix}{(maxNum + 1):D4}",
                PatientId = prescription.PatientId,
                VisitId = prescription.VisitId,
                InvoiceDate = DateTime.UtcNow,
                DueDate = DateTime.UtcNow.AddDays(30),
                Status = InvoiceStatus.Draft,
                SubTotal = totalAmount,
                TotalAmount = totalAmount,
                OutstandingAmount = totalAmount,
                Notes = $"Pharmacy dispense - Prescription #{prescription.PrescriptionNumber}",
                TenantId = tenantId,
                BranchId = branchId
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            foreach (var item in invoiceItems)
            {
                item.InvoiceId = invoice.Id;
                _context.InvoiceItems.Add(item);
            }
            await _context.SaveChangesAsync();
        }

        return Ok(Result<object>.Success(new
        {
            prescriptionId = prescription.Id,
            isFullyDispensed = prescription.IsDispensed,
            invoiceId = invoice?.Id,
            invoiceNumber = invoice?.InvoiceNumber,
            totalAmount
        }, "Dispensed successfully"));
    }

    [HttpGet("medicines/search")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PharmacyView)]
    public async Task<IActionResult> SearchMedicines([FromQuery] string term)
    {
        if (string.IsNullOrWhiteSpace(term) || term.Length < 2)
            return Ok(Result<object>.Success(Array.Empty<object>()));

        var lower = term.ToLower();
        var medicines = await _context.Items
            .Where(i => !i.IsDeleted && i.IsActive && i.IsMedicine &&
                (i.Name.ToLower().Contains(lower) ||
                 (i.GenericName != null && i.GenericName.ToLower().Contains(lower)) ||
                 (i.BrandName != null && i.BrandName.ToLower().Contains(lower))))
            .Select(i => new
            {
                i.Id,
                i.Name,
                i.Code,
                i.GenericName,
                i.BrandName,
                i.Strength,
                i.Form,
                i.SellingPrice,
                i.CurrentStock
            })
            .OrderBy(i => i.Name)
            .Take(20)
            .ToListAsync();

        return Ok(Result<object>.Success(medicines));
    }

    public class DispenseRequest
    {
        public Guid PrescriptionId { get; set; }
        public List<DispenseItemRequest>? Items { get; set; }
    }

    public class DispenseItemRequest
    {
        public Guid PrescriptionItemId { get; set; }
        public decimal? Quantity { get; set; }
        public Guid? BatchId { get; set; }
        public decimal? UnitPrice { get; set; }
    }

    [HttpGet("stock")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PharmacyView)]
    public async Task<IActionResult> GetStock()
    {
        var stock = await _context.Items
            .Where(i => !i.IsDeleted && i.IsActive && i.IsMedicine)
            .Select(i => new
            {
                ItemId = i.Id,
                i.Name,
                i.Code,
                i.GenericName,
                i.BrandName,
                i.Strength,
                i.Form,
                i.CurrentStock,
                i.ReorderLevel,
                CategoryName = i.Category != null ? i.Category.Name : null,
                StockStatus = i.CurrentStock <= 0 ? "OutOfStock" :
                    i.CurrentStock <= i.ReorderLevel ? "LowStock" : "InStock"
            })
            .OrderBy(i => i.Name)
            .ToListAsync();

        return Ok(Result<object>.Success(stock));
    }

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PharmacyView)]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);
        var totalPrescriptions = await _context.Prescriptions.CountAsync(p => !p.IsDeleted);
        var pendingDispensing = await _context.Prescriptions.CountAsync(p => !p.IsDeleted && !p.IsDispensed);
        var todayDispensed = await _context.Prescriptions.CountAsync(p => !p.IsDeleted && p.IsDispensed && p.DispensedAt >= today);
        var lowStockMedicines = await _context.Items.CountAsync(i => !i.IsDeleted && i.IsActive && i.IsMedicine && i.CurrentStock <= i.ReorderLevel);

        var todaySales = await _context.Payments
            .Where(p => !p.IsDeleted && p.PaymentDate >= today && p.PaymentDate < tomorrow && p.Status == PaymentStatus.Completed)
            .SumAsync(p => p.Amount);

        return Ok(Result<object>.Success(new
        {
            totalPrescriptions,
            pendingPrescriptions = pendingDispensing,
            dispensedToday = todayDispensed,
            todaySales,
            lowStockMedicines
        }));
    }

    [HttpGet("pending")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PharmacyView)]
    public async Task<IActionResult> GetPendingPrescriptions()
    {
        var prescriptions = await _context.Prescriptions
            .Where(p => !p.IsDeleted && !p.IsDispensed)
            .OrderBy(p => p.PrescriptionDate)
            .Take(50)
            .Select(p => new
            {
                p.Id,
                p.PrescriptionNumber,
                PatientName = p.Patient != null ? p.Patient.FirstName + " " + p.Patient.LastName : null,
                p.PatientId,
                DoctorName = _context.Users.Where(u => u.Id == p.DoctorId)
                    .Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                p.PrescriptionDate,
                p.Diagnosis,
                ItemCount = p.Items.Count,
                CreatedAt = p.PrescriptionDate,
                Items = p.Items.Where(i => !i.IsDispensed).Select(i => new
                {
                    i.Id,
                    i.MedicineName,
                    i.Dosage,
                    i.Quantity,
                    i.Instructions,
                    MedicineId = i.MedicineId,
                    Strength = i.Strength,
                    Form = i.Form,
                    Frequency = i.Frequency.ToString(),
                    GenericName = i.GenericName
                }).ToList()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(prescriptions));
    }
}
