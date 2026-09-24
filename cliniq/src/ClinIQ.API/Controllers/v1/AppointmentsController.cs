using ClinIQ.Domain.Entities.Billing;
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
public class AppointmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public AppointmentsController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsView)]
    public async Task<IActionResult> GetAppointments(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] DateTime? date = null,
        [FromQuery] Guid? doctorId = null,
        [FromQuery] Guid? patientId = null,
        [FromQuery] string? status = null)
    {
        var query = _context.Appointments
            .Where(a => !a.IsDeleted);

        if (date.HasValue)
            query = query.Where(a => a.AppointmentDate.Date == date.Value.Date);

        if (doctorId.HasValue)
            query = query.Where(a => a.DoctorId == doctorId.Value);

        if (patientId.HasValue)
            query = query.Where(a => a.PatientId == patientId.Value);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<AppointmentStatus>(status, true, out var statusEnum))
            query = query.Where(a => a.Status == statusEnum);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(a => a.AppointmentDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new
            {
                a.Id,
                a.AppointmentNumber,
                PatientName = a.Patient.FirstName + " " + a.Patient.LastName,
                PatientId = a.PatientId,
                DoctorName = _context.Users.Where(u => u.Id == a.DoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                DoctorId = a.DoctorId,
                a.AppointmentDate,
                StartTime = a.StartTime.ToString(@"hh\:mm"),
                EndTime = a.EndTime != null ? a.EndTime.Value.ToString(@"hh\:mm") : null,
                Type = a.Type.ToString(),
                AppointmentType = a.Type.ToString(),
                Status = a.Status.ToString(),
                a.ChiefComplaint,
                a.Notes,
                a.ConsultationFee,
                a.IsBilled
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
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsView)]
    public async Task<IActionResult> GetAppointment(Guid id)
    {
        var appointment = await _context.Appointments
            .Where(a => a.Id == id && !a.IsDeleted)
            .Select(a => new
            {
                a.Id,
                a.AppointmentNumber,
                PatientName = a.Patient.FirstName + " " + a.Patient.LastName,
                PatientId = a.PatientId,
                Patient = new
                {
                    a.Patient.Id,
                    a.Patient.MRN,
                    a.Patient.Phone,
                    FullName = a.Patient.FirstName + " " + a.Patient.LastName
                },
                DoctorName = _context.Users.Where(u => u.Id == a.DoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                DoctorId = a.DoctorId,
                a.AppointmentDate,
                StartTime = a.StartTime.ToString(@"hh\:mm"),
                EndTime = a.EndTime != null ? a.EndTime.Value.ToString(@"hh\:mm") : null,
                Type = a.Type.ToString(),
                AppointmentType = a.Type.ToString(),
                Status = a.Status.ToString(),
                ChiefComplaint = a.ChiefComplaint,
                Reason = a.ChiefComplaint,
                a.Notes,
                a.DurationMinutes,
                a.ConsultationFee,
                a.IsBilled,
                a.InvoiceId
            })
            .FirstOrDefaultAsync();

        if (appointment == null)
            return NotFound(Result.Failure("Appointment not found"));

        return Ok(Result<object>.Success(appointment));
    }

    [HttpGet("calendar")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsView)]
    public async Task<IActionResult> GetCalendarEvents([FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        var events = await _context.Appointments
            .Where(a => !a.IsDeleted && a.AppointmentDate >= start && a.AppointmentDate <= end)
            .Select(a => new
            {
                a.Id,
                title = a.Patient.FirstName + " " + a.Patient.LastName + " - " + (_context.Users.Where(u => u.Id == a.DoctorId).Select(u => u.LastName).FirstOrDefault() ?? ""),
                start = a.AppointmentDate.Add(a.StartTime),
                end = a.EndTime.HasValue ? a.AppointmentDate.Add(a.EndTime.Value) : a.AppointmentDate.Add(a.StartTime.Add(TimeSpan.FromMinutes(a.DurationMinutes))),
                color = a.Status == AppointmentStatus.Cancelled ? "#f44336" : a.Status == AppointmentStatus.Completed ? "#4caf50" : "#2196f3"
            })
            .ToListAsync();

        return Ok(Result<object[]>.Success(events.ToArray()));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsCreate)]
    public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentRequest request)
    {
        var doctor = await _context.Users.FindAsync(request.DoctorId);
        var patient = await _context.Patients.FindAsync(request.PatientId);

        var startTime = TimeSpan.Parse(request.StartTime ?? "09:00");
        var durationMinutes = request.DurationMinutes ?? 30;
        var endTime = startTime.Add(TimeSpan.FromMinutes(durationMinutes));

        // The tenant MUST come from the signed-in context. Falling back to the
        // first tenant would mis-assign records to the wrong organization.
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));
        var branchId = _tenantService.GetCurrentBranchId();

        // Consultation fee: prefer the request value, fall back to the doctor's schedule fee for that day
        var consultationFee = request.ConsultationFee
            ?? await _context.DoctorSchedules
                .Where(s => s.DoctorId == request.DoctorId
                    && s.TenantId == tenantId
                    && s.DayOfWeek == (int)request.AppointmentDate.DayOfWeek
                    && !s.IsDeleted)
                .Select(s => s.ConsultationFee)
                .FirstOrDefaultAsync();

        // Generate unique appointment number scoped to the current tenant
        var count = await _context.Appointments.CountAsync(a => a.TenantId == tenantId);
        var aptNumber = $"APT{(count + 1):D4}";
        while (await _context.Appointments.AnyAsync(a => a.TenantId == tenantId && a.AppointmentNumber == aptNumber))
        {
            count++;
            aptNumber = $"APT{(count + 1):D4}";
        }

        var appointment = new Appointment
        {
            AppointmentNumber = aptNumber,
            PatientId = request.PatientId,
            DoctorId = request.DoctorId,
            DepartmentId = doctor?.DepartmentId,
            RoomId = null,
            AppointmentDate = request.AppointmentDate,
            StartTime = startTime,
            EndTime = endTime,
            DurationMinutes = durationMinutes,
            Type = ParseAppointmentType(request.AppointmentType),
            Status = AppointmentStatus.Scheduled,
            Priority = request.Priority ?? 0,
            ChiefComplaint = request.ChiefComplaint,
            Notes = request.Notes,
            TenantId = tenantId,
            BranchId = branchId,
            ConsultationFee = consultationFee
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        // Auto-create invoice + payment if consultation fee > 0
        if (consultationFee.HasValue && consultationFee.Value > 0)
        {
            var doctorName = doctor != null ? $"{doctor.FirstName} {doctor.LastName}" : "Doctor";

            // Generate invoice number
            var invoiceCount = await _context.Invoices.CountAsync() + 1;
            var invoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{invoiceCount:D5}";

            var invoice = new Invoice
            {
                InvoiceNumber = invoiceNumber,
                PatientId = request.PatientId,
                AppointmentId = appointment.Id,
                InvoiceDate = DateTime.UtcNow,
                Status = InvoiceStatus.Paid,
                SubTotal = consultationFee.Value,
                TotalAmount = consultationFee.Value,
                PaidAmount = consultationFee.Value,
                OutstandingAmount = 0,
                Notes = $"Appointment #{aptNumber} - Dr. {doctorName}"
            };

            invoice.Items.Add(new InvoiceItem
            {
                InvoiceId = invoice.Id,
                ItemType = "Service",
                ItemName = $"Consultation Fee - Dr. {doctorName}",
                Description = $"Appointment Consultation - Dr. {doctorName}",
                Quantity = 1,
                UnitPrice = consultationFee.Value,
                Amount = consultationFee.Value,
                TotalAmount = consultationFee.Value,
                DisplayOrder = 0
            });

            _context.Invoices.Add(invoice);

            // Create payment record
            var paymentCount = await _context.Payments.CountAsync() + 1;
            var paymentNumber = $"PAY-{DateTime.UtcNow:yyyyMMdd}-{paymentCount:D5}";

            var payment = new Payment
            {
                PaymentNumber = paymentNumber,
                InvoiceId = invoice.Id,
                PatientId = request.PatientId,
                PaymentDate = DateTime.UtcNow,
                Amount = consultationFee.Value,
                PaymentMethod = PaymentMethod.Cash,
                Status = PaymentStatus.Completed,
                Notes = $"Appointment #{aptNumber} payment"
            };
            _context.Payments.Add(payment);

            // Link appointment to invoice
            appointment.IsBilled = true;
            appointment.InvoiceId = invoice.Id;
            await _context.SaveChangesAsync();
        }

        return Ok(Result<object>.Success(new { id = appointment.Id, appointmentNumber = appointment.AppointmentNumber }));
    }

    private static AppointmentType ParseAppointmentType(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return AppointmentType.NewConsultation;
        return value.Trim().ToLowerInvariant() switch
        {
            "consultation" or "newconsultation" or "1" => AppointmentType.NewConsultation,
            "followup" or "follow_up" or "2" => AppointmentType.FollowUp,
            "procedure" or "3" => AppointmentType.Procedure,
            "emergency" or "4" => AppointmentType.Emergency,
            _ => Enum.TryParse<AppointmentType>(value, true, out var parsed) ? parsed : AppointmentType.NewConsultation
        };
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsEdit)]
    public async Task<IActionResult> UpdateAppointment(Guid id, [FromBody] CreateAppointmentRequest request)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null || appointment.IsDeleted)
            return NotFound(Result.Failure("Appointment not found"));

        appointment.PatientId = request.PatientId;
        appointment.DoctorId = request.DoctorId;
        appointment.AppointmentDate = request.AppointmentDate;
        if (TimeSpan.TryParse(request.StartTime, out var startTime))
            appointment.StartTime = startTime;
        appointment.DurationMinutes = request.DurationMinutes ?? appointment.DurationMinutes;
        if (appointment.EndTime.HasValue && startTime != TimeSpan.Zero)
            appointment.EndTime = startTime.Add(TimeSpan.FromMinutes(appointment.DurationMinutes));
        appointment.Type = ParseAppointmentType(request.AppointmentType);
        appointment.ChiefComplaint = request.ChiefComplaint ?? request.Reason;
        appointment.Notes = request.Notes;
        appointment.ConsultationFee = request.ConsultationFee ?? appointment.ConsultationFee;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Appointment updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsDelete)]
    public async Task<IActionResult> DeleteAppointment(Guid id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null || appointment.IsDeleted)
            return NotFound(Result.Failure("Appointment not found"));

        appointment.IsDeleted = true;
        appointment.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Appointment deleted successfully"));
    }

    [HttpPost("{id:guid}/check-in")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsCheckIn)]
    public async Task<IActionResult> CheckIn(Guid id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null || appointment.IsDeleted)
            return NotFound(Result.Failure("Appointment not found"));

        appointment.Status = AppointmentStatus.CheckedIn;
        appointment.CheckedInAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Patient checked in"));
    }

    [HttpPost("{id:guid}/check-out")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsCheckIn)]
    public async Task<IActionResult> CheckOut(Guid id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null || appointment.IsDeleted)
            return NotFound(Result.Failure("Appointment not found"));

        appointment.Status = AppointmentStatus.Completed;
        appointment.CheckedOutAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Patient checked out"));
    }

    [HttpPost("{id:guid}/cancel")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsCancel)]
    public async Task<IActionResult> CancelAppointment(Guid id, [FromBody] CancelAppointmentRequest? request = null)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null || appointment.IsDeleted)
            return NotFound(Result.Failure("Appointment not found"));

        appointment.Status = AppointmentStatus.Cancelled;
        appointment.CancellationReason = request?.Reason;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Appointment cancelled"));
    }

    [HttpPost("{id:guid}/confirm")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsConfirm)]
    public async Task<IActionResult> ConfirmAppointment(Guid id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null || appointment.IsDeleted)
            return NotFound(Result.Failure("Appointment not found"));

        appointment.Status = AppointmentStatus.Confirmed;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Appointment confirmed"));
    }

    [HttpPost("{id:guid}/status")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsEdit)]
    public async Task<IActionResult> UpdateAppointmentStatus(Guid id, [FromBody] UpdateAppointmentStatusRequest request)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null || appointment.IsDeleted)
            return NotFound(Result.Failure("Appointment not found"));

        if (Enum.TryParse<AppointmentStatus>(request.Status, true, out var newStatus))
        {
            appointment.Status = newStatus;
            if (newStatus == AppointmentStatus.Cancelled)
                appointment.CancellationReason = request.Reason;
            else if (appointment.Status == AppointmentStatus.Cancelled && newStatus != AppointmentStatus.Cancelled)
                appointment.CancellationReason = null;

            await _context.SaveChangesAsync();
            return Ok(Result.Success($"Appointment status updated to {newStatus}"));
        }

        return BadRequest(Result.Failure("Invalid status value"));
    }

    [HttpPost("{id:guid}/restore")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsEdit)]
    public async Task<IActionResult> RestoreAppointment(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        // Soft-deleted rows require IgnoreQueryFilters — re-apply tenant + branch scope manually.
        var query = _context.Appointments
            .IgnoreQueryFilters()
            .Where(a => a.Id == id && a.TenantId == tenantId);

        if (!_tenantService.HasAllLocationAccess())
        {
            var branchId = _tenantService.GetCurrentBranchId();
            if (branchId is null)
                return NotFound(Result.Failure("Appointment not found"));
            query = query.Where(a => a.BranchId == branchId);
        }

        var appointment = await query.FirstOrDefaultAsync();

        if (appointment == null)
            return NotFound(Result.Failure("Appointment not found"));

        if (!appointment.IsDeleted && appointment.Status != AppointmentStatus.Cancelled)
            return BadRequest(Result.Failure("Appointment is not cancelled or deleted"));

        appointment.IsDeleted = false;
        appointment.DeletedAt = null;
        appointment.Status = AppointmentStatus.Scheduled;
        appointment.CancellationReason = null;

        await _context.SaveChangesAsync();

        return Ok(Result.Success("Appointment restored successfully"));
    }

    [HttpGet("{id:guid}/print")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AppointmentsView)]
    public async Task<IActionResult> GetAppointmentForPrint(Guid id)
    {
        var appointment = await _context.Appointments
            .Where(a => a.Id == id && !a.IsDeleted)
            .Select(a => new
            {
                a.Id,
                a.AppointmentNumber,
                PatientName = a.Patient.FirstName + " " + a.Patient.LastName,
                PatientMrn = a.Patient.MRN,
                PatientPhone = a.Patient.Phone,
                PatientEmail = a.Patient.Email,
                PatientAddress = a.Patient.Address,
                PatientDateOfBirth = a.Patient.DateOfBirth,
                PatientGender = a.Patient.Gender,
                DoctorName = _context.Users.Where(u => u.Id == a.DoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                DoctorSpecialization = _context.Users.Where(u => u.Id == a.DoctorId).Select(u => u.Specialization).FirstOrDefault(),
                DoctorPhone = _context.Users.Where(u => u.Id == a.DoctorId).Select(u => u.PhoneNumber).FirstOrDefault(),
                a.AppointmentDate,
                StartTime = a.StartTime.ToString(@"hh\:mm"),
                EndTime = a.EndTime != null ? a.EndTime.Value.ToString(@"hh\:mm") : null,
                Type = a.Type.ToString(),
                Status = a.Status.ToString(),
                a.ChiefComplaint,
                a.Notes,
                a.DurationMinutes,
                a.ConsultationFee,
                a.CreatedAt,
                ClinicName = "ClinIQ Healthcare",
                ClinicAddress = "123 Medical Center Drive",
                ClinicPhone = "+92-21-1234567"
            })
            .FirstOrDefaultAsync();

        if (appointment == null)
            return NotFound(Result.Failure("Appointment not found"));

        return Ok(Result<object>.Success(appointment));
    }
}

public record CreateAppointmentRequest(
    Guid PatientId,
    Guid DoctorId,
    DateTime AppointmentDate,
    string? StartTime,
    int? DurationMinutes,
    string? AppointmentType,
    int? Priority,
    string? ChiefComplaint,
    string? Notes,
    string? Reason,
    decimal? ConsultationFee
);

public record CancelAppointmentRequest(string? Reason);

public record UpdateAppointmentStatusRequest(string Status, string? Reason);
