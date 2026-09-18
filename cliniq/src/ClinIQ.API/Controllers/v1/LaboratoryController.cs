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
public class LaboratoryController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LaboratoryController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("orders")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryView)]
    public async Task<IActionResult> GetOrders(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? status = null)
    {
        var query = _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Lab && !o.IsDeleted);

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
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryCreate)]
    public async Task<IActionResult> CreateOrder([FromBody] CreateLabOrderRequest request)
    {
        if (request.PatientId == Guid.Empty)
            return BadRequest(Result.Failure("PatientId is required"));

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == request.PatientId && !p.IsDeleted);
        if (patient == null)
            return NotFound(Result.Failure("Patient not found"));

        var count = await _context.MedicalOrders.CountAsync(o => o.OrderType == MedicalOrderType.Lab && o.OrderDate.Date == DateTime.UtcNow.Date);
        var orderNumber = $"LAB-{DateTime.UtcNow:yyyyMMdd}-{(count + 1):D4}";

        var order = new Domain.Entities.Clinical.MedicalOrder
        {
            OrderNumber = orderNumber,
            PatientId = request.PatientId,
            OrderedById = request.OrderedById ?? Guid.Empty,
            VisitId = request.VisitId,
            AdmissionId = request.AdmissionId,
            OrderType = MedicalOrderType.Lab,
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
        }, "Lab order created successfully"));
    }

    [HttpGet("orders/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryView)]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var order = await _context.MedicalOrders
            .Where(o => o.Id == id && o.OrderType == MedicalOrderType.Lab && !o.IsDeleted)
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
                o.SpecialInstructions,
                o.OrderItems,
                o.Results,
                o.ResultNotes,
                o.AbnormalFlags,
                o.Notes,
                o.CompletedAt,
                o.IsBilled
            })
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        return Ok(Result<object>.Success(order));
    }

    [HttpPut("orders/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryEdit)]
    public async Task<IActionResult> UpdateOrder(Guid id, [FromBody] UpdateLabOrderRequest request)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Lab && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        if (request.Status != null && Enum.TryParse<MedicalOrderStatus>(request.Status, true, out var status))
            order.Status = status;
        if (request.ClinicalIndication != null) order.ClinicalIndication = request.ClinicalIndication;
        if (request.SpecialInstructions != null) order.SpecialInstructions = request.SpecialInstructions;
        if (request.Notes != null) order.Notes = request.Notes;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Order updated"));
    }

    [HttpPost("orders/{id:guid}/complete")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryManageResults)]
    public async Task<IActionResult> CompleteOrder(Guid id, [FromBody] CompleteLabOrderRequest request)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Lab && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        order.Status = MedicalOrderStatus.Completed;
        order.Results = request.Results;
        order.ResultNotes = request.ResultNotes;
        order.AbnormalFlags = request.AbnormalFlags;
        order.CompletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Order completed"));
    }

    [HttpGet("results")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryView)]
    public async Task<IActionResult> GetResults([FromQuery] Guid? patientId = null)
    {
        var query = _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Lab && o.Status == MedicalOrderStatus.Completed && !o.IsDeleted);

        if (patientId.HasValue)
            query = query.Where(o => o.PatientId == patientId.Value);

        var results = await query
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
                o.AbnormalFlags,
                o.OrderItems
            })
            .ToListAsync();

        return Ok(Result<object>.Success(results));
    }

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryView)]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.UtcNow.Date;
        var pendingOrders = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Lab &&
            (o.Status == MedicalOrderStatus.Ordered || o.Status == MedicalOrderStatus.InProgress) &&
            !o.IsDeleted);
        var completedToday = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Lab &&
            o.Status == MedicalOrderStatus.Completed &&
            o.CompletedAt >= today && !o.IsDeleted);
        var totalResults = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Lab &&
            o.Status == MedicalOrderStatus.Completed &&
            !o.IsDeleted);

        return Ok(Result<object>.Success(new
        {
            pendingOrders,
            completedToday,
            totalResults
        }));
    }

    [HttpGet("pending")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryView)]
    public async Task<IActionResult> GetPendingOrders()
    {
        var orders = await _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Lab &&
                (o.Status == MedicalOrderStatus.Ordered || o.Status == MedicalOrderStatus.InProgress) &&
                !o.IsDeleted)
            .OrderByDescending(o => o.OrderDate)
            .Take(50)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                o.PatientId,
                o.OrderDate,
                Status = o.Status.ToString(),
                o.IsUrgent,
                o.Priority,
                o.OrderItems,
                o.ClinicalIndication
            })
            .ToListAsync();

        return Ok(Result<object>.Success(orders));
    }

    [HttpDelete("orders/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryDelete)]
    public async Task<IActionResult> DeleteOrder(Guid id)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Lab && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        order.IsDeleted = true;
        await _context.SaveChangesAsync();
        return Ok(Result.Success("Lab order deleted successfully"));
    }

    public class CreateLabOrderRequest
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

    public class UpdateLabOrderRequest
    {
        public string? Status { get; set; }
        public string? ClinicalIndication { get; set; }
        public string? SpecialInstructions { get; set; }
        public string? Notes { get; set; }
    }

    public class CompleteLabOrderRequest
    {
        public string? Results { get; set; }
        public string? ResultNotes { get; set; }
        public string? AbnormalFlags { get; set; }
    }
}
