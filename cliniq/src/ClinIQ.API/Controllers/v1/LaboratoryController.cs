using System.Text.Json;
using ClinIQ.API.Authorization;
using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Enums;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
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

    [HttpGet("services")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryView)]
    public async Task<IActionResult> GetLabServices()
    {
        var services = await _context.Services
            .Where(s => s.Type == ServiceType.Laboratory && s.IsActive && !s.IsDeleted)
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
                s.DurationMinutes,
                HasParameters = _context.LabTestParameters.Any(p => p.ServiceId == s.Id && p.IsActive)
            })
            .ToListAsync();

        return Ok(Result<object>.Success(services));
    }

    #region Test Parameters

    [HttpGet("services/{serviceId:guid}/parameters")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryView)]
    public async Task<IActionResult> GetTestParameters(Guid serviceId)
    {
        var parameters = await _context.LabTestParameters
            .Where(p => p.ServiceId == serviceId && p.IsActive)
            .OrderBy(p => p.DisplayOrder)
            .ThenBy(p => p.Name)
            .Select(p => new
            {
                p.Id,
                p.ServiceId,
                p.Name,
                p.Code,
                p.DisplayOrder,
                p.Unit,
                p.DataType,
                p.NormalRange,
                p.MinValue,
                p.MaxValue,
                p.MaleRange,
                p.FemaleRange,
                p.ChildRange,
                p.CriticalLow,
                p.CriticalHigh,
                p.Description,
                p.Options,
                p.IsActive
            })
            .ToListAsync();

        return Ok(Result<object>.Success(parameters));
    }

    [HttpPost("services/{serviceId:guid}/parameters")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryEdit)]
    public async Task<IActionResult> CreateTestParameter(Guid serviceId, [FromBody] CreateTestParameterRequest request)
    {
        var service = await _context.Services.FirstOrDefaultAsync(s => s.Id == serviceId && s.Type == ServiceType.Laboratory && !s.IsDeleted);
        if (service == null)
            return NotFound(Result.Failure("Laboratory service not found"));

        var maxOrder = await _context.LabTestParameters
            .Where(p => p.ServiceId == serviceId && p.IsActive)
            .MaxAsync(p => (int?)p.DisplayOrder) ?? 0;

        var parameter = new Domain.Entities.Clinical.LabTestParameter
        {
            ServiceId = serviceId,
            Name = request.Name,
            Code = request.Code,
            DisplayOrder = request.DisplayOrder > 0 ? request.DisplayOrder : maxOrder + 1,
            Unit = request.Unit,
            DataType = Enum.TryParse<TestParameterDataType>(request.DataType, true, out var dt) ? dt : TestParameterDataType.Numeric,
            NormalRange = request.NormalRange,
            MinValue = request.MinValue,
            MaxValue = request.MaxValue,
            MaleRange = request.MaleRange,
            FemaleRange = request.FemaleRange,
            ChildRange = request.ChildRange,
            CriticalLow = request.CriticalLow,
            CriticalHigh = request.CriticalHigh,
            Description = request.Description,
            Options = request.Options,
            IsActive = true
        };

        _context.LabTestParameters.Add(parameter);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { parameter.Id }, "Parameter created"));
    }

    [HttpPut("parameters/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryEdit)]
    public async Task<IActionResult> UpdateTestParameter(Guid id, [FromBody] CreateTestParameterRequest request)
    {
        var parameter = await _context.LabTestParameters.FirstOrDefaultAsync(p => p.Id == id);
        if (parameter == null)
            return NotFound(Result.Failure("Parameter not found"));

        parameter.Name = request.Name;
        parameter.Code = request.Code;
        parameter.DisplayOrder = request.DisplayOrder;
        parameter.Unit = request.Unit;
        parameter.DataType = Enum.TryParse<TestParameterDataType>(request.DataType, true, out var dt) ? dt : TestParameterDataType.Numeric;
        parameter.NormalRange = request.NormalRange;
        parameter.MinValue = request.MinValue;
        parameter.MaxValue = request.MaxValue;
        parameter.MaleRange = request.MaleRange;
        parameter.FemaleRange = request.FemaleRange;
        parameter.ChildRange = request.ChildRange;
        parameter.CriticalLow = request.CriticalLow;
        parameter.CriticalHigh = request.CriticalHigh;
        parameter.Description = request.Description;
        parameter.Options = request.Options;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Parameter updated"));
    }

    [HttpDelete("parameters/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryEdit)]
    public async Task<IActionResult> DeleteTestParameter(Guid id)
    {
        var parameter = await _context.LabTestParameters.FirstOrDefaultAsync(p => p.Id == id);
        if (parameter == null)
            return NotFound(Result.Failure("Parameter not found"));

        parameter.IsActive = false;
        await _context.SaveChangesAsync();
        return Ok(Result.Success("Parameter deactivated"));
    }

    #endregion Test Parameters

    #region Orders

    [HttpGet("orders")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryOrdersView)]
    public async Task<IActionResult> GetOrders(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? status = null,
        [FromQuery] string? priority = null,
        [FromQuery] DateTime? dateFrom = null,
        [FromQuery] DateTime? dateTo = null)
    {
        var query = _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Lab && !o.IsDeleted);

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
                TestCount = _context.LabOrderItems.Count(i => i.MedicalOrderId == o.Id),
                Items = _context.LabOrderItems.Where(i => i.MedicalOrderId == o.Id).Select(i => new { i.ServiceName, i.ServiceCode, i.UnitPrice, i.NetAmount }).ToList(),
                o.IsBilled,
                o.InvoiceId,
                o.CompletedAt
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new { items = orders, totalCount, pageNumber, pageSize }));
    }

    [HttpPost("orders")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryOrdersCreate)]
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
                var service = await _context.Services.FirstOrDefaultAsync(s => s.Id == item.ServiceId && s.Type == ServiceType.Laboratory && s.IsActive && !s.IsDeleted);
                if (service == null) continue;

                var labItem = new Domain.Entities.Clinical.LabOrderItem
                {
                    MedicalOrderId = order.Id,
                    ServiceId = service.Id,
                    ServiceName = service.Name,
                    ServiceCode = service.Code,
                    UnitPrice = service.Price,
                    Quantity = item.Quantity > 0 ? item.Quantity : 1,
                    Discount = item.Discount,
                    NetAmount = (service.Price * (item.Quantity > 0 ? item.Quantity : 1)) - item.Discount,
                    SampleType = item.SampleType,
                    Status = LabOrderItemStatus.SamplePending,
                    Notes = item.Notes
                };

                _context.LabOrderItems.Add(labItem);
            }
        }

        await _context.SaveChangesAsync();

        // Auto-create invoice
        var labItems = await _context.LabOrderItems.Where(i => i.MedicalOrderId == order.Id).ToListAsync();
        if (labItems.Count > 0)
        {
            var totalAmount = labItems.Sum(i => i.NetAmount);
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
                Notes = $"Lab Order #{orderNumber}"
            };

            var displayOrder = 0;
            foreach (var item in labItems)
            {
                invoice.Items.Add(new InvoiceItem
                {
                    InvoiceId = invoice.Id,
                    ServiceId = item.ServiceId,
                    ItemType = "Service",
                    ItemName = item.ServiceName,
                    ItemCode = item.ServiceCode,
                    Description = $"Lab Test - {item.ServiceName}",
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Amount = item.NetAmount,
                    TotalAmount = item.NetAmount,
                    ReferenceId = order.Id,
                    ReferenceType = "LabOrder",
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
                Notes = $"Lab Order #{orderNumber} payment"
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
        }, "Lab order created successfully"));
    }

    [HttpGet("orders/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryOrdersView)]
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
                PatientAge = o.Patient != null ? o.Patient.DateOfBirth : (DateTime?)null,
                PatientGender = o.Patient != null ? o.Patient.Gender : null,
                PatientPhone = o.Patient != null ? o.Patient.Phone : null,
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
                o.IsBilled,
                Items = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id)
                    .Select(i => new
                    {
                        i.Id,
                        i.ServiceId,
                        i.ServiceName,
                        i.ServiceCode,
                        i.UnitPrice,
                        i.Quantity,
                        i.Discount,
                        i.NetAmount,
                        i.SampleType,
                        Status = i.Status.ToString(),
                        i.SampleId,
                        i.Container,
                        i.SampleCollectedAt,
                        SampleCollectedBy = _context.Users.Where(u => u.Id == i.SampleCollectedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                        i.ResultEnteredAt,
                        ResultEnteredBy = _context.Users.Where(u => u.Id == i.ResultEnteredById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                        i.VerifiedAt,
                        VerifiedBy = _context.Users.Where(u => u.Id == i.VerifiedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                        i.Notes,
                        Parameters = _context.LabResultParameters
                            .Where(r => r.LabOrderItemId == i.Id)
                            .OrderBy(r => r.DisplayOrder)
                            .Select(r => new
                            {
                                r.Id,
                                r.ParameterId,
                                r.ParameterName,
                                r.ParameterCode,
                                r.ResultValue,
                                r.Unit,
                                r.NormalRange,
                                Flag = r.Flag.ToString(),
                                r.DataType,
                                r.IsAbnormal,
                                r.DisplayOrder,
                                Options = r.ParameterId != null
                                    ? _context.LabTestParameters.Where(p => p.Id == r.ParameterId).Select(p => p.Options).FirstOrDefault()
                                    : null
                            })
                            .ToList()
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        // Auto-populate LabResultParameters from LabTestParameters when empty,
        // and sync stale parameters when test parameter config has changed.
        var itemIds = order.Items.Select(i => i.Id).ToList();
        var existingParams = await _context.LabResultParameters
            .Where(r => itemIds.Contains(r.LabOrderItemId))
            .ToListAsync();
        var existingParamsByItem = existingParams.GroupBy(r => r.LabOrderItemId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var serviceIds = order.Items.Select(i => i.ServiceId).ToList();
        var testParams = await _context.LabTestParameters
            .Where(p => serviceIds.Contains(p.ServiceId) && p.IsActive && !p.IsDeleted)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();

        var paramsByService = testParams.GroupBy(p => p.ServiceId).ToDictionary(g => g.Key, g => g.ToList());

        bool hasChanges = false;
        foreach (var item in order.Items)
        {
            existingParamsByItem.TryGetValue(item.Id, out var existingParamsForItem);
            var existingParamList = existingParamsForItem ?? new List<Domain.Entities.Clinical.LabResultParameter>();

            if (!paramsByService.TryGetValue(item.ServiceId, out var templateParams))
                continue;

            // If no result parameters exist yet, create them from template
            if (existingParamList.Count == 0)
            {
                foreach (var tp in templateParams)
                {
                    _context.LabResultParameters.Add(new Domain.Entities.Clinical.LabResultParameter
                    {
                        LabOrderItemId = item.Id,
                        ParameterId = tp.Id,
                        ParameterName = tp.Name,
                        ParameterCode = tp.Code,
                        Unit = tp.Unit,
                        DataType = tp.DataType,
                        NormalRange = tp.NormalRange,
                        DisplayOrder = tp.DisplayOrder
                    });
                }
                hasChanges = true;
            }
            else
            {
                // Sync: update DataType, Unit, NormalRange from current test parameter config
                // for parameters that have no result value entered yet
                foreach (var ep in existingParamList)
                {
                    if (ep.ParameterId == null) continue;
                    var tp = templateParams.FirstOrDefault(t => t.Id == ep.ParameterId.Value);
                    if (tp == null) continue;

                    bool changed = false;
                    if (ep.DataType != tp.DataType) { ep.DataType = tp.DataType; changed = true; }
                    if (ep.Unit != tp.Unit) { ep.Unit = tp.Unit; changed = true; }
                    if (ep.NormalRange != tp.NormalRange) { ep.NormalRange = tp.NormalRange; changed = true; }
                    if (ep.ParameterName != tp.Name) { ep.ParameterName = tp.Name; changed = true; }
                    if (ep.ParameterCode != tp.Code) { ep.ParameterCode = tp.Code; changed = true; }
                    if (ep.DisplayOrder != tp.DisplayOrder) { ep.DisplayOrder = tp.DisplayOrder; changed = true; }
                    if (changed) hasChanges = true;
                }

                // Check for new parameters added to test config that don't exist in result yet
                var existingParamIds = existingParamList.Where(p => p.ParameterId.HasValue).Select(p => p.ParameterId!.Value).ToHashSet();
                foreach (var tp in templateParams)
                {
                    if (!existingParamIds.Contains(tp.Id))
                    {
                        _context.LabResultParameters.Add(new Domain.Entities.Clinical.LabResultParameter
                        {
                            LabOrderItemId = item.Id,
                            ParameterId = tp.Id,
                            ParameterName = tp.Name,
                            ParameterCode = tp.Code,
                            Unit = tp.Unit,
                            DataType = tp.DataType,
                            NormalRange = tp.NormalRange,
                            DisplayOrder = tp.DisplayOrder
                        });
                        hasChanges = true;
                    }
                }
            }
        }

        if (hasChanges)
            await _context.SaveChangesAsync();

        // Re-fetch order to include newly created/updated parameters
        order = await _context.MedicalOrders
            .Where(o => o.Id == id && o.OrderType == MedicalOrderType.Lab && !o.IsDeleted)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                Mrn = o.Patient != null ? o.Patient.MRN : null,
                PatientAge = o.Patient != null ? o.Patient.DateOfBirth : (DateTime?)null,
                PatientGender = o.Patient != null ? o.Patient.Gender : null,
                PatientPhone = o.Patient != null ? o.Patient.Phone : null,
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
                o.IsBilled,
                Items = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id)
                    .Select(i => new
                    {
                        i.Id,
                        i.ServiceId,
                        i.ServiceName,
                        i.ServiceCode,
                        i.UnitPrice,
                        i.Quantity,
                        i.Discount,
                        i.NetAmount,
                        i.SampleType,
                        Status = i.Status.ToString(),
                        i.SampleId,
                        i.Container,
                        i.SampleCollectedAt,
                        SampleCollectedBy = _context.Users.Where(u => u.Id == i.SampleCollectedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                        i.ResultEnteredAt,
                        ResultEnteredBy = _context.Users.Where(u => u.Id == i.ResultEnteredById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                        i.VerifiedAt,
                        VerifiedBy = _context.Users.Where(u => u.Id == i.VerifiedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                        i.Notes,
                        Parameters = _context.LabResultParameters
                            .Where(r => r.LabOrderItemId == i.Id)
                            .OrderBy(r => r.DisplayOrder)
                            .Select(r => new
                            {
                                r.Id,
                                r.ParameterId,
                                r.ParameterName,
                                r.ParameterCode,
                                r.ResultValue,
                                r.Unit,
                                r.NormalRange,
                                Flag = r.Flag.ToString(),
                                r.DataType,
                                r.IsAbnormal,
                                r.DisplayOrder,
                                Options = r.ParameterId != null
                                    ? _context.LabTestParameters.Where(p => p.Id == r.ParameterId).Select(p => p.Options).FirstOrDefault()
                                    : null
                            })
                            .ToList()
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        return Ok(Result<object>.Success(order));
    }

    [HttpPut("orders/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryOrdersEdit)]
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

    [HttpPost("orders/{id:guid}/cancel")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryOrdersEdit)]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Lab && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        order.Status = MedicalOrderStatus.Cancelled;
        await _context.SaveChangesAsync();
        return Ok(Result.Success("Order cancelled"));
    }

    [HttpDelete("orders/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryOrdersDelete)]
    public async Task<IActionResult> DeleteOrder(Guid id)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Lab && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        order.IsDeleted = true;
        await _context.SaveChangesAsync();
        return Ok(Result.Success("Lab order deleted successfully"));
    }

    #endregion Orders

    #region Sample Collection

    [HttpGet("sample-collection")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratorySample)]
    public async Task<IActionResult> GetSampleCollectionOrders()
    {
        var orders = await _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Lab &&
                (o.Status == MedicalOrderStatus.Ordered || o.Status == MedicalOrderStatus.SamplePending) &&
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
                Items = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && i.Status == LabOrderItemStatus.SamplePending)
                    .Select(i => new
                    {
                        i.Id,
                        i.ServiceName,
                        i.SampleType,
                        i.ServiceCode
                    })
                    .ToList(),
                ItemCount = _context.LabOrderItems.Count(i => i.MedicalOrderId == o.Id && i.Status == LabOrderItemStatus.SamplePending)
            })
            .ToListAsync();

        return Ok(Result<object>.Success(orders));
    }

    [HttpPost("orders/{id:guid}/collect-sample")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratorySample)]
    public async Task<IActionResult> CollectSample(Guid id, [FromBody] CollectSampleRequest request)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Lab && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        if (request.OrderItemIds == null || request.OrderItemIds.Count == 0)
            return BadRequest(Result.Failure("No items selected for sample collection"));

        foreach (var itemId in request.OrderItemIds)
        {
            var item = await _context.LabOrderItems.FirstOrDefaultAsync(i => i.Id == itemId && i.MedicalOrderId == id);
            if (item == null) continue;

            var sampleId = request.SampleId ?? GenerateSampleId();
            item.Status = LabOrderItemStatus.SampleCollected;
            item.SampleId = sampleId;
            item.SampleType = request.SampleType ?? item.SampleType;
            item.Container = request.Container;
            item.SampleCollectedAt = request.CollectionTime ?? DateTime.UtcNow;
            item.SampleCollectedById = request.CollectedById;
            item.Notes = request.Notes;
        }

        // Update order status
        var allItems = await _context.LabOrderItems.Where(i => i.MedicalOrderId == id).ToListAsync();
        if (allItems.All(i => i.Status == LabOrderItemStatus.SampleCollected || i.Status == LabOrderItemStatus.Cancelled))
            order.Status = MedicalOrderStatus.SampleCollected;
        else
            order.Status = MedicalOrderStatus.SamplePending;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Sample collected successfully"));
    }

    [HttpPost("orders/{id:guid}/reject-sample")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratorySample)]
    public async Task<IActionResult> RejectSample(Guid id, [FromBody] RejectSampleRequest request)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Lab && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        foreach (var itemId in request.OrderItemIds)
        {
            var item = await _context.LabOrderItems.FirstOrDefaultAsync(i => i.Id == itemId && i.MedicalOrderId == id);
            if (item == null) continue;

            item.Status = LabOrderItemStatus.Rejected;
            item.Notes = request.Reason;
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Sample rejected"));
    }

    private string GenerateSampleId()
    {
        return $"SMP-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper()}";
    }

    #endregion Sample Collection

    #region Result Entry

    [HttpGet("result-entry")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryResultsEdit)]
    public async Task<IActionResult> GetResultEntryOrders()
    {
        var orders = await _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Lab &&
                (o.Status == MedicalOrderStatus.SampleCollected || o.Status == MedicalOrderStatus.Processing) &&
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
                Items = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && (i.Status == LabOrderItemStatus.SampleCollected || i.Status == LabOrderItemStatus.Processing))
                    .Select(i => new
                    {
                        i.Id,
                        i.ServiceName,
                        i.SampleType,
                        i.SampleId,
                        i.ServiceCode
                    })
                    .ToList(),
                ItemCount = _context.LabOrderItems.Count(i => i.MedicalOrderId == o.Id && (i.Status == LabOrderItemStatus.SampleCollected || i.Status == LabOrderItemStatus.Processing))
            })
            .ToListAsync();

        return Ok(Result<object>.Success(orders));
    }

    [HttpPost("orders/{id:guid}/save-results")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryResultsEdit)]
    public async Task<IActionResult> SaveResults(Guid id, [FromBody] SaveResultsRequest request)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Lab && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        if (request.Items == null || request.Items.Count == 0)
            return BadRequest(Result.Failure("No results provided"));

        // Pre-fetch all test parameters for fallback DataType lookup
        var testParamCache = new Dictionary<Guid, TestParameterDataType>();

        foreach (var itemResult in request.Items)
        {
            var item = await _context.LabOrderItems.FirstOrDefaultAsync(i => i.Id == itemResult.OrderItemId && i.MedicalOrderId == id);
            if (item == null) continue;

            var existingResults = await _context.LabResultParameters.Where(r => r.LabOrderItemId == item.Id).ToListAsync();
            _context.LabResultParameters.RemoveRange(existingResults);

            if (itemResult.Parameters != null)
            {
                foreach (var param in itemResult.Parameters)
                {
                    // Resolve DataType: try from request first, then fallback to test parameter config
                    var dataType = TestParameterDataType.Numeric;
                    if (!string.IsNullOrEmpty(param.DataType) && Enum.TryParse<TestParameterDataType>(param.DataType, true, out var parsedDt))
                    {
                        dataType = parsedDt;
                    }
                    else if (param.ParameterId.HasValue)
                    {
                        // Fallback: look up from the test parameter definition
                        if (!testParamCache.TryGetValue(param.ParameterId.Value, out dataType))
                        {
                            var testParam = await _context.LabTestParameters.FindAsync(param.ParameterId.Value);
                            dataType = testParam?.DataType ?? TestParameterDataType.Numeric;
                            testParamCache[param.ParameterId.Value] = dataType;
                        }
                    }

                    var resultParam = new Domain.Entities.Clinical.LabResultParameter
                    {
                        LabOrderItemId = item.Id,
                        ParameterId = param.ParameterId,
                        ParameterName = param.ParameterName,
                        ParameterCode = param.ParameterCode,
                        ResultValue = param.ResultValue,
                        Unit = param.Unit,
                        NormalRange = param.NormalRange,
                        DataType = dataType,
                        DisplayOrder = param.DisplayOrder,
                        EnteredById = request.EnteredById,
                        EnteredAt = DateTime.UtcNow
                    };

                    resultParam.Flag = CalculateFlag(param.ResultValue, param.NormalRange, resultParam.DataType);
                    resultParam.IsAbnormal = resultParam.Flag != TestResultFlag.Normal && resultParam.Flag != TestResultFlag.None;

                    _context.LabResultParameters.Add(resultParam);
                }
            }

            item.Status = LabOrderItemStatus.ResultEntered;
            item.ResultEnteredAt = DateTime.UtcNow;
            item.ResultEnteredById = request.EnteredById;
        }

        order.Status = MedicalOrderStatus.ResultEntered;
        order.CompletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Results saved successfully"));
    }

    private TestResultFlag CalculateFlag(string? value, string? normalRange, TestParameterDataType dataType)
    {
        if (string.IsNullOrWhiteSpace(value) || string.IsNullOrWhiteSpace(normalRange) || dataType != TestParameterDataType.Numeric)
            return TestResultFlag.None;

        if (!decimal.TryParse(value, out var numVal))
            return TestResultFlag.None;

        var range = normalRange.Replace("<", "").Replace(">", "").Replace(" ", "");
        var parts = range.Split('-');
        if (parts.Length == 2 && decimal.TryParse(parts[0], out var min) && decimal.TryParse(parts[1], out var max))
        {
            if (numVal < min) return TestResultFlag.Low;
            if (numVal > max) return TestResultFlag.High;
            return TestResultFlag.Normal;
        }

        return TestResultFlag.None;
    }

    #endregion Result Entry

    #region Verification

    [HttpGet("verification")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryVerify)]
    public async Task<IActionResult> GetVerificationOrders()
    {
        var orders = await _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Lab &&
                (o.Status == MedicalOrderStatus.ResultEntered) &&
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
                ResultEnteredBy = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && i.ResultEnteredById != null)
                    .Select(i => _context.Users.Where(u => u.Id == i.ResultEnteredById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault())
                    .FirstOrDefault(),
                ResultEnteredAt = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && i.ResultEnteredAt != null)
                    .Max(i => i.ResultEnteredAt),
                Items = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && i.Status == LabOrderItemStatus.ResultEntered)
                    .Select(i => new
                    {
                        i.Id,
                        i.ServiceName,
                        i.ServiceCode
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(orders));
    }

    [HttpPost("orders/{id:guid}/verify")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryVerify)]
    public async Task<IActionResult> VerifyOrder(Guid id, [FromBody] VerifyOrderRequest request)
    {
        var order = await _context.MedicalOrders.FirstOrDefaultAsync(o => o.Id == id && o.OrderType == MedicalOrderType.Lab && !o.IsDeleted);
        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        if (request.Verified)
        {
            // Verify all result-entered items
            var items = await _context.LabOrderItems.Where(i => i.MedicalOrderId == id && i.Status == LabOrderItemStatus.ResultEntered).ToListAsync();
            foreach (var item in items)
            {
                item.Status = LabOrderItemStatus.Verified;
                item.VerifiedAt = DateTime.UtcNow;
                item.VerifiedById = request.VerifiedById;

                // Update result parameters verification
                var results = await _context.LabResultParameters.Where(r => r.LabOrderItemId == item.Id).ToListAsync();
                foreach (var r in results)
                {
                    r.VerifiedById = request.VerifiedById;
                    r.VerifiedAt = DateTime.UtcNow;
                }
            }

            order.Status = MedicalOrderStatus.Verified;
        }
        else
        {
            // Return for correction
            var items = await _context.LabOrderItems.Where(i => i.MedicalOrderId == id && i.Status == LabOrderItemStatus.ResultEntered).ToListAsync();
            foreach (var item in items)
            {
                item.Status = LabOrderItemStatus.SampleCollected;
                item.ResultEnteredAt = null;
                item.ResultEnteredById = null;
            }

            order.Status = MedicalOrderStatus.Processing;
            if (!string.IsNullOrEmpty(request.ReturnReason))
            {
                order.Notes = (order.Notes ?? "") + $"\n[Returned] {request.ReturnReason}";
            }
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success(request.Verified ? "Order verified" : "Order returned for correction"));
    }

    #endregion Verification

    #region Reports

    [HttpGet("reports")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryReports)]
    public async Task<IActionResult> GetReports(
        [FromQuery] Guid? patientId = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null)
    {
        var query = _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Lab &&
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
                Items = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id)
                    .Select(i => new
                    {
                        i.ServiceName,
                        i.ServiceCode,
                        HasAbnormal = _context.LabResultParameters.Any(r => r.LabOrderItemId == i.Id && r.IsAbnormal)
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new { items = reports, totalCount, pageNumber, pageSize }));
    }

    [HttpGet("reports/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryReports)]
    public async Task<IActionResult> GetReport(Guid id)
    {
        // Reuse GetOrder logic
        return await GetOrder(id);
    }

    #endregion Reports

    #region Stats

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryView)]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.UtcNow.Date;
        var todaysOrders = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Lab && o.OrderDate.Date == today && !o.IsDeleted);
        var pendingSamples = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Lab &&
            (o.Status == MedicalOrderStatus.Ordered || o.Status == MedicalOrderStatus.SamplePending) &&
            !o.IsDeleted);
        var collectedSamples = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Lab &&
            (o.Status == MedicalOrderStatus.SampleCollected || o.Status == MedicalOrderStatus.Processing) &&
            !o.IsDeleted);
        var processing = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Lab && o.Status == MedicalOrderStatus.Processing && !o.IsDeleted);
        var pendingResults = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Lab && o.Status == MedicalOrderStatus.SampleCollected && !o.IsDeleted);
        var pendingVerification = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Lab && o.Status == MedicalOrderStatus.ResultEntered && !o.IsDeleted);
        var completedToday = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Lab &&
            (o.Status == MedicalOrderStatus.Verified || o.Status == MedicalOrderStatus.Completed) &&
            o.CompletedAt >= today && !o.IsDeleted);
        var cancelledToday = await _context.MedicalOrders.CountAsync(o =>
            o.OrderType == MedicalOrderType.Lab && o.Status == MedicalOrderStatus.Cancelled &&
            o.OrderDate.Date == today && !o.IsDeleted);

        return Ok(Result<object>.Success(new
        {
            todaysOrders,
            pendingSamples,
            collectedSamples,
            processing,
            pendingResults,
            pendingVerification,
            completedToday,
            cancelledToday
        }));
    }

    [HttpGet("recent-orders")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryView)]
    public async Task<IActionResult> GetRecentOrders()
    {
        var orders = await _context.MedicalOrders
            .Where(o => o.OrderType == MedicalOrderType.Lab && !o.IsDeleted)
            .OrderByDescending(o => o.OrderDate)
            .Take(10)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                PatientName = o.Patient != null ? o.Patient.FirstName + " " + o.Patient.LastName : null,
                o.OrderDate,
                Status = o.Status.ToString(),
                o.IsUrgent,
                TestCount = _context.LabOrderItems.Count(i => i.MedicalOrderId == o.Id)
            })
            .ToListAsync();

        return Ok(Result<object>.Success(orders));
    }

    #endregion Stats

    #region Print

    [HttpGet("orders/{id:guid}/print")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryPrint)]
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
                o.Notes,
                Items = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id)
                    .Select(i => new
                    {
                        i.Id,
                        i.ServiceName,
                        i.ServiceCode,
                        i.SampleType,
                        i.UnitPrice,
                        i.NetAmount,
                        Status = i.Status.ToString(),
                        i.SampleId,
                        Parameters = _context.LabResultParameters
                            .Where(r => r.LabOrderItemId == i.Id)
                            .OrderBy(r => r.DisplayOrder)
                            .Select(r => new
                            {
                                r.ParameterName,
                                r.ResultValue,
                                r.Unit,
                                r.NormalRange,
                                Flag = r.Flag.ToString(),
                                r.IsAbnormal
                            })
                            .ToList()
                    })
                    .ToList(),
                o.CompletedAt,
                VerifiedBy = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && i.VerifiedById != null)
                    .Select(i => _context.Users.Where(u => u.Id == i.VerifiedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault())
                    .FirstOrDefault(),
                VerifiedAt = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && i.VerifiedAt != null)
                    .Max(i => i.VerifiedAt),
                EnteredBy = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id && i.ResultEnteredById != null)
                    .Select(i => _context.Users.Where(u => u.Id == i.ResultEnteredById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault())
                    .FirstOrDefault()
            })
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        return Ok(Result<object>.Success(order));
    }

    [HttpGet("orders/{id:guid}/sample-label")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryPrint)]
    public async Task<IActionResult> GetSampleLabel(Guid id)
    {
        var items = await _context.LabOrderItems
            .Where(i => i.MedicalOrderId == id && i.Status == LabOrderItemStatus.SampleCollected)
            .Select(i => new
            {
                i.Id,
                i.SampleId,
                i.SampleType,
                i.Container,
                i.SampleCollectedAt,
                SampleCollectedBy = _context.Users.Where(u => u.Id == i.SampleCollectedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                i.ServiceName,
                OrderNumber = i.MedicalOrder.OrderNumber,
                PatientName = i.MedicalOrder.Patient != null ? i.MedicalOrder.Patient.FirstName + " " + i.MedicalOrder.Patient.LastName : null,
                Mrn = i.MedicalOrder.Patient != null ? i.MedicalOrder.Patient.MRN : null
            })
            .ToListAsync();

        if (items.Count == 0)
            return NotFound(Result.Failure("No collected samples found"));

        return Ok(Result<object>.Success(items));
    }

    [HttpGet("orders/{id:guid}/receipt")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.LaboratoryPrint)]
    public async Task<IActionResult> GetOrderReceipt(Guid id)
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
                OrderedBy = _context.Users.Where(u => u.Id == o.OrderedById).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                o.OrderDate,
                Priority = o.IsUrgent ? "Urgent" : "Routine",
                o.ClinicalIndication,
                o.SpecialInstructions,
                Items = _context.LabOrderItems
                    .Where(i => i.MedicalOrderId == o.Id)
                    .Select(i => new
                    {
                        i.ServiceName,
                        i.ServiceCode,
                        i.UnitPrice,
                        i.Quantity,
                        i.Discount,
                        i.NetAmount
                    })
                    .ToList(),
                TotalAmount = _context.LabOrderItems.Where(i => i.MedicalOrderId == o.Id).Sum(i => i.NetAmount)
            })
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound(Result.Failure("Order not found"));

        return Ok(Result<object>.Success(order));
    }

    #endregion Print

    public class CreateLabOrderRequest
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
        public List<LabOrderItemRequest>? Items { get; set; }
    }

    public class LabOrderItemRequest
    {
        public Guid ServiceId { get; set; }
        public int Quantity { get; set; } = 1;
        public decimal Discount { get; set; }
        public string? SampleType { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateLabOrderRequest
    {
        public string? Status { get; set; }
        public string? ClinicalIndication { get; set; }
        public string? SpecialInstructions { get; set; }
        public string? Notes { get; set; }
    }

    public class CollectSampleRequest
    {
        public List<Guid>? OrderItemIds { get; set; }
        public string? SampleId { get; set; }
        public string? SampleType { get; set; }
        public string? Container { get; set; }
        public DateTime? CollectionTime { get; set; }
        public Guid? CollectedById { get; set; }
        public string? Notes { get; set; }
    }

    public class RejectSampleRequest
    {
        public List<Guid> OrderItemIds { get; set; } = new();
        public string? Reason { get; set; }
    }

    public class SaveResultsRequest
    {
        public Guid? EnteredById { get; set; }
        public List<ItemResultRequest>? Items { get; set; }
    }

    public class ItemResultRequest
    {
        public Guid OrderItemId { get; set; }
        public List<ParameterResultRequest>? Parameters { get; set; }
    }

    public class ParameterResultRequest
    {
        public Guid? ParameterId { get; set; }
        public string ParameterName { get; set; } = string.Empty;
        public string? ParameterCode { get; set; }
        public string? ResultValue { get; set; }
        public string? Unit { get; set; }
        public string? NormalRange { get; set; }
        public string? DataType { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class VerifyOrderRequest
    {
        public bool Verified { get; set; }
        public Guid? VerifiedById { get; set; }
        public string? ReturnReason { get; set; }
    }

    public class CreateTestParameterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public int DisplayOrder { get; set; }
        public string? Unit { get; set; }
        public string? DataType { get; set; }
        public string? NormalRange { get; set; }
        public decimal? MinValue { get; set; }
        public decimal? MaxValue { get; set; }
        public string? MaleRange { get; set; }
        public string? FemaleRange { get; set; }
        public string? ChildRange { get; set; }
        public decimal? CriticalLow { get; set; }
        public decimal? CriticalHigh { get; set; }
        public string? Description { get; set; }
        public string? Options { get; set; }
    }
}
