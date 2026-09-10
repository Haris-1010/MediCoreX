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
public class IpdController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public IpdController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetStats()
    {
        var totalAdmitted = await _context.Admissions.CountAsync(a => !a.IsDeleted && a.Status == AdmissionStatus.Admitted);
        var totalBeds = await _context.Beds.CountAsync(b => !b.IsDeleted);
        var occupiedBeds = await _context.Beds.CountAsync(b => !b.IsDeleted && b.Status == BedStatus.Occupied);
        var todayDischarges = await _context.Admissions.CountAsync(a => !a.IsDeleted && a.DischargeDate.HasValue && a.DischargeDate.Value.Date == DateTime.UtcNow.Date);
        var todayAdmissions = await _context.Admissions.CountAsync(a => !a.IsDeleted && a.AdmissionDate.Date == DateTime.UtcNow.Date);

        return Ok(Result<object>.Success(new
        {
            totalAdmitted,
            totalBeds,
            occupiedBeds,
            availableBeds = totalBeds - occupiedBeds,
            occupancyRate = totalBeds > 0 ? Math.Round((double)occupiedBeds / totalBeds * 100, 1) : 0,
            todayAdmissions,
            todayDischarges
        }));
    }

    [HttpGet("wards/overview")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetWardsOverview()
    {
        var wards = await _context.Wards
            .Where(w => !w.IsDeleted && w.IsActive)
            .OrderBy(w => w.DisplayOrder)
            .Select(w => new
            {
                w.Id,
                w.Name,
                w.Code,
                WardType = w.WardType.ToString(),
                TotalBeds = w.Rooms.SelectMany(r => r.Beds).Count(b => !b.IsDeleted),
                OccupiedBeds = w.Rooms.SelectMany(r => r.Beds).Count(b => !b.IsDeleted && b.Status == BedStatus.Occupied),
                AvailableBeds = w.Rooms.SelectMany(r => r.Beds).Count(b => !b.IsDeleted && b.Status == BedStatus.Available),
                RoomCount = w.Rooms.Count(r => !r.IsDeleted)
            })
            .ToListAsync();

        return Ok(Result<object>.Success(wards));
    }

    [HttpGet("admissions/recent")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetRecentAdmissions()
    {
        var admissions = await _context.Admissions
            .Where(a => !a.IsDeleted)
            .OrderByDescending(a => a.AdmissionDate)
            .Take(10)
            .Select(a => new
            {
                a.Id,
                a.AdmissionNumber,
                PatientName = a.Patient.FirstName + " " + a.Patient.LastName,
                a.PatientId,
                DoctorName = _context.Users.Where(u => u.Id == a.AttendingDoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                a.AdmissionDate,
                Type = a.AdmissionType.ToString(),
                Status = a.Status.ToString(),
                Ward = _context.Wards.Where(w => w.Id == a.CurrentWardId).Select(w => w.Name).FirstOrDefault(),
                Bed = _context.Beds.Where(b => b.Id == a.CurrentBedId).Select(b => b.BedNumber).FirstOrDefault()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(admissions));
    }

    [HttpGet("admitted-patients")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.AdmissionsView)]
    public async Task<IActionResult> GetAdmittedPatients()
    {
        var patients = await _context.Admissions
            .Where(a => !a.IsDeleted && a.Status == AdmissionStatus.Admitted)
            .OrderByDescending(a => a.AdmissionDate)
            .Select(a => new
            {
                a.Id,
                a.AdmissionNumber,
                PatientName = a.Patient.FirstName + " " + a.Patient.LastName,
                a.PatientId,
                DoctorName = _context.Users.Where(u => u.Id == a.AttendingDoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                DoctorId = a.AttendingDoctorId,
                a.AdmissionDate,
                Ward = _context.Wards.Where(w => w.Id == a.CurrentWardId).Select(w => w.Name).FirstOrDefault(),
                WardId = a.CurrentWardId,
                Bed = _context.Beds.Where(b => b.Id == a.CurrentBedId).Select(b => b.BedNumber).FirstOrDefault(),
                BedId = a.CurrentBedId,
                a.AdmissionReason
            })
            .ToListAsync();

        return Ok(Result<object>.Success(patients));
    }
}
