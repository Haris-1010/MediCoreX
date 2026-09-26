using System.Globalization;
using System.Text;
using System.Text.Json;
using ClinIQ.API.Authorization;
using ClinIQ.Application.Interfaces;
using ClinIQ.Domain.Common;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Constants;
using ClinIQ.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

/// <summary>
/// Hospital reporting read API.
///
/// Security model (backend is the authority — nothing from Angular is trusted):
///   - every report needs reports.view (attribute) PLUS the view permission of
///     the module it reads (e.g. laboratory.view), financial reports need
///     reports.financial, the audit report needs audit.view, exports need
///     reports.export — all checked against EFFECTIVE permissions (roles, user
///     overrides and entitlements), never against client state,
///   - the location comes from <see cref="ILocationScopeService"/>: a requested
///     locationId must belong to the caller's tenant AND be one of the caller's
///     locations, otherwise 403 — it can never widen the result set,
///   - queries bypass the ambient global filters and apply tenant + location +
///     soft-delete predicates explicitly from that validated scope,
///   - report views/exports are audited (REPORT_GENERATED / REPORT_EXPORTED)
///     with filter metadata only — never row data or patient details.
///
/// Every report returns one unified shape (summary cards, chart series,
/// column definitions, paged rows) so the Angular viewer stays generic.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public partial class ReportsController : ControllerBase
{
    private const int MaxExportRows = 50000;
    private const int MaxPageSize = 200;
    private const int MaxRangeDays = 1100;

    private readonly ApplicationDbContext _context;
    private readonly ILocationScopeService _scopeService;
    private readonly IAuditService _auditService;

    public ReportsController(
        ApplicationDbContext context,
        ILocationScopeService scopeService,
        IAuditService auditService)
    {
        _context = context;
        _scopeService = scopeService;
        _auditService = auditService;
    }

    // ------------------------------------------------------------------
    // Registry
    // ------------------------------------------------------------------

    private sealed record FilterDef(string Key, string Label, string Type, string[]? Options = null);

    /// <param name="AnyOf">Module view permissions — the caller needs at least one.</param>
    private sealed record ReportDef(
        string Key, string Name, string Category, string Description, string Icon,
        string[] AnyOf, bool Financial = false, bool Audit = false,
        bool AllLocationsOnly = false, bool UsesDateRange = true,
        FilterDef[]? Filters = null);

    private sealed record CategoryDef(string Id, string Name, string Icon, string Description);

    private static readonly CategoryDef[] Categories =
    {
        new("management", "Management", "insights", "Organization-wide KPIs and location comparison"),
        new("patients", "Patients & Appointments", "groups", "Registrations, demographics and scheduling"),
        new("clinical", "Clinical", "medical_services", "OPD, IPD, beds, laboratory, radiology and pharmacy"),
        new("doctors", "Doctors & Staff", "badge", "Measured activity per doctor"),
        new("finance", "Billing & Finance", "account_balance_wallet", "Revenue, collections, refunds and service mix"),
        new("inventory", "Inventory & Procurement", "inventory_2", "Stock, movements, expiry, purchases and suppliers"),
        new("administration", "Administration", "admin_panel_settings", "Audit activity across the system"),
    };

    private static readonly FilterDef Doctor = new("doctorId", "Doctor", "doctor");
    private static readonly FilterDef Department = new("departmentId", "Department", "department");
    private static readonly FilterDef Search = new("search", "Search", "text");
    private static FilterDef Status(params string[] options) => new("status", "Status", "select", options);

    private static readonly ReportDef[] Reports =
    {
        new("management", "Management Summary", "management",
            "Patients, visits, admissions, orders, revenue and occupancy for the period",
            "dashboard", Array.Empty<string>(), Financial: true),
        new("location-comparison", "Location Comparison", "management",
            "Side-by-side activity and revenue for every location", "compare_arrows",
            Array.Empty<string>(), Financial: true, AllLocationsOnly: true),

        new("patients", "Patient Registrations", "patients",
            "New registrations, gender split and registration trend", "person_add",
            new[] { Permissions.PatientsView },
            Filters: new[] { new FilterDef("gender", "Gender", "select", new[] { "Male", "Female", "Other" }), Search }),
        new("appointments", "Appointments", "patients",
            "Appointments by status, doctor and department", "event",
            new[] { Permissions.AppointmentsView },
            Filters: new[] { Doctor, Department,
                Status("Scheduled", "Confirmed", "CheckedIn", "InProgress", "Completed", "Cancelled", "NoShow", "Rescheduled"), Search }),

        new("opd", "OPD Visits", "clinical",
            "Outpatient visits, completion and billing by doctor", "local_hospital",
            new[] { Permissions.OpdView, Permissions.VisitsView },
            Filters: new[] { Doctor, Department, Status("Completed", "In Progress", "Billed", "Unbilled"), Search }),
        new("ipd", "Admissions & Discharges", "clinical",
            "Admissions, discharges, length of stay and ward mix", "hotel",
            new[] { Permissions.IpdView, Permissions.AdmissionsView },
            Filters: new[] { Doctor, Department,
                Status("Requested", "Admitted", "InTreatment", "ReadyForDischarge", "Discharged", "Transferred", "Cancelled", "Deceased"), Search }),
        new("beds", "Bed Occupancy", "clinical",
            "Current bed status, occupancy and ward utilization", "bed",
            new[] { Permissions.BedsView, Permissions.IpdView }, UsesDateRange: false,
            Filters: new[] { Status("Available", "Occupied", "Reserved", "Cleaning", "Maintenance", "Blocked", "OutOfService"), Search }),
        new("laboratory", "Laboratory Orders", "clinical",
            "Lab orders, completion, verification and top tests", "science",
            new[] { Permissions.LaboratoryView },
            Filters: new[] { Doctor, Status("Pending", "Completed", "Verified", "Cancelled"), Search }),
        new("radiology", "Radiology Orders", "clinical",
            "Imaging orders, report status and modality mix", "medical_information",
            new[] { Permissions.RadiologyView },
            Filters: new[] { Doctor, Status("Pending", "Completed", "Verified", "Cancelled"), Search }),
        new("pharmacy", "Prescriptions & Dispensing", "clinical",
            "Prescriptions issued and dispensed", "local_pharmacy",
            new[] { Permissions.PharmacyView, Permissions.PrescriptionsView },
            Filters: new[] { Doctor, Status("Dispensed", "Pending"), Search }),

        new("doctor-activity", "Doctor Activity", "doctors",
            "Appointments, visits, admissions, orders and prescriptions per doctor", "assignment_ind",
            new[] { Permissions.DoctorsView, Permissions.AppointmentsView },
            Filters: new[] { Department, Search }),

        new("billing", "Invoices & Revenue", "finance",
            "Invoiced revenue, collections, discounts and outstanding", "receipt_long",
            new[] { Permissions.BillingView }, Financial: true,
            Filters: new[] { Status("Pending", "Draft", "Finalized", "PartiallyPaid", "Paid", "Overdue", "Cancelled", "Refunded", "PartiallyRefunded", "WrittenOff"), Search }),
        new("payments", "Collections & Refunds", "finance",
            "Payments received, refunds and payment-method mix", "payments",
            new[] { Permissions.PaymentsView, Permissions.BillingView }, Financial: true,
            Filters: new[] { new FilterDef("status", "Payment Method", "select",
                new[] { "Cash", "CreditCard", "DebitCard", "BankTransfer", "Check", "Insurance", "Corporate", "Online", "MobilePayment", "Other", "Refunds" }), Search }),
        new("service-revenue", "Service-wise Revenue", "finance",
            "Revenue, discount and tax by service and item type", "stacked_bar_chart",
            new[] { Permissions.BillingView }, Financial: true,
            Filters: new[] { new FilterDef("status", "Item Type", "select", new[] { "Service", "Medicine", "Procedure", "Lab", "Radiology", "RoomCharge", "BedCharge", "Other" }), Search }),

        new("inventory", "Current Stock", "inventory",
            "Stock levels, valuation and low-stock alerts", "inventory",
            new[] { Permissions.InventoryView }, UsesDateRange: false,
            Filters: new[] { Status("In Stock", "Low Stock", "Out of Stock", "Inactive"), Search }),
        new("stock-movements", "Stock Movements", "inventory",
            "Stock in, stock out, adjustments and transfers", "swap_vert",
            new[] { Permissions.InventoryView },
            Filters: new[] { new FilterDef("status", "Movement Type", "select",
                new[] { "Purchase", "Sale", "Return", "Adjustment", "Transfer", "Expiry", "Damage", "Consumption", "OpeningStock", "WriteOff" }), Search }),
        new("stock-expiry", "Expiry & Near Expiry", "inventory",
            "Expired batches and batches expiring within 90 days", "event_busy",
            new[] { Permissions.InventoryView }, UsesDateRange: false,
            Filters: new[] { Status("Expired", "Within 30 days", "Within 60 days", "Within 90 days"), Search }),
        new("purchases", "Purchase Orders", "inventory",
            "Purchase orders by supplier and status", "shopping_cart",
            new[] { Permissions.PurchaseOrdersView, Permissions.InventoryView },
            Filters: new[] { Status("Draft", "Pending", "Approved", "Rejected", "Ordered", "PartiallyReceived", "Received", "Cancelled", "Closed"), Search }),
        new("suppliers", "Suppliers", "inventory",
            "Supplier list, terms and outstanding payables", "local_shipping",
            new[] { Permissions.SuppliersView, Permissions.InventoryView }, UsesDateRange: false,
            Filters: new[] { Status("Active", "Inactive"), Search }),

        new("audit-activity", "Audit Activity", "administration",
            "Who did what, when and where — by user, module and action", "history",
            Array.Empty<string>(), Audit: true,
            Filters: new[] { Status("Success", "Failure"), Search }),
    };

    private static readonly Dictionary<string, ReportDef> ReportIndex =
        Reports.ToDictionary(r => r.Key, StringComparer.OrdinalIgnoreCase);

    /// <summary>Old report ids keep working and resolve to their canonical report.</summary>
    private static readonly Dictionary<string, string> LegacyKeys = new(StringComparer.OrdinalIgnoreCase)
    {
        ["patient-registration"] = "patients",
        ["patient-demographics"] = "patients",
        ["revenue"] = "billing",
        ["stock-summary"] = "inventory",
        ["low-stock"] = "inventory",
    };

    /// <summary>Query-string contract shared by the view and the export.</summary>
    public sealed class ReportQuery
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid? LocationId { get; set; }
        /// <summary>Explicit All Locations request (ignored when LocationId is set).</summary>
        public bool AllLocations { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 25;
        public Guid? DoctorId { get; set; }
        public Guid? DepartmentId { get; set; }
        public string? Status { get; set; }
        public string? Gender { get; set; }
        public string? Search { get; set; }
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; } = true;
    }

    // ------------------------------------------------------------------
    // Catalog + filter context
    // ------------------------------------------------------------------

    /// <summary>Only the reports this caller may actually open, grouped by category.</summary>
    [HttpGet]
    [RequirePermission(Permissions.ReportsView)]
    public async Task<IActionResult> GetReports(CancellationToken cancellationToken)
    {
        var (scope, _) = await _scopeService.ResolveAsync(null, cancellationToken);
        var canExport = await _scopeService.HasPermissionAsync(Permissions.ReportsExport, cancellationToken);

        var visible = new List<ReportDef>();
        foreach (var def in Reports)
            if (await DenyReasonAsync(def, scope?.CanSeeAllLocations == true, cancellationToken) is null)
                visible.Add(def);

        var categories = Categories
            .Select(c => new
            {
                id = c.Id,
                name = c.Name,
                icon = c.Icon,
                description = c.Description,
                reports = visible.Where(r => r.Category == c.Id).Select(r => new
                {
                    id = r.Key,
                    name = r.Name,
                    description = r.Description,
                    icon = r.Icon,
                    financial = r.Financial,
                    audit = r.Audit,
                    allLocationsOnly = r.AllLocationsOnly,
                    usesDateRange = r.UsesDateRange,
                    filters = (r.Filters ?? Array.Empty<FilterDef>()).Select(f => new
                    {
                        key = f.Key, label = f.Label, type = f.Type, options = f.Options,
                    }),
                }).ToList(),
            })
            .Where(c => c.reports.Count > 0)
            .ToList();

        return Ok(Result<object>.Success(new { categories, canExport }));
    }

    /// <summary>
    /// Everything the filter panel needs, computed server-side: the locations
    /// this caller may choose (with "All Locations" only when allowed) and the
    /// doctor/department lookups limited to the caller's tenant and locations.
    /// </summary>
    [HttpGet("context")]
    [RequirePermission(Permissions.ReportsView)]
    public async Task<IActionResult> GetReportContext(CancellationToken cancellationToken)
    {
        var (scope, error) = await _scopeService.ResolveAsync(null, cancellationToken);
        if (scope is null)
            return Forbidden(error);

        var locations = await _scopeService.GetSelectableAsync(cancellationToken);
        var allowed = scope.AllowedBranchIds;

        var departments = await _context.Departments.IgnoreQueryFilters()
            .Where(d => d.TenantId == scope.TenantId && !d.IsDeleted && d.IsActive
                        && (scope.CanSeeAllLocations || d.BranchId == null || allowed.Contains(d.BranchId.Value)))
            .OrderBy(d => d.Name)
            .Select(d => new { id = d.Id, name = d.Name, locationId = d.BranchId })
            .ToListAsync(cancellationToken);

        var doctorIds = _context.DoctorSchedules.IgnoreQueryFilters()
                .Where(s => s.TenantId == scope.TenantId && !s.IsDeleted).Select(s => s.DoctorId)
            .Union(_context.Appointments.IgnoreQueryFilters()
                .Where(a => a.TenantId == scope.TenantId && !a.IsDeleted).Select(a => a.DoctorId))
            .Union(_context.Visits.IgnoreQueryFilters()
                .Where(v => v.TenantId == scope.TenantId && !v.IsDeleted).Select(v => v.DoctorId));

        var doctors = await _context.Users.IgnoreQueryFilters()
            .Where(u => doctorIds.Contains(u.Id) && !u.IsDeleted)
            .OrderBy(u => u.FirstName).ThenBy(u => u.LastName)
            .Select(u => new { id = u.Id, name = (u.FirstName + " " + u.LastName).Trim() })
            .ToListAsync(cancellationToken);

        return Ok(Result<object>.Success(new
        {
            currentLocation = new { id = scope.BranchId, name = scope.LocationName },
            canSeeAllLocations = scope.CanSeeAllLocations,
            locations,
            departments,
            doctors,
        }));
    }

    // ------------------------------------------------------------------
    // Report data (unified shape)
    // ------------------------------------------------------------------

    [HttpGet("{reportId}")]
    [RequirePermission(Permissions.ReportsView)]
    public async Task<IActionResult> GetReportData(
        string reportId, [FromQuery] ReportQuery query, CancellationToken cancellationToken = default)
    {
        var (request, def, failure) = await PrepareAsync(reportId, query, export: false, cancellationToken);
        if (failure is not null)
            return failure;

        var payload = await BuildReportAsync(def!.Key, request!, cancellationToken);

        if (request!.PageNumber == 1)
            await AuditReportAsync("REPORT_GENERATED", def, request, payload.TotalCount, cancellationToken);

        return Ok(Result<object>.Success(BuildResponse(payload, request)));
    }

    // ------------------------------------------------------------------
    // CSV export — same scope/permission/filter rules as the view, capped, audited
    // ------------------------------------------------------------------

    [HttpGet("{reportId}/export")]
    [RequirePermission(Permissions.ReportsView, Permissions.ReportsExport)]
    public async Task<IActionResult> ExportReport(
        string reportId, [FromQuery] ReportQuery query, CancellationToken cancellationToken = default)
    {
        var (request, def, failure) = await PrepareAsync(reportId, query, export: true, cancellationToken);
        if (failure is not null)
            return failure;

        var payload = await BuildReportAsync(def!.Key, request!, cancellationToken);

        var csv = new StringBuilder();
        csv.AppendLine(Csv($"{def.Name} — {request!.LocationName}"));
        if (def.UsesDateRange)
            csv.AppendLine(Csv($"Period: {request.Start:yyyy-MM-dd} to {request.End.AddDays(-1):yyyy-MM-dd}"));
        csv.AppendLine(Csv($"Generated: {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC"));
        csv.AppendLine();
        csv.AppendLine(string.Join(",", payload.Columns.Select(c => Csv(c.Label))));
        foreach (var row in payload.Rows)
        {
            csv.AppendLine(string.Join(",", payload.Columns.Select(c =>
                Csv(ToDisplay(row.TryGetValue(c.Key, out var value) ? value : null)))));
        }

        await AuditReportAsync("REPORT_EXPORTED", def, request, payload.Rows.Count, cancellationToken);

        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csv.ToString())).ToArray();
        return File(bytes, "text/csv", $"{def.Key}-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv");
    }

    // ------------------------------------------------------------------
    // Authorization + request preparation
    // ------------------------------------------------------------------

    private async Task<(ReportRequest? Request, ReportDef? Def, IActionResult? Failure)> PrepareAsync(
        string reportId, ReportQuery q, bool export, CancellationToken cancellationToken)
    {
        var key = reportId?.Trim() ?? string.Empty;
        if (LegacyKeys.TryGetValue(key, out var canonical))
            key = canonical;
        if (!ReportIndex.TryGetValue(key, out var def))
            return (null, null, NotFound(Result.Failure("Report not found.", "NOT_FOUND")));

        if (q.StartDate.HasValue && q.EndDate.HasValue && q.EndDate.Value.Date < q.StartDate.Value.Date)
            return (null, def, BadRequest(Result.Failure("End date must be on or after the start date.", "INVALID_DATE_RANGE")));

        var (scope, scopeError) = await _scopeService.ResolveAsync(q.LocationId, cancellationToken, q.AllLocations);
        if (scope is null)
            return (null, def, Forbidden(scopeError));

        var deny = await DenyReasonAsync(def, scope.CanSeeAllLocations, cancellationToken);
        if (deny is not null)
            return (null, def, Forbidden(deny));

        var start = (q.StartDate ?? DateTime.UtcNow.Date.AddDays(-29)).Date;
        var end = (q.EndDate ?? DateTime.UtcNow.Date).Date.AddDays(1);
        if ((end - start).TotalDays > MaxRangeDays)
            return (null, def, BadRequest(Result.Failure($"The date range cannot exceed {MaxRangeDays} days.", "INVALID_DATE_RANGE")));

        var includeFinancial = await _scopeService.HasPermissionAsync(Permissions.ReportsFinancial, cancellationToken);

        var request = new ReportRequest(
            TenantId: scope.TenantId,
            BranchId: scope.BranchId,
            LocationName: scope.LocationName,
            AllowedBranchIds: scope.AllowedBranchIds,
            Start: start,
            End: end,
            PageNumber: export ? 1 : Math.Max(1, q.PageNumber),
            PageSize: export ? MaxExportRows : Math.Clamp(q.PageSize, 1, MaxPageSize),
            DoctorId: q.DoctorId,
            DepartmentId: q.DepartmentId,
            Status: string.IsNullOrWhiteSpace(q.Status) ? null : q.Status.Trim(),
            Gender: string.IsNullOrWhiteSpace(q.Gender) ? null : q.Gender.Trim(),
            Search: string.IsNullOrWhiteSpace(q.Search) ? null : q.Search.Trim().ToLowerInvariant(),
            SortBy: string.IsNullOrWhiteSpace(q.SortBy) ? null : q.SortBy.Trim(),
            SortDescending: q.SortDescending,
            IncludeFinancial: includeFinancial,
            ExplicitLocation: q.LocationId.HasValue);

        return (request, def, null);
    }

    /// <summary>NULL when the caller may open the report, otherwise the reason.</summary>
    private async Task<string?> DenyReasonAsync(ReportDef def, bool canSeeAllLocations, CancellationToken cancellationToken)
    {
        if (def.AllLocationsOnly && !canSeeAllLocations)
            return "This report requires All Locations access.";

        if (def.Financial && !await _scopeService.HasPermissionAsync(Permissions.ReportsFinancial, cancellationToken))
            return "You do not have permission to view financial reports.";

        if (def.Audit && !await _scopeService.HasPermissionAsync(Permissions.AuditView, cancellationToken))
            return "You do not have permission to view audit activity.";

        if (def.AnyOf.Length > 0)
        {
            foreach (var permission in def.AnyOf)
                if (await _scopeService.HasPermissionAsync(permission, cancellationToken))
                    return null;
            return "You do not have access to the module this report reads.";
        }

        return null;
    }

    private ObjectResult Forbidden(string? message) =>
        StatusCode(StatusCodes.Status403Forbidden,
            Result.Failure(message ?? "You do not have access to this report.", "FORBIDDEN"));

    private async Task AuditReportAsync(string action, ReportDef def, ReportRequest request, int rowCount, CancellationToken cancellationToken)
    {
        var period = def.UsesDateRange
            ? $" for {request.Start:yyyy-MM-dd} → {request.End.AddDays(-1):yyyy-MM-dd}"
            : string.Empty;

        await _auditService.LogAsync(new AuditEvent
        {
            Action = action,
            Module = "Reports",
            EntityName = def.Name,
            EntityId = def.Key,
            Description = action == "REPORT_EXPORTED"
                ? $"{def.Name} exported ({rowCount} rows) — {request.LocationName}{period}"
                : $"{def.Name} generated — {request.LocationName}{period}",
            // NULL location = All Locations; never a random single branch.
            BranchSpecified = true,
            BranchId = request.BranchId,
            Success = true,
            // Filter metadata only: no rows, no patient data. Free-text search is
            // recorded as present/absent, not its value (it may be a patient name).
            AdditionalData = JsonSerializer.Serialize(new
            {
                reportKey = def.Key,
                location = request.LocationName,
                locationId = request.BranchId,
                startDate = def.UsesDateRange ? request.Start : (DateTime?)null,
                endDate = def.UsesDateRange ? request.End.AddDays(-1) : (DateTime?)null,
                doctorId = request.DoctorId,
                departmentId = request.DepartmentId,
                status = request.Status,
                gender = request.Gender,
                searchApplied = request.Search is not null,
                rowCount,
            }),
        }, cancellationToken);
    }

    private static object BuildResponse(ReportPayload payload, ReportRequest request) => new
    {
        reportKey = payload.ReportKey,
        reportName = payload.ReportName,
        locationScope = new { locationId = request.BranchId, name = request.LocationName },
        period = new { start = request.Start, end = request.End.AddDays(-1) },
        summary = payload.Summary,
        series = payload.Series,
        columns = payload.Columns.Select(c => new
        {
            key = c.Key, label = c.Label, type = c.Type, sortable = payload.SortableKeys.Contains(c.Key),
        }),
        rows = payload.Rows,
        pageNumber = request.PageNumber,
        pageSize = request.PageSize,
        totalCount = payload.TotalCount,
        sortBy = payload.AppliedSort,
        sortDescending = payload.AppliedSortDescending,
        generatedAt = DateTime.UtcNow,
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
        // Neutralise spreadsheet formula injection from user-entered text.
        if (value.Length > 0 && "=+-@\t\r".Contains(value[0]) && !decimal.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out _))
            value = "'" + value;
        if (value.Contains('"') || value.Contains(',') || value.Contains('\n') || value.Contains('\r'))
            return "\"" + value.Replace("\"", "\"\"") + "\"";
        return value;
    }
}
