using System.Text.Json;
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
                Priority = o.Priority.ToString(),
                o.ClinicalIndication,
                o.OrderItems,
                o.Results,
                o.CompletedAt
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new { items = orders, totalCount, pageNumber, pageSize }));
    }

    [HttpPost("orders")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyCreate)]
    public async Task<IActionResult> CreateOrder([FromBody] CreateRadiologyOrderRequest request)
    {
        if (request.PatientId == Guid.Empty)
            return BadRequest(Result.Failure("PatientId is required"));

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == request.PatientId && !p.IsDeleted);
        if (patient == null)
            return NotFound(Result.Failure("Patient not found"));

        var count = await _context.MedicalOrders.CountAsync(o => o.OrderType == MedicalOrderType.Radiology && o.OrderDate.Date == DateTime.UtcNow.Date);
        var orderNumber = $"RAD-{DateTime.UtcNow:yyyyMMdd}-{(count + 1):D4}";

        var orderItems = JsonSerializer.Serialize(new
        {
            request.Modality,
            request.BodyPart
        });

        int priorityValue = request.Priority?.ToLower() switch
        {
            "urgent" => 2,
            "emergent" => 3,
            _ => 1
        };

        var order = new Domain.Entities.Clinical.MedicalOrder
        {
            OrderNumber = orderNumber,
            PatientId = request.PatientId,
            OrderedById = request.DoctorId ?? request.OrderedById ?? Guid.Empty,
            VisitId = request.VisitId,
            AdmissionId = request.AdmissionId,
            OrderType = MedicalOrderType.Radiology,
            Status = MedicalOrderStatus.Ordered,
            OrderDate = DateTime.UtcNow,
            Priority = priorityValue,
            IsUrgent = request.IsUrgent || request.Priority?.ToLower() == "urgent" || request.Priority?.ToLower() == "emergent",
            OrderItems = request.OrderItems ?? orderItems,
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
        var raw = await _context.MedicalOrders
            .Where(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                o.PatientId,
                o.OrderedById,
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                o.ClinicalIndication,
                o.OrderItems,
                o.Results,
                o.ResultNotes,
                o.AbnormalFlags,
                o.CompletedAt
            })
            .FirstOrDefaultAsync();

        if (raw == null)
            return NotFound(Result.Failure("Report not found"));

        var (modality, bodyPart) = ExtractModalityBodyPart(raw.OrderItems);

        var report = new
        {
            raw.Id,
            raw.OrderNumber,
            raw.PatientName,
            raw.PatientId,
            raw.OrderedById,
            raw.OrderedBy,
            raw.OrderDate,
            raw.ClinicalIndication,
            Modality = modality,
            BodyPart = bodyPart,
            OrderItems = ParseOrderItems(raw.OrderItems),
            raw.Results,
            raw.ResultNotes,
            raw.AbnormalFlags,
            raw.CompletedAt
        };

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

    [HttpGet("pending")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyView)]
    public async Task<IActionResult> GetPendingOrders()
    {
        var orders = await _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Radiology &&
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
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                Status = o.Status.ToString(),
                o.IsUrgent,
                Priority = o.Priority.ToString(),
                o.OrderItems,
                o.ClinicalIndication
            })
            .ToListAsync();

        return Ok(Result<object>.Success(orders));
    }

    [HttpGet("orders/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyView)]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var raw = await _context.MedicalOrders
            .Where(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                o.PatientId,
                o.OrderedById,
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                Status = o.Status.ToString(),
                o.IsUrgent,
                Priority = o.Priority.ToString(),
                o.ClinicalIndication,
                o.SpecialInstructions,
                o.OrderItems,
                o.Results,
                o.ResultNotes,
                o.AbnormalFlags,
                o.CompletedAt
            })
            .FirstOrDefaultAsync();

        if (raw == null)
            return NotFound(Result.Failure("Order not found"));

        var (modality, bodyPart) = ExtractModalityBodyPart(raw.OrderItems);

        var order = new
        {
            raw.Id,
            raw.OrderNumber,
            raw.PatientName,
            raw.PatientId,
            raw.OrderedById,
            raw.OrderedBy,
            raw.OrderDate,
            raw.Status,
            raw.IsUrgent,
            raw.Priority,
            raw.ClinicalIndication,
            raw.SpecialInstructions,
            Modality = modality,
            BodyPart = bodyPart,
            OrderItems = ParseOrderItems(raw.OrderItems),
            raw.Results,
            raw.ResultNotes,
            raw.AbnormalFlags,
            raw.CompletedAt
        };

        return Ok(Result<object>.Success(order));
    }

    [HttpPut("orders/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyEdit)]
    public async Task<IActionResult> UpdateOrder(Guid id, [FromBody] UpdateRadiologyOrderRequest request)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);
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
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyReport)]
    public async Task<IActionResult> CompleteOrder(Guid id, [FromBody] CompleteRadiologyOrderRequest request)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        order.Status = MedicalOrderStatus.Completed;
        order.Results = request.Results;
        order.ResultNotes = request.ResultNotes;
        order.AbnormalFlags = request.AbnormalFindings.HasValue
            ? (request.AbnormalFindings.Value ? "Abnormal" : "Normal")
            : request.AbnormalFlags;
        order.CompletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Report completed"));
    }

    [HttpGet("orders/{id:guid}/print")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyView)]
    public async Task<IActionResult> GetOrderForPrint(Guid id)
    {
        var raw = await _context.MedicalOrders
            .Where(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                PatientAge = o.Patient != null ? o.Patient.DateOfBirth : (DateTime?)null,
                PatientGender = o.Patient != null ? o.Patient.Gender : null,
                Mrn = o.Patient != null ? o.Patient.MRN : null,
                o.PatientId,
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                DoctorSpecialization = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.Specialization).FirstOrDefault(),
                o.OrderDate,
                o.ClinicalIndication,
                o.SpecialInstructions,
                o.OrderItems,
                o.Results,
                o.ResultNotes,
                o.AbnormalFlags,
                o.CompletedAt
            })
            .FirstOrDefaultAsync();

        if (raw == null)
            return NotFound(Result.Failure("Report not found"));

        var (modality, bodyPart) = ExtractModalityBodyPart(raw.OrderItems);

        var report = new
        {
            raw.Id,
            raw.OrderNumber,
            raw.PatientName,
            raw.PatientAge,
            raw.PatientGender,
            raw.Mrn,
            raw.PatientId,
            raw.OrderedBy,
            raw.DoctorSpecialization,
            raw.OrderDate,
            raw.ClinicalIndication,
            raw.SpecialInstructions,
            Modality = modality,
            BodyPart = bodyPart,
            raw.Results,
            raw.ResultNotes,
            raw.AbnormalFlags,
            raw.CompletedAt
        };

        return Ok(Result<object>.Success(report));
    }

    [HttpDelete("orders/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyDelete)]
    public async Task<IActionResult> DeleteOrder(Guid id)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        order.IsDeleted = true;
        await _context.SaveChangesAsync();
        return Ok(Result.Success("Radiology order deleted successfully"));
    }

    private static object? ParseOrderItems(string? orderItemsJson)
    {
        if (string.IsNullOrWhiteSpace(orderItemsJson))
            return null;

        try
        {
            using var doc = JsonDocument.Parse(orderItemsJson);
            return doc.RootElement.Clone();
        }
        catch
        {
            return orderItemsJson;
        }
    }

    private static (string? modality, string? bodyPart) ExtractModalityBodyPart(string? orderItemsJson)
    {
        if (string.IsNullOrWhiteSpace(orderItemsJson))
            return (null, null);

        try
        {
            using var doc = JsonDocument.Parse(orderItemsJson);
            var root = doc.RootElement;
            string? modality = null;
            string? bodyPart = null;
            if (root.TryGetProperty("Modality", out var m)) modality = m.GetString();
            if (root.TryGetProperty("BodyPart", out var b)) bodyPart = b.GetString();
            return (modality, bodyPart);
        }
        catch
        {
            return (null, null);
        }
    }

    public class CreateRadiologyOrderRequest
    {
        public Guid PatientId { get; set; }
        public Guid? DoctorId { get; set; }
        public Guid? OrderedById { get; set; }
        public Guid? VisitId { get; set; }
        public Guid? AdmissionId { get; set; }
        public string? Modality { get; set; }
        public string? BodyPart { get; set; }
        public string? Priority { get; set; }
        public bool IsUrgent { get; set; }
        public string? OrderItems { get; set; }
        public string? ClinicalIndication { get; set; }
        public string? SpecialInstructions { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateRadiologyOrderRequest
    {
        public string? Status { get; set; }
        public string? ClinicalIndication { get; set; }
        public string? SpecialInstructions { get; set; }
        public string? Notes { get; set; }
    }

    public class CompleteRadiologyOrderRequest
    {
        public string? Results { get; set; }
        public string? ResultNotes { get; set; }
        public bool? AbnormalFindings { get; set; }
        public string? AbnormalFlags { get; set; }
    }
}
