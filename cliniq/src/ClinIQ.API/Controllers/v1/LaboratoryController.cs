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
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                Status = o.Status.ToString(),
                o.IsUrgent,
                Priority = o.IsUrgent ? "Urgent" : "Routine",
                o.ClinicalIndication,
                Tests = ParseOrderItems(o.OrderItems),
                TestCount = ParseOrderItems(o.OrderItems).Count,
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
            OrderedById = request.DoctorId ?? request.OrderedById ?? Guid.Empty,
            VisitId = request.VisitId,
            AdmissionId = request.AdmissionId,
            OrderType = MedicalOrderType.Lab,
            Status = MedicalOrderStatus.Ordered,
            OrderDate = DateTime.UtcNow,
            Priority = request.Priority,
            IsUrgent = request.IsUrgent,
            OrderItems = request.Tests != null
                ? JsonSerializer.Serialize(request.Tests)
                : request.OrderItems,
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
                Mrn = o.Patient != null ? o.Patient.MRN : null,
                o.PatientId,
                o.OrderedById,
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                Status = o.Status.ToString(),
                o.IsUrgent,
                Priority = o.IsUrgent ? "Urgent" : "Routine",
                o.ClinicalIndication,
                o.SpecialInstructions,
                Tests = ParseOrderItems(o.OrderItems),
                Results = ParseResults(o.Results),
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
        if (request.Comments != null) order.ResultNotes = request.Comments;
        if (request.Tests != null) order.Results = JsonSerializer.Serialize(request.Tests);

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
        order.Results = request.Tests != null
            ? JsonSerializer.Serialize(request.Tests)
            : request.Results;
        order.ResultNotes = request.Comments ?? request.ResultNotes;
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
                Results = ParseResults(o.Results),
                o.ResultNotes,
                o.AbnormalFlags,
                Tests = ParseOrderItems(o.OrderItems)
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
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                Status = o.Status.ToString(),
                o.IsUrgent,
                Priority = o.IsUrgent ? "Urgent" : "Routine",
                Tests = ParseOrderItems(o.OrderItems),
                TestCount = ParseOrderItems(o.OrderItems).Count,
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

    private static List<string> ParseOrderItems(string? orderItemsJson)
    {
        if (string.IsNullOrWhiteSpace(orderItemsJson))
            return new List<string>();

        try
        {
            return JsonSerializer.Deserialize<List<string>>(orderItemsJson) ?? new List<string>();
        }
        catch
        {
            return new List<string> { orderItemsJson };
        }
    }

    private static object? ParseResults(string? resultsJson)
    {
        if (string.IsNullOrWhiteSpace(resultsJson))
            return null;

        try
        {
            return JsonSerializer.Deserialize<object>(resultsJson);
        }
        catch
        {
            return resultsJson;
        }
    }

    public class CreateLabOrderRequest
    {
        public Guid PatientId { get; set; }
        public Guid? DoctorId { get; set; }
        public Guid? OrderedById { get; set; }
        public Guid? VisitId { get; set; }
        public Guid? AdmissionId { get; set; }
        public int? Priority { get; set; }
        public bool IsUrgent { get; set; }
        public string? OrderItems { get; set; }
        public List<object>? Tests { get; set; }
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
        public string? Comments { get; set; }
        public List<object>? Tests { get; set; }
    }

    [HttpGet("test-catalog")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryView)]
    public IActionResult GetTestCatalog()
    {
        var catalog = new[]
        {
            new { name = "Complete Blood Count (CBC)", code = "CBC", price = 500m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "WBC", unit = "x10³/µL", normalRange = "4.0-11.0" },
                    new { name = "RBC", unit = "x10⁶/µL", normalRange = "4.5-5.5" },
                    new { name = "Hemoglobin", unit = "g/dL", normalRange = "12.0-16.0" },
                    new { name = "Hematocrit", unit = "%", normalRange = "36.0-46.0" },
                    new { name = "MCV", unit = "fL", normalRange = "80.0-100.0" },
                    new { name = "MCH", unit = "pg", normalRange = "27.0-31.0" },
                    new { name = "MCHC", unit = "g/dL", normalRange = "32.0-36.0" },
                    new { name = "Platelet Count", unit = "x10³/µL", normalRange = "150.0-400.0" },
                    new { name = "RDW", unit = "%", normalRange = "11.5-14.5" },
                    new { name = "Neutrophils", unit = "%", normalRange = "40.0-70.0" },
                    new { name = "Lymphocytes", unit = "%", normalRange = "20.0-40.0" },
                    new { name = "Monocytes", unit = "%", normalRange = "2.0-8.0" },
                    new { name = "Eosinophils", unit = "%", normalRange = "1.0-4.0" },
                    new { name = "Basophils", unit = "%", normalRange = "0.0-1.0" }
                }
            },
            new { name = "Lipid Panel", code = "LIPID", price = 800m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "Total Cholesterol", unit = "mg/dL", normalRange = "<200" },
                    new { name = "Triglycerides", unit = "mg/dL", normalRange = "<150" },
                    new { name = "HDL Cholesterol", unit = "mg/dL", normalRange = ">40" },
                    new { name = "LDL Cholesterol", unit = "mg/dL", normalRange = "<100" },
                    new { name = "VLDL", unit = "mg/dL", normalRange = "5-40" }
                }
            },
            new { name = "Blood Sugar (Fasting)", code = "BSF", price = 200m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "Fasting Blood Sugar", unit = "mg/dL", normalRange = "70-100" }
                }
            },
            new { name = "Blood Sugar (Random)", code = "BSR", price = 200m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "Random Blood Sugar", unit = "mg/dL", normalRange = "70-140" }
                }
            },
            new { name = "HbA1c (Glycated Hemoglobin)", code = "HBA1C", price = 1200m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "HbA1c", unit = "%", normalRange = "4.0-5.6" }
                }
            },
            new { name = "Liver Function Test (LFT)", code = "LFT", price = 1500m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "SGOT (AST)", unit = "U/L", normalRange = "5-40" },
                    new { name = "SGPT (ALT)", unit = "U/L", normalRange = "7-56" },
                    new { name = "Alkaline Phosphatase", unit = "U/L", normalRange = "44-147" },
                    new { name = "Total Bilirubin", unit = "mg/dL", normalRange = "0.1-1.2" },
                    new { name = "Direct Bilirubin", unit = "mg/dL", normalRange = "0.0-0.3" },
                    new { name = "Total Protein", unit = "g/dL", normalRange = "6.0-8.3" },
                    new { name = "Albumin", unit = "g/dL", normalRange = "3.5-5.0" }
                }
            },
            new { name = "Kidney Function Test (KFT)", code = "KFT", price = 1200m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "Urea", unit = "mg/dL", normalRange = "7-20" },
                    new { name = "Creatinine", unit = "mg/dL", normalRange = "0.6-1.2" },
                    new { name = "Uric Acid", unit = "mg/dL", normalRange = "2.5-7.0" },
                    new { name = "BUN", unit = "mg/dL", normalRange = "7-20" }
                }
            },
            new { name = "Urinalysis (Routine)", code = "URA", price = 300m, sampleType = "Urine",
                parameters = new[] {
                    new { name = "Color", unit = "", normalRange = "Yellow" },
                    new { name = "Appearance", unit = "", normalRange = "Clear" },
                    new { name = "Specific Gravity", unit = "", normalRange = "1.005-1.030" },
                    new { name = "pH", unit = "", normalRange = "4.5-8.0" },
                    new { name = "Glucose", unit = "", normalRange = "Negative" },
                    new { name = "Protein", unit = "", normalRange = "Negative" },
                    new { name = "Ketones", unit = "", normalRange = "Negative" },
                    new { name = "Blood", unit = "", normalRange = "Negative" },
                    new { name = "WBC", unit = "/HPF", normalRange = "0-5" },
                    new { name = "RBC", unit = "/HPF", normalRange = "0-2" }
                }
            },
            new { name = "Thyroid Function Test (TFT)", code = "TFT", price = 2000m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "TSH", unit = "µIU/mL", normalRange = "0.4-4.0" },
                    new { name = "Free T4", unit = "ng/dL", normalRange = "0.8-1.8" },
                    new { name = "Free T3", unit = "pg/mL", normalRange = "2.3-4.2" }
                }
            },
            new { name = "Coagulation Profile", code = "COAG", price = 1000m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "PT", unit = "seconds", normalRange = "11-13.5" },
                    new { name = "INR", unit = "", normalRange = "0.8-1.2" },
                    new { name = "aPTT", unit = "seconds", normalRange = "25-35" },
                    new { name = "Fibrinogen", unit = "mg/dL", normalRange = "200-400" }
                }
            },
            new { name = "Iron Studies", code = "IRON", price = 1500m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "Serum Iron", unit = "µg/dL", normalRange = "60-170" },
                    new { name = "Ferritin", unit = "ng/mL", normalRange = "12-150" },
                    new { name = "TIBC", unit = "µg/dL", normalRange = "250-370" },
                    new { name = "Transferrin Saturation", unit = "%", normalRange = "20-50" }
                }
            },
            new { name = "ESR", code = "ESR", price = 200m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "ESR", unit = "mm/hr", normalRange = "0-20" }
                }
            },
            new { name = "CRP (C-Reactive Protein)", code = "CRP", price = 600m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "CRP", unit = "mg/L", normalRange = "<10" }
                }
            },
            new { name = "Vitamin D", code = "VITD", price = 2500m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "25-OH Vitamin D", unit = "ng/mL", normalRange = "30-100" }
                }
            },
            new { name = "Vitamin B12", code = "B12", price = 1500m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "Vitamin B12", unit = "pg/mL", normalRange = "200-900" }
                }
            },
            new { name = "Hepatitis B Profile", code = "HEPB", price = 2000m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "HBsAg", unit = "", normalRange = "Non-Reactive" },
                    new { name = "Anti-HBs", unit = "mIU/mL", normalRange = "<10" },
                    new { name = "HBeAg", unit = "", normalRange = "Non-Reactive" },
                    new { name = "Anti-HBe", unit = "", normalRange = "Non-Reactive" },
                    new { name = "Anti-HBc IgM", unit = "", normalRange = "Non-Reactive" }
                }
            },
            new { name = "HIV Screening", code = "HIV", price = 500m, sampleType = "Blood",
                parameters = new[] {
                    new { name = "HIV 1/2 Ag/Ab", unit = "", normalRange = "Non-Reactive" }
                }
            },
            new { name = "Stool Routine", code = "STOOL", price = 300m, sampleType = "Stool",
                parameters = new[] {
                    new { name = "Color", unit = "", normalRange = "Brown" },
                    new { name = "Consistency", unit = "", normalRange = "Soft" },
                    new { name = "Occult Blood", unit = "", normalRange = "Negative" },
                    new { name = "Ova & Parasites", unit = "", normalRange = "Not Seen" },
                    new { name = "WBC", unit = "/HPF", normalRange = "0-5" }
                }
            }
        };

        return Ok(Result<object>.Success(catalog));
    }

    [HttpGet("orders/{id:guid}/print")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryView)]
    public async Task<IActionResult> GetOrderForPrint(Guid id)
    {
        var order = await _context.MedicalOrders
            .Where(o => o.Id == id && o.OrderType == MedicalOrderType.Lab && !o.IsDeleted)
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
                Status = o.Status.ToString(),
                o.ClinicalIndication,
                o.SpecialInstructions,
                Tests = ParseOrderItems(o.OrderItems),
                Results = ParseResults(o.Results),
                o.ResultNotes,
                o.AbnormalFlags,
                o.CompletedAt,
                o.Notes
            })
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        return Ok(Result<object>.Success(order));
    }

    public class CompleteLabOrderRequest
    {
        public string? Results { get; set; }
        public List<object>? Tests { get; set; }
        public string? Comments { get; set; }
        public string? ResultNotes { get; set; }
        public string? AbnormalFlags { get; set; }
    }
}
