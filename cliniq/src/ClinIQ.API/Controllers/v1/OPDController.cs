using ClinIQ.Domain.Enums;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using ClinIQ.API.Hubs;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class OPDController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<QueueHub> _hubContext;
    private readonly ITenantService _tenantService;

    public OPDController(ApplicationDbContext context, IHubContext<QueueHub> hubContext, ITenantService tenantService)
    {
        _context = context;
        _hubContext = hubContext;
        _tenantService = tenantService;
    }

    // ─────────────────────────── Dashboard Stats ───────────────────────────

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        var queueToday = _context.Queues
            .Where(q => !q.IsDeleted && q.QueueDate >= today && q.QueueDate < tomorrow);

        var totalPatients = await queueToday.CountAsync();
        var waitingCount = await queueToday.CountAsync(q => q.Status == QueueStatus.Waiting || q.Status == QueueStatus.Called || q.Status == QueueStatus.Recalled);
        var inProgressCount = await queueToday.CountAsync(q => q.Status == QueueStatus.InConsultation);
        var completedCount = await queueToday.CountAsync(q => q.Status == QueueStatus.Completed);

        return Ok(Result<object>.Success(new
        {
            totalPatients,
            waitingCount,
            inProgressCount,
            completedCount
        }));
    }

    // ─────────────────────────── Active Doctors ───────────────────────────

    [HttpGet("active-doctors")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> GetActiveDoctors()
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        var tenantUserIds = _context.TenantUsers
            .Where(tu => tu.TenantId == tenantId.Value && tu.IsActive)
            .Select(tu => tu.UserId);

        var doctorScheduleIds = _context.DoctorSchedules
            .Where(s => s.TenantId == tenantId.Value && !s.IsDeleted)
            .Select(s => s.DoctorId);

        var doctors = await _context.Users
            .Where(u => u.IsActive && !u.IsDeleted && u.Specialization != null
                && (tenantUserIds.Contains(u.Id) || doctorScheduleIds.Contains(u.Id)))
            .Select(u => new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                FullName = (u.FirstName + " " + u.LastName).Trim(),
                Initials = ((u.FirstName.Length > 0 ? u.FirstName.Substring(0, 1) : "") +
                            (u.LastName.Length > 0 ? u.LastName.Substring(0, 1) : "")).ToUpper(),
                u.Specialization,
                QueueCount = _context.Queues
                    .Count(q => !q.IsDeleted && q.DoctorId == u.Id
                        && q.QueueDate >= today && q.QueueDate < tomorrow
                        && (q.Status == QueueStatus.Waiting || q.Status == QueueStatus.Called
                            || q.Status == QueueStatus.InConsultation || q.Status == QueueStatus.Recalled))
            })
            .Where(d => d.QueueCount > 0)
            .OrderBy(d => d.FullName)
            .ToListAsync();

        return Ok(Result<object>.Success(doctors));
    }

    // ─────────────────────────── Current Queue (all) ───────────────────────────

    [HttpGet("current-queue")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> GetCurrentQueue()
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        var queue = await _context.Queues
            .Where(q => !q.IsDeleted && q.QueueDate >= today && q.QueueDate < tomorrow)
            .OrderBy(q => q.TokenNumber)
            .Select(q => new
            {
                q.Id,
                q.TokenNumber,
                q.PatientId,
                PatientName = _context.Patients.Where(p => p.Id == q.PatientId).Select(p => p.FirstName + " " + p.LastName).FirstOrDefault(),
                PatientMRN = _context.Patients.Where(p => p.Id == q.PatientId).Select(p => p.MRN).FirstOrDefault(),
                DoctorName = _context.Users.Where(u => u.Id == q.DoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                q.DoctorId,
                Status = q.Status.ToString(),
                q.JoinedAt,
                q.CalledAt,
                q.QueueDate
            })
            .ToListAsync();

        var patientIds = queue.Where(q => q.PatientId != Guid.Empty).Select(q => q.PatientId).Distinct().ToList();

        var invoiceDataByPatient = new Dictionary<Guid, (List<object> Items, decimal TotalAmount, string PaymentMethod, string InvoiceNumber)>();

        if (patientIds.Any())
        {
            var todayInvoices = await _context.Invoices
                .Where(i => !i.IsDeleted
                    && patientIds.Contains(i.PatientId)
                    && i.InvoiceDate >= today && i.InvoiceDate < tomorrow)
                .Select(i => new { i.Id, i.PatientId, i.TotalAmount, i.InvoiceNumber })
                .ToListAsync();

            var invoiceIds = todayInvoices.Select(i => i.Id).ToList();
            var patientInvoiceMap = todayInvoices.ToDictionary(i => i.Id, i => i.PatientId);

            var invoiceItems = await _context.InvoiceItems
                .Where(ii => invoiceIds.Contains(ii.InvoiceId))
                .Select(ii => new
                {
                    ii.InvoiceId,
                    ii.ItemName,
                    ii.Amount,
                    ii.Quantity
                })
                .ToListAsync();

            var payments = await _context.Payments
                .Where(p => p.InvoiceId.HasValue && invoiceIds.Contains(p.InvoiceId.Value))
                .GroupBy(p => p.InvoiceId!.Value)
                .Select(g => new { InvoiceId = g.Key, PaymentMethod = g.First().PaymentMethod.ToString() })
                .ToListAsync();

            var paymentByInvoice = payments.ToDictionary(p => p.InvoiceId, p => p.PaymentMethod);

            var grouped = invoiceItems
                .Where(ii => patientInvoiceMap.ContainsKey(ii.InvoiceId))
                .GroupBy(ii => patientInvoiceMap[ii.InvoiceId]);

            foreach (var g in grouped)
            {
                var inv = todayInvoices.First(i => i.PatientId == g.Key);
                var firstInvoiceId = g.First().InvoiceId;
                paymentByInvoice.TryGetValue(firstInvoiceId, out var payMethod);
                invoiceDataByPatient[g.Key] = (
                    g.Select(x => (object)new { x.ItemName, x.Amount, x.Quantity }).ToList(),
                    inv.TotalAmount,
                    payMethod ?? "Cash",
                    inv.InvoiceNumber ?? ""
                );
            }
        }

        var result = queue.Select(q =>
        {
            var hasInvoice = invoiceDataByPatient.TryGetValue(q.PatientId, out var invData);
            return new
            {
                q.Id,
                q.TokenNumber,
                q.PatientName,
                q.PatientMRN,
                q.DoctorName,
                q.DoctorId,
                q.Status,
                q.JoinedAt,
                q.CalledAt,
                q.QueueDate,
                Services = hasInvoice ? invData.Items : new List<object>(),
                TotalAmount = hasInvoice ? invData.TotalAmount : 0,
                PaymentMethod = hasInvoice ? invData.PaymentMethod : "",
                InvoiceNumber = hasInvoice ? invData.InvoiceNumber : ""
            };
        }).ToList();

        return Ok(Result<object>.Success(result));
    }

    // ─────────────────────────── Queue per Doctor (management) ───────────────────────────

    [HttpGet("queue/{doctorId:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> GetDoctorQueue(Guid doctorId)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        var allEntries = await _context.Queues
            .Where(q => !q.IsDeleted && q.DoctorId == doctorId
                && q.QueueDate >= today && q.QueueDate < tomorrow)
            .OrderBy(q => q.TokenNumber)
            .Select(q => new
            {
                q.Id,
                q.TokenNumber,
                PatientName = q.Patient != null ? q.Patient.FirstName + " " + q.Patient.LastName : null,
                MRN = q.Patient != null ? q.Patient.MRN : null,
                q.PatientId,
                Status = q.Status.ToString(),
                WaitTime = q.JoinedAt.HasValue
                    ? (int?)(DateTime.UtcNow - q.JoinedAt.Value).TotalMinutes
                    : null,
                q.Priority,
                q.Notes
            })
            .ToListAsync();

        var currentPatient = allEntries.FirstOrDefault(e =>
            e.Status == QueueStatus.Called.ToString() ||
            e.Status == QueueStatus.InConsultation.ToString() ||
            e.Status == QueueStatus.Recalled.ToString());

        var waitingQueue = allEntries
            .Where(e => e.Status == QueueStatus.Waiting.ToString())
            .OrderBy(e => e.Priority ?? int.MaxValue)
            .ThenBy(e => e.TokenNumber)
            .ToList();

        return Ok(Result<object>.Success(new { currentPatient, waitingQueue }));
    }

    // ─────────────────────────── Generate Token (with fee) ───────────────────────────

    [HttpPost("tokens")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> GenerateToken([FromBody] GenerateTokenRequest request)
    {
        if (request.PatientId == Guid.Empty)
            return BadRequest(Result.Failure("PatientId is required"));
        if (request.DoctorId == Guid.Empty)
            return BadRequest(Result.Failure("DoctorId is required"));

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == request.PatientId && !p.IsDeleted);
        if (patient == null)
            return NotFound(Result.Failure("Patient not found"));

        var doctor = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.DoctorId && !u.IsDeleted);
        if (doctor == null)
            return NotFound(Result.Failure("Doctor not found"));

        // Generate next token number for today
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);
        var maxToken = await _context.Queues
            .Where(q => q.QueueDate >= today && q.QueueDate < tomorrow)
            .MaxAsync(q => (int?)q.TokenNumber) ?? 0;
        var tokenNumber = maxToken + 1;

        // Create queue entry
        var queue = new Domain.Entities.Clinical.Queue
        {
            PatientId = request.PatientId,
            DoctorId = request.DoctorId,
            QueueDate = DateTime.UtcNow,
            TokenNumber = tokenNumber,
            Status = QueueStatus.Waiting,
            JoinedAt = DateTime.UtcNow,
            Notes = request.Notes
        };
        _context.Queues.Add(queue);

        // Create invoice for consultation fee
        decimal consultationFee = request.ConsultationFee;
        decimal additionalServicesTotal = 0;

        if (request.AdditionalServices != null && request.AdditionalServices.Any())
        {
            var serviceIds = request.AdditionalServices.Select(s => s.ServiceId).ToList();
            var services = await _context.Services
                .Where(s => serviceIds.Contains(s.Id) && !s.IsDeleted && s.IsActive)
                .ToListAsync();

            foreach (var svc in services)
            {
                additionalServicesTotal += svc.Price;
            }
        }

        var totalAmount = consultationFee + additionalServicesTotal;

        // Generate invoice number
        var invoiceCount = await _context.Invoices.CountAsync() + 1;
        var invoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{invoiceCount:D5}";

        var invoice = new Domain.Entities.Billing.Invoice
        {
            InvoiceNumber = invoiceNumber,
            PatientId = request.PatientId,
            InvoiceDate = DateTime.UtcNow,
            Status = Domain.Enums.InvoiceStatus.Paid,
            SubTotal = totalAmount,
            TotalAmount = totalAmount,
            PaidAmount = totalAmount,
            OutstandingAmount = 0,
            Notes = $"OPD Token #{tokenNumber} - Dr. {doctor.FirstName} {doctor.LastName}"
        };

        // Add consultation fee as invoice item
        invoice.Items.Add(new Domain.Entities.Billing.InvoiceItem
        {
            InvoiceId = invoice.Id,
            ItemType = "Service",
            ItemName = $"Consultation Fee - Dr. {doctor.FirstName} {doctor.LastName}",
            Description = $"OPD Consultation - Dr. {doctor.FirstName} {doctor.LastName}",
            Quantity = 1,
            UnitPrice = consultationFee,
            Amount = consultationFee,
            TotalAmount = consultationFee,
            DisplayOrder = 0
        });

        // Add additional services as invoice items
        int displayOrder = 1;
        if (request.AdditionalServices != null)
        {
            foreach (var svcReq in request.AdditionalServices)
            {
                var svc = await _context.Services.FirstOrDefaultAsync(s => s.Id == svcReq.ServiceId && !s.IsDeleted);
                if (svc != null)
                {
                    var qty = svcReq.Quantity > 0 ? svcReq.Quantity : 1;
                    invoice.Items.Add(new Domain.Entities.Billing.InvoiceItem
                    {
                        InvoiceId = invoice.Id,
                        ServiceId = svc.Id,
                        ItemType = "Service",
                        ItemName = svc.Name,
                        ItemCode = svc.Code,
                        Description = svc.Description,
                        Quantity = qty,
                        UnitPrice = svc.Price,
                        Amount = svc.Price * qty,
                        TotalAmount = svc.Price * qty,
                        DisplayOrder = displayOrder++
                    });
                }
            }
        }

        _context.Invoices.Add(invoice);

        // Create MedicalOrders for lab/radiology services
        if (request.AdditionalServices != null && request.AdditionalServices.Any())
        {
            var serviceIds = request.AdditionalServices.Select(s => s.ServiceId).ToList();
            var orderedServices = await _context.Services
                .Where(s => serviceIds.Contains(s.Id) && !s.IsDeleted && s.IsActive)
                .ToListAsync();

            foreach (var svc in orderedServices)
            {
                if (svc.Type == ServiceType.Laboratory)
                {
                    var labCount = await _context.MedicalOrders.CountAsync(o => o.OrderType == MedicalOrderType.Lab && o.OrderDate.Date == DateTime.UtcNow.Date);
                    var labOrderNumber = $"LAB-{DateTime.UtcNow:yyyyMMdd}-{(labCount + 1):D4}";

                    _context.MedicalOrders.Add(new Domain.Entities.Clinical.MedicalOrder
                    {
                        OrderNumber = labOrderNumber,
                        PatientId = request.PatientId,
                        OrderedById = request.DoctorId,
                        OrderType = MedicalOrderType.Lab,
                        Status = MedicalOrderStatus.Ordered,
                        OrderDate = DateTime.UtcNow,
                        OrderItems = svc.Name,
                        InvoiceId = invoice.Id,
                        IsBilled = true,
                        Notes = $"Auto-generated from OPD Token #{tokenNumber}"
                    });
                }
                else if (svc.Type == ServiceType.Radiology)
                {
                    var radCount = await _context.MedicalOrders.CountAsync(o => o.OrderType == MedicalOrderType.Radiology && o.OrderDate.Date == DateTime.UtcNow.Date);
                    var radOrderNumber = $"RAD-{DateTime.UtcNow:yyyyMMdd}-{(radCount + 1):D4}";

                    _context.MedicalOrders.Add(new Domain.Entities.Clinical.MedicalOrder
                    {
                        OrderNumber = radOrderNumber,
                        PatientId = request.PatientId,
                        OrderedById = request.DoctorId,
                        OrderType = MedicalOrderType.Radiology,
                        Status = MedicalOrderStatus.Ordered,
                        OrderDate = DateTime.UtcNow,
                        OrderItems = svc.Name,
                        InvoiceId = invoice.Id,
                        IsBilled = true,
                        Notes = $"Auto-generated from OPD Token #{tokenNumber}"
                    });
                }
            }
        }

        // Create payment record
        var paymentCount = await _context.Payments.CountAsync() + 1;
        var paymentNumber = $"PAY-{DateTime.UtcNow:yyyyMMdd}-{paymentCount:D5}";

        var paymentMethod = Enum.TryParse<PaymentMethod>(request.PaymentMethod, true, out var pm)
            ? pm : PaymentMethod.Cash;

        var payment = new Domain.Entities.Billing.Payment
        {
            PaymentNumber = paymentNumber,
            InvoiceId = invoice.Id,
            PatientId = request.PatientId,
            PaymentDate = DateTime.UtcNow,
            Amount = totalAmount,
            PaymentMethod = paymentMethod,
            Status = PaymentStatus.Completed,
            Notes = $"OPD Token #{tokenNumber} payment"
        };
        _context.Payments.Add(payment);

        await _context.SaveChangesAsync();

        // Broadcast to queue display
        await _hubContext.Clients.All.SendAsync("TokenGenerated", new
        {
            tokenNumber,
            patientName = patient.FullName,
            doctorName = doctor.FullName,
            doctorId = doctor.Id.ToString(),
            roomNumber = ""
        });

        return Ok(Result<object>.Success(new
        {
            queueId = queue.Id,
            tokenNumber,
            patientName = patient.FullName,
            patientMRN = patient.MRN,
            doctorName = doctor.FullName,
            doctorId = doctor.Id,
            consultationFee,
            additionalServices = request.AdditionalServices ?? new List<TokenServiceItem>(),
            totalAmount,
            paymentMethod = paymentMethod.ToString(),
            paymentNumber,
            invoiceNumber,
            createdAt = DateTime.UtcNow
        }, "Token generated successfully"));
    }

    // ─────────────────────────── Quick Add Patient ───────────────────────────

    [HttpPost("quick-patient")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsView)]
    public async Task<IActionResult> QuickAddPatient([FromBody] QuickPatientRequest request)
    {
        var fullName = !string.IsNullOrWhiteSpace(request.FullName)
            ? request.FullName.Trim()
            : $"{request.FirstName} {request.LastName}".Trim();

        if (string.IsNullOrWhiteSpace(fullName))
            return BadRequest(Result.Failure("Full name is required"));

        var nameParts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var firstName = nameParts[0];
        var lastName = nameParts.Length > 1 ? string.Join(' ', nameParts.Skip(1)) : string.Empty;

        // Generate MRN
        var patientCount = await _context.Patients.CountAsync() + 1;
        var mrn = $"MRN-{DateTime.UtcNow:yyyyMMdd}-{patientCount:D5}";

        var patientNumber = $"P-{patientCount:D6}";

        var patient = new Domain.Entities.Clinical.Patient
        {
            PatientNumber = patientNumber,
            MRN = mrn,
            FirstName = firstName,
            LastName = lastName,
            Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            Gender = Enum.TryParse<Gender>(request.Gender, true, out var g) ? g : null,
            DateOfBirth = request.DateOfBirth,
            Address = string.IsNullOrWhiteSpace(request.Address) ? null : request.Address.Trim(),
            Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim(),
            Notes = "Quick added from OPD Token Generation"
        };

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new
        {
            patient.Id,
            patient.MRN,
            patient.PatientNumber,
            fullName = patient.FullName,
            patient.Phone,
            patient.Gender,
            patient.DateOfBirth
        }, "Patient created successfully"));
    }

    // ─────────────────────────── Search Patients (for autocomplete) ───────────────────────────

    [HttpGet("search-patients")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsView)]
    public async Task<IActionResult> SearchPatients([FromQuery] string term)
    {
        if (string.IsNullOrWhiteSpace(term) || term.Length < 2)
            return Ok(Result<object>.Success(Array.Empty<object>()));

        var tenantId = _tenantService.GetCurrentTenantId();

        var termLower = term.ToLower();
        var query = _context.Patients
            .Where(p => !p.IsDeleted && (
                p.FirstName.ToLower().Contains(termLower) ||
                p.LastName.ToLower().Contains(termLower) ||
                (p.MRN != null && p.MRN.ToLower().Contains(termLower)) ||
                (p.Phone != null && p.Phone.Contains(term))
            ));

        // Filter by tenant if available
        if (tenantId.HasValue)
        {
            query = query.Where(p => p.TenantId == tenantId.Value);
        }

        var patients = await query
            .OrderBy(p => p.FirstName)
            .Take(20)
            .Select(p => new
            {
                p.Id,
                p.MRN,
                fullName = (p.FirstName + " " + p.LastName).Trim(),
                p.Phone,
                p.Gender,
                p.DateOfBirth
            })
            .ToListAsync();

        return Ok(Result<object>.Success(patients));
    }

    // ─────────────────────────── Available Doctors (for token gen) ───────────────────────────

    [HttpGet("available-doctors")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> GetAvailableDoctors()
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var tenantUserIds = _context.TenantUsers
            .Where(tu => tu.TenantId == tenantId.Value && tu.IsActive)
            .Select(tu => tu.UserId);

        var doctorScheduleIds = _context.DoctorSchedules
            .Where(s => s.TenantId == tenantId.Value && !s.IsDeleted)
            .Select(s => s.DoctorId);

        var doctors = await _context.Users
            .Where(u => u.IsActive && !u.IsDeleted && u.Specialization != null
                && (tenantUserIds.Contains(u.Id) || doctorScheduleIds.Contains(u.Id)))
            .Select(u => new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                fullName = (u.FirstName + " " + u.LastName).Trim(),
                u.Specialization,
                consultationFee = _context.DoctorSchedules
                    .Where(s => s.DoctorId == u.Id && !s.IsDeleted)
                    .Select(s => s.ConsultationFee)
                    .FirstOrDefault() ?? 500m,
                services = _context.Services
                    .Where(s => !s.IsDeleted && s.IsActive)
                    .Select(s => new { s.Id, s.Name, s.Price, s.Code })
                    .ToList()
            })
            .OrderBy(d => d.fullName)
            .ToListAsync();

        return Ok(Result<object>.Success(doctors));
    }

    // ─────────────────────────── Recall Patient ───────────────────────────

    [HttpPost("queue/{id:guid}/recall")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OpdView)]
    public async Task<IActionResult> RecallPatient(Guid id)
    {
        var queue = await _context.Queues.FirstOrDefaultAsync(q => q.Id == id && !q.IsDeleted);
        if (queue == null)
            return NotFound(Result.Failure("Queue entry not found"));

        queue.Status = QueueStatus.Recalled;
        queue.CalledAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Broadcast recall
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == queue.PatientId);
        var doctorName = queue.DoctorId != null
            ? await _context.Users.Where(u => u.Id == queue.DoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefaultAsync()
            : "";

        await _hubContext.Clients.All.SendAsync("TokenCalled", new
        {
            queueId = queue.Id.ToString(),
            tokenNumber = queue.TokenNumber,
            patientName = patient?.FullName ?? "",
            doctorId = queue.DoctorId?.ToString() ?? "",
            doctorName,
            roomNumber = "",
            status = "Recalled"
        });

        return Ok(Result.Success("Patient recalled"));
    }

    // ─────────────────────────── Existing endpoints ───────────────────────────

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

        // Broadcast call to display
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == queue.PatientId);
        var doctorName = queue.DoctorId != null
            ? await _context.Users.Where(u => u.Id == queue.DoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefaultAsync()
            : "";

        await _hubContext.Clients.All.SendAsync("TokenCalled", new
        {
            queueId = queue.Id.ToString(),
            tokenNumber = queue.TokenNumber,
            patientName = patient?.FullName ?? "",
            doctorId = queue.DoctorId?.ToString() ?? "",
            doctorName,
            roomNumber = "",
            status = "Called"
        });

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

        // Broadcast queue update
        await _hubContext.Clients.All.SendAsync("QueueUpdated", new
        {
            queueId = queue.Id.ToString(),
            doctorId = queue.DoctorId?.ToString() ?? "",
            status = "Completed"
        });

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

    // ─────────────────────────── Request Models ───────────────────────────

    public class AddToQueueRequest
    {
        public Guid PatientId { get; set; }
        public Guid? DoctorId { get; set; }
        public Guid? DepartmentId { get; set; }
        public Guid? RoomId { get; set; }
        public int? Priority { get; set; }
        public string? Notes { get; set; }
    }

    public class GenerateTokenRequest
    {
        public Guid PatientId { get; set; }
        public Guid DoctorId { get; set; }
        public decimal ConsultationFee { get; set; }
        public string PaymentMethod { get; set; } = "Cash";
        public List<TokenServiceItem>? AdditionalServices { get; set; }
        public string? Notes { get; set; }
    }

    public class TokenServiceItem
    {
        public Guid ServiceId { get; set; }
        public int Quantity { get; set; } = 1;
    }

    public class QuickPatientRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
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
