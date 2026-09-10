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
public class RadiologyController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RadiologyController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("orders")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyView)]
    public async Task<IActionResult> GetOrders(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? status = null)
    {
        var query = _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(o =>
                o.OrderNumber.ToLower().Contains(term) ||
                (o.Patient != null && (o.Patient.FirstName + " " + o.Patient.LastName).ToLower().Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<MedicalOrderStatus>(status, true, out var s))
            query = query.Where(o => o.Status == s);

        var totalCount = await query.CountAsync();
        var orders = await query
            .OrderByDescending(o => o.OrderDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                o.PatientId,
                o.OrderedById,
                o.OrderDate,
                Status = o.Status.ToString(),
                o.IsUrgent,
                o.Priority,
                o.ClinicalIndication,
                o.OrderItems,
                o.Results,
                o.CompletedAt
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new { items = orders, totalCount, pageNumber, pageSize }));
    }

    [HttpPost("orders")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyView)]
    public async Task<IActionResult> CreateOrder([FromBody] CreateRadiologyOrderRequest request)
    {
        if (request.PatientId == Guid.Empty)
            return BadRequest(Result.Failure("PatientId is required"));

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == request.PatientId && !p.IsDeleted);
        if (patient == null)
            return NotFound(Result.Failure("Patient not found"));

        var count = await _context.MedicalOrders.CountAsync(o => o.OrderType == MedicalOrderType.Radiology && o.OrderDate.Date == DateTime.UtcNow.Date);
        var orderNumber = $"RAD-{DateTime.UtcNow:yyyyMMdd}-{(count + 1):D4}";

        var order = new Domain.Entities.Clinical.MedicalOrder
        {
            OrderNumber = orderNumber,
            PatientId = request.PatientId,
            OrderedById = request.OrderedById ?? Guid.Empty,
            VisitId = request.VisitId,
            AdmissionId = request.AdmissionId,
            OrderType = MedicalOrderType.Radiology,
            Status = MedicalOrderStatus.Ordered,
            OrderDate = DateTime.UtcNow,
            Priority = request.Priority,
            IsUrgent = request.IsUrgent,
            OrderItems = request.OrderItems,
            ClinicalIndication = request.ClinicalIndication,
            SpecialInstructions = request.SpecialInstructions,
            Notes = request.Notes
        };

        _context.MedicalOrders.Add(order);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new
        {
            order.Id,
            order.OrderNumber
        }, "Radiology order created successfully"));
    }

    [HttpGet("reports")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyView)]
    public async Task<IActionResult> GetReports([FromQuery] Guid? patientId = null)
    {
        var query = _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Radiology && o.Status == MedicalOrderStatus.Completed && !o.IsDeleted);

        if (patientId.HasValue)
            query = query.Where(o => o.PatientId == patientId.Value);

        var reports = await query
            .OrderByDescending(o => o.CompletedAt)
            .Take(50)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                o.PatientId,
                o.OrderDate,
                o.CompletedAt,
                o.Results,
                o.ResultNotes,
                o.OrderItems,
                o.ClinicalIndication
            })
            .ToListAsync();

        return Ok(Result<object>.Success(reports));
    }

    [HttpGet("reports/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyView)]
    public async Task<IActionResult> GetReport(Guid id)
    {
        var report = await _context.MedicalOrders
            .Where(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                o.PatientId,
                o.OrderedById,
                o.OrderDate,
                o.ClinicalIndication,
                o.OrderItems,
                o.Results,
                o.ResultNotes,
                o.AbnormalFlags,
                o.CompletedAt
            })
            .FirstOrDefaultAsync();

        if (report == null)
            return NotFound(Result.Failure("Report not found"));

        return Ok(Result<object>.Success(report));
    }

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyView)]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.UtcNow.Date;
        var pendingOrders = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Radiology &&
            (o.Status == MedicalOrderStatus.Ordered || o.Status == MedicalOrderStatus.InProgress) &&
            !o.IsDeleted);
        var completedToday = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Radiology &&
            o.Status == MedicalOrderStatus.Completed &&
            o.CompletedAt >= today && !o.IsDeleted);
        var totalReports = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Radiology &&
            o.Status == MedicalOrderStatus.Completed &&
            !o.IsDeleted);

        return Ok(Result<object>.Success(new
        {
            pendingOrders,
            completedToday,
            totalReports
        }));
    }

    public class CreateRadiologyOrderRequest
    {
        public Guid PatientId { get; set; }
        public Guid? OrderedById { get; set; }
        public Guid? VisitId { get; set; }
        public Guid? AdmissionId { get; set; }
        public int? Priority { get; set; }
        public bool IsUrgent { get; set; }
        public string? OrderItems { get; set; }
        public string? ClinicalIndication { get; set; }
        public string? SpecialInstructions { get; set; }
        public string? Notes { get; set; }
    }
}
