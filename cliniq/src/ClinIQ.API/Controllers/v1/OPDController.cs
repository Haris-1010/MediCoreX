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
public class OPDController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OPDController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("queue")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> GetQueue([FromQuery] Guid? doctorId = null, [FromQuery] string? status = null)
    {
        var query = _context.Queues
            .Where(q => !q.IsDeleted);

        if (doctorId.HasValue)
            query = query.Where(q => q.DoctorId == doctorId.Value);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<QueueStatus>(status, true, out var queueStatus))
            query = query.Where(q => q.Status == queueStatus);

        var queue = await query
            .OrderBy(q => q.TokenNumber)
            .Select(q => new
            {
                q.Id,
                q.TokenNumber,
                PatientName = q.Patient != null ? q.Patient.FirstName + " " + q.Patient.LastName : null,
                PatientId = q.PatientId,
                DoctorId = q.DoctorId,
                q.DepartmentId,
                q.RoomId,
                Status = q.Status.ToString(),
                q.Priority,
                q.QueueDate,
                q.JoinedAt,
                q.CalledAt,
                q.StartedAt,
                q.CompletedAt,
                q.WaitTimeMinutes,
                q.Notes
            })
            .ToListAsync();

        return Ok(Result<object>.Success(queue));
    }

    [HttpPost("queue")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> AddToQueue([FromBody] AddToQueueRequest request)
    {
        if (request.PatientId == Guid.Empty)
            return BadRequest(Result.Failure("PatientId is required"));

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == request.PatientId && !p.IsDeleted);
        if (patient == null)
            return NotFound(Result.Failure("Patient not found"));

        // Generate next token number for today
        var today = DateTime.UtcNow.Date;
        var maxToken = await _context.Queues
            .Where(q => q.QueueDate >= today && q.QueueDate < today.AddDays(1))
            .MaxAsync(q => (int?)q.TokenNumber) ?? 0;

        var queue = new Domain.Entities.Clinical.Queue
        {
            PatientId = request.PatientId,
            DoctorId = request.DoctorId,
            DepartmentId = request.DepartmentId,
            RoomId = request.RoomId,
            QueueDate = DateTime.UtcNow,
            TokenNumber = maxToken + 1,
            Status = QueueStatus.Waiting,
            Priority = request.Priority,
            JoinedAt = DateTime.UtcNow,
            Notes = request.Notes
        };

        _context.Queues.Add(queue);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new
        {
            queue.Id,
            queue.TokenNumber
        }, "Added to queue successfully"));
    }

    [HttpPost("queue/{id:guid}/call")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> CallPatient(Guid id)
    {
        var queue = await _context.Queues.FirstOrDefaultAsync(q => q.Id == id && !q.IsDeleted);
        if (queue == null)
            return NotFound(Result.Failure("Queue entry not found"));

        queue.Status = QueueStatus.Called;
        queue.CalledAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Patient called"));
    }

    [HttpPost("queue/{id:guid}/complete")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> CompleteConsultation(Guid id)
    {
        var queue = await _context.Queues.FirstOrDefaultAsync(q => q.Id == id && !q.IsDeleted);
        if (queue == null)
            return NotFound(Result.Failure("Queue entry not found"));

        queue.Status = QueueStatus.Completed;
        queue.CompletedAt = DateTime.UtcNow;
        if (queue.JoinedAt.HasValue)
            queue.WaitTimeMinutes = (int)(queue.CompletedAt.Value - queue.JoinedAt.Value).TotalMinutes;

        await _context.SaveChangesAsync();

        return Ok(Result.Success("Consultation completed"));
    }

    [HttpPost("queue/{id:guid}/skip")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> SkipPatient(Guid id)
    {
        var queue = await _context.Queues.FirstOrDefaultAsync(q => q.Id == id && !q.IsDeleted);
        if (queue == null)
            return NotFound(Result.Failure("Queue entry not found"));

        queue.Status = QueueStatus.Skipped;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Patient skipped"));
    }

    [HttpDelete("queue/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> RemoveFromQueue(Guid id)
    {
        var queue = await _context.Queues.FirstOrDefaultAsync(q => q.Id == id && !q.IsDeleted);
        if (queue == null)
            return NotFound(Result.Failure("Queue entry not found"));

        _context.Queues.Remove(queue);
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Removed from queue"));
    }

    [HttpGet("consultation/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> GetConsultation(Guid id)
    {
        var visit = await _context.Visits
            .Where(v => v.Id == id && !v.IsDeleted)
            .Select(v => new
            {
                v.Id,
                v.VisitNumber,
                PatientName = v.Patient != null ? v.Patient.FirstName + " " + v.Patient.LastName : null,
                v.PatientId,
                v.DoctorId,
                v.VisitDate,
                v.ChiefComplaint,
                v.HistoryOfPresentIllness,
                v.PhysicalExamination,
                v.Assessment,
                v.Plan,
                v.ClinicalNotes,
                v.Diagnoses,
                v.IsCompleted,
                Status = v.IsCompleted ? "Completed" : "InConsultation"
            })
            .FirstOrDefaultAsync();

        if (visit == null)
            return NotFound(Result.Failure("Consultation not found"));

        return Ok(Result<object>.Success(visit));
    }

    [HttpPost("consultation/{id:guid}/complete")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> CompleteConsultation(Guid id, [FromBody] CompleteConsultationRequest request)
    {
        var visit = await _context.Visits.FirstOrDefaultAsync(v => v.Id == id && !v.IsDeleted);
        if (visit == null)
            return NotFound(Result.Failure("Consultation not found"));

        visit.ChiefComplaint = request.ChiefComplaint ?? visit.ChiefComplaint;
        visit.Assessment = request.Assessment ?? visit.Assessment;
        visit.Plan = request.Plan ?? visit.Plan;
        visit.ClinicalNotes = request.ClinicalNotes ?? visit.ClinicalNotes;
        visit.Diagnoses = request.Diagnoses ?? visit.Diagnoses;
        visit.IsCompleted = true;
        visit.CompletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(Result.Success("Consultation completed"));
    }

    public class AddToQueueRequest
    {
        public Guid PatientId { get; set; }
        public Guid? DoctorId { get; set; }
        public Guid? DepartmentId { get; set; }
        public Guid? RoomId { get; set; }
        public int? Priority { get; set; }
        public string? Notes { get; set; }
    }

    public class CompleteConsultationRequest
    {
        public string? ChiefComplaint { get; set; }
        public string? Assessment { get; set; }
        public string? Plan { get; set; }
        public string? ClinicalNotes { get; set; }
        public string? Diagnoses { get; set; }
    }
}
