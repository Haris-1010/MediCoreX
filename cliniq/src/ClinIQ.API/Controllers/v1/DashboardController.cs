using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DashboardView)]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.Today;
        var tomorrow = today.AddDays(1);
        var totalPatients = await _context.Patients.CountAsync(p => !p.IsDeleted);
        var todayAppointments = await _context.Appointments.CountAsync(a => !a.IsDeleted && a.AppointmentDate >= today && a.AppointmentDate < tomorrow);
        var activeAdmissions = await _context.Admissions.CountAsync(a => !a.IsDeleted && a.Status == Domain.Enums.AdmissionStatus.Admitted);
        var todayRevenue = await _context.Invoices
            .Where(i => !i.IsDeleted && i.InvoiceDate.Date == DateTime.Today && i.Status == Domain.Enums.InvoiceStatus.Paid)
            .SumAsync(i => i.TotalAmount);

        var amountReceivables = await _context.Invoices
            .Where(i => !i.IsDeleted && i.Status != Domain.Enums.InvoiceStatus.Paid && i.Status != Domain.Enums.InvoiceStatus.Cancelled && i.Status != Domain.Enums.InvoiceStatus.Refunded && i.Status != Domain.Enums.InvoiceStatus.WrittenOff)
            .SumAsync(i => i.TotalAmount - i.PaidAmount);

        return Ok(Result<object>.Success(new
        {
            totalPatients,
            todayAppointments,
            activeAdmissions,
            todayRevenue,
            amountReceivables,
            patientGrowth = 0.0,
            appointmentGrowth = 0.0,
            admissionGrowth = 0.0,
            revenueGrowth = 0.0,
            pendingLabResults = 0,
            bedOccupancy = 0.0
        }));
    }

    [HttpGet("today-appointments")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DashboardView)]
    public async Task<IActionResult> GetTodayAppointments()
    {
        var today = DateTime.Today;
        var tomorrow = today.AddDays(1);
        var appointments = await _context.Appointments
            .Where(a => !a.IsDeleted && a.AppointmentDate >= today && a.AppointmentDate < tomorrow)
            .OrderBy(a => a.StartTime)
            .Select(a => new
            {
                a.Id,
                PatientName = a.Patient.FirstName + " " + a.Patient.LastName,
                DoctorName = _context.Users.Where(u => u.Id == a.DoctorId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                a.StartTime,
                a.Status,
                a.Type
            })
            .ToListAsync();

        var result = appointments.Select(a => new
        {
            a.Id,
            a.PatientName,
            a.DoctorName,
            Time = a.StartTime.ToString(@"hh\:mm tt"),
            Status = a.Status.ToString(),
            Type = a.Type.ToString()
        }).ToArray();

        return Ok(Result<object[]>.Success(result));
    }

    [HttpGet("new-patients")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsView)]
    public async Task<IActionResult> GetNewPatients()
    {
        var patients = await _context.Patients
            .Where(patient => !patient.IsDeleted)
            .OrderByDescending(patient => patient.CreatedAt)
            .Take(5)
            .Select(patient => new
            {
                patient.Id,
                Name = patient.FirstName + " " + patient.LastName,
                patient.Phone,
                Date = patient.CreatedAt
            })
            .ToArrayAsync();

        return Ok(Result<object[]>.Success(patients));
    }

    [HttpGet("patient-growth")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsView)]
    public async Task<IActionResult> GetPatientGrowth()
    {
        var firstMonth = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1).AddMonths(-11);
        var patients = await _context.Patients
            .Where(patient => !patient.IsDeleted && patient.CreatedAt >= firstMonth)
            .Select(patient => patient.CreatedAt)
            .ToListAsync();

        var result = Enumerable.Range(0, 12)
            .Select(offset => firstMonth.AddMonths(offset))
            .Select(month => new
            {
                Month = month.ToString("MMM", CultureInfo.InvariantCulture),
                Patients = patients.Count(createdAt => createdAt.Year == month.Year && createdAt.Month == month.Month)
            })
            .ToArray();

        return Ok(Result<object[]>.Success(result));
    }

    [HttpGet("inventory-overview")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryView)]
    public async Task<IActionResult> GetInventoryOverview()
    {
        var today = DateTime.Today;
        var warningDate = today.AddDays(30);
        var totalProduct = await _context.Items.CountAsync(item => !item.IsDeleted && item.IsActive);
        var expiryProduct = await _context.StockBatches.CountAsync(batch => batch.IsActive && batch.ExpiryDate.HasValue && batch.ExpiryDate < today);
        var nearToExpire = await _context.StockBatches.CountAsync(batch => batch.IsActive && batch.ExpiryDate >= today && batch.ExpiryDate <= warningDate);
        var nearToFinish = await _context.Items.CountAsync(item => !item.IsDeleted && item.IsActive && item.CurrentStock <= item.ReorderLevel);

        return Ok(Result<object>.Success(new { totalProduct, expiryProduct, nearToExpire, nearToFinish }));
    }

    [HttpGet("queue")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DashboardView)]
    public IActionResult GetQueue()
    {
        return Ok(Result<object[]>.Success(Array.Empty<object>()));
    }

    [HttpGet("revenue")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DashboardView)]
    public IActionResult GetRevenue([FromQuery] string period = "daily")
    {
        return Ok(Result<object[]>.Success(Array.Empty<object>()));
    }

    [HttpGet("bed-stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DashboardView)]
    public async Task<IActionResult> GetBedStats()
    {
        var wards = await _context.Wards
            .Where(w => !w.IsDeleted && w.IsActive)
            .OrderBy(w => w.DisplayOrder)
            .ToListAsync();

        var result = new List<object>();

        foreach (var ward in wards)
        {
            var roomIds = await _context.Rooms
                .Where(r => r.WardId == ward.Id && !r.IsDeleted)
                .Select(r => r.Id)
                .ToListAsync();

            var total = 0;
            var occupied = 0;
            var available = 0;
            var maintenance = 0;

            foreach (var rid in roomIds)
            {
                total += await _context.Beds.CountAsync(b => b.RoomId == rid && !b.IsDeleted);
                occupied += await _context.Beds.CountAsync(b => b.RoomId == rid && !b.IsDeleted && b.Status == Domain.Enums.BedStatus.Occupied);
                available += await _context.Beds.CountAsync(b => b.RoomId == rid && !b.IsDeleted && b.Status == Domain.Enums.BedStatus.Available);
                maintenance += await _context.Beds.CountAsync(b => b.RoomId == rid && !b.IsDeleted && b.Status == Domain.Enums.BedStatus.Maintenance);
            }

            result.Add(new
            {
                ward = ward.Name,
                total,
                occupied,
                available,
                maintenance
            });
        }

        return Ok(Result<object[]>.Success(result.ToArray()));
    }
}
