using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Enums;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Interfaces;

namespace ClinIQ.API.Controllers.v1;    

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class DoctorsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DoctorsController> _logger;
    private readonly ITenantService _tenantService;

    public DoctorsController(ApplicationDbContext context, ILogger<DoctorsController> logger, ITenantService tenantService)
    {
        _context = context;
        _logger = logger;
        _tenantService = tenantService;
    }

    private static TimeSpan? ParseTime(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return null;
        if (TimeSpan.TryParse(input, out var ts)) return ts;
        // accept HH:mm
        if (DateTime.TryParse(input, out var dt)) return dt.TimeOfDay;
        return null;
    }

    private async Task<bool> IsCallerAdminAsync(Guid tenantId, Guid userId)
    {
        var adminRoleName = ClinIQ.Shared.Constants.Roles.OrganizationAdmin.ToUpperInvariant();
        return await _context.UserRoles.IgnoreQueryFilters()
            .AnyAsync(ur => ur.TenantId == tenantId && ur.UserId == userId
                && _context.Roles.IgnoreQueryFilters().Any(r => r.Id == ur.RoleId
                    && r.NormalizedName == adminRoleName && !r.IsDeleted));
    }

    [HttpGet("{id:guid}/schedule")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DoctorsView)]
    public async Task<IActionResult> GetSchedule(Guid id)
    {
        var schedules = await _context.DoctorSchedules
            .Where(s => s.DoctorId == id && !s.IsDeleted)
            .OrderBy(s => s.DayOfWeek)
            .Select(s => new
            {
                s.DayOfWeek,
                startTime = s.StartTime.ToString(@"hh\:mm"),
                endTime = s.EndTime.ToString(@"hh\:mm"),
                s.SlotDuration,
                s.ConsultationFee
            })
            .ToListAsync();

        return Ok(Result<object[]>.Success(schedules.ToArray()));
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DoctorsView)]
    public async Task<IActionResult> GetDoctors(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] Guid? departmentId = null)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var callerUserId = Guid.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var uid) ? uid : Guid.Empty;
        var callerIsOwner = await _context.TenantUsers.IgnoreQueryFilters()
            .AnyAsync(tu => tu.TenantId == tenantId.Value && tu.UserId == callerUserId && tu.IsOwner && tu.IsActive);
        var callerIsAdmin = await IsCallerAdminAsync(tenantId.Value, callerUserId);

        var query = _context.Users
            .Where(u => u.IsActive && !u.IsDeleted && u.Specialization != null);

        var tenantUserIds = _context.TenantUsers
            .Where(tu => tu.TenantId == tenantId.Value && tu.IsActive)
            .Select(tu => tu.UserId);

        var doctorScheduleIds = _context.DoctorSchedules
            .Where(s => s.TenantId == tenantId.Value && !s.IsDeleted)
            .Select(s => s.DoctorId);

        query = query.Where(u => tenantUserIds.Contains(u.Id) || doctorScheduleIds.Contains(u.Id));

        if (!callerIsOwner && !callerIsAdmin)
        {
            query = query.Where(u =>
                !_context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value && tu.IsOwner)
                && !_context.UserRoles.Any(ur => ur.UserId == u.Id && ur.TenantId == tenantId.Value
                    && _context.Roles.IgnoreQueryFilters().Any(r => r.Id == ur.RoleId && !r.IsDeleted
                        && (r.NormalizedName == ClinIQ.Shared.Constants.Roles.OrganizationOwner.ToUpperInvariant()
                            || r.NormalizedName == ClinIQ.Shared.Constants.Roles.OrganizationAdmin.ToUpperInvariant()))));
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(u =>
                u.FirstName.ToLower().Contains(term) ||
                u.LastName.ToLower().Contains(term) ||
                (u.Specialization != null && u.Specialization.ToLower().Contains(term)) ||
                (u.LicenseNumber != null && u.LicenseNumber.ToLower().Contains(term)) ||
                (u.Email != null && u.Email.ToLower().Contains(term)));
        }

        if (departmentId.HasValue)
        {
            query = query.Where(u => u.DepartmentId == departmentId.Value);
        }

        var totalCount = await query.CountAsync();
        var rawItems = await query
            .OrderBy(u => u.FirstName)
            .ThenBy(u => u.LastName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                FullName = (u.FirstName + " " + u.LastName).Trim(),
                u.Email,
                u.PhoneNumber,
                u.Specialization,
                u.LicenseNumber,
                u.Qualification,
                Qualifications = u.Qualification,
                u.Bio,
                u.DepartmentId,
                DepartmentName = _context.Departments.Where(d => d.Id == u.DepartmentId).Select(d => d.Name).FirstOrDefault(),
                Status = u.IsActive ? "Active" : "Inactive"
            })
            .ToListAsync();

        var items = rawItems.Select(u => new
        {
            u.Id,
            u.FirstName,
            u.LastName,
            u.FullName,
            Initials = (((u.FirstName.Length > 0 ? u.FirstName.Substring(0, 1) : "") + (u.LastName.Length > 0 ? u.LastName.Substring(0, 1) : "")).ToUpper()),
            u.Email,
            phone = u.PhoneNumber,
            phoneNumber = u.PhoneNumber,
            u.Specialization,
            u.LicenseNumber,
            u.Qualification,
            u.Qualifications,
            u.Bio,
            u.DepartmentId,
            DepartmentName = u.DepartmentName ?? "General",
            u.Status
        }).ToList();

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
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DoctorsView)]
    public async Task<IActionResult> GetDoctor(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var user = await _context.Users
            .Where(u => u.Id == id && !u.IsDeleted
                && (_context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value)
                    || _context.DoctorSchedules.Any(s => s.DoctorId == u.Id && s.TenantId == tenantId.Value)))
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound(Result.Failure("Doctor not found"));

        decimal? consultationFee = null;
        string? consultationStartTime = null;
        string? consultationEndTime = null;
        int? slotDuration = null;
        var workingDays = new List<string>();

        var schedules = await _context.DoctorSchedules
            .Where(s => s.DoctorId == id && !s.IsDeleted)
            .OrderBy(s => s.DayOfWeek)
            .ToListAsync();

        if (schedules.Count > 0)
        {
            var first = schedules[0];
            consultationFee = first.ConsultationFee;
            consultationStartTime = first.StartTime.ToString(@"hh\:mm");
            consultationEndTime = first.EndTime.ToString(@"hh\:mm");
            slotDuration = first.SlotDuration;

            var dayNames = new[] { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
            foreach (var s in schedules)
            {
                if (s.DayOfWeek >= 0 && s.DayOfWeek < dayNames.Length)
                {
                    workingDays.Add(dayNames[s.DayOfWeek]);
                }
            }
        }

        return Ok(Result<object>.Success(new
        {
            user.Id,
            FullName = (user.FirstName + " " + user.LastName).Trim(),
            user.FirstName,
            user.LastName,
            user.Email,
            user.PhoneNumber,
            Phone = user.PhoneNumber,
            user.Specialization,
            user.LicenseNumber,
            user.Qualification,
            Qualifications = user.Qualification,
            user.Bio,
            user.DepartmentId,
            ConsultationFee = consultationFee ?? 0,
            ConsultationStartTime = consultationStartTime ?? "09:00",
            ConsultationEndTime = consultationEndTime ?? "17:00",
            SlotDuration = slotDuration ?? 30,
            WorkingDays = workingDays.Count > 0 ? workingDays.ToArray() : new[] { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" },
            Status = user.IsActive ? "Active" : "Inactive"
        }));
    }

    [HttpGet("available-slots")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DoctorsView)]
    public async Task<IActionResult> GetAvailableSlots([FromQuery] Guid doctorId, [FromQuery] DateTime date)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var dow = (int)date.DayOfWeek;

        DoctorSchedule? schedule = null;
        try
        {
            schedule = await _context.DoctorSchedules
                .FirstOrDefaultAsync(s => s.DoctorId == doctorId && s.DayOfWeek == dow && !s.IsDeleted);
        }
        catch { }

        var slots = new List<object>();
        TimeSpan startTime;
        TimeSpan endTime;
        int slotDurationMinutes;

        if (schedule != null)
        {
            startTime = schedule.StartTime;
            endTime = schedule.EndTime;
            slotDurationMinutes = schedule.SlotDuration > 0 ? schedule.SlotDuration : 30;
        }
        else
        {
            // No schedule for this day -> doctor is not available, no slots
            return Ok(Result<object[]>.Success(Array.Empty<object>()));
        }

        if (endTime <= startTime || slotDurationMinutes <= 0)
        {
            return BadRequest(Result.Failure("Invalid schedule or slot duration"));
        }

        var existingAppointments = await _context.Appointments
            .Where(a => a.DoctorId == doctorId
                && a.AppointmentDate.Date == date.Date
                && !a.IsDeleted
                && a.Status != AppointmentStatus.Cancelled)
            .Select(a => new
            {
                a.StartTime,
                a.EndTime,
                a.PatientId,
                PatientFirstName = a.Patient.FirstName,
                PatientLastName = a.Patient.LastName,
                a.Status
            })
            .ToListAsync();

        for (var time = startTime; time + TimeSpan.FromMinutes(slotDurationMinutes) <= endTime; time = time.Add(TimeSpan.FromMinutes(slotDurationMinutes)))
        {
            var slotTime = time;
            var matchedAppointment = existingAppointments.FirstOrDefault(a =>
                a.StartTime <= slotTime && a.EndTime.HasValue && slotTime < a.EndTime.Value);
            var isReserved = matchedAppointment != null;

            var slotEnd = time.Add(TimeSpan.FromMinutes(slotDurationMinutes));
            var displayStart = DateTime.Today.Add(time).ToString("h:mm tt");
            var displayEnd = DateTime.Today.Add(slotEnd).ToString("h:mm tt");
            slots.Add(new
            {
                time = time.ToString(@"hh\:mm"),
                startTime = time.ToString(@"hh\:mm"),
                endTime = slotEnd.ToString(@"hh\:mm"),
                displayTime = $"{displayStart} - {displayEnd}",
                available = !isReserved,
                reserved = isReserved,
                patientName = matchedAppointment != null ? matchedAppointment.PatientFirstName + " " + matchedAppointment.PatientLastName : null,
                appointmentStatus = matchedAppointment?.Status,
                consultationFee = schedule.ConsultationFee
            });
        }

        return Ok(Result<object[]>.Success(slots.ToArray()));
    }

    [HttpGet("search")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DoctorsView)]
    public async Task<IActionResult> SearchDoctors([FromQuery] string? term, [FromQuery] int limit = 10)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var doctorUserIds = _context.DoctorSchedules
            .Where(s => s.TenantId == tenantId.Value && !s.IsDeleted)
            .Select(s => s.DoctorId);

        var query = _context.Users
            .Where(u => u.IsActive && !u.IsDeleted && u.Specialization != null
                && (_context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value)
                    || doctorUserIds.Contains(u.Id)));

        if (!string.IsNullOrWhiteSpace(term))
        {
            var t = term.ToLower();
            query = query.Where(u =>
                u.FirstName.ToLower().Contains(t) ||
                u.LastName.ToLower().Contains(t) ||
                (u.Specialization != null && u.Specialization.ToLower().Contains(t)));
        }

        var items = await query
            .OrderBy(u => u.FirstName)
            .Take(limit)
            .Select(u => new
            {
                u.Id,
                FullName = (u.FirstName + " " + u.LastName).Trim(),
                u.Specialization
            })
            .ToListAsync();

        return Ok(Result<object[]>.Success(items.ToArray()));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DoctorsCreate)]
    public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorRequest request)
    {
        try
        {
            var normalizedEmail = request.Email.Trim().ToUpperInvariant();
            if (await _context.Users.IgnoreQueryFilters().AnyAsync(user => user.NormalizedEmail == normalizedEmail && !user.IsDeleted))
                return Conflict(Result.Failure("A doctor with this email already exists."));

            var tenantId = _tenantService.GetCurrentTenantId();
            if (tenantId is null)
                return BadRequest(Result.Failure("Unable to resolve the current organization."));
            var branchId = _tenantService.GetCurrentBranchId();
            if (tenantId.HasValue && !branchId.HasValue)
            {
                branchId = await _context.Branches.IgnoreQueryFilters()
                    .Where(branch => branch.TenantId == tenantId.Value && branch.IsActive && !branch.IsDeleted)
                    .OrderByDescending(branch => branch.IsMainBranch)
                    .Select(branch => (Guid?)branch.Id)
                    .FirstOrDefaultAsync();
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();

            var userCount = await _context.Users.IgnoreQueryFilters().CountAsync(u => u.Specialization != null);
            var user = new ApplicationUser
            {
                Email = request.Email.Trim(),
                NormalizedEmail = normalizedEmail,
                EmailConfirmed = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor@123"),
                FirstName = request.FirstName.Trim(),
                LastName = request.LastName.Trim(),
                PhoneNumber = request.PhoneNumber?.Trim(),
                Specialization = request.Specialization?.Trim(),
                LicenseNumber = request.LicenseNumber?.Trim(),
                Qualification = (request.Qualifications ?? request.Qualification)?.Trim(),
                Bio = request.Bio?.Trim(),
                DepartmentId = request.DepartmentId,
                IsActive = true,
                EmployeeId = $"DOC{(userCount + 1):D3}"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            if (tenantId.HasValue)
            {
                _context.TenantUsers.Add(new TenantUser
                {
                    TenantId = tenantId.Value,
                    UserId = user.Id,
                    IsActive = true,
                    IsOwner = false
                });

                if (branchId.HasValue)
                {
                    _context.BranchUsers.Add(new BranchUser
                    {
                        TenantId = tenantId.Value,
                        BranchId = branchId.Value,
                        UserId = user.Id,
                        IsPrimary = true,
                        IsActive = true
                    });
                }

                // Associate with Doctor Role
                var doctorRole = await _context.Roles.IgnoreQueryFilters()
                    .FirstOrDefaultAsync(r => r.TenantId == tenantId.Value
                        && r.NormalizedName == "DOCTOR"
                        && !r.IsSystemRole
                        && !r.IsDeleted
                        && r.IsActive);
                if (doctorRole != null)
                {
                    _context.UserRoles.Add(new UserRole
                    {
                        TenantId = tenantId.Value,
                        BranchId = branchId,
                        UserId = user.Id,
                        RoleId = doctorRole.Id
                    });
                }
                await _context.SaveChangesAsync();
            }

            // Save schedules
            if (request.WorkingDays != null && request.WorkingDays.Length > 0)
            {
                var schedules = new List<DoctorSchedule>();
                var start = ParseTime(request.ConsultationStartTime) ?? new TimeSpan(9, 0, 0);
                var end = ParseTime(request.ConsultationEndTime) ?? new TimeSpan(17, 0, 0);
                var slotDuration = request.SlotDuration ?? 30;

                foreach (var day in request.WorkingDays)
                {
                    if (Enum.TryParse<DayOfWeek>(day, true, out var dow))
                    {
                        schedules.Add(new DoctorSchedule
                        {
                            DoctorId = user.Id,
                            TenantId = tenantId,
                            BranchId = branchId,
                            DayOfWeek = (int)dow,
                            StartTime = start,
                            EndTime = end,
                            SlotDuration = slotDuration,
                            ConsultationFee = request.ConsultationFee
                        });
                    }
                }

                if (schedules.Count > 0)
                {
                    _context.DoctorSchedules.AddRange(schedules);
                    await _context.SaveChangesAsync();
                }
            }

            await transaction.CommitAsync();
            return Ok(Result<object>.Success(new { id = user.Id, fullName = user.FullName }));
        }
        catch (Exception ex)
        {
            return StatusCode(500, Result.Failure("CreateDoctor failed: " + ex.Message));
        }
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DoctorsEdit)]
    public async Task<IActionResult> UpdateDoctor(Guid id, [FromBody] CreateDoctorRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted
                && (_context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value)
                    || _context.DoctorSchedules.Any(s => s.DoctorId == u.Id && s.TenantId == tenantId.Value)));
        if (user == null || user.IsDeleted)
            return NotFound(Result.Failure("Doctor not found"));

        if (user.IsSuperAdmin)
            return Forbid();

        var membership = await _context.TenantUsers
            .FirstOrDefaultAsync(tu => tu.UserId == id && tu.TenantId == tenantId);
        if (membership != null && membership.IsOwner)
            return Forbid();

        var targetRoleNames = await _context.UserRoles
            .Where(ur => ur.UserId == id && ur.TenantId == tenantId)
            .Join(_context.Roles.IgnoreQueryFilters(), ur => ur.RoleId, r => r.Id, (_, r) => r.NormalizedName)
            .ToListAsync();

        if (targetRoleNames.Contains(ClinIQ.Shared.Constants.Roles.OrganizationAdmin.ToUpperInvariant())
            || targetRoleNames.Contains(ClinIQ.Shared.Constants.Roles.OrganizationOwner.ToUpperInvariant()))
            return Forbid();

        user.FirstName = request.FirstName.Trim();
        user.LastName = request.LastName.Trim();
        user.Email = request.Email.Trim();
        user.NormalizedEmail = request.Email.Trim().ToUpperInvariant();
        user.PhoneNumber = request.PhoneNumber?.Trim();
        user.Specialization = request.Specialization?.Trim();
        user.LicenseNumber = request.LicenseNumber?.Trim();
        user.Qualification = (request.Qualifications ?? request.Qualification)?.Trim();
        user.Bio = request.Bio?.Trim();
        user.DepartmentId = request.DepartmentId;
        user.UpdatedAt = DateTime.UtcNow;

        var branchId = _tenantService.GetCurrentBranchId();

        // Update schedules if provided
        if (request.WorkingDays != null)
        {
            var scheduleRequests = request.WorkingDays
                .Where(day => Enum.TryParse<DayOfWeek>(day, true, out _))
                .Select(day => new DoctorScheduleRequest(
                    (int)Enum.Parse<DayOfWeek>(day, true),
                    request.ConsultationStartTime ?? "09:00",
                    request.ConsultationEndTime ?? "17:00",
                    request.SlotDuration ?? 30,
                    request.ConsultationFee))
                .ToList();

            await UpsertSchedules(id, scheduleRequests, saveImmediately: false);
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Doctor updated successfully"));
    }

    [HttpPut("{id:guid}/schedule")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DoctorsEdit)]
    public async Task<IActionResult> SaveSchedule(Guid id, [FromBody] DoctorScheduleRequest[] schedulesRequest)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted
                && (_context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value)
                    || _context.DoctorSchedules.Any(s => s.DoctorId == u.Id && s.TenantId == tenantId.Value)));
        if (user == null || user.IsDeleted)
            return NotFound(Result.Failure("Doctor not found"));

        await UpsertSchedules(id, schedulesRequest ?? Array.Empty<DoctorScheduleRequest>());

        return Ok(Result.Success("Schedule saved"));
    }

    /// <summary>
    /// Upserts a doctor's schedule rows in place keyed by DayOfWeek so editing
    /// updates existing entries instead of deleting and recreating them.
    /// </summary>
    private async Task UpsertSchedules(Guid doctorId, IReadOnlyCollection<DoctorScheduleRequest> requests, bool saveImmediately = true)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            throw new InvalidOperationException("Unable to resolve the current organization.");
        var branchId = _tenantService.GetCurrentBranchId();

        var existing = await _context.DoctorSchedules.Where(s => s.DoctorId == doctorId && !s.IsDeleted).ToListAsync();
        var requestedDays = requests.Select(r => r.DayOfWeek).Distinct().ToHashSet();

        // De-duplicate days in the incoming payload so the same weekday can
        // never create two rows in a single save call.
        var uniqueRequests = requests
            .GroupBy(r => r.DayOfWeek)
            .Select(g => g.First())
            .ToList();

        foreach (var r in uniqueRequests)
        {
            var match = existing.FirstOrDefault(s => s.DayOfWeek == r.DayOfWeek);
            if (match != null)
            {
                match.StartTime = ParseTime(r.StartTime) ?? match.StartTime;
                match.EndTime = ParseTime(r.EndTime) ?? match.EndTime;
                match.SlotDuration = r.SlotDuration > 0 ? r.SlotDuration : match.SlotDuration;
                match.ConsultationFee = r.ConsultationFee;
                match.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                _context.DoctorSchedules.Add(new DoctorSchedule
                {
                    DoctorId = doctorId,
                    TenantId = tenantId,
                    BranchId = branchId,
                    DayOfWeek = r.DayOfWeek,
                    StartTime = ParseTime(r.StartTime) ?? new TimeSpan(9, 0, 0),
                    EndTime = ParseTime(r.EndTime) ?? new TimeSpan(17, 0, 0),
                    SlotDuration = r.SlotDuration > 0 ? r.SlotDuration : 30,
                    ConsultationFee = r.ConsultationFee
                });
            }
        }

        // Soft-delete days no longer present in the request
        var removedDays = existing.Where(s => !requestedDays.Contains(s.DayOfWeek)).ToList();
        foreach (var s in removedDays)
        {
            s.IsDeleted = true;
            s.DeletedAt = DateTime.UtcNow;
        }

        if (saveImmediately)
            await _context.SaveChangesAsync();
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DoctorsDelete)]
    public async Task<IActionResult> DeleteDoctor(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var user = await _context.Users.FindAsync(id);
        if (user == null || user.IsDeleted)
            return NotFound(Result.Failure("Doctor not found"));

        if (user.IsSuperAdmin)
            return Forbid();

        var membership = await _context.TenantUsers
            .FirstOrDefaultAsync(tu => tu.UserId == id && tu.TenantId == tenantId);
        if (membership != null && membership.IsOwner)
            return Forbid();

        var targetRoleNames = await _context.UserRoles
            .Where(ur => ur.UserId == id && ur.TenantId == tenantId)
            .Join(_context.Roles.IgnoreQueryFilters(), ur => ur.RoleId, r => r.Id, (_, r) => r.NormalizedName)
            .ToListAsync();

        if (targetRoleNames.Contains(ClinIQ.Shared.Constants.Roles.OrganizationAdmin.ToUpperInvariant())
            || targetRoleNames.Contains(ClinIQ.Shared.Constants.Roles.OrganizationOwner.ToUpperInvariant()))
            return Forbid();

        user.IsDeleted = true;
        user.IsActive = false;
        user.DeletedAt = DateTime.UtcNow;

        var schedules = await _context.DoctorSchedules
            .Where(s => s.DoctorId == id && s.TenantId == tenantId && !s.IsDeleted)
            .ToListAsync();
        foreach (var s in schedules)
        {
            s.IsDeleted = true;
            s.DeletedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Doctor deleted successfully"));
    }
}

public record CreateDoctorRequest(
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber,
    string Specialization,
    string? LicenseNumber,
    string? Qualifications,
    string? Qualification,
    string? Bio,
    Guid? DepartmentId,
    string? ConsultationStartTime, 
    string? ConsultationEndTime,
    int? SlotDuration,
    decimal? ConsultationFee,
    string[]? WorkingDays
);

public record DoctorScheduleRequest(
    int DayOfWeek,
    string StartTime,
    string EndTime,
    int SlotDuration,
    decimal? ConsultationFee
);

