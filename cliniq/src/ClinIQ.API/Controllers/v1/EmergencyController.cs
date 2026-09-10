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
public class EmergencyController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EmergencyController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetEmergencyVisits(
        [FromQuery] string? status = null,
        [FromQuery] string? triageLevel = null)
    {
        var query = _context.EmergencyVisits
            .Where(ev => !ev.IsDeleted);

        if (!string.IsNullOrWhiteSpace(status))
        {
            if (status.ToLower() == "active")
                query = query.Where(ev => ev.IsActive);
            else if (status.ToLower() == "completed")
                query = query.Where(ev => !ev.IsActive);
        }

        if (!string.IsNullOrWhiteSpace(triageLevel) && Enum.TryParse<TriageLevel>(triageLevel, true, out var tl))
            query = query.Where(ev => ev.TriageLevel == tl);

        var visits = await query
            .OrderByDescending(ev => ev.ArrivalTime)
            .Take(100)
            .Select(ev => new
            {
                ev.Id,
                ev.EmergencyNumber,
                PatientName = ev.Patient != null ? ev.Patient.FirstName + " " + ev.Patient.LastName : null,
                ev.PatientId,
                ev.DoctorId,
                ev.ArrivalTime,
                ev.ArrivalMode,
                ev.ChiefComplaint,
                TriageLevel = ev.TriageLevel.ToString(),
                ev.TriageTime,
                ev.Disposition,
                ev.DispositionTime,
                ev.DischargeTime,
                ev.IsActive,
                ev.PresentingSymptoms,
                ev.InitialAssessment,
                ev.TreatmentNotes
            })
            .ToListAsync();

        return Ok(Result<object>.Success(visits));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsCreate)]
    public async Task<IActionResult> CreateEmergencyVisit([FromBody] CreateEmergencyVisitRequest request)
    {
        if (request.PatientId == Guid.Empty)
            return BadRequest(Result.Failure("PatientId is required"));

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == request.PatientId && !p.IsDeleted);
        if (patient == null)
            return NotFound(Result.Failure("Patient not found"));

        // Generate emergency number
        var today = DateTime.UtcNow.Date;
        var count = await _context.EmergencyVisits.CountAsync(ev => ev.ArrivalTime >= today);
        var emergencyNumber = $"ER-{DateTime.UtcNow:yyyyMMdd}-{(count + 1):D4}";

        var visit = new Domain.Entities.Clinical.EmergencyVisit
        {
            EmergencyNumber = emergencyNumber,
            PatientId = request.PatientId,
            DoctorId = request.DoctorId,
            ArrivalTime = DateTime.UtcNow,
            ArrivalMode = request.ArrivalMode,
            ChiefComplaint = request.ChiefComplaint,
            TriageLevel = Enum.TryParse<TriageLevel>(request.TriageLevel, true, out var tl) ? tl : null,
            TriageTime = request.TriageLevel != null ? DateTime.UtcNow : null,
            PresentingSymptoms = request.PresentingSymptoms,
            IsActive = true
        };

        _context.EmergencyVisits.Add(visit);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new
        {
            visit.Id,
            visit.EmergencyNumber
        }, "Emergency visit created successfully"));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetEmergencyVisit(Guid id)
    {
        var visit = await _context.EmergencyVisits
            .Where(ev => ev.Id == id && !ev.IsDeleted)
            .Select(ev => new
            {
                ev.Id,
                ev.EmergencyNumber,
                PatientName = ev.Patient != null ? ev.Patient.FirstName + " " + ev.Patient.LastName : null,
                ev.PatientId,
                ev.DoctorId,
                ev.ArrivalTime,
                ev.ArrivalMode,
                ev.ChiefComplaint,
                TriageLevel = ev.TriageLevel.ToString(),
                ev.TriageTime,
                ev.TriageNotes,
                ev.PresentingSymptoms,
                ev.InitialAssessment,
                ev.TreatmentNotes,
                ev.Procedures,
                ev.Disposition,
                ev.DispositionTime,
                ev.DischargeTime,
                ev.IsActive,
                ev.AdmissionId
            })
            .FirstOrDefaultAsync();

        if (visit == null)
            return NotFound(Result.Failure("Emergency visit not found"));

        return Ok(Result<object>.Success(visit));
    }

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.UtcNow.Date;
        var activeCases = await _context.EmergencyVisits.CountAsync(ev => ev.IsActive && !ev.IsDeleted);
        var todayVisits = await _context.EmergencyVisits.CountAsync(ev => ev.ArrivalTime >= today && !ev.IsDeleted);
        var waitingPatients = await _context.EmergencyVisits.CountAsync(ev => ev.IsActive && ev.TriageLevel == null && !ev.IsDeleted);
        var criticalCases = await _context.EmergencyVisits.CountAsync(ev =>
            ev.IsActive && (ev.TriageLevel == TriageLevel.Resuscitation || ev.TriageLevel == TriageLevel.Emergency) && !ev.IsDeleted);

        return Ok(Result<object>.Success(new
        {
            activeCases,
            todayVisits,
            waitingPatients,
            criticalCases
        }));
    }

    [HttpGet("active")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetActiveCases()
    {
        var cases = await _context.EmergencyVisits
            .Where(ev => ev.IsActive && !ev.IsDeleted)
            .OrderByDescending(ev => ev.TriageLevel)
            .ThenBy(ev => ev.ArrivalTime)
            .Select(ev => new
            {
                ev.Id,
                ev.EmergencyNumber,
                PatientName = ev.Patient != null ? ev.Patient.FirstName + " " + ev.Patient.LastName : null,
                ev.PatientId,
                ev.ArrivalTime,
                ev.ChiefComplaint,
                TriageLevel = ev.TriageLevel.ToString(),
                ev.InitialAssessment,
                ElapsedMinutes = (int)(DateTime.UtcNow - ev.ArrivalTime).TotalMinutes
            })
            .ToListAsync();

        return Ok(Result<object>.Success(cases));
    }

    [HttpGet("triage")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetTriageList()
    {
        var list = await _context.EmergencyVisits
            .Where(ev => ev.IsActive && ev.TriageLevel == null && !ev.IsDeleted)
            .OrderBy(ev => ev.ArrivalTime)
            .Select(ev => new
            {
                ev.Id,
                ev.EmergencyNumber,
                PatientName = ev.Patient != null ? ev.Patient.FirstName + " " + ev.Patient.LastName : null,
                ev.PatientId,
                ev.ArrivalTime,
                ev.ChiefComplaint,
                ev.ArrivalMode,
                WaitMinutes = (int)(DateTime.UtcNow - ev.ArrivalTime).TotalMinutes
            })
            .ToListAsync();

        return Ok(Result<object>.Success(list));
    }

    public class CreateEmergencyVisitRequest
    {
        public Guid PatientId { get; set; }
        public Guid? DoctorId { get; set; }
        public string? ArrivalMode { get; set; }
        public string? ChiefComplaint { get; set; }
        public string? TriageLevel { get; set; }
        public string? PresentingSymptoms { get; set; }
    }
}
