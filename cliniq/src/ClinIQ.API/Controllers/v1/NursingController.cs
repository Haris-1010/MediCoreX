using System.Security.Claims;
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

    private Guid CurrentUserId =>
        Guid.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var uid) ? uid : Guid.Empty;

    // ──────────── Vitals ────────────

    [HttpGet("vitals")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetVitals([FromQuery] Guid? admissionId = null, [FromQuery] Guid? patientId = null)
    {
        var query = _context.Vitals.Where(v => !v.IsDeleted);

        if (admissionId.HasValue)
            query = query.Where(v => v.AdmissionId == admissionId.Value);
        else if (patientId.HasValue)
            query = query.Where(v => v.PatientId == patientId.Value);

        var vitals = await query
            .OrderByDescending(v => v.RecordedAt)
            .Take(100)
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
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> RecordVitals([FromBody] RecordVitalsRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(e => e.Value != null && e.Value.Errors.Count > 0)
                .ToDictionary(
                    e => e.Key,
                    e => e.Value!.Errors.Select(x => x.ErrorMessage).ToArray()
                );

            return BadRequest(Result.ValidationFailure(errors));
        }

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
            RecordedById = CurrentUserId,
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

    [HttpPut("vitals/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> UpdateVitals(Guid id, [FromBody] RecordVitalsRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(e => e.Value != null && e.Value.Errors.Count > 0)
                .ToDictionary(
                    e => e.Key,
                    e => e.Value!.Errors.Select(x => x.ErrorMessage).ToArray()
                );

            return BadRequest(Result.ValidationFailure(errors));
        }

        var vital = await _context.Vitals.FirstOrDefaultAsync(v => v.Id == id && !v.IsDeleted);
        if (vital == null) return NotFound(Result.Failure("Vitals not found"));

        decimal? bmi = null;
        if (request.Weight.HasValue && request.Height.HasValue && request.Height > 0)
        {
            var heightM = request.Height.Value / 100m;
            bmi = Math.Round(request.Weight.Value / (heightM * heightM), 1);
        }

        vital.SystolicBP = request.SystolicBP;
        vital.DiastolicBP = request.DiastolicBP;
        vital.Pulse = request.Pulse;
        vital.Temperature = request.Temperature;
        vital.RespiratoryRate = request.RespiratoryRate;
        vital.SpO2 = request.SpO2;
        vital.Weight = request.Weight;
        vital.Height = request.Height;
        vital.BMI = bmi;
        vital.BloodSugar = request.BloodSugar;
        vital.BloodSugarType = request.BloodSugarType;
        vital.Notes = request.Notes;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Vitals updated successfully"));
    }

    [HttpDelete("vitals/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> DeleteVitals(Guid id)
    {
        var vital = await _context.Vitals.FirstOrDefaultAsync(v => v.Id == id && !v.IsDeleted);
        if (vital == null) return NotFound(Result.Failure("Vitals not found"));

        vital.IsDeleted = true;
        await _context.SaveChangesAsync();
        return Ok(Result.Success("Vitals deleted successfully"));
    }

    [HttpGet("vitals/{admissionId:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetVitalsByAdmission(Guid admissionId)
    {
        var vitals = await _context.Vitals
            .Where(v => v.AdmissionId == admissionId && !v.IsDeleted)
            .OrderByDescending(v => v.RecordedAt)
            .Select(v => new
            {
                v.Id,
                v.PatientId,
                v.AdmissionId,
                PatientName = v.Patient != null ? v.Patient.FirstName + " " + v.Patient.LastName : null,
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
                v.WeightUnit,
                v.Height,
                v.HeightUnit,
                v.BMI,
                v.BloodSugar,
                v.BloodSugarType,
                v.Notes
            })
            .ToListAsync();

        return Ok(Result<object>.Success(vitals));
    }

    [HttpGet("vitals/single/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetVitalById(Guid id)
    {
        var vital = await _context.Vitals
            .Where(v => v.Id == id && !v.IsDeleted)
            .Select(v => new
            {
                v.Id,
                v.PatientId,
                v.AdmissionId,
                v.RecordedAt,
                v.SystolicBP,
                v.DiastolicBP,
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
            .FirstOrDefaultAsync();

        if (vital == null) return NotFound(Result.Failure("Vitals not found"));
        return Ok(Result<object>.Success(vital));
    }

    // ──────────── Medications ────────────

    [HttpGet("medications")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetMedications([FromQuery] Guid? admissionId = null)
    {
        var query = _context.Prescriptions
            .Where(p => !p.IsDeleted);

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
                Items = p.Items.Select(i => new
                {
                    i.Id,
                    i.MedicineName,
                    i.Dosage,
                    Frequency = i.Frequency.ToString(),
                    i.DurationDays,
                    i.Quantity,
                    i.Instructions,
                    i.IsDispensed,
                    Timing = new { i.Morning, i.Afternoon, i.Evening, i.Night }
                }).ToList()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(medications));
    }

    [HttpPatch("medications/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> UpdateMedication(Guid id, [FromBody] UpdateMedicationRequest request)
    {
        var item = await _context.PrescriptionItems.FirstOrDefaultAsync(i => i.Id == id);
        if (item == null) return NotFound(Result.Failure("Prescription item not found"));

        if (request.IsDispensed.HasValue)
        {
            item.IsDispensed = request.IsDispensed.Value;
            if (request.IsDispensed.Value)
                item.DispensedQuantity = request.DispensedQuantity;
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Medication updated"));
    }

    // ──────────── Nursing Notes ────────────

    [HttpGet("notes")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetNotes([FromQuery] Guid? admissionId = null)
    {
        var query = _context.NursingNotes.Where(n => !n.IsDeleted);

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
                NurseId = n.NurseId,
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
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> AddNote([FromBody] AddNoteRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(e => e.Value != null && e.Value.Errors.Count > 0)
                .ToDictionary(
                    e => e.Key,
                    e => e.Value!.Errors.Select(x => x.ErrorMessage).ToArray()
                );

            return BadRequest(Result.ValidationFailure(errors));
        }

        if (request.PatientId == Guid.Empty || request.AdmissionId == Guid.Empty)
            return BadRequest(Result.Failure("PatientId and AdmissionId are required"));

        var note = new Domain.Entities.Clinical.NursingNote
        {
            PatientId = request.PatientId,
            AdmissionId = request.AdmissionId,
            NurseId = CurrentUserId,
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

    [HttpPut("notes/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> UpdateNote(Guid id, [FromBody] AddNoteRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(e => e.Value != null && e.Value.Errors.Count > 0)
                .ToDictionary(
                    e => e.Key,
                    e => e.Value!.Errors.Select(x => x.ErrorMessage).ToArray()
                );

            return BadRequest(Result.ValidationFailure(errors));
        }

        var note = await _context.NursingNotes.FirstOrDefaultAsync(n => n.Id == id && !n.IsDeleted);
        if (note == null) return NotFound(Result.Failure("Nursing note not found"));

        note.Shift = request.Shift;
        note.Assessment = request.Assessment;
        note.Interventions = request.Interventions;
        note.PatientResponse = request.PatientResponse;
        note.CarePlan = request.CarePlan;
        note.Notes = request.Notes;
        note.PainScore = request.PainScore;
        note.FallRisk = request.FallRisk;
        note.Mobility = request.Mobility;
        note.Diet = request.Diet;
        note.IntakeOutput = request.IntakeOutput;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Note updated successfully"));
    }

    [HttpDelete("notes/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> DeleteNote(Guid id)
    {
        var note = await _context.NursingNotes.FirstOrDefaultAsync(n => n.Id == id && !n.IsDeleted);
        if (note == null) return NotFound(Result.Failure("Nursing note not found"));

        note.IsDeleted = true;
        await _context.SaveChangesAsync();
        return Ok(Result.Success("Note deleted successfully"));
    }

    [HttpGet("notes/single/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetNoteById(Guid id)
    {
        var note = await _context.NursingNotes
            .Where(n => n.Id == id && !n.IsDeleted)
            .Select(n => new
            {
                n.Id,
                n.PatientId,
                n.AdmissionId,
                n.NurseId,
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
            .FirstOrDefaultAsync();

        if (note == null) return NotFound(Result.Failure("Nursing note not found"));
        return Ok(Result<object>.Success(note));
    }

    // ──────────── Intake/Output ────────────

    [HttpGet("intake-output")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetIntakeOutput([FromQuery] Guid admissionId)
    {
        var notes = await _context.NursingNotes
            .Where(n => !n.IsDeleted && n.AdmissionId == admissionId && n.IntakeOutput != null && n.IntakeOutput != "[]")
            .OrderByDescending(n => n.NoteDate)
            .ToListAsync();

        var allRecords = new List<object>();

        foreach (var note in notes)
        {
            try
            {
                var records = System.Text.Json.JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(note.IntakeOutput!);
                if (records != null)
                {
                    foreach (var record in records)
                    {
                        allRecords.Add(new
                        {
                            Id = record.TryGetProperty("Id", out var idProp) ? idProp.GetString() : "",
                            Type = record.TryGetProperty("Type", out var t) ? t.GetString() : "",
                            Description = record.TryGetProperty("Description", out var d) ? d.GetString() : "",
                            Amount = record.TryGetProperty("Amount", out var a) ? a.GetInt32() : 0,
                            Notes = record.TryGetProperty("Notes", out var n) ? n.GetString() : "",
                            RecordedAt = record.TryGetProperty("RecordedAt", out var r) && DateTime.TryParse(r.GetString(), out var dt) ? dt : DateTime.MinValue
                        });
                    }
                }
            }
            catch { }
        }

        allRecords = allRecords
            .OrderByDescending(r => ((dynamic)r).RecordedAt)
            .ToList();

        return Ok(Result<object>.Success(allRecords));
    }

    [HttpPost("intake-output")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> AddIntakeOutput([FromBody] AddIntakeOutputRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(e => e.Value != null && e.Value.Errors.Count > 0)
                .ToDictionary(
                    e => e.Key,
                    e => e.Value!.Errors.Select(x => x.ErrorMessage).ToArray()
                );

            return BadRequest(Result.ValidationFailure(errors));
        }

        if (request.AdmissionId == Guid.Empty)
            return BadRequest(Result.Failure("AdmissionId is required"));

        var today = DateTime.UtcNow.Date;
        var note = await _context.NursingNotes
            .FirstOrDefaultAsync(n => !n.IsDeleted && n.AdmissionId == request.AdmissionId
                && n.NoteDate >= today && n.NoteDate < today.AddDays(1));

        var ioEntry = new
        {
            Id = Guid.NewGuid().ToString(),
            Type = request.Type,
            Description = request.Description,
            Amount = request.Amount,
            Notes = request.Notes,
            RecordedAt = DateTime.UtcNow.ToString("O")
        };

        var ioList = new List<System.Text.Json.JsonElement>();
        if (!string.IsNullOrEmpty(note?.IntakeOutput))
        {
            ioList = System.Text.Json.JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(note.IntakeOutput!) ?? new();
        }

        var entryJson = System.Text.Json.JsonSerializer.Serialize(ioEntry);
        var entryElement = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(entryJson);
        ioList.Add(entryElement);

        if (note == null)
        {
            note = new Domain.Entities.Clinical.NursingNote
            {
                PatientId = request.PatientId,
                AdmissionId = request.AdmissionId,
                NurseId = CurrentUserId,
                NoteDate = DateTime.UtcNow,
                Shift = "N/A",
                IntakeOutput = System.Text.Json.JsonSerializer.Serialize(ioList)
            };
            _context.NursingNotes.Add(note);
        }
        else
        {
            note.IntakeOutput = System.Text.Json.JsonSerializer.Serialize(ioList);
        }

        await _context.SaveChangesAsync();
        return Ok(Result<object>.Success(new { ioEntry.Id }, "Intake/Output recorded"));
    }

    [HttpDelete("intake-output/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> DeleteIntakeOutput(Guid id, [FromQuery] Guid admissionId)
    {
        if (admissionId == Guid.Empty)
            return BadRequest(Result.Failure("AdmissionId is required"));

        var today = DateTime.UtcNow.Date;
        var note = await _context.NursingNotes
            .FirstOrDefaultAsync(n => !n.IsDeleted && n.AdmissionId == admissionId
                && n.NoteDate >= today && n.NoteDate < today.AddDays(1)
                && n.IntakeOutput != null);

        if (note == null) return NotFound(Result.Failure("No intake/output records found"));

        var ioList = System.Text.Json.JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(note.IntakeOutput!) ?? new();
        var idStr = id.ToString();
        ioList.RemoveAll(e =>
            (e.TryGetProperty("Id", out var idProp) && (idProp.GetString() == idStr || idProp.GetGuid() == id)));
        note.IntakeOutput = System.Text.Json.JsonSerializer.Serialize(ioList);

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Intake/Output deleted"));
    }

    [HttpGet("intake-output/single/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetIntakeOutputById(Guid id, [FromQuery] Guid admissionId)
    {
        if (admissionId == Guid.Empty)
            return BadRequest(Result.Failure("AdmissionId is required"));

        var today = DateTime.UtcNow.Date;
        var note = await _context.NursingNotes
            .FirstOrDefaultAsync(n => !n.IsDeleted && n.AdmissionId == admissionId
                && n.NoteDate >= today && n.NoteDate < today.AddDays(1)
                && n.IntakeOutput != null);

        if (note == null) return NotFound(Result.Failure("No intake/output records found"));

        var ioList = System.Text.Json.JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(note.IntakeOutput!) ?? new();
        var entry = ioList.FirstOrDefault(e => e.TryGetProperty("Id", out var idProp) && idProp.GetString() == id.ToString());

        if (entry.ValueKind == System.Text.Json.JsonValueKind.Undefined)
            return NotFound(Result.Failure("Intake/Output record not found"));

        var record = new
        {
            Id = id,
            Type = entry.TryGetProperty("Type", out var t) ? t.GetString() : "",
            Description = entry.TryGetProperty("Description", out var d) ? d.GetString() : "",
            Amount = entry.TryGetProperty("Amount", out var a) ? a.GetInt32() : 0,
            Notes = entry.TryGetProperty("Notes", out var n) ? n.GetString() : "",
            RecordedAt = entry.TryGetProperty("RecordedAt", out var r) && DateTime.TryParse(r.GetString(), out var dt) ? dt : DateTime.MinValue
        };

        return Ok(Result<object>.Success(record));
    }

    // ──────────── Request DTOs ────────────

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

    public class AddIntakeOutputRequest
    {
        public Guid PatientId { get; set; }
        public Guid AdmissionId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Amount { get; set; }
        public string? Notes { get; set; }
    }
}
