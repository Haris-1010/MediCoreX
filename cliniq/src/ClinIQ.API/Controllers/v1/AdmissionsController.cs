using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Entities.Facility;
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
        [FromQuery] string? status = null,
        [FromQuery] Guid? wardId = null,
        [FromQuery] string? searchTerm = null)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var query = _context.Admissions.IgnoreQueryFilters()
            .Where(a => !a.IsDeleted && (!tenantId.HasValue || a.TenantId == tenantId.Value));

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<AdmissionStatus>(status, true, out var statusEnum))
            query = query.Where(a => a.Status == statusEnum);

        if (wardId.HasValue)
            query = query.Where(a => a.CurrentWardId == wardId.Value);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(a =>
                a.Patient.FirstName.ToLower().Contains(term) ||
                a.Patient.LastName.ToLower().Contains(term) ||
                a.AdmissionNumber.ToLower().Contains(term));
        }

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
                MRN = a.Patient.MRN,
                DoctorName = _context.Users.Where(u => u.Id == a.AttendingDoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                DoctorId = a.AttendingDoctorId,
                a.AdmissionDate,
                a.DischargeDate,
                Type = a.AdmissionType.ToString(),
                Status = a.Status.ToString(),
                a.AdmissionReason,
                a.ProvisionalDiagnosis,
                WardName = _context.Wards.IgnoreQueryFilters().Where(w => w.Id == a.CurrentWardId).Select(w => w.Name).FirstOrDefault(),
                BedNumber = _context.Beds.IgnoreQueryFilters().Where(b => b.Id == a.CurrentBedId).Select(b => b.BedNumber).FirstOrDefault(),
                RoomNumber = _context.Rooms.IgnoreQueryFilters().Where(r => r.Id == a.CurrentRoomId).Select(r => r.RoomNumber).FirstOrDefault(),
                DaysAdmitted = a.DischargeDate.HasValue
                    ? (int)(a.DischargeDate.Value - a.AdmissionDate).TotalDays
                    : (int)(DateTime.UtcNow - a.AdmissionDate).TotalDays,
                a.Notes
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
        var admission = await _context.Admissions.IgnoreQueryFilters()
            .Where(a => a.Id == id && !a.IsDeleted)
            .Select(a => new
            {
                a.Id,
                a.AdmissionNumber,
                PatientName = a.Patient.FirstName + " " + a.Patient.LastName,
                PatientId = a.PatientId,
                MRN = a.Patient.MRN,
                DoctorName = _context.Users.Where(u => u.Id == a.AttendingDoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                DoctorId = a.AttendingDoctorId,
                a.AdmissionDate,
                a.DischargeDate,
                Type = a.AdmissionType.ToString(),
                Status = a.Status.ToString(),
                a.AdmissionReason,
                a.ProvisionalDiagnosis,
                a.FinalDiagnosis,
                a.DischargeSummary,
                a.DischargeInstructions,
                WardName = _context.Wards.IgnoreQueryFilters().Where(w => w.Id == a.CurrentWardId).Select(w => w.Name).FirstOrDefault(),
                WardId = a.CurrentWardId,
                BedNumber = _context.Beds.IgnoreQueryFilters().Where(b => b.Id == a.CurrentBedId).Select(b => b.BedNumber).FirstOrDefault(),
                BedId = a.CurrentBedId,
                RoomNumber = _context.Rooms.IgnoreQueryFilters().Where(r => r.Id == a.CurrentRoomId).Select(r => r.RoomNumber).FirstOrDefault(),
                RoomId = a.CurrentRoomId,
                DaysAdmitted = a.DischargeDate.HasValue
                    ? (int)(a.DischargeDate.Value - a.AdmissionDate).TotalDays
                    : (int)(DateTime.UtcNow - a.AdmissionDate).TotalDays,
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
        var currentUserId = Guid.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var uid) ? uid : Guid.Empty;

        var admissionNumber = $"ADM{(_context.Admissions.Count() + 1):D4}";

        var admission = new Admission
        {
            AdmissionNumber = admissionNumber,
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

        // Allocate bed if ward and bed are provided
        if (request.WardId.HasValue && request.BedId.HasValue)
        {
            var bed = await _context.Beds.FirstOrDefaultAsync(b => b.Id == request.BedId.Value && !b.IsDeleted);
            if (bed != null && bed.Status == BedStatus.Available)
            {
                var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == bed.RoomId && !r.IsDeleted);

                admission.CurrentWardId = request.WardId;
                admission.CurrentRoomId = room?.Id;
                admission.CurrentBedId = request.BedId;

                bed.Status = BedStatus.Occupied;
                bed.CurrentPatientId = request.PatientId;
                bed.CurrentAdmissionId = admission.Id;

                var allocation = new BedAllocation
                {
                    BedId = request.BedId.Value,
                    RoomId = room?.Id ?? bed.RoomId,
                    WardId = request.WardId.Value,
                    AdmissionId = admission.Id,
                    PatientId = request.PatientId,
                    AllocatedAt = DateTime.UtcNow,
                    AllocatedById = currentUserId,
                    Notes = $"Auto-allocated during admission {admissionNumber}"
                };
                _context.BedAllocations.Add(allocation);

                await _context.SaveChangesAsync();
            }
        }

        return Ok(Result<object>.Success(new { id = admission.Id, admissionNumber = admission.AdmissionNumber }));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> UpdateAdmission(Guid id, [FromBody] CreateAdmissionRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var admission = await _context.Admissions.IgnoreQueryFilters()
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted
                && (!tenantId.HasValue || a.TenantId == tenantId.Value));
        if (admission == null)
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

    [HttpDelete("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> DeleteAdmission(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var admission = await _context.Admissions.IgnoreQueryFilters()
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted
                && (!tenantId.HasValue || a.TenantId == tenantId.Value));
        if (admission == null)
            return NotFound(Result.Failure("Admission not found"));

        // Release bed if occupied
        if (admission.CurrentBedId.HasValue)
        {
            var bed = await _context.Beds.FirstOrDefaultAsync(b => b.Id == admission.CurrentBedId.Value && !b.IsDeleted);
            if (bed != null)
            {
                bed.Status = BedStatus.Available;
                bed.CurrentPatientId = null;
                bed.CurrentAdmissionId = null;
            }
        }

        admission.IsDeleted = true;
        await _context.SaveChangesAsync();
        return Ok(Result.Success("Admission deleted successfully"));
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
        admission.DischargeSummary = request?.Summary ?? request?.DischargeSummary;
        admission.FinalDiagnosis = request?.FinalDiagnosis;
        admission.DischargeInstructions = request?.Instructions ?? request?.FollowUpInstructions;
        admission.Notes = request?.DischargeMedications != null
            ? $"Discharge Medications: {request.DischargeMedications}"
            : admission.Notes;

        // Release the bed
        if (admission.CurrentBedId.HasValue)
        {
            var bed = await _context.Beds.FirstOrDefaultAsync(b => b.Id == admission.CurrentBedId.Value && !b.IsDeleted);
            if (bed != null)
            {
                bed.Status = BedStatus.Available;
                bed.CurrentPatientId = null;
                bed.CurrentAdmissionId = null;

                // Update the allocation record
                var allocation = await _context.BedAllocations
                    .FirstOrDefaultAsync(ba => ba.AdmissionId == id && ba.ReleasedAt == null);
                if (allocation != null)
                {
                    allocation.ReleasedAt = DateTime.UtcNow;
                    allocation.Notes = $"Released on discharge {DateTime.UtcNow:yyyy-MM-dd}";
                }
            }
        }

        await _context.SaveChangesAsync();
        return Ok(Result<object>.Success(new
        {
            id = admission.Id,
            admissionNumber = admission.AdmissionNumber,
            status = "Discharged"
        }, "Patient discharged successfully"));
    }

    [HttpPost("{id:guid}/transfer-bed")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsEdit)]
    public async Task<IActionResult> TransferBed(Guid id, [FromBody] TransferBedRequest request)
    {
        var admission = await _context.Admissions.FindAsync(id);
        if (admission == null || admission.IsDeleted)
            return NotFound(Result.Failure("Admission not found"));

        var currentUserId = Guid.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var uid) ? uid : Guid.Empty;

        // Release old bed
        if (admission.CurrentBedId.HasValue)
        {
            var oldBed = await _context.Beds.FirstOrDefaultAsync(b => b.Id == admission.CurrentBedId.Value && !b.IsDeleted);
            if (oldBed != null)
            {
                oldBed.Status = BedStatus.Available;
                oldBed.CurrentPatientId = null;
                oldBed.CurrentAdmissionId = null;

                var oldAllocation = await _context.BedAllocations
                    .FirstOrDefaultAsync(ba => ba.AdmissionId == id && ba.ReleasedAt == null);
                if (oldAllocation != null)
                {
                    oldAllocation.ReleasedAt = DateTime.UtcNow;
                    oldAllocation.ReleasedById = currentUserId;
                    oldAllocation.ReleaseReason = request.Reason ?? "Transfer";
                }
            }
        }

        // Allocate new bed
        var newBed = await _context.Beds.FirstOrDefaultAsync(b => b.Id == request.NewBedId && !b.IsDeleted);
        if (newBed != null && newBed.Status == BedStatus.Available)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == newBed.RoomId && !r.IsDeleted);

            newBed.Status = BedStatus.Occupied;
            newBed.CurrentPatientId = admission.PatientId;
            newBed.CurrentAdmissionId = admission.Id;

            admission.CurrentWardId = request.NewWardId;
            admission.CurrentRoomId = room?.Id;
            admission.CurrentBedId = request.NewBedId;

            var allocation = new BedAllocation
            {
                BedId = request.NewBedId,
                RoomId = room?.Id ?? newBed.RoomId,
                WardId = request.NewWardId ?? admission.CurrentWardId ?? Guid.Empty,
                AdmissionId = admission.Id,
                PatientId = admission.PatientId,
                AllocatedAt = DateTime.UtcNow,
                AllocatedById = currentUserId,
                Notes = $"Transferred from previous bed"
            };
            _context.BedAllocations.Add(allocation);
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Bed transferred successfully"));
    }

    [HttpGet("{id:guid}/allocation-history")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetAllocationHistory(Guid id)
    {
        var history = await _context.BedAllocations
            .Where(ba => ba.AdmissionId == id && !ba.IsDeleted)
            .OrderByDescending(ba => ba.AllocatedAt)
            .Select(ba => new
            {
                ba.Id,
                Bed = _context.Beds.IgnoreQueryFilters().Where(b => b.Id == ba.BedId).Select(b => b.BedNumber).FirstOrDefault(),
                Ward = _context.Wards.IgnoreQueryFilters().Where(w => w.Id == _context.Rooms.IgnoreQueryFilters().Where(r => r.Id == _context.Beds.IgnoreQueryFilters().Where(b => b.Id == ba.BedId).Select(b => b.RoomId).FirstOrDefault()).Select(r => r.WardId).FirstOrDefault()).Select(w => w.Name).FirstOrDefault(),
                ba.AllocatedAt,
                ba.ReleasedAt,
                Duration = ba.ReleasedAt.HasValue
                    ? $"{(ba.ReleasedAt.Value - ba.AllocatedAt).TotalDays:F0} days"
                    : $"{(DateTime.UtcNow - ba.AllocatedAt).TotalDays:F0} days (current)",
                ba.Notes
            })
            .ToListAsync();

        return Ok(Result<object>.Success(history));
    }
}

public record CreateAdmissionRequest(
    Guid PatientId,
    Guid DoctorId,
    string? AdmissionType,
    Guid? WardId,
    Guid? BedId,
    string? AdmissionReason,
    string? ProvisionalDiagnosis,
    string? Notes
);

public record DischargeRequest(
    string? Summary,
    string? DischargeSummary,
    string? FinalDiagnosis,
    string? Instructions,
    string? FollowUpInstructions,
    string? DischargeMedications,
    DateTime? FollowUpDate,
    string? DischargeType
);

public record TransferBedRequest(
    Guid NewBedId,
    Guid? NewWardId,
    string? Reason
);
