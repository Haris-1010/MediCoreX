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
public class ReportsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReportsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.ReportsView)]
    public IActionResult GetReports()
    {
        var today = DateTime.UtcNow.Date;
        var monthStart = new DateTime(today.Year, today.Month, 1);

        var categories = new object[]
        {
            new
            {
                id = "patient",
                name = "Patient Reports",
                icon = "people",
                reports = new object[]
                {
                    new { id = "patient-registration", name = "Patient Registration Summary", description = "Daily/Monthly patient registration count", available = true },
                    new { id = "patient-demographics", name = "Patient Demographics", description = "Age/Gender/Location distribution", available = true }
                }
            },
            new
            {
                id = "financial",
                name = "Financial Reports",
                icon = "account_balance",
                reports = new object[]
                {
                    new { id = "revenue", name = "Revenue Report", description = "Total revenue by period", available = true },
                    new { id = "payments", name = "Payment Summary", description = "Payments received and outstanding", available = true }
                }
            },
            new
            {
                id = "clinical",
                name = "Clinical Reports",
                icon = "medical_services",
                reports = new object[]
                {
                    new { id = "appointments", name = "Appointment Report", description = "Appointments by status and doctor", available = true },
                    new { id = "ipd", name = "IPD Report", description = "Admissions, discharges, occupancy", available = true }
                }
            },
            new
            {
                id = "inventory",
                name = "Inventory Reports",
                icon = "inventory_2",
                reports = new object[]
                {
                    new { id = "stock-summary", name = "Stock Summary", description = "Current stock levels and value", available = true },
                    new { id = "low-stock", name = "Low Stock Alert", description = "Items below reorder level", available = true }
                }
            }
        };

        return Ok(Result<object[]>.Success(categories));
    }

    [HttpGet("{reportId}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.ReportsView)]
    public async Task<IActionResult> GetReportData(string reportId, [FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
    {
        var start = startDate ?? DateTime.UtcNow.Date.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow.Date.AddDays(1);

        object data = reportId switch
        {
            "patient-registration" => await GetPatientRegistrationReport(start, end),
            "patient-demographics" => await GetPatientDemographicsReport(),
            "revenue" => await GetRevenueReport(start, end),
            "payments" => await GetPaymentsReport(start, end),
            "appointments" => await GetAppointmentReport(start, end),
            "ipd" => await GetIpdReport(start, end),
            "stock-summary" => await GetStockSummaryReport(),
            "low-stock" => await GetLowStockReport(),
            _ => new { message = "Report not found" }
        };

        return Ok(Result<object>.Success(data));
    }

    private async Task<object> GetPatientRegistrationReport(DateTime start, DateTime end)
    {
        var dailyRegistrations = await _context.Patients
            .Where(p => !p.IsDeleted && p.CreatedAt >= start && p.CreatedAt < end)
            .GroupBy(p => p.CreatedAt.Date)
            .Select(g => new { date = g.Key, count = g.Count() })
            .OrderBy(x => x.date)
            .ToListAsync();

        var totalPatients = await _context.Patients.CountAsync(p => !p.IsDeleted);
        var periodPatients = await _context.Patients.CountAsync(p => !p.IsDeleted && p.CreatedAt >= start && p.CreatedAt < end);

        return new
        {
            reportName = "Patient Registration Summary",
            period = new { start, end },
            totalPatients,
            periodPatients,
            dailyRegistrations = dailyRegistrations.Select(d => new { date = d.date.ToString("yyyy-MM-dd"), d.count })
        };
    }

    private async Task<object> GetPatientDemographicsReport()
    {
        var genderDistribution = await _context.Patients
            .Where(p => !p.IsDeleted)
            .GroupBy(p => p.Gender)
            .Select(g => new { gender = g.Key.ToString(), count = g.Count() })
            .ToListAsync();

        var bloodGroupDistribution = await _context.Patients
            .Where(p => !p.IsDeleted && p.BloodGroup != null)
            .GroupBy(p => p.BloodGroup)
            .Select(g => new { bloodGroup = g.Key.ToString(), count = g.Count() })
            .ToListAsync();

        var totalPatients = await _context.Patients.CountAsync(p => !p.IsDeleted);

        return new
        {
            reportName = "Patient Demographics",
            totalPatients,
            genderDistribution,
            bloodGroupDistribution
        };
    }

    private async Task<object> GetRevenueReport(DateTime start, DateTime end)
    {
        var dailyRevenue = await _context.Invoices
            .Where(i => !i.IsDeleted && i.CreatedAt >= start && i.CreatedAt < end)
            .GroupBy(i => i.CreatedAt.Date)
            .Select(g => new { date = g.Key, total = g.Sum(i => i.TotalAmount) })
            .OrderBy(x => x.date)
            .ToListAsync();

        var totalRevenue = dailyRevenue.Sum(d => d.total);
        var invoiceCount = await _context.Invoices.CountAsync(i => !i.IsDeleted && i.CreatedAt >= start && i.CreatedAt < end);

        return new
        {
            reportName = "Revenue Report",
            period = new { start, end },
            totalRevenue,
            invoiceCount,
            dailyRevenue = dailyRevenue.Select(d => new { date = d.date.ToString("yyyy-MM-dd"), d.total })
        };
    }

    private async Task<object> GetPaymentsReport(DateTime start, DateTime end)
    {
        var payments = await _context.Payments
            .Where(p => !p.IsDeleted && p.CreatedAt >= start && p.CreatedAt < end)
            .GroupBy(p => p.PaymentMethod)
            .Select(g => new { method = g.Key.ToString(), total = g.Sum(p => p.Amount), count = g.Count() })
            .ToListAsync();

        var totalPaid = payments.Sum(p => p.total);

        return new
        {
            reportName = "Payment Summary",
            period = new { start, end },
            totalPaid,
            payments
        };
    }

    private async Task<object> GetAppointmentReport(DateTime start, DateTime end)
    {
        var statusDistribution = await _context.Appointments
            .Where(a => !a.IsDeleted && a.AppointmentDate >= start && a.AppointmentDate < end)
            .GroupBy(a => a.Status)
            .Select(g => new { status = g.Key.ToString(), count = g.Count() })
            .ToListAsync();

        var totalAppointments = await _context.Appointments.CountAsync(a => !a.IsDeleted && a.AppointmentDate >= start && a.AppointmentDate < end);

        return new
        {
            reportName = "Appointment Report",
            period = new { start, end },
            totalAppointments,
            statusDistribution
        };
    }

    private async Task<object> GetIpdReport(DateTime start, DateTime end)
    {
        var admissions = await _context.Admissions
            .CountAsync(a => !a.IsDeleted && a.AdmissionDate >= start && a.AdmissionDate < end);

        var discharges = await _context.Admissions
            .CountAsync(a => !a.IsDeleted && a.DischargeDate >= start && a.DischargeDate < end);

        var totalBeds = await _context.Beds.CountAsync(b => !b.IsDeleted);
        var occupiedBeds = await _context.Beds.CountAsync(b => !b.IsDeleted && b.Status == Domain.Enums.BedStatus.Occupied);

        return new
        {
            reportName = "IPD Report",
            period = new { start, end },
            admissions,
            discharges,
            totalBeds,
            occupiedBeds,
            occupancyRate = totalBeds > 0 ? Math.Round((double)occupiedBeds / totalBeds * 100, 1) : 0
        };
    }

    private async Task<object> GetStockSummaryReport()
    {
        var totalItems = await _context.Items.CountAsync(i => !i.IsDeleted && i.IsActive);
        var totalValue = await _context.Items
            .Where(i => !i.IsDeleted && i.IsActive)
            .SumAsync(i => i.CurrentStock * i.PurchasePrice);

        var categoryWise = await _context.Items
            .Where(i => !i.IsDeleted && i.IsActive)
            .GroupBy(i => i.Category != null ? i.Category.Name : "Uncategorized")
            .Select(g => new { category = g.Key, count = g.Count(), value = g.Sum(i => i.CurrentStock * i.PurchasePrice) })
            .ToListAsync();

        return new
        {
            reportName = "Stock Summary",
            totalItems,
            totalValue,
            categoryWise
        };
    }

    private async Task<object> GetLowStockReport()
    {
        var items = await _context.Items
            .Where(i => !i.IsDeleted && i.IsActive && i.CurrentStock <= i.ReorderLevel)
            .Select(i => new
            {
                i.Id,
                i.Name,
                i.Code,
                i.CurrentStock,
                i.ReorderLevel,
                CategoryName = i.Category != null ? i.Category.Name : null,
                StockStatus = i.CurrentStock <= 0 ? "OutOfStock" : "LowStock"
            })
            .OrderBy(i => i.CurrentStock)
            .ToListAsync();

        return new
        {
            reportName = "Low Stock Alert",
            totalItems = items.Count,
            items
        };
    }
}
