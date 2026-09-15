using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Constants;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class PrescriptionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public PrescriptionsController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    [HttpGet]
    [RequirePermission(Permissions.PrescriptionsView)]
    public async Task<IActionResult> GetPrescriptions([FromQuery] Guid? patientId, [FromQuery] Guid? doctorId,
        [FromQuery] string? status, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.Prescriptions
            .Include(p => p.Items)
            .Where(p => !p.IsDeleted);

        if (patientId.HasValue)
            query = query.Where(p => p.PatientId == patientId.Value);
        if (doctorId.HasValue)
            query = query.Where(p => p.DoctorId == doctorId.Value);
        if (!string.IsNullOrEmpty(status))
        {
            if (status.Equals("dispensed", StringComparison.OrdinalIgnoreCase))
                query = query.Where(p => p.IsDispensed);
            else if (status.Equals("pending", StringComparison.OrdinalIgnoreCase))
                query = query.Where(p => !p.IsDispensed);
        }

        var totalCount = await query.CountAsync();
        var prescriptions = await query
            .OrderByDescending(p => p.PrescriptionDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.Id,
                p.PrescriptionNumber,
                p.PrescriptionDate,
                p.ValidUntil,
                p.Diagnosis,
                p.GeneralInstructions,
                p.IsDispensed,
                p.DispensedAt,
                PatientName = p.Patient.FirstName + " " + p.Patient.LastName,
                PatientId = p.PatientId,
                DoctorId = p.DoctorId,
                DoctorName = _context.Users.Where(u => u.Id == p.DoctorId)
                    .Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                ItemsCount = p.Items.Count,
                p.CreatedAt
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new { items = prescriptions, totalCount, pageNumber, pageSize }));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(Permissions.PrescriptionsView)]
    public async Task<IActionResult> GetPrescription(Guid id)
    {
        var prescription = await _context.Prescriptions
            .Include(p => p.Items.OrderBy(i => i.DisplayOrder))
            .Where(p => p.Id == id && !p.IsDeleted)
            .Select(p => new
            {
                p.Id,
                p.PrescriptionNumber,
                p.PrescriptionDate,
                p.ValidUntil,
                p.Diagnosis,
                p.GeneralInstructions,
                p.DietaryAdvice,
                p.LifestyleAdvice,
                p.IsDispensed,
                p.DispensedAt,
                p.PatientId,
                PatientName = p.Patient.FirstName + " " + p.Patient.LastName,
                PatientNumber = p.Patient.PatientNumber,
                p.DoctorId,
                DoctorName = _context.Users.Where(u => u.Id == p.DoctorId)
                    .Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                p.VisitId,
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
                    i.Morning, i.Afternoon, i.Evening, i.Night,
                    i.AllowSubstitution,
                    i.DisplayOrder
                }),
                p.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (prescription == null)
            return NotFound(Result.Failure("Prescription not found"));

        return Ok(Result<object>.Success(prescription));
    }

    [HttpPost]
    [RequirePermission(Permissions.PrescriptionsCreate)]
    public async Task<IActionResult> CreatePrescription([FromBody] CreatePrescriptionRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var patient = await _context.Patients.FindAsync(request.PatientId);
        if (patient == null)
            return NotFound(Result.Failure("Patient not found"));

        var prescriptionCount = await _context.Prescriptions.CountAsync();
        var prescription = new Prescription
        {
            PrescriptionNumber = $"RX-{DateTime.UtcNow:yyyyMMdd}-{(prescriptionCount + 1):D5}",
            PatientId = request.PatientId,
            DoctorId = request.DoctorId,
            VisitId = request.VisitId,
            PrescriptionDate = DateTime.UtcNow,
            ValidUntil = request.ValidUntil,
            Diagnosis = request.Diagnosis,
            GeneralInstructions = request.GeneralInstructions,
            DietaryAdvice = request.DietaryAdvice,
            LifestyleAdvice = request.LifestyleAdvice,
            TenantId = tenantId,
            BranchId = _tenantService.GetCurrentBranchId()
        };

        if (request.Items?.Any() == true)
        {
            for (int i = 0; i < request.Items.Count; i++)
            {
                var item = request.Items[i];

                // Try to link medicine to inventory by name match
                Guid? medicineId = null;
                if (!string.IsNullOrWhiteSpace(item.MedicineName))
                {
                    var nameLower = item.MedicineName.ToLower().Trim();
                    var inventoryItem = await _context.Items
                        .FirstOrDefaultAsync(x => !x.IsDeleted && x.IsActive && x.IsMedicine &&
                            x.Name.ToLower().Trim() == nameLower);
                    if (inventoryItem != null)
                        medicineId = inventoryItem.Id;
                }

                prescription.Items.Add(new PrescriptionItem
                {
                    MedicineId = medicineId,
                    MedicineName = item.MedicineName,
                    GenericName = item.GenericName,
                    Strength = item.Strength,
                    Form = item.Form,
                    Dosage = item.Dosage,
                    Frequency = Enum.TryParse<Domain.Enums.PrescriptionFrequency>(item.Frequency, true, out var freq) ? freq : Domain.Enums.PrescriptionFrequency.OnceDaily,
                    FrequencyText = item.FrequencyText,
                    Route = Enum.TryParse<Domain.Enums.MedicineRoute>(item.Route, true, out var route) ? route : Domain.Enums.MedicineRoute.Oral,
                    DurationDays = item.DurationDays,
                    DurationText = item.DurationText,
                    Quantity = item.Quantity,
                    Instructions = item.Instructions,
                    SpecialInstructions = item.SpecialInstructions,
                    Warnings = item.Warnings,
                    Morning = item.Morning,
                    Afternoon = item.Afternoon,
                    Evening = item.Evening,
                    Night = item.Night,
                    AllowSubstitution = item.AllowSubstitution,
                    DisplayOrder = i + 1
                });
            }
        }

        _context.Prescriptions.Add(prescription);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { id = prescription.Id, prescriptionNumber = prescription.PrescriptionNumber }));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(Permissions.PrescriptionsEdit)]
    public async Task<IActionResult> UpdatePrescription(Guid id, [FromBody] CreatePrescriptionRequest request)
    {
        var prescription = await _context.Prescriptions
            .Include(p => p.Items)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        if (prescription == null)
            return NotFound(Result.Failure("Prescription not found"));

        prescription.Diagnosis = request.Diagnosis;
        prescription.GeneralInstructions = request.GeneralInstructions;
        prescription.DietaryAdvice = request.DietaryAdvice;
        prescription.LifestyleAdvice = request.LifestyleAdvice;
        prescription.ValidUntil = request.ValidUntil;

        if (request.Items?.Any() == true)
        {
            _context.PrescriptionItems.RemoveRange(prescription.Items);
            prescription.Items.Clear();

            for (int i = 0; i < request.Items.Count; i++)
            {
                var item = request.Items[i];

                // Try to link medicine to inventory by name match
                Guid? medicineId = null;
                if (!string.IsNullOrWhiteSpace(item.MedicineName))
                {
                    var nameLower = item.MedicineName.ToLower().Trim();
                    var inventoryItem = await _context.Items
                        .FirstOrDefaultAsync(x => !x.IsDeleted && x.IsActive && x.IsMedicine &&
                            x.Name.ToLower().Trim() == nameLower);
                    if (inventoryItem != null)
                        medicineId = inventoryItem.Id;
                }

                prescription.Items.Add(new PrescriptionItem
                {
                    MedicineId = medicineId,
                    MedicineName = item.MedicineName,
                    GenericName = item.GenericName,
                    Strength = item.Strength,
                    Form = item.Form,
                    Dosage = item.Dosage,
                    Frequency = Enum.TryParse<Domain.Enums.PrescriptionFrequency>(item.Frequency, true, out var freq) ? freq : Domain.Enums.PrescriptionFrequency.OnceDaily,
                    FrequencyText = item.FrequencyText,
                    Route = Enum.TryParse<Domain.Enums.MedicineRoute>(item.Route, true, out var route) ? route : Domain.Enums.MedicineRoute.Oral,
                    DurationDays = item.DurationDays,
                    DurationText = item.DurationText,
                    Quantity = item.Quantity,
                    Instructions = item.Instructions,
                    SpecialInstructions = item.SpecialInstructions,
                    Warnings = item.Warnings,
                    Morning = item.Morning,
                    Afternoon = item.Afternoon,
                    Evening = item.Evening,
                    Night = item.Night,
                    AllowSubstitution = item.AllowSubstitution,
                    DisplayOrder = i + 1
                });
            }
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Prescription updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(Permissions.PrescriptionsDelete)]
    public async Task<IActionResult> DeletePrescription(Guid id)
    {
        var prescription = await _context.Prescriptions.FindAsync(id);
        if (prescription == null || prescription.IsDeleted)
            return NotFound(Result.Failure("Prescription not found"));

        prescription.IsDeleted = true;
        prescription.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Prescription deleted successfully"));
    }

    [HttpPost("{id:guid}/dispense")]
    [RequirePermission(Permissions.PrescriptionsDispense)]
    public async Task<IActionResult> DispensePrescription(Guid id)
    {
        var prescription = await _context.Prescriptions.FindAsync(id);
        if (prescription == null || prescription.IsDeleted)
            return NotFound(Result.Failure("Prescription not found"));

        prescription.IsDispensed = true;
        prescription.DispensedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Prescription dispensed successfully"));
    }

    [HttpGet("print/{id:guid}")]
    [RequirePermission(Permissions.PrescriptionsPrint)]
    public async Task<IActionResult> PrintPrescription(Guid id)
    {
        var prescription = await _context.Prescriptions
            .Include(p => p.Items.OrderBy(i => i.DisplayOrder))
            .Where(p => p.Id == id && !p.IsDeleted)
            .Select(p => new
            {
                p.PrescriptionNumber,
                p.PrescriptionDate,
                p.ValidUntil,
                p.Diagnosis,
                p.GeneralInstructions,
                p.DietaryAdvice,
                p.LifestyleAdvice,
                PatientName = p.Patient.FirstName + " " + p.Patient.LastName,
                PatientNumber = p.Patient.PatientNumber,
                PatientAge = p.Patient.Age,
                PatientGender = p.Patient.Gender,
                DoctorName = _context.Users.Where(u => u.Id == p.DoctorId)
                    .Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                Items = p.Items.Select(i => new
                {
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
                    i.Warnings,
                    i.Morning, i.Afternoon, i.Evening, i.Night
                })
            })
            .FirstOrDefaultAsync();

        if (prescription == null)
            return NotFound(Result.Failure("Prescription not found"));

        return Ok(Result<object>.Success(prescription));
    }
}

public record CreatePrescriptionRequest(
    Guid PatientId,
    Guid DoctorId,
    Guid? VisitId,
    DateTime? ValidUntil,
    string? Diagnosis,
    string? GeneralInstructions,
    string? DietaryAdvice,
    string? LifestyleAdvice,
    List<PrescriptionItemRequest>? Items
);

public record PrescriptionItemRequest(
    string MedicineName,
    string? GenericName,
    string? Strength,
    string? Form,
    string? Dosage,
    string? Frequency,
    string? FrequencyText,
    string? Route,
    int? DurationDays,
    string? DurationText,
    decimal? Quantity,
    string? Instructions,
    string? SpecialInstructions,
    string? Warnings,
    bool Morning,
    bool Afternoon,
    bool Evening,
    bool Night,
    bool AllowSubstitution = true
);
