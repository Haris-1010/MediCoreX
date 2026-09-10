using ClinIQ.Domain.Entities.Clinical;
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
public class AdmissionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public AdmissionsController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetAdmissions(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null)
    {
        var query = _context.Admissions.Where(a => !a.IsDeleted);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<AdmissionStatus>(status, true, out var statusEnum))
            query = query.Where(a => a.Status == statusEnum);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(a => a.AdmissionDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new
            {
                a.Id,
                a.AdmissionNumber,
                PatientName = a.Patient.FirstName + " " + a.Patient.LastName,
                PatientId = a.PatientId,
                DoctorName = _context.Users.Where(u => u.Id == a.AttendingDoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                DoctorId = a.AttendingDoctorId,
                a.AdmissionDate,
                Type = a.AdmissionType.ToString(),
                Status = a.Status.ToString(),
                a.AdmissionReason,
                Ward = _context.Wards.Where(w => w.Id == a.CurrentWardId).Select(w => w.Name).FirstOrDefault(),
                Bed = _context.Beds.Where(b => b.Id == a.CurrentBedId).Select(b => b.BedNumber).FirstOrDefault()
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
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetAdmission(Guid id)
    {
        var admission = await _context.Admissions
            .Where(a => a.Id == id && !a.IsDeleted)
            .Select(a => new
            {
                a.Id,
                a.AdmissionNumber,
                PatientName = a.Patient.FirstName + " " + a.Patient.LastName,
                PatientId = a.PatientId,
                DoctorName = _context.Users.Where(u => u.Id == a.AttendingDoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                DoctorId = a.AttendingDoctorId,
                a.AdmissionDate,
                Type = a.AdmissionType.ToString(),
                Status = a.Status.ToString(),
                a.AdmissionReason,
                a.ProvisionalDiagnosis,
                Ward = _context.Wards.Where(w => w.Id == a.CurrentWardId).Select(w => w.Name).FirstOrDefault(),
                Bed = _context.Beds.Where(b => b.Id == a.CurrentBedId).Select(b => b.BedNumber).FirstOrDefault(),
                a.Notes
            })
            .FirstOrDefaultAsync();

        if (admission == null)
            return NotFound(Result.Failure("Admission not found"));

        return Ok(Result<object>.Success(admission));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsCreate)]
    public async Task<IActionResult> CreateAdmission([FromBody] CreateAdmissionRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));
        var branchId = _tenantService.GetCurrentBranchId();

        var admission = new Admission
        {
            AdmissionNumber = $"ADM{(_context.Admissions.Count() + 1):D4}",
            PatientId = request.PatientId,
            AttendingDoctorId = request.DoctorId,
            AdmissionDate = DateTime.UtcNow,
            AdmissionType = Enum.TryParse<AdmissionType>(request.AdmissionType, true, out var type) ? type : AdmissionType.Planned,
            Status = AdmissionStatus.Admitted,
            AdmissionReason = request.AdmissionReason,
            ProvisionalDiagnosis = request.ProvisionalDiagnosis,
            Notes = request.Notes,
            TenantId = tenantId,
            BranchId = branchId
        };

        _context.Admissions.Add(admission);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { id = admission.Id, admissionNumber = admission.AdmissionNumber }));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> UpdateAdmission(Guid id, [FromBody] CreateAdmissionRequest request)
    {
        var admission = await _context.Admissions.FindAsync(id);
        if (admission == null || admission.IsDeleted)
            return NotFound(Result.Failure("Admission not found"));

        admission.AttendingDoctorId = request.DoctorId;
        if (Enum.TryParse<AdmissionType>(request.AdmissionType, true, out var type))
            admission.AdmissionType = type;
        admission.AdmissionReason = request.AdmissionReason;
        admission.ProvisionalDiagnosis = request.ProvisionalDiagnosis;
        admission.Notes = request.Notes;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Admission updated successfully"));
    }

    [HttpPost("{id:guid}/discharge")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsDischarge)]
    public async Task<IActionResult> DischargePatient(Guid id, [FromBody] DischargeRequest? request = null)
    {
        var admission = await _context.Admissions.FindAsync(id);
        if (admission == null || admission.IsDeleted)
            return NotFound(Result.Failure("Admission not found"));

        admission.Status = AdmissionStatus.Discharged;
        admission.DischargeDate = DateTime.UtcNow;
        admission.DischargeSummary = request?.Summary;
        admission.FinalDiagnosis = request?.FinalDiagnosis;
        admission.DischargeInstructions = request?.Instructions;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Patient discharged successfully"));
    }
}

public record CreateAdmissionRequest(
    Guid PatientId,
    Guid DoctorId,
    string? AdmissionType,
    string? AdmissionReason,
    string? ProvisionalDiagnosis,
    string? Notes
);

public record DischargeRequest(
    string? Summary,
    string? FinalDiagnosis,
    string? Instructions
);
