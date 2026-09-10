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
public class NursingController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NursingController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("vitals")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.EmrView)]
    public async Task<IActionResult> GetVitals([FromQuery] Guid? admissionId = null, [FromQuery] Guid? patientId = null)
    {
        var query = _context.Vitals
            .Where(v => !v.IsDeleted);

        if (admissionId.HasValue)
            query = query.Where(v => v.AdmissionId == admissionId.Value);
        else if (patientId.HasValue)
            query = query.Where(v => v.PatientId == patientId.Value);

        var vitals = await query
            .OrderByDescending(v => v.RecordedAt)
            .Take(50)
            .Select(v => new
            {
                v.Id,
                PatientName = v.Patient != null ? v.Patient.FirstName + " " + v.Patient.LastName : null,
                v.PatientId,
                v.AdmissionId,
                v.RecordedAt,
                v.SystolicBP,
                v.DiastolicBP,
                BloodPressure = v.SystolicBP.HasValue && v.DiastolicBP.HasValue ? $"{v.SystolicBP}/{v.DiastolicBP}" : null,
                v.Pulse,
                v.Temperature,
                v.TemperatureUnit,
                v.RespiratoryRate,
                v.SpO2,
                v.Weight,
                v.Height,
                v.BMI,
                v.BloodSugar,
                v.BloodSugarType,
                v.Notes
            })
            .ToListAsync();

        return Ok(Result<object>.Success(vitals));
    }

    [HttpPost("vitals")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.EmrEdit)]
    public async Task<IActionResult> RecordVitals([FromBody] RecordVitalsRequest request)
    {
        if (request.PatientId == Guid.Empty)
            return BadRequest(Result.Failure("PatientId is required"));

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == request.PatientId && !p.IsDeleted);
        if (patient == null)
            return NotFound(Result.Failure("Patient not found"));

        decimal? bmi = null;
        if (request.Weight.HasValue && request.Height.HasValue && request.Height > 0)
        {
            var heightM = request.Height.Value / 100m;
            bmi = Math.Round(request.Weight.Value / (heightM * heightM), 1);
        }

        var vital = new Domain.Entities.Clinical.Vital
        {
            PatientId = request.PatientId,
            AdmissionId = request.AdmissionId,
            RecordedAt = DateTime.UtcNow,
            SystolicBP = request.SystolicBP,
            DiastolicBP = request.DiastolicBP,
            Pulse = request.Pulse,
            Temperature = request.Temperature,
            TemperatureUnit = request.TemperatureUnit ?? "C",
            RespiratoryRate = request.RespiratoryRate,
            SpO2 = request.SpO2,
            Weight = request.Weight,
            WeightUnit = request.WeightUnit ?? "kg",
            Height = request.Height,
            HeightUnit = request.HeightUnit ?? "cm",
            BMI = bmi,
            BloodSugar = request.BloodSugar,
            BloodSugarType = request.BloodSugarType,
            Notes = request.Notes
        };

        _context.Vitals.Add(vital);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { vital.Id }, "Vitals recorded successfully"));
    }

    [HttpGet("vitals/{admissionId:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.EmrView)]
    public async Task<IActionResult> GetVitalsByAdmission(Guid admissionId)
    {
        var vitals = await _context.Vitals
            .Where(v => v.AdmissionId == admissionId && !v.IsDeleted)
            .OrderByDescending(v => v.RecordedAt)
            .Select(v => new
            {
                v.Id,
                PatientName = v.Patient != null ? v.Patient.FirstName + " " + v.Patient.LastName : null,
                v.RecordedAt,
                BloodPressure = v.SystolicBP.HasValue && v.DiastolicBP.HasValue ? $"{v.SystolicBP}/{v.DiastolicBP}" : null,
                v.Pulse,
                v.Temperature,
                v.SpO2,
                v.RespiratoryRate,
                v.Weight,
                v.BMI,
                v.BloodSugar,
                v.Notes
            })
            .ToListAsync();

        return Ok(Result<object>.Success(vitals));
    }

    [HttpGet("medications")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.EmrView)]
    public async Task<IActionResult> GetMedications([FromQuery] Guid? admissionId = null)
    {
        var query = _context.Prescriptions
            .Where(p => !p.IsDeleted && p.Items.Any(i => !i.IsDispensed));

        if (admissionId.HasValue)
            query = query.Where(p => p.AdmissionId == admissionId.Value);

        var medications = await query
            .OrderByDescending(p => p.PrescriptionDate)
            .Take(50)
            .Select(p => new
            {
                PrescriptionId = p.Id,
                PatientName = p.Patient != null ? p.Patient.FirstName + " " + p.Patient.LastName : null,
                p.PatientId,
                p.DoctorId,
                p.PrescriptionDate,
                p.Diagnosis,
                Items = p.Items.Where(i => !i.IsDispensed).Select(i => new
                {
                    i.Id,
                    i.MedicineName,
                    i.Dosage,
                    Frequency = i.Frequency.ToString(),
                    i.DurationDays,
                    i.Quantity,
                    i.Instructions,
                    IsDispensed = i.IsDispensed
                }).ToList()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(medications));
    }

    [HttpPatch("medications/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.EmrEdit)]
    public async Task<IActionResult> UpdateMedication(Guid id, [FromBody] UpdateMedicationRequest request)
    {
        var item = await _context.PrescriptionItems.FirstOrDefaultAsync(i => i.Id == id);
        if (item == null)
            return NotFound(Result.Failure("Prescription item not found"));

        if (request.IsDispensed.HasValue)
        {
            item.IsDispensed = request.IsDispensed.Value;
            if (request.IsDispensed.Value)
            {
                item.DispensedQuantity = request.DispensedQuantity;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Medication updated"));
    }

    [HttpGet("tasks")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.EmrView)]
    public async Task<IActionResult> GetTasks([FromQuery] Guid? nurseId = null)
    {
        var notes = await _context.NursingNotes
            .Where(n => !n.IsDeleted)
            .OrderByDescending(n => n.NoteDate)
            .Take(50)
            .Select(n => new
            {
                n.Id,
                n.PatientId,
                AdmissionId = n.AdmissionId,
                PatientName = n.Patient != null ? n.Patient.FirstName + " " + n.Patient.LastName : null,
                n.NoteDate,
                n.Shift,
                n.Assessment,
                n.Interventions,
                n.CarePlan,
                n.PainScore,
                n.FallRisk,
                n.Mobility,
                n.Diet,
                n.Notes
            })
            .ToListAsync();

        return Ok(Result<object>.Success(notes));
    }

    [HttpPatch("tasks/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.EmrEdit)]
    public async Task<IActionResult> UpdateTask(Guid id, [FromBody] UpdateTaskRequest request)
    {
        var note = await _context.NursingNotes.FirstOrDefaultAsync(n => n.Id == id && !n.IsDeleted);
        if (note == null)
            return NotFound(Result.Failure("Nursing note not found"));

        if (request.Assessment != null) note.Assessment = request.Assessment;
        if (request.Interventions != null) note.Interventions = request.Interventions;
        if (request.CarePlan != null) note.CarePlan = request.CarePlan;
        if (request.Notes != null) note.Notes = request.Notes;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Task updated"));
    }

    [HttpGet("notes")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.EmrView)]
    public async Task<IActionResult> GetNotes([FromQuery] Guid? admissionId = null)
    {
        var query = _context.NursingNotes
            .Where(n => !n.IsDeleted);

        if (admissionId.HasValue)
            query = query.Where(n => n.AdmissionId == admissionId.Value);

        var notes = await query
            .OrderByDescending(n => n.NoteDate)
            .Take(50)
            .Select(n => new
            {
                n.Id,
                n.PatientId,
                n.AdmissionId,
                PatientName = n.Patient != null ? n.Patient.FirstName + " " + n.Patient.LastName : null,
                n.NoteDate,
                n.Shift,
                n.Assessment,
                n.Interventions,
                n.PatientResponse,
                n.CarePlan,
                n.Notes,
                n.PainScore,
                n.FallRisk,
                n.Mobility,
                n.Diet,
                n.IntakeOutput
            })
            .ToListAsync();

        return Ok(Result<object>.Success(notes));
    }

    [HttpPost("notes")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.EmrEdit)]
    public async Task<IActionResult> AddNote([FromBody] AddNoteRequest request)
    {
        if (request.PatientId == Guid.Empty || request.AdmissionId == Guid.Empty)
            return BadRequest(Result.Failure("PatientId and AdmissionId are required"));

        var note = new Domain.Entities.Clinical.NursingNote
        {
            PatientId = request.PatientId,
            AdmissionId = request.AdmissionId,
            NoteDate = DateTime.UtcNow,
            Shift = request.Shift,
            Assessment = request.Assessment,
            Interventions = request.Interventions,
            PatientResponse = request.PatientResponse,
            CarePlan = request.CarePlan,
            Notes = request.Notes,
            PainScore = request.PainScore,
            FallRisk = request.FallRisk,
            Mobility = request.Mobility,
            Diet = request.Diet,
            IntakeOutput = request.IntakeOutput
        };

        _context.NursingNotes.Add(note);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { note.Id }, "Note added successfully"));
    }

    public class RecordVitalsRequest
    {
        public Guid PatientId { get; set; }
        public Guid? AdmissionId { get; set; }
        public int? SystolicBP { get; set; }
        public int? DiastolicBP { get; set; }
        public int? Pulse { get; set; }
        public decimal? Temperature { get; set; }
        public string? TemperatureUnit { get; set; }
        public int? RespiratoryRate { get; set; }
        public int? SpO2 { get; set; }
        public decimal? Weight { get; set; }
        public string? WeightUnit { get; set; }
        public decimal? Height { get; set; }
        public string? HeightUnit { get; set; }
        public decimal? BloodSugar { get; set; }
        public string? BloodSugarType { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateMedicationRequest
    {
        public bool? IsDispensed { get; set; }
        public decimal? DispensedQuantity { get; set; }
    }

    public class UpdateTaskRequest
    {
        public string? Assessment { get; set; }
        public string? Interventions { get; set; }
        public string? CarePlan { get; set; }
        public string? Notes { get; set; }
    }

    public class AddNoteRequest
    {
        public Guid PatientId { get; set; }
        public Guid AdmissionId { get; set; }
        public string? Shift { get; set; }
        public string? Assessment { get; set; }
        public string? Interventions { get; set; }
        public string? PatientResponse { get; set; }
        public string? CarePlan { get; set; }
        public string? Notes { get; set; }
        public string? PainScore { get; set; }
        public string? FallRisk { get; set; }
        public string? Mobility { get; set; }
        public string? Diet { get; set; }
        public string? IntakeOutput { get; set; }
    }
}
