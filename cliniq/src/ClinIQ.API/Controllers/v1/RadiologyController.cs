using System.Text.Json;
using ClinIQ.Domain.Entities.Billing;
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

    [HttpGet("services")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyView)]
    public async Task<IActionResult> GetRadiologyServices()
    {
        var services = await _context.Services
            .Where(s => s.Type == ServiceType.Radiology && s.IsActive && !s.IsDeleted)
            .OrderBy(s => s.DisplayOrder)
            .ThenBy(s => s.Name)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Code,
                s.Price,
                s.Description,
                s.DepartmentId,
                s.DurationMinutes
            })
            .ToListAsync();

        return Ok(Result<object>.Success(services));
    }

    #region Orders

    [HttpGet("orders")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyOrdersView)]
    public async Task<IActionResult> GetOrders(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? status = null,
        [FromQuery] DateTime? dateFrom = null,
        [FromQuery] DateTime? dateTo = null)
    {
        var query = _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(o =>
                o.OrderNumber.ToLower().Contains(term) ||
                (o.Patient != null && (o.Patient.FirstName + " " + o.Patient.LastName).ToLower().Contains(term)) ||
                (o.Patient != null && o.Patient.MRN != null && o.Patient.MRN.ToLower().Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<MedicalOrderStatus>(status, true, out var s))
            query = query.Where(o => o.Status == s);

        if (dateFrom.HasValue)
            query = query.Where(o => o.OrderDate >= dateFrom.Value);
        if (dateTo.HasValue)
            query = query.Where(o => o.OrderDate <= dateTo.Value.AddDays(1));

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
                Mrn = o.Patient != null ? o.Patient.MRN : null,
                o.PatientId,
                o.OrderedById,
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                Status = o.Status.ToString(),
                o.IsUrgent,
                Priority = o.IsUrgent ? "Urgent" : "Routine",
                o.ClinicalIndication,
                ItemCount = _context.RadiologyOrderItems.Count(i => i.MedicalOrderId == o.Id),
                Items = _context.RadiologyOrderItems
                    .Where(i => i.MedicalOrderId == o.Id)
                    .Select(i => new { i.ServiceName, i.Modality, i.BodyPart, Status = i.Status.ToString() })
                    .ToList(),
                o.IsBilled,
                o.InvoiceId,
                o.CompletedAt
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new { items = orders, totalCount, pageNumber, pageSize }));
    }

    [HttpPost("orders")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyOrdersCreate)]
    public async Task<IActionResult> CreateOrder([FromBody] CreateRadiologyOrderRequest request)
    {
        if (request.PatientId == Guid.Empty)
            return BadRequest(Result.Failure("PatientId is required"));

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == request.PatientId && !p.IsDeleted);
        if (patient == null)
            return NotFound(Result.Failure("Patient not found"));

        var orderedById = request.DoctorId ?? request.OrderedById;
        if (!orderedById.HasValue || orderedById.Value == Guid.Empty)
            return BadRequest(Result.Failure("Ordering doctor is required"));

        var count = await _context.MedicalOrders.CountAsync(o => o.OrderType == MedicalOrderType.Radiology && o.OrderDate.Date == DateTime.UtcNow.Date);
        var orderNumber = $"RAD-{DateTime.UtcNow:yyyyMMdd}-{(count + 1):D4}";

        var order = new Domain.Entities.Clinical.MedicalOrder
        {
            OrderNumber = orderNumber,
            PatientId = request.PatientId,
            OrderedById = orderedById.Value,
            VisitId = request.VisitId,
            AdmissionId = request.AdmissionId,
            OrderType = MedicalOrderType.Radiology,
            Status = MedicalOrderStatus.Ordered,
            OrderDate = DateTime.UtcNow,
            IsUrgent = request.Priority?.ToLower() == "urgent" || request.Priority?.ToLower() == "stat",
            ClinicalIndication = request.ClinicalIndication,
            SpecialInstructions = request.SpecialInstructions,
            Notes = request.Notes
        };

        _context.MedicalOrders.Add(order);
        await _context.SaveChangesAsync();

        // Create order items from service selections
        if (request.Items != null && request.Items.Count > 0)
        {
            foreach (var item in request.Items)
            {
                var service = await _context.Services.FirstOrDefaultAsync(s => s.Id == item.ServiceId && s.Type == ServiceType.Radiology && s.IsActive && !s.IsDeleted);
                if (service == null) continue;

                var radItem = new Domain.Entities.Clinical.RadiologyOrderItem
                {
                    MedicalOrderId = order.Id,
                    ServiceId = service.Id,
                    ServiceName = service.Name,
                    ServiceCode = service.Code,
                    UnitPrice = service.Price,
                    Quantity = 1,
                    Discount = item.Discount,
                    NetAmount = service.Price - item.Discount,
                    Modality = item.Modality,
                    BodyPart = item.BodyPart,
                    Status = RadiologyOrderItemStatus.Ordered,
                    Notes = item.Notes
                };

                _context.RadiologyOrderItems.Add(radItem);
            }
        }

        await _context.SaveChangesAsync();

        // Auto-create invoice
        var radItems = await _context.RadiologyOrderItems.Where(i => i.MedicalOrderId == order.Id).ToListAsync();
        if (radItems.Count > 0)
        {
            var totalAmount = radItems.Sum(i => i.NetAmount);
            var invoiceCount = await _context.Invoices.CountAsync() + 1;
            var invoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{invoiceCount:D5}";

            var invoice = new Invoice
            {
                InvoiceNumber = invoiceNumber,
                PatientId = request.PatientId,
                InvoiceDate = DateTime.UtcNow,
                Status = InvoiceStatus.Draft,
                SubTotal = totalAmount,
                TotalAmount = totalAmount,
                OutstandingAmount = totalAmount,
                Notes = $"Radiology Order #{orderNumber}"
            };

            var displayOrder = 0;
            foreach (var item in radItems)
            {
                invoice.Items.Add(new InvoiceItem
                {
                    InvoiceId = invoice.Id,
                    ServiceId = item.ServiceId,
                    ItemType = "Service",
                    ItemName = item.ServiceName,
                    ItemCode = item.ServiceCode,
                    Description = $"Radiology - {item.ServiceName}" + (item.Modality != null ? $" ({item.Modality})" : ""),
                    Quantity = 1,
                    UnitPrice = item.UnitPrice,
                    Amount = item.NetAmount,
                    TotalAmount = item.NetAmount,
                    ReferenceId = order.Id,
                    ReferenceType = "RadiologyOrder",
                    DisplayOrder = displayOrder++
                });
            }

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            // Create payment record
            var paymentCount = await _context.Payments.CountAsync() + 1;
            var paymentNumber = $"PAY-{DateTime.UtcNow:yyyyMMdd}-{paymentCount:D5}";

            var payment = new Payment
            {
                PaymentNumber = paymentNumber,
                InvoiceId = invoice.Id,
                PatientId = request.PatientId,
                PaymentDate = DateTime.UtcNow,
                Amount = totalAmount,
                PaymentMethod = PaymentMethod.Cash,
                Status = PaymentStatus.Completed,
                Notes = $"Radiology Order #{orderNumber} payment"
            };
            _context.Payments.Add(payment);

            // Mark invoice as paid
            invoice.PaidAmount = totalAmount;
            invoice.OutstandingAmount = 0;
            invoice.Status = InvoiceStatus.Paid;

            // Link order to invoice
            order.IsBilled = true;
            order.InvoiceId = invoice.Id;
            await _context.SaveChangesAsync();
        }

        return Ok(Result<object>.Success(new
        {
            order.Id,
            order.OrderNumber
        }, "Radiology order created successfully"));
    }

    [HttpGet("orders/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyOrdersView)]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var order = await _context.MedicalOrders
            .Where(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                Mrn = o.Patient != null ? o.Patient.MRN : null,
                PatientAge = o.Patient != null ? o.Patient.DateOfBirth : (DateTime?)null,
                PatientGender = o.Patient != null ? o.Patient.Gender : null,
                o.PatientId,
                o.OrderedById,
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                Status = o.Status.ToString(),
                o.IsUrgent,
                Priority = o.IsUrgent ? "Urgent" : "Routine",
                o.ClinicalIndication,
                o.SpecialInstructions,
                o.Notes,
                o.CompletedAt,
                Items = _context.RadiologyOrderItems
                    .Where(i => i.MedicalOrderId == o.Id)
                    .Select(i => new
                    {
                        i.Id,
                        i.ServiceId,
                        i.ServiceName,
                        i.ServiceCode,
                        i.UnitPrice,
                        i.NetAmount,
                        i.Modality,
                        i.BodyPart,
                        Status = i.Status.ToString(),
                        i.ScheduledAt,
                        i.PatientArrivedAt,
                        i.ProcedureStartedAt,
                        i.ProcedureEndedAt,
                        PerformedBy = _context.Users.Where(u => u.Id == i.PerformedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                        i.Technique,
                        i.Findings,
                        i.Impression,
                        i.Recommendations,
                        i.IsAbnormal,
                        i.VerifiedAt,
                        VerifiedBy = _context.Users.Where(u => u.Id == i.VerifiedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                        ReportedBy = _context.Users.Where(u => u.Id == i.ReportedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                        i.ReportedAt,
                        i.Notes
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        return Ok(Result<object>.Success(order));
    }

    [HttpPut("orders/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyOrdersEdit)]
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

    [HttpDelete("orders/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyOrdersDelete)]
    public async Task<IActionResult> DeleteOrder(Guid id)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        order.IsDeleted = true;
        await _context.SaveChangesAsync();
        return Ok(Result.Success("Radiology order deleted successfully"));
    }

    #endregion

    #region Scheduling

    [HttpGet("schedule")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologySchedule)]
    public async Task<IActionResult> GetSchedule([FromQuery] DateTime? date = null)
    {
        var targetDate = date ?? DateTime.UtcNow.Date;
        var nextDate = targetDate.AddDays(1);

        var orders = await _context.RadiologyOrderItems
            .Where(i => i.MedicalOrder.OrderType == MedicalOrderType.Radiology &&
                !i.MedicalOrder.IsDeleted &&
                (i.Status == RadiologyOrderItemStatus.Scheduled || i.Status == RadiologyOrderItemStatus.PatientArrived || i.Status == RadiologyOrderItemStatus.ProcedureInProgress))
            .Where(i => i.ScheduledAt >= targetDate && i.ScheduledAt < nextDate)
            .OrderBy(i => i.ScheduledAt)
            .Select(i => new
            {
                OrderId = i.MedicalOrderId,
                OrderNumber = i.MedicalOrder.OrderNumber,
                PatientName = i.MedicalOrder.Patient != null ? i.MedicalOrder.Patient.FirstName + " " + i.MedicalOrder.Patient.LastName : null,
                Mrn = i.MedicalOrder.Patient != null ? i.MedicalOrder.Patient.MRN : null,
                i.ServiceName,
                i.Modality,
                i.BodyPart,
                i.ScheduledAt,
                Status = i.Status.ToString(),
                i.IsAbnormal
            })
            .ToListAsync();

        return Ok(Result<object>.Success(orders));
    }

    [HttpPost("orders/{id:guid}/schedule")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologySchedule)]
    public async Task<IActionResult> ScheduleOrder(Guid id, [FromBody] ScheduleRadiologyRequest request)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        // Update all order items
        var items = await _context.RadiologyOrderItems.Where(i => i.MedicalOrderId == id).ToListAsync();
        foreach (var item in items)
        {
            item.ScheduledAt = request.ScheduledAt;
            if (item.Status == RadiologyOrderItemStatus.Ordered)
                item.Status = RadiologyOrderItemStatus.Scheduled;
        }

        if (order.Status == MedicalOrderStatus.Ordered)
            order.Status = MedicalOrderStatus.Scheduled;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Order scheduled"));
    }

    [HttpPost("orders/{id:guid}/patient-arrived")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyProcedure)]
    public async Task<IActionResult> PatientArrived(Guid id)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        var items = await _context.RadiologyOrderItems.Where(i => i.MedicalOrderId == id).ToListAsync();
        foreach (var item in items)
        {
            item.PatientArrivedAt = DateTime.UtcNow;
            if (item.Status == RadiologyOrderItemStatus.Scheduled)
                item.Status = RadiologyOrderItemStatus.PatientArrived;
        }

        if (order.Status == MedicalOrderStatus.Scheduled)
            order.Status = MedicalOrderStatus.PatientArrived;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Patient arrived"));
    }

    [HttpPost("orders/{id:guid}/start-procedure")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyProcedure)]
    public async Task<IActionResult> StartProcedure(Guid id, [FromBody] StartProcedureRequest request)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        var items = await _context.RadiologyOrderItems.Where(i => i.MedicalOrderId == id).ToListAsync();
        foreach (var item in items)
        {
            item.ProcedureStartedAt = DateTime.UtcNow;
            item.PerformedById = request.PerformedById;
            if (item.Status == RadiologyOrderItemStatus.PatientArrived || item.Status == RadiologyOrderItemStatus.Scheduled)
                item.Status = RadiologyOrderItemStatus.ProcedureInProgress;
        }

        order.Status = MedicalOrderStatus.ProcedureInProgress;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Procedure started"));
    }

    [HttpPost("orders/{id:guid}/complete-imaging")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyProcedure)]
    public async Task<IActionResult> CompleteImaging(Guid id)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        var items = await _context.RadiologyOrderItems.Where(i => i.MedicalOrderId == id).ToListAsync();
        foreach (var item in items)
        {
            item.ProcedureEndedAt = DateTime.UtcNow;
            if (item.Status == RadiologyOrderItemStatus.ProcedureInProgress)
                item.Status = RadiologyOrderItemStatus.ImagingCompleted;
        }

        order.Status = MedicalOrderStatus.ImagingCompleted;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Imaging completed"));
    }

    [HttpPost("orders/{id:guid}/cancel")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyOrdersEdit)]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        order.Status = MedicalOrderStatus.Cancelled;

        var items = await _context.RadiologyOrderItems.Where(i => i.MedicalOrderId == id).ToListAsync();
        foreach (var item in items)
        {
            if (item.Status != RadiologyOrderItemStatus.Verified && item.Status != RadiologyOrderItemStatus.Completed)
                item.Status = RadiologyOrderItemStatus.Cancelled;
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Order cancelled"));
    }

    [HttpPost("orders/{id:guid}/no-show")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyProcedure)]
    public async Task<IActionResult> NoShow(Guid id)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        order.Status = MedicalOrderStatus.NoShow;

        var items = await _context.RadiologyOrderItems.Where(i => i.MedicalOrderId == id).ToListAsync();
        foreach (var item in items)
        {
            if (item.Status == RadiologyOrderItemStatus.Scheduled || item.Status == RadiologyOrderItemStatus.Ordered)
                item.Status = RadiologyOrderItemStatus.NoShow;
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Patient marked as no-show"));
    }

    #endregion

    #region Reporting

    [HttpGet("reporting")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyReport)]
    public async Task<IActionResult> GetReportingOrders()
    {
        var orders = await _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Radiology &&
                (o.Status == MedicalOrderStatus.ImagingCompleted || o.Status == MedicalOrderStatus.ReportPending || o.Status == MedicalOrderStatus.ReportDrafted) &&
                !o.IsDeleted)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                Mrn = o.Patient != null ? o.Patient.MRN : null,
                o.PatientId,
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                Status = o.Status.ToString(),
                o.IsUrgent,
                Priority = o.IsUrgent ? "Urgent" : "Routine",
                o.ClinicalIndication,
                Items = _context.RadiologyOrderItems
                    .Where(i => i.MedicalOrderId == o.Id)
                    .Select(i => new
                    {
                        i.Id,
                        i.ServiceName,
                        i.Modality,
                        i.BodyPart,
                        Status = i.Status.ToString()
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(orders));
    }

    [HttpPost("orders/{id:guid}/save-report")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyReport)]
    public async Task<IActionResult> SaveReport(Guid id, [FromBody] SaveRadiologyReportRequest request)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        if (request.Items == null || request.Items.Count == 0)
            return BadRequest(Result.Failure("No report items provided"));

        foreach (var itemReport in request.Items)
        {
            var item = await _context.RadiologyOrderItems.FirstOrDefaultAsync(i => i.Id == itemReport.OrderItemId && i.MedicalOrderId == id);
            if (item == null) continue;

            item.Technique = itemReport.Technique;
            item.Findings = itemReport.Findings;
            item.Impression = itemReport.Impression;
            item.Recommendations = itemReport.Recommendations;
            item.IsAbnormal = itemReport.IsAbnormal;
            item.ReportedAt = DateTime.UtcNow;
            item.ReportedById = request.ReportedById;

            if (request.SaveAsDraft)
            {
                item.Status = RadiologyOrderItemStatus.ReportDrafted;
            }
            else
            {
                item.Status = RadiologyOrderItemStatus.ReportPending;
            }
        }

        // Update order status
        if (request.SaveAsDraft)
            order.Status = MedicalOrderStatus.ReportDrafted;
        else
            order.Status = MedicalOrderStatus.ReportPending;

        await _context.SaveChangesAsync();
        return Ok(Result.Success(request.SaveAsDraft ? "Report saved as draft" : "Report submitted for verification"));
    }

    #endregion

    #region Verification

    [HttpGet("verification")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyVerify)]
    public async Task<IActionResult> GetVerificationOrders()
    {
        var orders = await _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Radiology &&
                (o.Status == MedicalOrderStatus.ReportPending || o.Status == MedicalOrderStatus.ReportDrafted) &&
                !o.IsDeleted)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                Mrn = o.Patient != null ? o.Patient.MRN : null,
                o.PatientId,
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                Status = o.Status.ToString(),
                o.IsUrgent,
                Priority = o.IsUrgent ? "Urgent" : "Routine",
                ReportedBy = _context.RadiologyOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && i.ReportedById != null)
                    .Select(i => _context.Users.Where(u => u.Id == i.ReportedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault())
                    .FirstOrDefault(),
                Items = _context.RadiologyOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && (i.Status == RadiologyOrderItemStatus.ReportDrafted || i.Status == RadiologyOrderItemStatus.ReportPending))
                    .Select(i => new
                    {
                        i.Id,
                        i.ServiceName,
                        i.Modality,
                        i.BodyPart,
                        Status = i.Status.ToString()
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(orders));
    }

    [HttpPost("orders/{id:guid}/verify")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyVerify)]
    public async Task<IActionResult> VerifyOrder(Guid id, [FromBody] VerifyRadiologyOrderRequest request)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        if (request.Verified)
        {
            var items = await _context.RadiologyOrderItems.Where(i => i.MedicalOrderId == id &&
                (i.Status == RadiologyOrderItemStatus.ReportDrafted || i.Status == RadiologyOrderItemStatus.ReportPending)).ToListAsync();
            foreach (var item in items)
            {
                item.Status = RadiologyOrderItemStatus.Verified;
                item.VerifiedAt = DateTime.UtcNow;
                item.VerifiedById = request.VerifiedById;
            }

            order.Status = MedicalOrderStatus.Verified;
            order.CompletedAt = DateTime.UtcNow;
        }
        else
        {
            // Return for correction
            var items = await _context.RadiologyOrderItems.Where(i => i.MedicalOrderId == id &&
                (i.Status == RadiologyOrderItemStatus.ReportDrafted || i.Status == RadiologyOrderItemStatus.ReportPending)).ToListAsync();
            foreach (var item in items)
            {
                item.Status = RadiologyOrderItemStatus.ImagingCompleted;
                item.ReportedAt = null;
                item.ReportedById = null;
            }

            order.Status = MedicalOrderStatus.ImagingCompleted;
            if (!string.IsNullOrEmpty(request.ReturnReason))
            {
                order.Notes = (order.Notes ?? "") + $"\n[Returned] {request.ReturnReason}";
            }
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success(request.Verified ? "Report verified" : "Report returned for correction"));
    }

    #endregion

    #region Reports

    [HttpGet("reports")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyReports)]
    public async Task<IActionResult> GetReports(
        [FromQuery] Guid? patientId = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null)
    {
        var query = _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Radiology &&
                (o.Status == MedicalOrderStatus.Verified || o.Status == MedicalOrderStatus.Completed) &&
                !o.IsDeleted);

        if (patientId.HasValue)
            query = query.Where(o => o.PatientId == patientId.Value);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(o =>
                o.OrderNumber.ToLower().Contains(term) ||
                (o.Patient != null && (o.Patient.FirstName + " " + o.Patient.LastName).ToLower().Contains(term)));
        }

        var totalCount = await query.CountAsync();
        var reports = await query
            .OrderByDescending(o => o.CompletedAt ?? o.OrderDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                Mrn = o.Patient != null ? o.Patient.MRN : null,
                o.PatientId,
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                o.CompletedAt,
                Status = o.Status.ToString(),
                Items = _context.RadiologyOrderItems
                    .Where(i => i.MedicalOrderId == o.Id)
                    .Select(i => new
                    {
                        i.ServiceName,
                        i.Modality,
                        i.BodyPart,
                        i.Impression,
                        i.IsAbnormal
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new { items = reports, totalCount, pageNumber, pageSize }));
    }

    [HttpGet("reports/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyReports)]
    public async Task<IActionResult> GetReport(Guid id)
    {
        return await GetOrder(id);
    }

    #endregion

    #region Stats

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyView)]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.UtcNow.Date;
        var todaysOrders = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Radiology && o.OrderDate.Date == today && !o.IsDeleted);
        var pendingSchedule = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Radiology &&
            o.Status == MedicalOrderStatus.Ordered && !o.IsDeleted);
        var scheduledToday = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Radiology &&
            (o.Status == MedicalOrderStatus.Scheduled || o.Status == MedicalOrderStatus.PatientArrived || o.Status == MedicalOrderStatus.ProcedureInProgress) &&
            !o.IsDeleted);
        var completedToday = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Radiology &&
            (o.Status == MedicalOrderStatus.Verified || o.Status == MedicalOrderStatus.Completed) &&
            o.CompletedAt >= today && !o.IsDeleted);
        var pendingReports = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Radiology &&
            (o.Status == MedicalOrderStatus.ImagingCompleted || o.Status == MedicalOrderStatus.ReportPending) &&
            !o.IsDeleted);
        var totalReports = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Radiology &&
            (o.Status == MedicalOrderStatus.Verified || o.Status == MedicalOrderStatus.Completed) &&
            !o.IsDeleted);

        return Ok(Result<object>.Success(new
        {
            todaysOrders,
            pendingSchedule,
            scheduledToday,
            completedToday,
            pendingReports,
            totalReports
        }));
    }

    [HttpGet("pending")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyView)]
    public async Task<IActionResult> GetPendingOrders()
    {
        var orders = await _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Radiology &&
                (o.Status == MedicalOrderStatus.Ordered || o.Status == MedicalOrderStatus.Scheduled || o.Status == MedicalOrderStatus.InProgress) &&
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
                o.ClinicalIndication,
                Items = _context.RadiologyOrderItems
                    .Where(i => i.MedicalOrderId == o.Id)
                    .Select(i => new { i.ServiceName, i.Modality, i.BodyPart })
                    .ToList()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(orders));
    }

    #endregion

    #region Print

    [HttpGet("orders/{id:guid}/print")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyPrint)]
    public async Task<IActionResult> GetOrderForPrint(Guid id)
    {
        var order = await _context.MedicalOrders
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
                Status = o.Status.ToString(),
                o.ClinicalIndication,
                o.SpecialInstructions,
                o.Notes,
                Items = _context.RadiologyOrderItems
                    .Where(i => i.MedicalOrderId == o.Id)
                    .Select(i => new
                    {
                        i.ServiceName,
                        i.ServiceCode,
                        i.Modality,
                        i.BodyPart,
                        i.UnitPrice,
                        i.NetAmount,
                        Status = i.Status.ToString(),
                        i.Technique,
                        i.Findings,
                        i.Impression,
                        i.Recommendations,
                        i.IsAbnormal
                    })
                    .ToList(),
                o.CompletedAt,
                VerifiedBy = _context.RadiologyOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && i.VerifiedById != null)
                    .Select(i => _context.Users.Where(u => u.Id == i.VerifiedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault())
                    .FirstOrDefault(),
                VerifiedAt = _context.RadiologyOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && i.VerifiedAt != null)
                    .Max(i => i.VerifiedAt),
                ReportedBy = _context.RadiologyOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && i.ReportedById != null)
                    .Select(i => _context.Users.Where(u => u.Id == i.ReportedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault())
                    .FirstOrDefault()
            })
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        return Ok(Result<object>.Success(order));
    }

    [HttpGet("orders/{id:guid}/receipt")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RadiologyPrint)]
    public async Task<IActionResult> GetOrderReceipt(Guid id)
    {
        var order = await _context.MedicalOrders
            .Where(o => o.Id == id && o.OrderType == MedicalOrderType.Radiology && !o.IsDeleted)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                Mrn = o.Patient != null ? o.Patient.MRN : null,
                o.PatientId,
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                Priority = o.IsUrgent ? "Urgent" : "Routine",
                o.ClinicalIndication,
                o.SpecialInstructions,
                Items = _context.RadiologyOrderItems
                    .Where(i => i.MedicalOrderId == o.Id)
                    .Select(i => new
                    {
                        i.ServiceName,
                        i.ServiceCode,
                        i.UnitPrice,
                        i.NetAmount
                    })
                    .ToList(),
                TotalAmount = _context.RadiologyOrderItems.Where(i => i.MedicalOrderId == o.Id).Sum(i => i.NetAmount)
            })
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        return Ok(Result<object>.Success(order));
    }

    #endregion

    public class CreateRadiologyOrderRequest
    {
        public Guid PatientId { get; set; }
        public Guid? DoctorId { get; set; }
        public Guid? OrderedById { get; set; }
        public Guid? VisitId { get; set; }
        public Guid? AdmissionId { get; set; }
        public string? Priority { get; set; }
        public string? ClinicalIndication { get; set; }
        public string? SpecialInstructions { get; set; }
        public string? Notes { get; set; }
        public List<RadiologyOrderItemRequest>? Items { get; set; }
    }

    public class RadiologyOrderItemRequest
    {
        public Guid ServiceId { get; set; }
        public string? Modality { get; set; }
        public string? BodyPart { get; set; }
        public decimal Discount { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateRadiologyOrderRequest
    {
        public string? Status { get; set; }
        public string? ClinicalIndication { get; set; }
        public string? SpecialInstructions { get; set; }
        public string? Notes { get; set; }
    }

    public class ScheduleRadiologyRequest
    {
        public DateTime ScheduledAt { get; set; }
    }

    public class StartProcedureRequest
    {
        public Guid? PerformedById { get; set; }
    }

    public class SaveRadiologyReportRequest
    {
        public Guid? ReportedById { get; set; }
        public bool SaveAsDraft { get; set; }
        public List<RadiologyReportItemRequest>? Items { get; set; }
    }

    public class RadiologyReportItemRequest
    {
        public Guid OrderItemId { get; set; }
        public string? Technique { get; set; }
        public string? Findings { get; set; }
        public string? Impression { get; set; }
        public string? Recommendations { get; set; }
        public bool IsAbnormal { get; set; }
    }

    public class VerifyRadiologyOrderRequest
    {
        public bool Verified { get; set; }
        public Guid? VerifiedById { get; set; }
        public string? ReturnReason { get; set; }
    }
}
