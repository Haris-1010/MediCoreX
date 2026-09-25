using System.Globalization;
using System.Text;
using System.Text.Json;
using ClinIQ.Domain.Common;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Constants;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

/// <summary>
/// Reporting module read API.
///
/// Security model (backend is the authority):
///   - every query is tenant-scoped; a non "All Locations" caller is pinned to
///     their current location so a forged locationId can only narrow, never
///     widen, the result set,
///   - financial reports additionally require ReportsFinancial, the
///     audit-activity report requires AuditView, exports require ReportsExport,
///   - report views/exports are themselves audited (REPORT_GENERATED /
///     REPORT_EXPORTED) with filter metadata only — no row data.
///
/// Every report returns one unified shape (summary cards, series for charts,
/// column definitions and paged rows) so the Angular viewer is generic.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public partial class ReportsController : ControllerBase
{
    private const int MaxExportRows = 50000;
    private const int MaxPageSize = 200;

    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAuditService _auditService;

    /// <summary>Canonical report registry: display name + extra permission flags.</summary>
    private static readonly Dictionary<string, (string Name, bool Financial, bool Audit)> ReportDefs =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["patients"] = ("Patient Report", false, false),
            ["appointments"] = ("Appointment Report", false, false),
            ["opd"] = ("OPD Report", false, false),
            ["ipd"] = ("IPD Report", false, false),
            ["beds"] = ("Bed Occupancy Report", false, false),
            ["laboratory"] = ("Laboratory Report", false, false),
            ["radiology"] = ("Radiology Report", false, false),
            ["pharmacy"] = ("Pharmacy / Prescriptions Report", false, false),
            ["inventory"] = ("Inventory / Stock Report", false, false),
            ["suppliers"] = ("Supplier Report", false, false),
            ["billing"] = ("Billing Report", true, false),
            ["management"] = ("Management Overview", true, false),
            ["audit-activity"] = ("Audit Activity Report", false, true),
            // Legacy report ids kept working — they resolve to canonical keys.
            ["patient-registration"] = ("Patient Report", false, false),
            ["patient-demographics"] = ("Patient Report", false, false),
            ["revenue"] = ("Billing Report", true, false),
            ["payments"] = ("Billing Report", true, false),
            ["stock-summary"] = ("Inventory / Stock Report", false, false),
            ["low-stock"] = ("Inventory / Stock Report", false, false),
        };

    public ReportsController(
        ApplicationDbContext context,
        ITenantService tenantService,
        ICurrentUserService currentUserService,
        IAuditService auditService)
    {
        _context = context;
        _tenantService = tenantService;
        _currentUserService = currentUserService;
        _auditService = auditService;
    }

    // ------------------------------------------------------------------
    // Catalog
    // ------------------------------------------------------------------

    [HttpGet]
    [RequirePermission(Permissions.ReportsView)]
    public IActionResult GetReports()
    {
        var categories = new object[]
        {
            new
            {
                id = "patient",
                name = "Patient Reports",
                icon = "people",
                reports = new object[]
                {
                    New("patients", "Patient Report", "Registrations, demographics and trends"),
                    New("appointments", "Appointment Report", "Appointments by status, doctor and date"),
                }
            },
            new
            {
                id = "clinical",
                name = "Clinical Reports",
                icon = "medical_services",
                reports = new object[]
                {
                    New("opd", "OPD Report", "Outpatient visits, completion and billing status"),
                    New("ipd", "IPD Report", "Admissions, discharges and outcomes"),
                    New("beds", "Bed Occupancy Report", "Bed status, occupancy and ward capacity"),
                    New("laboratory", "Laboratory Report", "Lab orders, completion and verification"),
                    New("radiology", "Radiology Report", "Imaging orders and report status"),
                    New("pharmacy", "Pharmacy / Prescriptions Report", "Prescriptions issued and dispensed"),
                }
            },
            new
            {
                id = "financial",
                name = "Financial Reports",
                icon = "account_balance",
                financial = true,
                reports = new object[]
                {
                    New("billing", "Billing Report", "Invoices, collections and outstanding dues", financial: true),
                    New("management", "Management Overview", "Cross-department KPIs and revenue trends", financial: true),
                }
            },
            new
            {
                id = "inventory",
                name = "Inventory Reports",
                icon = "inventory_2",
                reports = new object[]
                {
                    New("inventory", "Inventory / Stock Report", "Stock levels, valuation and low-stock alerts"),
                    New("suppliers", "Supplier Report", "Suppliers, terms and payables"),
                }
            },
            new
            {
                id = "audit",
                name = "Administration Reports",
                icon = "history",
                reports = new object[]
                {
                    New("audit-activity", "Audit Activity Report", "System activity by user, module and action", audit: true),
                }
            },
        };

        return Ok(Result<object[]>.Success(categories));

        static object New(string id, string name, string description, bool financial = false, bool audit = false) =>
            new { id, name, description, financial, audit, available = true };
    }

    // ------------------------------------------------------------------
    // Report data (unified shape)
    // ------------------------------------------------------------------

    [HttpGet("{reportId}")]
    [RequirePermission(Permissions.ReportsView)]
    public async Task<IActionResult> GetReportData(
        string reportId,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] Guid? locationId = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        if (!TryResolve(reportId, out var key, out var denied))
            return NotFound(Result.Failure("Report not found.", "NOT_FOUND"));
        if (denied is not null)
            return denied;

        var (tenantId, branchId, scopeError) = ResolveScope(locationId);
        if (tenantId is null)
            return StatusCode(
       StatusCodes.Status403Forbidden,
       Result.Failure(scopeError ?? "Unable to resolve location scope.", "FORBIDDEN"));

        var (start, end) = ResolvePeriod(startDate, endDate);
        pageNumber = Math.Max(1, pageNumber);
        pageSize = Math.Clamp(pageSize, 1, MaxPageSize);

        var payload = await BuildReportAsync(key!, tenantId.Value, branchId, start, end, pageNumber, pageSize, cancellationToken);
        payload.LocationId = branchId;
        payload.LocationName = await ResolveLocationNameAsync(branchId, cancellationToken);

        if (pageNumber == 1)
            await AuditReportGeneratedAsync(key!, payload, cancellationToken);

        return Ok(Result<object>.Success(BuildResponse(payload)));
    }

    // ------------------------------------------------------------------
    // CSV export — same scope/permission rules as the view, capped, audited
    // ------------------------------------------------------------------

    [HttpGet("{reportId}/export")]
    [RequirePermission(Permissions.ReportsView, Permissions.ReportsExport)]
    public async Task<IActionResult> ExportReport(
        string reportId,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] Guid? locationId = null,
        CancellationToken cancellationToken = default)
    {
        if (!TryResolve(reportId, out var key, out var denied))
            return NotFound(Result.Failure("Report not found.", "NOT_FOUND"));
        if (denied is not null)
            return denied;

        var (tenantId, branchId, scopeError) = ResolveScope(locationId);
        if (tenantId is null)
            return StatusCode(
        StatusCodes.Status403Forbidden,
        Result.Failure(scopeError ?? "Unable to resolve location scope.", "FORBIDDEN"));

        var (start, end) = ResolvePeriod(startDate, endDate);

        var payload = await BuildReportAsync(key!, tenantId.Value, branchId, start, end, 1, MaxExportRows, cancellationToken);

        var csv = new StringBuilder();
        csv.AppendLine(string.Join(",", payload.Columns.Select(c => Csv(c.Label))));
        foreach (var row in payload.Rows)
        {
            csv.AppendLine(string.Join(",", payload.Columns.Select(c =>
                Csv(ToDisplay(row.TryGetValue(c.Key, out var value) ? value : null)))));
        }

        await _auditService.LogAsync(new AuditEvent
        {
            Action = "REPORT_EXPORTED",
            Module = "Reports",
            EntityName = ReportDefs[key!].Name,
            EntityId = key,
            Description = $"{ReportDefs[key!].Name} exported ({payload.Rows.Count} rows)",
            BranchSpecified = true,
            BranchId = branchId,
            Success = true,
            AdditionalData = JsonSerializer.Serialize(new
            {
                reportKey = key,
                startDate = start,
                endDate = end,
                locationId = branchId,
                rowCount = payload.Rows.Count,
            }),
        }, cancellationToken);

        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csv.ToString())).ToArray();
        return File(bytes, "text/csv", $"{key}-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv");
    }

    // ------------------------------------------------------------------
    // Security + period helpers
    // ------------------------------------------------------------------

    /// <summary>Maps a (possibly legacy) report id to a canonical key and enforces per-report permissions.</summary>
    private bool TryResolve(string reportId, out string? key, out IActionResult? denied)
    {
        denied = null;

        key = reportId?.Trim().ToLowerInvariant() switch
        {
            "patient-registration" or "patient-demographics" => "patients",
            "revenue" or "payments" => "billing",
            "stock-summary" or "low-stock" => "inventory",
            var k when k is not null && ReportDefs.ContainsKey(k) && CanonicalKeys.Contains(k) => k,
            _ => null,
        };

        if (key is null)
            return false;

        if (ReportDefs[key].Financial && !_currentUserService.HasPermission(Permissions.ReportsFinancial))
        {
            denied = StatusCode(StatusCodes.Status403Forbidden,
                Result.Failure("You do not have permission to view financial reports.", "FORBIDDEN"));
            return true;
        }

        if (ReportDefs[key].Audit && !_currentUserService.HasPermission(Permissions.AuditView))
        {
            denied = StatusCode(StatusCodes.Status403Forbidden,
                Result.Failure("You do not have permission to view audit activity.", "FORBIDDEN"));
            return true;
        }

        return true;
    }

    private static readonly HashSet<string> CanonicalKeys = new(StringComparer.OrdinalIgnoreCase)
    {
        "patients", "appointments", "opd", "ipd", "beds", "laboratory", "radiology",
        "pharmacy", "inventory", "suppliers", "billing", "management", "audit-activity",
    };

    /// <summary>
    /// Tenant + location authorization. Returns (null, null, error) when the
    /// caller may not run the query. Non-"All Locations" callers are pinned to
    /// their current location; "All Locations" callers may pick any real,
    /// non-deleted branch of their own tenant.
    /// </summary>
    private (Guid? TenantId, Guid? BranchId, string? Error) ResolveScope(Guid? requestedLocationId)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return (null, null, "No organization context.");

        if (_tenantService.HasAllLocationAccess())
        {
            if (requestedLocationId.HasValue)
            {
                var belongsToTenant = _context.Branches
                    .IgnoreQueryFilters()
                    .Any(b => b.Id == requestedLocationId.Value
                              && b.TenantId == tenantId
                              && !b.IsDeleted);

                if (!belongsToTenant)
                    return (null, null, "You do not have access to this location.");

                return (tenantId, requestedLocationId, null);
            }

            return (tenantId, null, null);
        }

        var currentBranchId = _tenantService.GetCurrentBranchId();
        if (currentBranchId is null)
            return (null, null, "No location context.");

        if (requestedLocationId.HasValue && requestedLocationId.Value != currentBranchId.Value)
            return (null, null, "You do not have access to this location.");

        return (tenantId, currentBranchId, null);
    }

    private static (DateTime Start, DateTime End) ResolvePeriod(DateTime? startDate, DateTime? endDate)
    {
        var start = (startDate ?? DateTime.UtcNow.Date.AddDays(-30)).Date;
        var endExclusive = (endDate ?? DateTime.UtcNow.Date).Date.AddDays(1);
        if (endExclusive <= start)
            endExclusive = start.AddDays(1);
        return (start, endExclusive);
    }

    private async Task<string> ResolveLocationNameAsync(Guid? branchId, CancellationToken cancellationToken)
    {
        if (!branchId.HasValue)
            return "All Locations";

        var name = await _context.Branches
            .IgnoreQueryFilters()
            .Where(b => b.Id == branchId.Value)
            .Select(b => b.Name)
            .FirstOrDefaultAsync(cancellationToken);

        return name ?? "Unknown Location";
    }

    private async Task AuditReportGeneratedAsync(string key, ReportPayload payload, CancellationToken cancellationToken)
    {
        await _auditService.LogAsync(new AuditEvent
        {
            Action = "REPORT_GENERATED",
            Module = "Reports",
            EntityName = ReportDefs[key].Name,
            EntityId = key,
            Description = $"{ReportDefs[key].Name} generated",
            BranchSpecified = true,
            BranchId = payload.LocationId,
            Success = true,
            AdditionalData = JsonSerializer.Serialize(new
            {
                reportKey = key,
                startDate = payload.Start,
                endDate = payload.End,
                locationId = payload.LocationId,
            }),
        }, cancellationToken);
    }

    private static object BuildResponse(ReportPayload payload) => new
    {
        reportKey = payload.ReportKey,
        reportName = payload.ReportName,
        locationScope = new { locationId = payload.LocationId, name = payload.LocationName },
        period = new { start = payload.Start, end = payload.End },
        summary = payload.Summary,
        series = payload.Series,
        columns = payload.Columns,
        rows = payload.Rows,
        pageNumber = payload.PageNumber,
        pageSize = payload.PageSize,
        totalCount = payload.TotalCount,
    };

    // ------------------------------------------------------------------
    // Shared value helpers
    // ------------------------------------------------------------------

    private static string ToDisplay(object? value) => value switch
    {
        null => string.Empty,
        bool b => b ? "Yes" : "No",
        DateTime dt => dt.TimeOfDay == TimeSpan.Zero ? dt.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) : dt.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture),
        decimal d => d.ToString(CultureInfo.InvariantCulture),
        double d => d.ToString(CultureInfo.InvariantCulture),
        float f => f.ToString(CultureInfo.InvariantCulture),
        _ => Convert.ToString(value, CultureInfo.InvariantCulture) ?? string.Empty,
    };

    private static string Csv(string? value)
    {
        value ??= string.Empty;
        if (value.Contains('"') || value.Contains(',') || value.Contains('\n') || value.Contains('\r'))
            return "\"" + value.Replace("\"", "\"\"") + "\"";
        return value;
    }
}
