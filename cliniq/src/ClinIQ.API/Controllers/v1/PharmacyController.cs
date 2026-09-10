using ClinIQ.Domain.Enums;
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

    public PharmacyController(ApplicationDbContext context)
    {
        _context = context;
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
                p.PrescriptionDate,
                p.ValidUntil,
                p.Diagnosis,
                p.IsDispensed,
                p.DispensedAt,
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
                    i.DispensedQuantity
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
        if (request.PrescriptionItemId == Guid.Empty)
            return BadRequest(Result.Failure("PrescriptionItemId is required"));

        var item = await _context.PrescriptionItems
            .FirstOrDefaultAsync(i => i.Id == request.PrescriptionItemId);
        if (item == null)
            return NotFound(Result.Failure("Prescription item not found"));

        item.IsDispensed = true;
        item.DispensedQuantity = request.Quantity;
        item.DispensedBatchId = request.BatchId;

        // Update stock if medicine has an inventory reference
        if (item.MedicineId.HasValue && request.Quantity.HasValue)
        {
            var inventoryItem = await _context.Items.FirstOrDefaultAsync(i => i.Id == item.MedicineId.Value);
            if (inventoryItem != null)
            {
                inventoryItem.CurrentStock -= request.Quantity.Value;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(Result<object>.Success(new { item.Id }, "Dispensed successfully"));
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
        var totalPrescriptions = await _context.Prescriptions.CountAsync(p => !p.IsDeleted);
        var pendingDispensing = await _context.Prescriptions.CountAsync(p => !p.IsDeleted && !p.IsDispensed);
        var todayDispensed = await _context.Prescriptions.CountAsync(p => !p.IsDeleted && p.IsDispensed && p.DispensedAt >= today);
        var lowStockMedicines = await _context.Items.CountAsync(i => !i.IsDeleted && i.IsActive && i.IsMedicine && i.CurrentStock <= i.ReorderLevel);

        return Ok(Result<object>.Success(new
        {
            totalPrescriptions,
            pendingDispensing,
            todayDispensed,
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
                p.PrescriptionDate,
                p.Diagnosis,
                Items = p.Items.Where(i => !i.IsDispensed).Select(i => new
                {
                    i.Id,
                    i.MedicineName,
                    i.Dosage,
                    i.Quantity,
                    i.Instructions
                }).ToList()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(prescriptions));
    }

    public class DispenseRequest
    {
        public Guid PrescriptionItemId { get; set; }
        public decimal? Quantity { get; set; }
        public Guid? BatchId { get; set; }
    }
}
