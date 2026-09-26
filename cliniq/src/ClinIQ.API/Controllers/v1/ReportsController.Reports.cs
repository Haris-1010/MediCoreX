using System.Linq.Expressions;
using ClinIQ.Domain.Common;
using ClinIQ.Domain.Entities;
using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Entities.Facility;
using ClinIQ.Domain.Entities.Inventory;
using ClinIQ.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

/// <summary>
/// Report payload records + per-report query builders.
///
/// Rules every builder follows:
///   - roots come from <see cref="In{T}"/> / explicit predicates: tenant +
///     validated location + not soft-deleted. Global filters are bypassed on
///     purpose — they follow the header-selected location, while a report may
///     legitimately read another location the caller was validated for,
///   - counts, sums and group-bys run in the database; only the requested page
///     (or small aggregated sets bounded by doctors/locations) is materialized,
///   - sorting happens in SQL through a whitelist of column → expression maps,
///   - clinical free text (complaints, diagnoses, notes) is never a column.
/// </summary>
public partial class ReportsController
{
    private sealed record ReportRequest(
        Guid TenantId,
        Guid? BranchId,
        string LocationName,
        IReadOnlyList<Guid> AllowedBranchIds,
        DateTime Start,
        DateTime End,
        int PageNumber,
        int PageSize,
        Guid? DoctorId,
        Guid? DepartmentId,
        string? Status,
        string? Gender,
        string? Search,
        string? SortBy,
        bool SortDescending,
        bool IncludeFinancial,
        bool ExplicitLocation);

    private sealed record ReportField(string Key, string Label, string Type);

    private sealed record SummaryValue(string Key, string Label, object? Value, string Format, string? Tone = null);

    private sealed record SeriesPoint(string Label, object? Value);

    /// <param name="Kind">"trend" (date axis) or "breakdown" (categories).</param>
    private sealed record SeriesData(string Name, string Kind, string Format, List<SeriesPoint> Points);

    private sealed class ReportPayload
    {
        public string ReportKey { get; init; } = string.Empty;
        public string ReportName { get; init; } = string.Empty;
        public List<SummaryValue> Summary { get; } = new();
        public List<SeriesData> Series { get; } = new();
        public List<ReportField> Columns { get; } = new();
        public List<Dictionary<string, object?>> Rows { get; } = new();
        public HashSet<string> SortableKeys { get; } = new(StringComparer.OrdinalIgnoreCase);
        public string? AppliedSort { get; set; }
        public bool AppliedSortDescending { get; set; }
        public int TotalCount { get; set; }
    }

    private async Task<ReportPayload> BuildReportAsync(string key, ReportRequest r, CancellationToken ct) => key switch
    {
        "management" => await BuildManagementAsync(r, ct),
        "location-comparison" => await BuildLocationComparisonAsync(r, ct),
        "patients" => await BuildPatientsAsync(r, ct),
        "appointments" => await BuildAppointmentsAsync(r, ct),
        "opd" => await BuildOpdAsync(r, ct),
        "ipd" => await BuildIpdAsync(r, ct),
        "beds" => await BuildBedsAsync(r, ct),
        "laboratory" => await BuildOrderReportAsync("laboratory", MedicalOrderType.Lab, r, ct),
        "radiology" => await BuildOrderReportAsync("radiology", MedicalOrderType.Radiology, r, ct),
        "pharmacy" => await BuildPharmacyAsync(r, ct),
        "doctor-activity" => await BuildDoctorActivityAsync(r, ct),
        "billing" => await BuildBillingAsync(r, ct),
        "payments" => await BuildPaymentsAsync(r, ct),
        "service-revenue" => await BuildServiceRevenueAsync(r, ct),
        "inventory" => await BuildInventoryAsync(r, ct),
        "stock-movements" => await BuildStockMovementsAsync(r, ct),
        "stock-expiry" => await BuildStockExpiryAsync(r, ct),
        "purchases" => await BuildPurchasesAsync(r, ct),
        "suppliers" => await BuildSuppliersAsync(r, ct),
        "audit-activity" => await BuildAuditActivityAsync(r, ct),
        _ => throw new InvalidOperationException($"Unknown report '{key}'."),
    };

    // ------------------------------------------------------------------
    // Shared query helpers
    // ------------------------------------------------------------------

    private static ReportPayload NewPayload(string key) => new()
    {
        ReportKey = key,
        ReportName = ReportIndex[key].Name,
    };

    /// <summary>Tenant + validated location + not deleted, without the ambient global filters.</summary>
    private IQueryable<T> In<T>(ReportRequest r) where T : BranchEntity =>
        _context.Set<T>().IgnoreQueryFilters()
            .Where(x => x.TenantId == r.TenantId && !x.IsDeleted && (r.BranchId == null || x.BranchId == r.BranchId));

    private IQueryable<T> Raw<T>() where T : class => _context.Set<T>().IgnoreQueryFilters();

    private static IQueryable<T> Page<T>(IQueryable<T> q, ReportRequest r) =>
        q.Skip((r.PageNumber - 1) * r.PageSize).Take(r.PageSize);

    /// <summary>
    /// Whitelisted SQL sort. Unknown / missing sortBy falls back to the
    /// report's natural order, so a crafted column name can never reach SQL.
    /// </summary>
    private static IQueryable<T> Sorted<T>(
        IQueryable<T> source, ReportRequest r, ReportPayload payload,
        string defaultKey, bool defaultDescending,
        params (string Key, Expression<Func<T, object?>> By)[] map)
    {
        foreach (var m in map) payload.SortableKeys.Add(m.Key);

        var chosen = map.FirstOrDefault(m => string.Equals(m.Key, r.SortBy, StringComparison.OrdinalIgnoreCase));
        var descending = r.SortDescending;
        if (chosen.By is null)
        {
            chosen = map.First(m => m.Key == defaultKey);
            descending = defaultDescending;
        }

        payload.AppliedSort = chosen.Key;
        payload.AppliedSortDescending = descending;
        return descending ? source.OrderByDescending(chosen.By) : source.OrderBy(chosen.By);
    }

    /// <summary>In-memory sort for small aggregated sets (doctors, locations).</summary>
    private static List<T> SortedInMemory<T>(
        IEnumerable<T> source, ReportRequest r, ReportPayload payload,
        string defaultKey, bool defaultDescending,
        params (string Key, Func<T, object?> By)[] map)
    {
        foreach (var m in map) payload.SortableKeys.Add(m.Key);

        var chosen = map.FirstOrDefault(m => string.Equals(m.Key, r.SortBy, StringComparison.OrdinalIgnoreCase));
        var descending = r.SortDescending;
        if (chosen.By is null)
        {
            chosen = map.First(m => m.Key == defaultKey);
            descending = defaultDescending;
        }

        payload.AppliedSort = chosen.Key;
        payload.AppliedSortDescending = descending;
        return (descending ? source.OrderByDescending(chosen.By) : source.OrderBy(chosen.By)).ToList();
    }

    private static bool TryEnum<TEnum>(string? value, out TEnum result) where TEnum : struct, Enum =>
        Enum.TryParse(value?.Replace(" ", string.Empty), ignoreCase: true, out result);

    /// <summary>
    /// Date series with the gaps filled, so a chart shows quiet days as zero.
    /// Ranges over 120 days are bucketed by month to keep charts readable.
    /// </summary>
    private static SeriesData Trend(string name, ReportRequest r, IEnumerable<(DateTime Date, decimal Value)> points, string format = "number")
    {
        var byDay = points.GroupBy(p => p.Date.Date).ToDictionary(g => g.Key, g => g.Sum(x => x.Value));
        var days = (r.End - r.Start).Days;
        var result = new List<SeriesPoint>();

        if (days > 120)
        {
            for (var m = new DateTime(r.Start.Year, r.Start.Month, 1); m < r.End; m = m.AddMonths(1))
            {
                var next = m.AddMonths(1);
                result.Add(new SeriesPoint(m.ToString("yyyy-MM"),
                    byDay.Where(kv => kv.Key >= m && kv.Key < next).Sum(kv => kv.Value)));
            }
        }
        else
        {
            for (var d = r.Start; d < r.End; d = d.AddDays(1))
                result.Add(new SeriesPoint(d.ToString("yyyy-MM-dd"), byDay.GetValueOrDefault(d)));
        }

        return new SeriesData(name, "trend", format, result);
    }

    private static SeriesData Breakdown<TLabel>(string name, IEnumerable<(TLabel Label, decimal Value)> points, string format = "number", int take = 10) =>
        new(name, "breakdown", format, points
            .Select(p => (Label: p.Label?.ToString(), p.Value))
            .GroupBy(p => string.IsNullOrWhiteSpace(p.Label) ? "Unspecified" : p.Label!)
            .Select(g => (Label: g.Key, Value: g.Sum(x => x.Value)))
            .Where(p => p.Value != 0)
            .OrderByDescending(p => p.Value)
            .Take(take)
            .Select(p => new SeriesPoint(p.Label, p.Value))
            .ToList());

    private static double Pct(double part, double whole) => whole > 0 ? Math.Round(part * 100.0 / whole, 1) : 0;

    private async Task<Dictionary<Guid, string>> NamesAsync(IEnumerable<Guid> userIds, CancellationToken ct)
    {
        var ids = userIds.Distinct().ToList();
        if (ids.Count == 0) return new Dictionary<Guid, string>();
        return await Raw<ClinIQ.Domain.Entities.Identity.ApplicationUser>()
            .Where(u => ids.Contains(u.Id))
            .Select(u => new { u.Id, Name = (u.FirstName + " " + u.LastName).Trim() })
            .ToDictionaryAsync(u => u.Id, u => u.Name, ct);
    }

    // ------------------------------------------------------------------
    // Management summary (financial)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildManagementAsync(ReportRequest r, CancellationToken ct)
    {
        var patients = In<Patient>(r);
        var appointments = In<Appointment>(r).Where(a => a.AppointmentDate >= r.Start && a.AppointmentDate < r.End);
        var visits = In<Visit>(r).Where(v => v.VisitDate >= r.Start && v.VisitDate < r.End);
        var admissions = In<Admission>(r);
        var orders = In<MedicalOrder>(r).Where(m => m.OrderDate >= r.Start && m.OrderDate < r.End);
        var invoices = In<Invoice>(r).Where(i => i.InvoiceDate >= r.Start && i.InvoiceDate < r.End && i.Status != InvoiceStatus.Cancelled);
        var payments = In<Payment>(r).Where(p => p.PaymentDate >= r.Start && p.PaymentDate < r.End);
        var beds = In<Bed>(r);

        var newPatients = await patients.CountAsync(p => p.CreatedAt >= r.Start && p.CreatedAt < r.End, ct);
        var totalPatients = await patients.CountAsync(ct);
        var appointmentCount = await appointments.CountAsync(ct);
        var appointmentsCompleted = await appointments.CountAsync(a => a.Status == AppointmentStatus.Completed, ct);
        var visitCount = await visits.CountAsync(ct);
        var admissionCount = await admissions.CountAsync(a => a.AdmissionDate >= r.Start && a.AdmissionDate < r.End, ct);
        var dischargeCount = await admissions.CountAsync(a => a.DischargeDate != null && a.DischargeDate >= r.Start && a.DischargeDate < r.End, ct);
        var labOrders = await orders.CountAsync(m => m.OrderType == MedicalOrderType.Lab, ct);
        var radiologyOrders = await orders.CountAsync(m => m.OrderType == MedicalOrderType.Radiology, ct);
        var prescriptions = await In<Prescription>(r).CountAsync(p => p.PrescriptionDate >= r.Start && p.PrescriptionDate < r.End, ct);
        var revenue = await invoices.SumAsync(i => i.TotalAmount, ct);
        var collected = await payments.Where(p => !p.IsRefund).SumAsync(p => p.Amount, ct);
        var refunds = await payments.Where(p => p.IsRefund).SumAsync(p => p.Amount, ct);
        var receivables = await In<Invoice>(r).Where(i => i.Status != InvoiceStatus.Cancelled).SumAsync(i => i.OutstandingAmount, ct);
        var totalBeds = await beds.CountAsync(ct);
        var occupiedBeds = await beds.CountAsync(b => b.Status == BedStatus.Occupied, ct);

        var dailyRevenue = await invoices.GroupBy(i => i.InvoiceDate.Date)
            .Select(g => new { Date = g.Key, Revenue = g.Sum(i => i.TotalAmount), Invoices = g.Count() }).ToListAsync(ct);
        var dailyCollections = await payments.Where(p => !p.IsRefund).GroupBy(p => p.PaymentDate.Date)
            .Select(g => new { Date = g.Key, Collected = g.Sum(p => p.Amount) }).ToListAsync(ct);
        var dailyAppointments = await appointments.GroupBy(a => a.AppointmentDate.Date)
            .Select(g => new { Date = g.Key, Count = g.Count(), Completed = g.Count(a => a.Status == AppointmentStatus.Completed) }).ToListAsync(ct);
        var dailyVisits = await visits.GroupBy(v => v.VisitDate.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() }).ToListAsync(ct);
        var dailyAdmissions = await admissions.Where(a => a.AdmissionDate >= r.Start && a.AdmissionDate < r.End)
            .GroupBy(a => a.AdmissionDate.Date).Select(g => new { Date = g.Key, Count = g.Count() }).ToListAsync(ct);

        var payload = NewPayload("management");
        payload.Summary.Add(new("revenue", "Revenue", revenue, "currency", "primary"));
        payload.Summary.Add(new("collected", "Collections", collected, "currency", "success"));
        payload.Summary.Add(new("receivables", "Receivables (to date)", receivables, "currency", "warning"));
        payload.Summary.Add(new("refunds", "Refunds", refunds, "currency"));
        payload.Summary.Add(new("newPatients", "New Patients", newPatients, "number"));
        payload.Summary.Add(new("totalPatients", "Total Patients", totalPatients, "number"));
        payload.Summary.Add(new("appointments", "Appointments", appointmentCount, "number"));
        payload.Summary.Add(new("visits", "OPD / Clinical Visits", visitCount, "number"));
        payload.Summary.Add(new("admissions", "Admissions", admissionCount, "number"));
        payload.Summary.Add(new("discharges", "Discharges", dischargeCount, "number"));
        payload.Summary.Add(new("labOrders", "Lab Orders", labOrders, "number"));
        payload.Summary.Add(new("radiologyOrders", "Radiology Orders", radiologyOrders, "number"));
        payload.Summary.Add(new("prescriptions", "Prescriptions", prescriptions, "number"));
        payload.Summary.Add(new("occupancy", "Bed Occupancy", Pct(occupiedBeds, totalBeds), "percent"));

        payload.Series.Add(Trend("Revenue", r, dailyRevenue.Select(d => (d.Date, d.Revenue)), "currency"));
        payload.Series.Add(Trend("Collections", r, dailyCollections.Select(d => (d.Date, d.Collected)), "currency"));
        payload.Series.Add(Trend("Appointments", r, dailyAppointments.Select(d => (d.Date, (decimal)d.Count))));

        if (r.BranchId is null)
        {
            var byLocation = await invoices.GroupBy(i => i.BranchId)
                .Select(g => new { BranchId = g.Key, Revenue = g.Sum(i => i.TotalAmount) }).ToListAsync(ct);
            var names = await BranchNamesAsync(r, ct);
            payload.Series.Add(Breakdown("Revenue by Location",
                byLocation.Select(x => (x.BranchId.HasValue ? names.GetValueOrDefault(x.BranchId.Value) : null, x.Revenue)), "currency"));
        }

        payload.Columns.AddRange(new[]
        {
            new ReportField("date", "Date", "date"),
            new ReportField("appointments", "Appointments", "number"),
            new ReportField("completed", "Completed", "number"),
            new ReportField("visits", "Visits", "number"),
            new ReportField("admissions", "Admissions", "number"),
            new ReportField("invoices", "Invoices", "number"),
            new ReportField("revenue", "Revenue", "currency"),
            new ReportField("collected", "Collected", "currency"),
        });

        var merged = new List<(DateTime Date, int Appointments, int Completed, int Visits, int Admissions, int Invoices, decimal Revenue, decimal Collected)>();
        for (var d = r.Start; d < r.End; d = d.AddDays(1))
        {
            var rev = dailyRevenue.FirstOrDefault(x => x.Date == d);
            var appt = dailyAppointments.FirstOrDefault(x => x.Date == d);
            var row = (d, appt?.Count ?? 0, appt?.Completed ?? 0,
                dailyVisits.FirstOrDefault(x => x.Date == d)?.Count ?? 0,
                dailyAdmissions.FirstOrDefault(x => x.Date == d)?.Count ?? 0,
                rev?.Invoices ?? 0, rev?.Revenue ?? 0m,
                dailyCollections.FirstOrDefault(x => x.Date == d)?.Collected ?? 0m);
            if (row.Item2 + row.Item4 + row.Item5 + row.Item6 > 0 || row.Item8 != 0)
                merged.Add(row);
        }

        var sorted = SortedInMemory(merged, r, payload, "date", true,
            ("date", x => x.Date), ("appointments", x => x.Appointments), ("visits", x => x.Visits),
            ("admissions", x => x.Admissions), ("invoices", x => x.Invoices),
            ("revenue", x => x.Revenue), ("collected", x => x.Collected));

        payload.TotalCount = sorted.Count;
        foreach (var x in sorted.Skip((r.PageNumber - 1) * r.PageSize).Take(r.PageSize))
        {
            payload.Rows.Add(new()
            {
                ["date"] = x.Date, ["appointments"] = x.Appointments, ["completed"] = x.Completed,
                ["visits"] = x.Visits, ["admissions"] = x.Admissions, ["invoices"] = x.Invoices,
                ["revenue"] = x.Revenue, ["collected"] = x.Collected,
            });
        }

        return payload;
    }

    private async Task<Dictionary<Guid, string>> BranchNamesAsync(ReportRequest r, CancellationToken ct) =>
        await Raw<ClinIQ.Domain.Entities.Tenancy.Branch>()
            .Where(b => b.TenantId == r.TenantId)
            .ToDictionaryAsync(b => b.Id, b => b.Name, ct);

    // ------------------------------------------------------------------
    // Location comparison (financial, All Locations callers only)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildLocationComparisonAsync(ReportRequest r, CancellationToken ct)
    {
        var branchIds = r.BranchId.HasValue ? new List<Guid> { r.BranchId.Value } : r.AllowedBranchIds.ToList();
        var names = await BranchNamesAsync(r, ct);

        var patients = await In<Patient>(r).Where(p => p.CreatedAt >= r.Start && p.CreatedAt < r.End)
            .GroupBy(p => p.BranchId).Select(g => new { g.Key, N = g.Count() }).ToListAsync(ct);
        var appointments = await In<Appointment>(r).Where(a => a.AppointmentDate >= r.Start && a.AppointmentDate < r.End)
            .GroupBy(a => a.BranchId).Select(g => new { g.Key, N = g.Count() }).ToListAsync(ct);
        var visits = await In<Visit>(r).Where(v => v.VisitDate >= r.Start && v.VisitDate < r.End)
            .GroupBy(v => v.BranchId).Select(g => new { g.Key, N = g.Count() }).ToListAsync(ct);
        var admissions = await In<Admission>(r).Where(a => a.AdmissionDate >= r.Start && a.AdmissionDate < r.End)
            .GroupBy(a => a.BranchId).Select(g => new { g.Key, N = g.Count() }).ToListAsync(ct);
        var orders = await In<MedicalOrder>(r).Where(m => m.OrderDate >= r.Start && m.OrderDate < r.End)
            .GroupBy(m => new { m.BranchId, m.OrderType }).Select(g => new { g.Key.BranchId, g.Key.OrderType, N = g.Count() }).ToListAsync(ct);
        var revenue = await In<Invoice>(r).Where(i => i.InvoiceDate >= r.Start && i.InvoiceDate < r.End && i.Status != InvoiceStatus.Cancelled)
            .GroupBy(i => i.BranchId).Select(g => new { g.Key, Revenue = g.Sum(i => i.TotalAmount), Outstanding = g.Sum(i => i.OutstandingAmount) }).ToListAsync(ct);
        var collected = await In<Payment>(r).Where(p => p.PaymentDate >= r.Start && p.PaymentDate < r.End && !p.IsRefund)
            .GroupBy(p => p.BranchId).Select(g => new { g.Key, Sum = g.Sum(p => p.Amount) }).ToListAsync(ct);
        var beds = await In<Bed>(r)
            .GroupBy(b => b.BranchId).Select(g => new { g.Key, Total = g.Count(), Occupied = g.Count(b => b.Status == BedStatus.Occupied) }).ToListAsync(ct);

        var rows = branchIds.Select(id => new
        {
            Id = id,
            Name = names.GetValueOrDefault(id) ?? "Unknown",
            Patients = patients.FirstOrDefault(x => x.Key == id)?.N ?? 0,
            Appointments = appointments.FirstOrDefault(x => x.Key == id)?.N ?? 0,
            Visits = visits.FirstOrDefault(x => x.Key == id)?.N ?? 0,
            Admissions = admissions.FirstOrDefault(x => x.Key == id)?.N ?? 0,
            Lab = orders.Where(x => x.BranchId == id && x.OrderType == MedicalOrderType.Lab).Sum(x => x.N),
            Radiology = orders.Where(x => x.BranchId == id && x.OrderType == MedicalOrderType.Radiology).Sum(x => x.N),
            Revenue = revenue.FirstOrDefault(x => x.Key == id)?.Revenue ?? 0m,
            Collected = collected.FirstOrDefault(x => x.Key == id)?.Sum ?? 0m,
            Outstanding = revenue.FirstOrDefault(x => x.Key == id)?.Outstanding ?? 0m,
            Occupancy = Pct(beds.FirstOrDefault(x => x.Key == id)?.Occupied ?? 0, beds.FirstOrDefault(x => x.Key == id)?.Total ?? 0),
        }).ToList();

        var payload = NewPayload("location-comparison");
        payload.Summary.Add(new("locations", "Locations", rows.Count, "number"));
        payload.Summary.Add(new("revenue", "Total Revenue", rows.Sum(x => x.Revenue), "currency", "primary"));
        payload.Summary.Add(new("collected", "Total Collections", rows.Sum(x => x.Collected), "currency", "success"));
        payload.Summary.Add(new("visits", "Total Visits", rows.Sum(x => x.Visits), "number"));
        payload.Summary.Add(new("admissions", "Total Admissions", rows.Sum(x => x.Admissions), "number"));

        payload.Series.Add(Breakdown("Revenue by Location", rows.Select(x => ((string?)x.Name, x.Revenue)), "currency"));
        payload.Series.Add(Breakdown("Visits by Location", rows.Select(x => ((string?)x.Name, (decimal)x.Visits))));
        payload.Series.Add(Breakdown("New Patients by Location", rows.Select(x => ((string?)x.Name, (decimal)x.Patients))));

        payload.Columns.AddRange(new[]
        {
            new ReportField("location", "Location", "text"),
            new ReportField("patients", "New Patients", "number"),
            new ReportField("appointments", "Appointments", "number"),
            new ReportField("visits", "Visits", "number"),
            new ReportField("admissions", "Admissions", "number"),
            new ReportField("lab", "Lab Orders", "number"),
            new ReportField("radiology", "Radiology", "number"),
            new ReportField("revenue", "Revenue", "currency"),
            new ReportField("collected", "Collected", "currency"),
            new ReportField("outstanding", "Outstanding", "currency"),
            new ReportField("occupancy", "Bed Occupancy", "percent"),
        });

        var sorted = SortedInMemory(rows, r, payload, "revenue", true,
            ("location", x => x.Name), ("patients", x => x.Patients), ("appointments", x => x.Appointments),
            ("visits", x => x.Visits), ("admissions", x => x.Admissions), ("lab", x => x.Lab),
            ("radiology", x => x.Radiology), ("revenue", x => x.Revenue), ("collected", x => x.Collected),
            ("outstanding", x => x.Outstanding), ("occupancy", x => x.Occupancy));

        payload.TotalCount = sorted.Count;
        foreach (var x in sorted.Skip((r.PageNumber - 1) * r.PageSize).Take(r.PageSize))
        {
            payload.Rows.Add(new()
            {
                ["location"] = x.Name, ["patients"] = x.Patients, ["appointments"] = x.Appointments,
                ["visits"] = x.Visits, ["admissions"] = x.Admissions, ["lab"] = x.Lab, ["radiology"] = x.Radiology,
                ["revenue"] = x.Revenue, ["collected"] = x.Collected, ["outstanding"] = x.Outstanding,
                ["occupancy"] = x.Occupancy,
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Patients
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildPatientsAsync(ReportRequest r, CancellationToken ct)
    {
        var scope = In<Patient>(r);
        var inPeriod = scope.Where(p => p.CreatedAt >= r.Start && p.CreatedAt < r.End);

        if (TryEnum<Gender>(r.Gender, out var gender))
            inPeriod = inPeriod.Where(p => p.Gender == gender);
        if (r.Search is { } s)
            inPeriod = inPeriod.Where(p => p.PatientNumber.ToLower().Contains(s)
                || (p.MRN != null && p.MRN.ToLower().Contains(s))
                || (p.FirstName + " " + p.LastName).ToLower().Contains(s)
                || (p.Phone != null && p.Phone.Contains(s)));

        var totalPatients = await scope.CountAsync(ct);
        var newInPeriod = await inPeriod.CountAsync(ct);
        var activeCount = await scope.CountAsync(p => p.IsActive, ct);

        // Returning = registered before the period and seen (visit) during it.
        var returning = await In<Visit>(r)
            .Where(v => v.VisitDate >= r.Start && v.VisitDate < r.End)
            .Join(scope.Where(p => p.CreatedAt < r.Start), v => v.PatientId, p => p.Id, (v, p) => p.Id)
            .Distinct()
            .CountAsync(ct);

        var daily = await inPeriod.GroupBy(p => p.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() }).ToListAsync(ct);
        var genderSplit = await inPeriod.GroupBy(p => p.Gender)
            .Select(g => new { Gender = g.Key, Count = g.Count() }).ToListAsync(ct);

        var today = DateTime.UtcNow.Date;
        var d18 = today.AddYears(-18); var d36 = today.AddYears(-36); var d61 = today.AddYears(-61);
        var ageGroups = new List<(string?, decimal)>
        {
            ("0–17", await inPeriod.CountAsync(p => p.DateOfBirth > d18, ct)),
            ("18–35", await inPeriod.CountAsync(p => p.DateOfBirth <= d18 && p.DateOfBirth > d36, ct)),
            ("36–60", await inPeriod.CountAsync(p => p.DateOfBirth <= d36 && p.DateOfBirth > d61, ct)),
            ("61+", await inPeriod.CountAsync(p => p.DateOfBirth <= d61, ct)),
            ("Unknown", await inPeriod.CountAsync(p => p.DateOfBirth == null, ct)),
        };

        var payload = NewPayload("patients");
        payload.TotalCount = newInPeriod;
        payload.Summary.Add(new("newInPeriod", "New Registrations", newInPeriod, "number", "primary"));
        payload.Summary.Add(new("returning", "Returning Patients", returning, "number", "success"));
        payload.Summary.Add(new("totalPatients", "Total Patients", totalPatients, "number"));
        payload.Summary.Add(new("activePatients", "Active Patients", activeCount, "number"));

        payload.Series.Add(Trend("Registrations", r, daily.Select(d => (d.Date, (decimal)d.Count))));
        payload.Series.Add(Breakdown("Gender", genderSplit.Select(g => (g.Gender?.ToString() ?? "Not specified", (decimal)g.Count))));
        payload.Series.Add(new SeriesData("Age Groups", "breakdown", "number",
            ageGroups.Where(a => a.Item2 > 0).Select(a => new SeriesPoint(a.Item1!, a.Item2)).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("patientNumber", "Patient #", "text"),
            new ReportField("mrn", "MRN", "text"),
            new ReportField("name", "Name", "text"),
            new ReportField("gender", "Gender", "text"),
            new ReportField("age", "Age", "number"),
            new ReportField("phone", "Phone", "text"),
            new ReportField("registeredOn", "Registered On", "datetime"),
            new ReportField("status", "Status", "status"),
        });

        var page = await Page(Sorted(inPeriod, r, payload, "registeredOn", true,
                ("patientNumber", p => p.PatientNumber), ("mrn", p => p.MRN),
                ("name", p => p.FirstName + " " + p.LastName), ("gender", p => p.Gender),
                ("registeredOn", p => p.CreatedAt), ("status", p => p.IsActive)), r)
            .Select(p => new { p.PatientNumber, p.MRN, p.FirstName, p.LastName, p.Gender, p.DateOfBirth, p.Phone, p.IsActive, p.CreatedAt })
            .ToListAsync(ct);

        foreach (var p in page)
        {
            int? age = null;
            if (p.DateOfBirth.HasValue)
            {
                var dob = p.DateOfBirth.Value.Date;
                age = today.Year - dob.Year;
                if (dob > today.AddYears(-age.Value)) age--;
            }

            payload.Rows.Add(new()
            {
                ["patientNumber"] = p.PatientNumber,
                ["mrn"] = p.MRN,
                ["name"] = $"{p.FirstName} {p.LastName}".Trim(),
                ["gender"] = p.Gender?.ToString(),
                ["age"] = age,
                ["phone"] = p.Phone,
                ["registeredOn"] = p.CreatedAt,
                ["status"] = p.IsActive ? "Active" : "Inactive",
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Appointments
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildAppointmentsAsync(ReportRequest r, CancellationToken ct)
    {
        var filtered = In<Appointment>(r).Where(a => a.AppointmentDate >= r.Start && a.AppointmentDate < r.End);
        if (r.DoctorId is { } doctorId) filtered = filtered.Where(a => a.DoctorId == doctorId);
        if (r.DepartmentId is { } departmentId) filtered = filtered.Where(a => a.DepartmentId == departmentId);
        if (TryEnum<AppointmentStatus>(r.Status, out var status)) filtered = filtered.Where(a => a.Status == status);

        var query =
            from a in filtered
            join p in Raw<Patient>() on a.PatientId equals p.Id
            join u in Raw<ClinIQ.Domain.Entities.Identity.ApplicationUser>() on a.DoctorId equals u.Id into uj
            from u in uj.DefaultIfEmpty()
            join d in Raw<ClinIQ.Domain.Entities.Tenancy.Department>() on a.DepartmentId equals d.Id into dj
            from d in dj.DefaultIfEmpty()
            select new
            {
                a.AppointmentNumber, a.AppointmentDate, a.StartTime, a.Status, a.Type, a.IsTelemedicine,
                PatientName = p.FirstName + " " + p.LastName,
                DoctorName = u.FirstName + " " + u.LastName,
                DepartmentName = d.Name,
            };

        if (r.Search is { } s)
            query = query.Where(x => x.AppointmentNumber.ToLower().Contains(s)
                || x.PatientName.ToLower().Contains(s) || x.DoctorName.ToLower().Contains(s));

        var totalCount = await query.CountAsync(ct);
        var statusSplit = await query.GroupBy(x => x.Status).Select(g => new { Status = g.Key, Count = g.Count() }).ToListAsync(ct);
        var daily = await query.GroupBy(x => x.AppointmentDate.Date).Select(g => new { Date = g.Key, Count = g.Count() }).ToListAsync(ct);
        var byDoctor = await query.GroupBy(x => x.DoctorName).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);
        var byDepartment = await query.GroupBy(x => x.DepartmentName).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);

        int Count(params AppointmentStatus[] s) => statusSplit.Where(x => s.Contains(x.Status)).Sum(x => x.Count);
        var completed = Count(AppointmentStatus.Completed);

        var payload = NewPayload("appointments");
        payload.TotalCount = totalCount;
        payload.Summary.Add(new("total", "Appointments", totalCount, "number", "primary"));
        payload.Summary.Add(new("completed", "Completed", completed, "number", "success"));
        payload.Summary.Add(new("pending", "Pending",
            Count(AppointmentStatus.Scheduled, AppointmentStatus.Confirmed, AppointmentStatus.CheckedIn, AppointmentStatus.InProgress), "number"));
        payload.Summary.Add(new("cancelled", "Cancelled", Count(AppointmentStatus.Cancelled), "number", "danger"));
        payload.Summary.Add(new("noShow", "No Show", Count(AppointmentStatus.NoShow), "number", "warning"));
        payload.Summary.Add(new("completionRate", "Completion Rate", Pct(completed, totalCount), "percent"));

        payload.Series.Add(Trend("Daily Appointments", r, daily.Select(d => (d.Date, (decimal)d.Count))));
        payload.Series.Add(Breakdown("By Status", statusSplit.Select(x => ((string?)x.Status.ToString(), (decimal)x.Count))));
        payload.Series.Add(Breakdown("By Doctor", byDoctor.Select(x => ((string?)x.Key, (decimal)x.Count))));
        payload.Series.Add(Breakdown("By Department", byDepartment.Select(x => (x.Key, (decimal)x.Count))));

        payload.Columns.AddRange(new[]
        {
            new ReportField("appointmentNumber", "Appointment #", "text"),
            new ReportField("scheduledFor", "Scheduled For", "datetime"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("doctor", "Doctor", "text"),
            new ReportField("department", "Department", "text"),
            new ReportField("type", "Type", "text"),
            new ReportField("status", "Status", "status"),
        });

        var page = await Page(Sorted(query, r, payload, "scheduledFor", true,
            ("appointmentNumber", x => x.AppointmentNumber), ("scheduledFor", x => x.AppointmentDate),
            ("patient", x => x.PatientName), ("doctor", x => x.DoctorName), ("department", x => x.DepartmentName),
            ("type", x => x.Type), ("status", x => x.Status)), r).ToListAsync(ct);

        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["appointmentNumber"] = x.AppointmentNumber,
                ["scheduledFor"] = x.AppointmentDate.Date.Add(x.StartTime),
                ["patient"] = x.PatientName,
                ["doctor"] = x.DoctorName,
                ["department"] = x.DepartmentName,
                ["type"] = x.Type.ToString() + (x.IsTelemedicine ? " (Tele)" : string.Empty),
                ["status"] = x.Status.ToString(),
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // OPD visits
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildOpdAsync(ReportRequest r, CancellationToken ct)
    {
        var filtered = In<Visit>(r).Where(v => v.VisitType == VisitType.OPD && v.VisitDate >= r.Start && v.VisitDate < r.End);
        if (r.DoctorId is { } doctorId) filtered = filtered.Where(v => v.DoctorId == doctorId);
        if (r.DepartmentId is { } departmentId) filtered = filtered.Where(v => v.DepartmentId == departmentId);
        filtered = r.Status switch
        {
            "Completed" => filtered.Where(v => v.IsCompleted),
            "In Progress" => filtered.Where(v => !v.IsCompleted),
            "Billed" => filtered.Where(v => v.IsBilled),
            "Unbilled" => filtered.Where(v => !v.IsBilled),
            _ => filtered,
        };

        var query =
            from v in filtered
            join p in Raw<Patient>() on v.PatientId equals p.Id
            join u in Raw<ClinIQ.Domain.Entities.Identity.ApplicationUser>() on v.DoctorId equals u.Id into uj
            from u in uj.DefaultIfEmpty()
            join d in Raw<ClinIQ.Domain.Entities.Tenancy.Department>() on v.DepartmentId equals d.Id into dj
            from d in dj.DefaultIfEmpty()
            select new
            {
                v.VisitNumber, v.VisitDate, v.IsCompleted, v.IsBilled, v.PatientId,
                PatientName = p.FirstName + " " + p.LastName,
                DoctorName = u.FirstName + " " + u.LastName,
                DepartmentName = d.Name,
            };

        if (r.Search is { } s)
            query = query.Where(x => x.VisitNumber.ToLower().Contains(s)
                || x.PatientName.ToLower().Contains(s) || x.DoctorName.ToLower().Contains(s));

        var totalCount = await query.CountAsync(ct);
        var completedCount = await query.CountAsync(x => x.IsCompleted, ct);
        var billedCount = await query.CountAsync(x => x.IsBilled, ct);
        var uniquePatients = await query.Select(x => x.PatientId).Distinct().CountAsync(ct);
        var daily = await query.GroupBy(x => x.VisitDate.Date).Select(g => new { Date = g.Key, Count = g.Count() }).ToListAsync(ct);
        var byDoctor = await query.GroupBy(x => x.DoctorName).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);
        var byDepartment = await query.GroupBy(x => x.DepartmentName).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);

        var payload = NewPayload("opd");
        payload.TotalCount = totalCount;
        payload.Summary.Add(new("total", "OPD Visits", totalCount, "number", "primary"));
        payload.Summary.Add(new("patients", "Unique Patients", uniquePatients, "number"));
        payload.Summary.Add(new("completed", "Completed", completedCount, "number", "success"));
        payload.Summary.Add(new("inProgress", "In Progress", totalCount - completedCount, "number", "warning"));
        payload.Summary.Add(new("billed", "Billed", billedCount, "number"));

        payload.Series.Add(Trend("Daily Visits", r, daily.Select(d => (d.Date, (decimal)d.Count))));
        payload.Series.Add(Breakdown("By Doctor", byDoctor.Select(x => ((string?)x.Key, (decimal)x.Count))));
        payload.Series.Add(Breakdown("By Department", byDepartment.Select(x => (x.Key, (decimal)x.Count))));

        payload.Columns.AddRange(new[]
        {
            new ReportField("visitNumber", "Visit #", "text"),
            new ReportField("visitDate", "Visit Date", "datetime"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("doctor", "Doctor", "text"),
            new ReportField("department", "Department", "text"),
            new ReportField("completed", "Status", "status"),
            new ReportField("billed", "Billing", "status"),
        });

        var page = await Page(Sorted(query, r, payload, "visitDate", true,
            ("visitNumber", x => x.VisitNumber), ("visitDate", x => x.VisitDate), ("patient", x => x.PatientName),
            ("doctor", x => x.DoctorName), ("department", x => x.DepartmentName),
            ("completed", x => x.IsCompleted), ("billed", x => x.IsBilled)), r).ToListAsync(ct);

        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["visitNumber"] = x.VisitNumber,
                ["visitDate"] = x.VisitDate,
                ["patient"] = x.PatientName,
                ["doctor"] = x.DoctorName,
                ["department"] = x.DepartmentName,
                ["completed"] = x.IsCompleted ? "Completed" : "In Progress",
                ["billed"] = x.IsBilled ? "Billed" : "Unbilled",
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // IPD admissions
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildIpdAsync(ReportRequest r, CancellationToken ct)
    {
        var all = In<Admission>(r);
        var filtered = all.Where(a => a.AdmissionDate >= r.Start && a.AdmissionDate < r.End);
        if (r.DoctorId is { } doctorId) filtered = filtered.Where(a => a.AttendingDoctorId == doctorId);
        if (r.DepartmentId is { } departmentId) filtered = filtered.Where(a => a.DepartmentId == departmentId);
        if (TryEnum<AdmissionStatus>(r.Status, out var status)) filtered = filtered.Where(a => a.Status == status);

        var query =
            from a in filtered
            join p in Raw<Patient>() on a.PatientId equals p.Id
            join u in Raw<ClinIQ.Domain.Entities.Identity.ApplicationUser>() on a.AttendingDoctorId equals u.Id into uj
            from u in uj.DefaultIfEmpty()
            join b in Raw<Bed>() on a.CurrentBedId equals b.Id into bj
            from b in bj.DefaultIfEmpty()
            join w in Raw<Ward>() on a.CurrentWardId equals w.Id into wj
            from w in wj.DefaultIfEmpty()
            select new
            {
                a.AdmissionNumber, a.AdmissionDate, a.DischargeDate, a.Status, a.AdmissionType,
                PatientName = p.FirstName + " " + p.LastName,
                DoctorName = u.FirstName + " " + u.LastName,
                BedNumber = b.BedNumber,
                WardName = w.Name,
            };

        if (r.Search is { } s)
            query = query.Where(x => x.AdmissionNumber.ToLower().Contains(s)
                || x.PatientName.ToLower().Contains(s) || x.DoctorName.ToLower().Contains(s));

        var totalCount = await query.CountAsync(ct);
        var discharged = all.Where(a => a.DischargeDate != null && a.DischargeDate >= r.Start && a.DischargeDate < r.End);
        var dischargeCount = await discharged.CountAsync(ct);
        var currentlyAdmitted = await all.CountAsync(a => a.Status == AdmissionStatus.Admitted
            || a.Status == AdmissionStatus.InTreatment || a.Status == AdmissionStatus.ReadyForDischarge, ct);
        var deaths = await query.CountAsync(a => a.Status == AdmissionStatus.Deceased, ct);

        // Length of stay over discharges in the period (two dates per row only).
        var stays = await discharged.Select(a => new { a.AdmissionDate, Discharge = a.DischargeDate!.Value }).ToListAsync(ct);
        var avgLos = stays.Count > 0 ? Math.Round(stays.Average(x => Math.Max((x.Discharge - x.AdmissionDate).TotalDays, 0)), 1) : 0;

        var totalBeds = await In<Bed>(r).CountAsync(ct);
        var occupiedBeds = await In<Bed>(r).CountAsync(b => b.Status == BedStatus.Occupied, ct);

        var dailyAdmissions = await query.GroupBy(a => a.AdmissionDate.Date).Select(g => new { Date = g.Key, Count = g.Count() }).ToListAsync(ct);
        var dailyDischarges = await discharged.GroupBy(a => a.DischargeDate!.Value.Date).Select(g => new { Date = g.Key, Count = g.Count() }).ToListAsync(ct);
        var byWard = await query.GroupBy(x => x.WardName).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);
        var byDoctor = await query.GroupBy(x => x.DoctorName).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);

        var payload = NewPayload("ipd");
        payload.TotalCount = totalCount;
        payload.Summary.Add(new("admissions", "Admissions", totalCount, "number", "primary"));
        payload.Summary.Add(new("discharges", "Discharges", dischargeCount, "number", "success"));
        payload.Summary.Add(new("currentlyAdmitted", "Currently Admitted", currentlyAdmitted, "number"));
        payload.Summary.Add(new("avgLos", "Avg Length of Stay", avgLos, "days"));
        payload.Summary.Add(new("occupancy", "Bed Occupancy", Pct(occupiedBeds, totalBeds), "percent"));
        payload.Summary.Add(new("deaths", "Deaths (Period)", deaths, "number", "danger"));

        payload.Series.Add(Trend("Admissions", r, dailyAdmissions.Select(d => (d.Date, (decimal)d.Count))));
        payload.Series.Add(Trend("Discharges", r, dailyDischarges.Select(d => (d.Date, (decimal)d.Count))));
        payload.Series.Add(Breakdown("By Ward", byWard.Select(x => (x.Key, (decimal)x.Count))));
        payload.Series.Add(Breakdown("By Attending Doctor", byDoctor.Select(x => ((string?)x.Key, (decimal)x.Count))));

        payload.Columns.AddRange(new[]
        {
            new ReportField("admissionNumber", "Admission #", "text"),
            new ReportField("admittedOn", "Admitted", "datetime"),
            new ReportField("dischargedOn", "Discharged", "datetime"),
            new ReportField("los", "Stay (days)", "number"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("doctor", "Attending Doctor", "text"),
            new ReportField("ward", "Ward", "text"),
            new ReportField("bed", "Bed", "text"),
            new ReportField("type", "Type", "text"),
            new ReportField("status", "Status", "status"),
        });

        var page = await Page(Sorted(query, r, payload, "admittedOn", true,
            ("admissionNumber", x => x.AdmissionNumber), ("admittedOn", x => x.AdmissionDate),
            ("dischargedOn", x => x.DischargeDate), ("patient", x => x.PatientName), ("doctor", x => x.DoctorName),
            ("ward", x => x.WardName), ("bed", x => x.BedNumber), ("type", x => x.AdmissionType), ("status", x => x.Status)), r)
            .ToListAsync(ct);

        var now = DateTime.UtcNow;
        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["admissionNumber"] = x.AdmissionNumber,
                ["admittedOn"] = x.AdmissionDate,
                ["dischargedOn"] = x.DischargeDate,
                ["los"] = Math.Round(Math.Max(((x.DischargeDate ?? now) - x.AdmissionDate).TotalDays, 0), 1),
                ["patient"] = x.PatientName,
                ["doctor"] = x.DoctorName,
                ["ward"] = x.WardName,
                ["bed"] = x.BedNumber,
                ["type"] = x.AdmissionType.ToString(),
                ["status"] = x.Status.ToString(),
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Beds / occupancy (as of now — no date range)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildBedsAsync(ReportRequest r, CancellationToken ct)
    {
        var query =
            from b in In<Bed>(r)
            join rm in Raw<Room>() on b.RoomId equals rm.Id
            join w in Raw<Ward>() on rm.WardId equals w.Id
            select new { b.BedNumber, b.BedType, b.Status, b.DailyRate, b.IsActive, RoomNumber = rm.RoomNumber, WardName = w.Name };

        var totalCount = await query.CountAsync(ct);
        var occupiedCount = await query.CountAsync(x => x.Status == BedStatus.Occupied, ct);
        var availableCount = await query.CountAsync(x => x.Status == BedStatus.Available, ct);
        var outOfServiceCount = await query.CountAsync(x => x.Status == BedStatus.Maintenance
            || x.Status == BedStatus.Blocked || x.Status == BedStatus.OutOfService, ct);
        var statusSplit = await query.GroupBy(x => x.Status).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);
        var wardSplit = await query.GroupBy(x => x.WardName)
            .Select(g => new { g.Key, Total = g.Count(), Occupied = g.Count(x => x.Status == BedStatus.Occupied) }).ToListAsync(ct);

        var filtered = query;
        if (TryEnum<BedStatus>(r.Status, out var status)) filtered = filtered.Where(x => x.Status == status);
        if (r.Search is { } s)
            filtered = filtered.Where(x => x.BedNumber.ToLower().Contains(s) || x.WardName.ToLower().Contains(s) || x.RoomNumber.ToLower().Contains(s));

        var payload = NewPayload("beds");
        payload.TotalCount = await filtered.CountAsync(ct);
        payload.Summary.Add(new("totalBeds", "Total Beds", totalCount, "number"));
        payload.Summary.Add(new("occupied", "Occupied", occupiedCount, "number", "primary"));
        payload.Summary.Add(new("available", "Available", availableCount, "number", "success"));
        payload.Summary.Add(new("outOfService", "Out of Service", outOfServiceCount, "number", "danger"));
        payload.Summary.Add(new("occupancy", "Occupancy", Pct(occupiedCount, totalCount), "percent"));

        payload.Series.Add(Breakdown("By Status", statusSplit.Select(x => ((string?)x.Key.ToString(), (decimal)x.Count))));
        payload.Series.Add(new SeriesData("Ward Occupancy %", "breakdown", "percent", wardSplit
            .OrderByDescending(w => Pct(w.Occupied, w.Total))
            .Select(w => new SeriesPoint(w.Key, Pct(w.Occupied, w.Total))).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("bedNumber", "Bed", "text"),
            new ReportField("ward", "Ward", "text"),
            new ReportField("room", "Room", "text"),
            new ReportField("type", "Type", "text"),
            new ReportField("status", "Status", "status"),
            new ReportField("dailyRate", "Daily Rate", "currency"),
        });

        var page = await Page(Sorted(filtered, r, payload, "ward", false,
            ("bedNumber", x => x.BedNumber), ("ward", x => x.WardName), ("room", x => x.RoomNumber),
            ("type", x => x.BedType), ("status", x => x.Status), ("dailyRate", x => x.DailyRate)), r).ToListAsync(ct);

        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["bedNumber"] = x.BedNumber, ["ward"] = x.WardName, ["room"] = x.RoomNumber,
                ["type"] = x.BedType.ToString(), ["status"] = x.IsActive ? x.Status.ToString() : "Inactive",
                ["dailyRate"] = x.DailyRate,
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Laboratory / Radiology (shared MedicalOrder report)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildOrderReportAsync(string key, MedicalOrderType orderType, ReportRequest r, CancellationToken ct)
    {
        var filtered = In<MedicalOrder>(r).Where(m => m.OrderType == orderType && m.OrderDate >= r.Start && m.OrderDate < r.End);
        if (r.DoctorId is { } doctorId) filtered = filtered.Where(m => m.OrderedById == doctorId);
        filtered = r.Status switch
        {
            "Completed" => filtered.Where(m => m.Status == MedicalOrderStatus.Completed),
            "Verified" => filtered.Where(m => m.Status == MedicalOrderStatus.Verified),
            "Cancelled" => filtered.Where(m => m.Status == MedicalOrderStatus.Cancelled),
            "Pending" => filtered.Where(m => m.Status != MedicalOrderStatus.Completed
                && m.Status != MedicalOrderStatus.Verified && m.Status != MedicalOrderStatus.Cancelled),
            _ => filtered,
        };

        var labItems = Raw<LabOrderItem>();
        var radItems = Raw<RadiologyOrderItem>();

        var query =
            from m in filtered
            join p in Raw<Patient>() on m.PatientId equals p.Id
            join u in Raw<ClinIQ.Domain.Entities.Identity.ApplicationUser>() on m.OrderedById equals u.Id into uj
            from u in uj.DefaultIfEmpty()
            select new
            {
                m.Id, m.OrderNumber, m.OrderDate, m.Status, m.IsUrgent, m.CompletedAt,
                PatientName = p.FirstName + " " + p.LastName,
                OrderedByName = u.FirstName + " " + u.LastName,
                Tests = orderType == MedicalOrderType.Lab
                    ? labItems.Count(i => i.MedicalOrderId == m.Id)
                    : radItems.Count(i => i.MedicalOrderId == m.Id),
            };

        if (r.Search is { } s)
            query = query.Where(x => x.OrderNumber.ToLower().Contains(s) || x.PatientName.ToLower().Contains(s));

        var totalCount = await query.CountAsync(ct);
        var statusSplit = await query.GroupBy(x => x.Status).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);
        var urgent = await query.CountAsync(x => x.IsUrgent, ct);
        var daily = await query.GroupBy(x => x.OrderDate.Date).Select(g => new { Date = g.Key, Count = g.Count() }).ToListAsync(ct);
        var turnaround = await query.Where(x => x.CompletedAt != null)
            .Select(x => new { x.OrderDate, Completed = x.CompletedAt!.Value }).ToListAsync(ct);
        var avgTat = turnaround.Count > 0 ? Math.Round(turnaround.Average(x => Math.Max((x.Completed - x.OrderDate).TotalHours, 0)), 1) : 0;

        var orderIds = query.Select(x => x.Id);
        List<(string?, decimal)> topItems;
        List<(string?, decimal)>? secondary = null;
        if (orderType == MedicalOrderType.Lab)
        {
            topItems = (await labItems.Where(i => orderIds.Contains(i.MedicalOrderId))
                    .GroupBy(i => i.ServiceName).Select(g => new { g.Key, Count = g.Sum(i => i.Quantity) }).ToListAsync(ct))
                .Select(x => ((string?)x.Key, (decimal)x.Count)).ToList();
        }
        else
        {
            topItems = (await radItems.Where(i => orderIds.Contains(i.MedicalOrderId))
                    .GroupBy(i => i.Modality).Select(g => new { g.Key, Count = g.Sum(i => i.Quantity) }).ToListAsync(ct))
                .Select(x => (x.Key, (decimal)x.Count)).ToList();
            secondary = (await radItems.Where(i => orderIds.Contains(i.MedicalOrderId))
                    .GroupBy(i => i.BodyPart).Select(g => new { g.Key, Count = g.Sum(i => i.Quantity) }).ToListAsync(ct))
                .Select(x => (x.Key, (decimal)x.Count)).ToList();
        }

        int Count(params MedicalOrderStatus[] s) => statusSplit.Where(x => s.Contains(x.Key)).Sum(x => x.Count);
        var done = Count(MedicalOrderStatus.Completed, MedicalOrderStatus.Verified);
        var cancelled = Count(MedicalOrderStatus.Cancelled);

        var payload = NewPayload(key);
        payload.TotalCount = totalCount;
        payload.Summary.Add(new("orders", "Orders", totalCount, "number", "primary"));
        payload.Summary.Add(new("completed", "Completed / Verified", done, "number", "success"));
        payload.Summary.Add(new("verified", "Verified", Count(MedicalOrderStatus.Verified), "number"));
        payload.Summary.Add(new("pending", "Pending", totalCount - done - cancelled, "number", "warning"));
        payload.Summary.Add(new("cancelled", "Cancelled", cancelled, "number", "danger"));
        payload.Summary.Add(new("urgent", "Urgent", urgent, "number"));
        payload.Summary.Add(new("tat", "Avg Turnaround", avgTat, "hours"));

        payload.Series.Add(Trend("Daily Orders", r, daily.Select(d => (d.Date, (decimal)d.Count))));
        payload.Series.Add(Breakdown("By Status", statusSplit.Select(x => ((string?)x.Key.ToString(), (decimal)x.Count))));
        payload.Series.Add(Breakdown(orderType == MedicalOrderType.Lab ? "Top Tests" : "By Modality", topItems));
        if (secondary is not null)
            payload.Series.Add(Breakdown("By Body Part", secondary));

        payload.Columns.AddRange(new[]
        {
            new ReportField("orderNumber", "Order #", "text"),
            new ReportField("orderedOn", "Ordered", "datetime"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("orderedBy", "Ordered By", "text"),
            new ReportField("tests", orderType == MedicalOrderType.Lab ? "Tests" : "Studies", "number"),
            new ReportField("status", "Status", "status"),
            new ReportField("urgent", "Priority", "status"),
            new ReportField("completedOn", "Completed", "datetime"),
        });

        var page = await Page(Sorted(query, r, payload, "orderedOn", true,
            ("orderNumber", x => x.OrderNumber), ("orderedOn", x => x.OrderDate), ("patient", x => x.PatientName),
            ("orderedBy", x => x.OrderedByName), ("tests", x => x.Tests), ("status", x => x.Status),
            ("urgent", x => x.IsUrgent), ("completedOn", x => x.CompletedAt)), r).ToListAsync(ct);

        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["orderNumber"] = x.OrderNumber, ["orderedOn"] = x.OrderDate, ["patient"] = x.PatientName,
                ["orderedBy"] = x.OrderedByName, ["tests"] = x.Tests, ["status"] = x.Status.ToString(),
                ["urgent"] = x.IsUrgent ? "Urgent" : "Routine", ["completedOn"] = x.CompletedAt,
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Pharmacy / prescriptions
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildPharmacyAsync(ReportRequest r, CancellationToken ct)
    {
        var filtered = In<Prescription>(r).Where(p => p.PrescriptionDate >= r.Start && p.PrescriptionDate < r.End);
        if (r.DoctorId is { } doctorId) filtered = filtered.Where(p => p.DoctorId == doctorId);
        filtered = r.Status switch
        {
            "Dispensed" => filtered.Where(p => p.IsDispensed),
            "Pending" => filtered.Where(p => !p.IsDispensed),
            _ => filtered,
        };

        var items = Raw<PrescriptionItem>();
        var query =
            from pr in filtered
            join p in Raw<Patient>() on pr.PatientId equals p.Id
            join u in Raw<ClinIQ.Domain.Entities.Identity.ApplicationUser>() on pr.DoctorId equals u.Id into uj
            from u in uj.DefaultIfEmpty()
            select new
            {
                pr.Id, pr.PrescriptionNumber, pr.PrescriptionDate, pr.IsDispensed, pr.DispensedAt,
                ItemCount = items.Count(i => i.PrescriptionId == pr.Id),
                PatientName = p.FirstName + " " + p.LastName,
                DoctorName = u.FirstName + " " + u.LastName,
            };

        if (r.Search is { } s)
            query = query.Where(x => x.PrescriptionNumber.ToLower().Contains(s)
                || x.PatientName.ToLower().Contains(s) || x.DoctorName.ToLower().Contains(s));

        var totalCount = await query.CountAsync(ct);
        var dispensedCount = await query.CountAsync(x => x.IsDispensed, ct);
        var totalItems = await query.SumAsync(x => x.ItemCount, ct);
        var daily = await query.GroupBy(x => x.PrescriptionDate.Date)
            .Select(g => new { Date = g.Key, Total = g.Count(), Dispensed = g.Count(x => x.IsDispensed) }).ToListAsync(ct);
        var ids = query.Select(x => x.Id);
        var topMedicines = await items.Where(i => ids.Contains(i.PrescriptionId))
            .GroupBy(i => i.MedicineName).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);
        var byDoctor = await query.GroupBy(x => x.DoctorName).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);

        var payload = NewPayload("pharmacy");
        payload.TotalCount = totalCount;
        payload.Summary.Add(new("prescriptions", "Prescriptions", totalCount, "number", "primary"));
        payload.Summary.Add(new("dispensed", "Dispensed", dispensedCount, "number", "success"));
        payload.Summary.Add(new("pendingDispense", "Pending Dispense", totalCount - dispensedCount, "number", "warning"));
        payload.Summary.Add(new("itemsPrescribed", "Items Prescribed", totalItems, "number"));
        payload.Summary.Add(new("dispenseRate", "Dispense Rate", Pct(dispensedCount, totalCount), "percent"));

        payload.Series.Add(Trend("Prescriptions", r, daily.Select(d => (d.Date, (decimal)d.Total))));
        payload.Series.Add(Trend("Dispensed", r, daily.Select(d => (d.Date, (decimal)d.Dispensed))));
        payload.Series.Add(Breakdown("Most Prescribed Medicines", topMedicines.Select(x => ((string?)x.Key, (decimal)x.Count))));
        payload.Series.Add(Breakdown("By Doctor", byDoctor.Select(x => ((string?)x.Key, (decimal)x.Count))));

        payload.Columns.AddRange(new[]
        {
            new ReportField("prescriptionNumber", "Prescription #", "text"),
            new ReportField("prescribedOn", "Prescribed", "datetime"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("doctor", "Doctor", "text"),
            new ReportField("items", "Items", "number"),
            new ReportField("dispensed", "Status", "status"),
            new ReportField("dispensedOn", "Dispensed", "datetime"),
        });

        var page = await Page(Sorted(query, r, payload, "prescribedOn", true,
            ("prescriptionNumber", x => x.PrescriptionNumber), ("prescribedOn", x => x.PrescriptionDate),
            ("patient", x => x.PatientName), ("doctor", x => x.DoctorName), ("items", x => x.ItemCount),
            ("dispensed", x => x.IsDispensed), ("dispensedOn", x => x.DispensedAt)), r).ToListAsync(ct);

        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["prescriptionNumber"] = x.PrescriptionNumber, ["prescribedOn"] = x.PrescriptionDate,
                ["patient"] = x.PatientName, ["doctor"] = x.DoctorName, ["items"] = x.ItemCount,
                ["dispensed"] = x.IsDispensed ? "Dispensed" : "Pending", ["dispensedOn"] = x.DispensedAt,
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Doctor activity — measured counts only, no scores
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildDoctorActivityAsync(ReportRequest r, CancellationToken ct)
    {
        var appointments = In<Appointment>(r).Where(a => a.AppointmentDate >= r.Start && a.AppointmentDate < r.End);
        var visits = In<Visit>(r).Where(v => v.VisitDate >= r.Start && v.VisitDate < r.End);
        var admissions = In<Admission>(r).Where(a => a.AdmissionDate >= r.Start && a.AdmissionDate < r.End);
        if (r.DepartmentId is { } departmentId)
        {
            appointments = appointments.Where(a => a.DepartmentId == departmentId);
            visits = visits.Where(v => v.DepartmentId == departmentId);
            admissions = admissions.Where(a => a.DepartmentId == departmentId);
        }

        var appt = await appointments.GroupBy(a => a.DoctorId).Select(g => new
        {
            g.Key, Total = g.Count(),
            Completed = g.Count(a => a.Status == AppointmentStatus.Completed),
            Cancelled = g.Count(a => a.Status == AppointmentStatus.Cancelled || a.Status == AppointmentStatus.NoShow),
        }).ToListAsync(ct);
        var visitCounts = await visits.GroupBy(v => v.DoctorId).Select(g => new { g.Key, N = g.Count() }).ToListAsync(ct);
        var admissionCounts = await admissions.GroupBy(a => a.AttendingDoctorId).Select(g => new { g.Key, N = g.Count() }).ToListAsync(ct);
        var orderCounts = await In<MedicalOrder>(r).Where(m => m.OrderDate >= r.Start && m.OrderDate < r.End)
            .GroupBy(m => new { m.OrderedById, m.OrderType }).Select(g => new { g.Key.OrderedById, g.Key.OrderType, N = g.Count() }).ToListAsync(ct);
        var rxCounts = await In<Prescription>(r).Where(p => p.PrescriptionDate >= r.Start && p.PrescriptionDate < r.End)
            .GroupBy(p => p.DoctorId).Select(g => new { g.Key, N = g.Count() }).ToListAsync(ct);

        // Revenue is attributed only through an explicit visit/appointment link
        // on the invoice — never estimated.
        var revenue = new Dictionary<Guid, decimal>();
        if (r.IncludeFinancial)
        {
            var linked =
                from i in In<Invoice>(r).Where(i => i.InvoiceDate >= r.Start && i.InvoiceDate < r.End && i.Status != InvoiceStatus.Cancelled)
                join v in Raw<Visit>() on i.VisitId equals v.Id into vj
                from v in vj.DefaultIfEmpty()
                join a in Raw<Appointment>() on i.AppointmentId equals a.Id into aj
                from a in aj.DefaultIfEmpty()
                select new { DoctorId = v != null ? (Guid?)v.DoctorId : (a != null ? (Guid?)a.DoctorId : null), i.TotalAmount };
            revenue = (await linked.Where(x => x.DoctorId != null)
                    .GroupBy(x => x.DoctorId).Select(g => new { g.Key, Sum = g.Sum(x => x.TotalAmount) }).ToListAsync(ct))
                .ToDictionary(x => x.Key!.Value, x => x.Sum);
        }

        var doctorIds = appt.Select(x => x.Key).Concat(visitCounts.Select(x => x.Key)).Concat(admissionCounts.Select(x => x.Key))
            .Concat(orderCounts.Select(x => x.OrderedById)).Concat(rxCounts.Select(x => x.Key)).Concat(revenue.Keys)
            .Distinct().ToList();
        if (r.DoctorId is { } only) doctorIds = doctorIds.Where(d => d == only).ToList();
        var names = await NamesAsync(doctorIds, ct);

        var rows = doctorIds.Select(id => new
        {
            Name = names.GetValueOrDefault(id) ?? "Unknown",
            Appointments = appt.FirstOrDefault(x => x.Key == id)?.Total ?? 0,
            Completed = appt.FirstOrDefault(x => x.Key == id)?.Completed ?? 0,
            Missed = appt.FirstOrDefault(x => x.Key == id)?.Cancelled ?? 0,
            Visits = visitCounts.FirstOrDefault(x => x.Key == id)?.N ?? 0,
            Admissions = admissionCounts.FirstOrDefault(x => x.Key == id)?.N ?? 0,
            Lab = orderCounts.Where(x => x.OrderedById == id && x.OrderType == MedicalOrderType.Lab).Sum(x => x.N),
            Radiology = orderCounts.Where(x => x.OrderedById == id && x.OrderType == MedicalOrderType.Radiology).Sum(x => x.N),
            Prescriptions = rxCounts.FirstOrDefault(x => x.Key == id)?.N ?? 0,
            Revenue = revenue.GetValueOrDefault(id),
        })
        .Where(x => r.Search == null || x.Name.ToLowerInvariant().Contains(r.Search))
        .ToList();

        var payload = NewPayload("doctor-activity");
        payload.Summary.Add(new("doctors", "Active Doctors", rows.Count, "number", "primary"));
        payload.Summary.Add(new("appointments", "Appointments", rows.Sum(x => x.Appointments), "number"));
        payload.Summary.Add(new("visits", "Visits", rows.Sum(x => x.Visits), "number"));
        payload.Summary.Add(new("admissions", "Admissions", rows.Sum(x => x.Admissions), "number"));
        payload.Summary.Add(new("orders", "Lab + Radiology Orders", rows.Sum(x => x.Lab + x.Radiology), "number"));
        payload.Summary.Add(new("prescriptions", "Prescriptions", rows.Sum(x => x.Prescriptions), "number"));
        if (r.IncludeFinancial)
            payload.Summary.Add(new("revenue", "Linked Revenue", rows.Sum(x => x.Revenue), "currency", "success"));

        payload.Series.Add(Breakdown("Appointments by Doctor", rows.Select(x => ((string?)x.Name, (decimal)x.Appointments))));
        payload.Series.Add(Breakdown("Visits by Doctor", rows.Select(x => ((string?)x.Name, (decimal)x.Visits))));
        if (r.IncludeFinancial)
            payload.Series.Add(Breakdown("Revenue by Doctor", rows.Select(x => ((string?)x.Name, x.Revenue)), "currency"));

        payload.Columns.AddRange(new[]
        {
            new ReportField("doctor", "Doctor", "text"),
            new ReportField("appointments", "Appointments", "number"),
            new ReportField("completed", "Completed", "number"),
            new ReportField("missed", "Cancelled / No-show", "number"),
            new ReportField("visits", "Visits", "number"),
            new ReportField("admissions", "Admissions", "number"),
            new ReportField("lab", "Lab Orders", "number"),
            new ReportField("radiology", "Radiology", "number"),
            new ReportField("prescriptions", "Prescriptions", "number"),
        });
        if (r.IncludeFinancial)
            payload.Columns.Add(new ReportField("revenue", "Linked Revenue", "currency"));

        var sorted = SortedInMemory(rows, r, payload, "appointments", true,
            ("doctor", x => x.Name), ("appointments", x => x.Appointments), ("completed", x => x.Completed),
            ("missed", x => x.Missed), ("visits", x => x.Visits), ("admissions", x => x.Admissions),
            ("lab", x => x.Lab), ("radiology", x => x.Radiology), ("prescriptions", x => x.Prescriptions),
            ("revenue", x => x.Revenue));
        if (!r.IncludeFinancial) payload.SortableKeys.Remove("revenue");

        payload.TotalCount = sorted.Count;
        foreach (var x in sorted.Skip((r.PageNumber - 1) * r.PageSize).Take(r.PageSize))
        {
            var row = new Dictionary<string, object?>
            {
                ["doctor"] = x.Name, ["appointments"] = x.Appointments, ["completed"] = x.Completed,
                ["missed"] = x.Missed, ["visits"] = x.Visits, ["admissions"] = x.Admissions,
                ["lab"] = x.Lab, ["radiology"] = x.Radiology, ["prescriptions"] = x.Prescriptions,
            };
            if (r.IncludeFinancial) row["revenue"] = x.Revenue;
            payload.Rows.Add(row);
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Billing / invoices (financial)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildBillingAsync(ReportRequest r, CancellationToken ct)
    {
        var inPeriod = In<Invoice>(r).Where(i => i.InvoiceDate >= r.Start && i.InvoiceDate < r.End);
        var filtered = inPeriod;
        if (TryEnum<InvoiceStatus>(r.Status, out var status)) filtered = filtered.Where(i => i.Status == status);

        var query =
            from i in filtered
            join p in Raw<Patient>() on i.PatientId equals p.Id
            select new
            {
                i.InvoiceNumber, i.InvoiceDate, i.Status, i.SubTotal, i.DiscountAmount, i.TaxAmount,
                i.TotalAmount, i.PaidAmount, i.OutstandingAmount, i.RefundedAmount, i.BranchId,
                PatientName = p.FirstName + " " + p.LastName,
            };
        if (r.Search is { } s)
            query = query.Where(x => x.InvoiceNumber.ToLower().Contains(s) || x.PatientName.ToLower().Contains(s));

        var billable = query.Where(x => x.Status != InvoiceStatus.Cancelled);
        var totalCount = await query.CountAsync(ct);
        var revenue = await billable.SumAsync(x => x.TotalAmount, ct);
        var discounts = await billable.SumAsync(x => x.DiscountAmount, ct);
        var outstanding = await billable.SumAsync(x => x.OutstandingAmount, ct);
        var refunded = await billable.SumAsync(x => x.RefundedAmount, ct);
        var billableCount = await billable.CountAsync(ct);
        var receivables = await In<Invoice>(r).Where(i => i.Status != InvoiceStatus.Cancelled).SumAsync(i => i.OutstandingAmount, ct);
        var collected = await In<Payment>(r).Where(p => p.PaymentDate >= r.Start && p.PaymentDate < r.End && !p.IsRefund).SumAsync(p => p.Amount, ct);

        var dailyRevenue = await billable.GroupBy(x => x.InvoiceDate.Date).Select(g => new { Date = g.Key, Total = g.Sum(x => x.TotalAmount) }).ToListAsync(ct);
        var dailyCollections = await In<Payment>(r).Where(p => p.PaymentDate >= r.Start && p.PaymentDate < r.End && !p.IsRefund)
            .GroupBy(p => p.PaymentDate.Date).Select(g => new { Date = g.Key, Total = g.Sum(p => p.Amount) }).ToListAsync(ct);
        var byStatus = await query.GroupBy(x => x.Status).Select(g => new { g.Key, Total = g.Sum(x => x.TotalAmount) }).ToListAsync(ct);

        var payload = NewPayload("billing");
        payload.TotalCount = totalCount;
        payload.Summary.Add(new("revenue", "Invoiced Revenue", revenue, "currency", "primary"));
        payload.Summary.Add(new("collected", "Collected (Period)", collected, "currency", "success"));
        payload.Summary.Add(new("outstanding", "Outstanding (Period)", outstanding, "currency", "warning"));
        payload.Summary.Add(new("receivables", "Total Receivables", receivables, "currency"));
        payload.Summary.Add(new("discounts", "Discounts Given", discounts, "currency"));
        payload.Summary.Add(new("refunded", "Refunded", refunded, "currency", "danger"));
        payload.Summary.Add(new("invoices", "Invoices", totalCount, "number"));
        payload.Summary.Add(new("average", "Average Invoice", billableCount > 0 ? Math.Round(revenue / billableCount, 2) : 0m, "currency"));

        payload.Series.Add(Trend("Revenue", r, dailyRevenue.Select(d => (d.Date, d.Total)), "currency"));
        payload.Series.Add(Trend("Collections", r, dailyCollections.Select(d => (d.Date, d.Total)), "currency"));
        payload.Series.Add(Breakdown("Invoice Value by Status", byStatus.Select(x => ((string?)x.Key.ToString(), x.Total)), "currency"));
        if (r.BranchId is null)
        {
            var names = await BranchNamesAsync(r, ct);
            var byLocation = await billable.GroupBy(x => x.BranchId).Select(g => new { g.Key, Total = g.Sum(x => x.TotalAmount) }).ToListAsync(ct);
            payload.Series.Add(Breakdown("Revenue by Location",
                byLocation.Select(x => (x.Key.HasValue ? names.GetValueOrDefault(x.Key.Value) : null, x.Total)), "currency"));
        }

        payload.Columns.AddRange(new[]
        {
            new ReportField("invoiceNumber", "Invoice #", "text"),
            new ReportField("invoiceDate", "Date", "datetime"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("status", "Status", "status"),
            new ReportField("subTotal", "Sub Total", "currency"),
            new ReportField("discount", "Discount", "currency"),
            new ReportField("tax", "Tax", "currency"),
            new ReportField("total", "Total", "currency"),
            new ReportField("paid", "Paid", "currency"),
            new ReportField("outstanding", "Outstanding", "currency"),
        });

        var page = await Page(Sorted(query, r, payload, "invoiceDate", true,
            ("invoiceNumber", x => x.InvoiceNumber), ("invoiceDate", x => x.InvoiceDate), ("patient", x => x.PatientName),
            ("status", x => x.Status), ("subTotal", x => x.SubTotal), ("discount", x => x.DiscountAmount),
            ("tax", x => x.TaxAmount), ("total", x => x.TotalAmount), ("paid", x => x.PaidAmount),
            ("outstanding", x => x.OutstandingAmount)), r).ToListAsync(ct);

        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["invoiceNumber"] = x.InvoiceNumber, ["invoiceDate"] = x.InvoiceDate, ["patient"] = x.PatientName,
                ["status"] = x.Status.ToString(), ["subTotal"] = x.SubTotal, ["discount"] = x.DiscountAmount,
                ["tax"] = x.TaxAmount, ["total"] = x.TotalAmount, ["paid"] = x.PaidAmount, ["outstanding"] = x.OutstandingAmount,
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Payments / collections / refunds (financial)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildPaymentsAsync(ReportRequest r, CancellationToken ct)
    {
        var inPeriod = In<Payment>(r).Where(p => p.PaymentDate >= r.Start && p.PaymentDate < r.End);
        var filtered = inPeriod;
        if (r.Status == "Refunds") filtered = filtered.Where(p => p.IsRefund);
        else if (TryEnum<PaymentMethod>(r.Status, out var method)) filtered = filtered.Where(p => p.PaymentMethod == method);

        var query =
            from pay in filtered
            join p in Raw<Patient>() on pay.PatientId equals p.Id
            join i in Raw<Invoice>() on pay.InvoiceId equals i.Id into ij
            from i in ij.DefaultIfEmpty()
            select new
            {
                pay.PaymentNumber, pay.PaymentDate, pay.Amount, pay.PaymentMethod, pay.Status,
                pay.IsRefund, pay.IsAdvancePayment, pay.ReferenceNumber,
                InvoiceNumber = i.InvoiceNumber,
                PatientName = p.FirstName + " " + p.LastName,
            };
        if (r.Search is { } s)
            query = query.Where(x => x.PaymentNumber.ToLower().Contains(s) || x.PatientName.ToLower().Contains(s)
                || (x.ReferenceNumber != null && x.ReferenceNumber.ToLower().Contains(s))
                || (x.InvoiceNumber != null && x.InvoiceNumber.ToLower().Contains(s)));

        var totalCount = await query.CountAsync(ct);
        var collected = await query.Where(x => !x.IsRefund).SumAsync(x => x.Amount, ct);
        var refunds = await query.Where(x => x.IsRefund).SumAsync(x => x.Amount, ct);
        var advances = await query.Where(x => x.IsAdvancePayment && !x.IsRefund).SumAsync(x => x.Amount, ct);
        var refundCount = await query.CountAsync(x => x.IsRefund, ct);
        var daily = await query.Where(x => !x.IsRefund).GroupBy(x => x.PaymentDate.Date).Select(g => new { Date = g.Key, Total = g.Sum(x => x.Amount) }).ToListAsync(ct);
        var dailyRefunds = await query.Where(x => x.IsRefund).GroupBy(x => x.PaymentDate.Date).Select(g => new { Date = g.Key, Total = g.Sum(x => x.Amount) }).ToListAsync(ct);
        var byMethod = await query.Where(x => !x.IsRefund).GroupBy(x => x.PaymentMethod).Select(g => new { g.Key, Total = g.Sum(x => x.Amount) }).ToListAsync(ct);

        var payload = NewPayload("payments");
        payload.TotalCount = totalCount;
        payload.Summary.Add(new("collected", "Collected", collected, "currency", "success"));
        payload.Summary.Add(new("refunds", "Refunded", refunds, "currency", "danger"));
        payload.Summary.Add(new("net", "Net Collection", collected - refunds, "currency", "primary"));
        payload.Summary.Add(new("advances", "Advance Payments", advances, "currency"));
        payload.Summary.Add(new("count", "Transactions", totalCount, "number"));
        payload.Summary.Add(new("refundCount", "Refund Transactions", refundCount, "number"));

        payload.Series.Add(Trend("Daily Collection", r, daily.Select(d => (d.Date, d.Total)), "currency"));
        payload.Series.Add(Trend("Refunds", r, dailyRefunds.Select(d => (d.Date, d.Total)), "currency"));
        payload.Series.Add(Breakdown("By Payment Method", byMethod.Select(x => ((string?)x.Key.ToString(), x.Total)), "currency"));

        payload.Columns.AddRange(new[]
        {
            new ReportField("paymentNumber", "Payment #", "text"),
            new ReportField("paymentDate", "Date", "datetime"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("invoiceNumber", "Invoice #", "text"),
            new ReportField("method", "Method", "text"),
            new ReportField("kind", "Type", "status"),
            new ReportField("amount", "Amount", "currency"),
            new ReportField("status", "Status", "status"),
            new ReportField("reference", "Reference", "text"),
        });

        var page = await Page(Sorted(query, r, payload, "paymentDate", true,
            ("paymentNumber", x => x.PaymentNumber), ("paymentDate", x => x.PaymentDate), ("patient", x => x.PatientName),
            ("invoiceNumber", x => x.InvoiceNumber), ("method", x => x.PaymentMethod), ("kind", x => x.IsRefund),
            ("amount", x => x.Amount), ("status", x => x.Status)), r).ToListAsync(ct);

        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["paymentNumber"] = x.PaymentNumber, ["paymentDate"] = x.PaymentDate, ["patient"] = x.PatientName,
                ["invoiceNumber"] = x.InvoiceNumber, ["method"] = x.PaymentMethod.ToString(),
                ["kind"] = x.IsRefund ? "Refund" : x.IsAdvancePayment ? "Advance" : "Payment",
                ["amount"] = x.Amount, ["status"] = x.Status.ToString(), ["reference"] = x.ReferenceNumber,
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Service-wise revenue (financial) — grouped in SQL
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildServiceRevenueAsync(ReportRequest r, CancellationToken ct)
    {
        var knownTypes = new[] { "Service", "Medicine", "Procedure", "Lab", "Radiology", "RoomCharge", "BedCharge" };

        var lines =
            from li in Raw<InvoiceItem>()
            join i in In<Invoice>(r).Where(i => i.InvoiceDate >= r.Start && i.InvoiceDate < r.End && i.Status != InvoiceStatus.Cancelled)
                on li.InvoiceId equals i.Id
            select li;

        if (r.Status == "Other")
            lines = lines.Where(li => li.ItemType == null || li.ItemType == "" || !knownTypes.Contains(li.ItemType));
        else if (r.Status is { } type)
            lines = lines.Where(li => li.ItemType == type);
        if (r.Search is { } s)
            lines = lines.Where(li => li.ItemName.ToLower().Contains(s) || (li.ItemCode != null && li.ItemCode.ToLower().Contains(s)));

        var grouped = lines
            .GroupBy(li => new { li.ItemType, li.ItemName, li.ItemCode })
            .Select(g => new
            {
                g.Key.ItemType, g.Key.ItemName, g.Key.ItemCode,
                Lines = g.Count(),
                Quantity = g.Sum(x => x.Quantity),
                Gross = g.Sum(x => x.Amount),
                Discount = g.Sum(x => x.DiscountAmount),
                Tax = g.Sum(x => x.TaxAmount),
                Net = g.Sum(x => x.TotalAmount),
            });

        var net = await lines.SumAsync(x => x.TotalAmount, ct);
        var gross = await lines.SumAsync(x => x.Amount, ct);
        var discount = await lines.SumAsync(x => x.DiscountAmount, ct);
        var tax = await lines.SumAsync(x => x.TaxAmount, ct);
        var byType = await lines.GroupBy(x => x.ItemType).Select(g => new { g.Key, Total = g.Sum(x => x.TotalAmount) }).ToListAsync(ct);
        var totalCount = await grouped.CountAsync(ct);
        var top = await grouped.OrderByDescending(x => x.Net).Take(10).Select(x => new { x.ItemName, x.Net }).ToListAsync(ct);

        var payload = NewPayload("service-revenue");
        payload.TotalCount = totalCount;
        payload.Summary.Add(new("net", "Net Revenue", net, "currency", "primary"));
        payload.Summary.Add(new("gross", "Gross Amount", gross, "currency"));
        payload.Summary.Add(new("discount", "Discounts", discount, "currency", "warning"));
        payload.Summary.Add(new("tax", "Tax", tax, "currency"));
        payload.Summary.Add(new("items", "Distinct Services / Items", totalCount, "number"));

        payload.Series.Add(Breakdown("Revenue by Item Type", byType.Select(x => (string.IsNullOrWhiteSpace(x.Key) ? "Other" : x.Key, x.Total)), "currency"));
        payload.Series.Add(Breakdown("Top 10 by Revenue", top.Select(x => ((string?)x.ItemName, x.Net)), "currency"));

        payload.Columns.AddRange(new[]
        {
            new ReportField("name", "Service / Item", "text"),
            new ReportField("code", "Code", "text"),
            new ReportField("type", "Type", "text"),
            new ReportField("lines", "Lines", "number"),
            new ReportField("quantity", "Qty", "number"),
            new ReportField("gross", "Gross", "currency"),
            new ReportField("discount", "Discount", "currency"),
            new ReportField("tax", "Tax", "currency"),
            new ReportField("net", "Net", "currency"),
        });

        var page = await Page(Sorted(grouped, r, payload, "net", true,
            ("name", x => x.ItemName), ("code", x => x.ItemCode), ("type", x => x.ItemType), ("lines", x => x.Lines),
            ("quantity", x => x.Quantity), ("gross", x => x.Gross), ("discount", x => x.Discount),
            ("tax", x => x.Tax), ("net", x => x.Net)), r).ToListAsync(ct);

        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["name"] = x.ItemName, ["code"] = x.ItemCode,
                ["type"] = string.IsNullOrWhiteSpace(x.ItemType) ? "Other" : x.ItemType,
                ["lines"] = x.Lines, ["quantity"] = x.Quantity, ["gross"] = x.Gross,
                ["discount"] = x.Discount, ["tax"] = x.Tax, ["net"] = x.Net,
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Inventory / current stock (as of now)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildInventoryAsync(ReportRequest r, CancellationToken ct)
    {
        var query =
            from i in In<Item>(r)
            join c in Raw<ItemCategory>() on i.CategoryId equals c.Id into cj
            from c in cj.DefaultIfEmpty()
            select new
            {
                i.Name, i.Code, i.GenericName, i.IsMedicine, i.IsActive, i.CurrentStock, i.ReorderLevel,
                i.PurchasePrice, i.SellingPrice,
                Value = i.CurrentStock * i.PurchasePrice,
                CategoryName = c.Name,
            };

        var totalCount = await query.CountAsync(ct);
        var activeCount = await query.CountAsync(x => x.IsActive, ct);
        var totalValue = await query.SumAsync(x => x.Value, ct);
        var retailValue = await query.SumAsync(x => x.CurrentStock * x.SellingPrice, ct);
        var lowStockCount = await query.CountAsync(x => x.IsActive && x.CurrentStock <= x.ReorderLevel && x.CurrentStock > 0, ct);
        var outOfStockCount = await query.CountAsync(x => x.IsActive && x.CurrentStock <= 0, ct);
        var byCategory = await query.GroupBy(x => x.CategoryName).Select(g => new { g.Key, Value = g.Sum(x => x.Value) }).ToListAsync(ct);

        var filtered = r.Status switch
        {
            "Inactive" => query.Where(x => !x.IsActive),
            "Out of Stock" => query.Where(x => x.IsActive && x.CurrentStock <= 0),
            "Low Stock" => query.Where(x => x.IsActive && x.CurrentStock > 0 && x.CurrentStock <= x.ReorderLevel),
            "In Stock" => query.Where(x => x.IsActive && x.CurrentStock > x.ReorderLevel),
            _ => query,
        };
        if (r.Search is { } s)
            filtered = filtered.Where(x => x.Name.ToLower().Contains(s) || x.Code.ToLower().Contains(s)
                || (x.GenericName != null && x.GenericName.ToLower().Contains(s)));

        var payload = NewPayload("inventory");
        payload.TotalCount = await filtered.CountAsync(ct);
        payload.Summary.Add(new("stockValue", "Stock Value (Cost)", totalValue, "currency", "primary"));
        payload.Summary.Add(new("retailValue", "Stock Value (Retail)", retailValue, "currency"));
        payload.Summary.Add(new("totalItems", "Items", totalCount, "number"));
        payload.Summary.Add(new("activeItems", "Active Items", activeCount, "number"));
        payload.Summary.Add(new("lowStock", "Low Stock", lowStockCount, "number", "warning"));
        payload.Summary.Add(new("outOfStock", "Out of Stock", outOfStockCount, "number", "danger"));

        payload.Series.Add(Breakdown("Stock Value by Category", byCategory.Select(x => (x.Key ?? "Uncategorized", x.Value)), "currency"));
        payload.Series.Add(new SeriesData("Stock Health", "breakdown", "number", new List<SeriesPoint>
        {
            new("In Stock", activeCount - lowStockCount - outOfStockCount),
            new("Low Stock", lowStockCount),
            new("Out of Stock", outOfStockCount),
        }.Where(p => Convert.ToInt32(p.Value) > 0).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("code", "Code", "text"),
            new ReportField("name", "Item", "text"),
            new ReportField("category", "Category", "text"),
            new ReportField("type", "Type", "text"),
            new ReportField("stock", "Stock", "number"),
            new ReportField("reorderLevel", "Reorder Level", "number"),
            new ReportField("purchasePrice", "Cost", "currency"),
            new ReportField("sellingPrice", "Price", "currency"),
            new ReportField("stockValue", "Stock Value", "currency"),
            new ReportField("status", "Status", "status"),
        });

        var page = await Page(Sorted(filtered, r, payload, "name", false,
            ("code", x => x.Code), ("name", x => x.Name), ("category", x => x.CategoryName), ("type", x => x.IsMedicine),
            ("stock", x => x.CurrentStock), ("reorderLevel", x => x.ReorderLevel), ("purchasePrice", x => x.PurchasePrice),
            ("sellingPrice", x => x.SellingPrice), ("stockValue", x => x.Value)), r).ToListAsync(ct);

        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["code"] = x.Code, ["name"] = x.Name, ["category"] = x.CategoryName ?? "Uncategorized",
                ["type"] = x.IsMedicine ? "Medicine" : "Non-medicine", ["stock"] = x.CurrentStock,
                ["reorderLevel"] = x.ReorderLevel, ["purchasePrice"] = x.PurchasePrice, ["sellingPrice"] = x.SellingPrice,
                ["stockValue"] = x.Value,
                ["status"] = !x.IsActive ? "Inactive" : x.CurrentStock <= 0 ? "Out of Stock"
                    : x.CurrentStock <= x.ReorderLevel ? "Low Stock" : "In Stock",
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Stock movements
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildStockMovementsAsync(ReportRequest r, CancellationToken ct)
    {
        var filtered = In<StockMovement>(r).Where(m => m.MovementDate >= r.Start && m.MovementDate < r.End);
        if (TryEnum<StockMovementType>(r.Status, out var type)) filtered = filtered.Where(m => m.MovementType == type);

        var query =
            from m in filtered
            join i in Raw<Item>() on m.ItemId equals i.Id
            join w in Raw<Warehouse>() on m.WarehouseId equals w.Id into wj
            from w in wj.DefaultIfEmpty()
            select new
            {
                m.MovementNumber, m.MovementDate, m.MovementType, m.Quantity, m.QuantityBefore, m.QuantityAfter,
                m.UnitPrice, m.TotalAmount, m.ReferenceType, m.ReferenceNumber,
                Delta = m.QuantityAfter - m.QuantityBefore,
                ItemName = i.Name, ItemCode = i.Code, WarehouseName = w.Name,
            };
        if (r.Search is { } s)
            query = query.Where(x => x.MovementNumber.ToLower().Contains(s) || x.ItemName.ToLower().Contains(s)
                || x.ItemCode.ToLower().Contains(s) || (x.ReferenceNumber != null && x.ReferenceNumber.ToLower().Contains(s)));

        var totalCount = await query.CountAsync(ct);
        var qtyIn = await query.Where(x => x.Delta > 0).SumAsync(x => x.Delta, ct);
        var qtyOut = await query.Where(x => x.Delta < 0).SumAsync(x => -x.Delta, ct);
        var valueIn = await query.Where(x => x.Delta > 0).SumAsync(x => x.TotalAmount, ct);
        var valueOut = await query.Where(x => x.Delta < 0).SumAsync(x => x.TotalAmount, ct);
        var adjustments = await query.CountAsync(x => x.MovementType == StockMovementType.Adjustment, ct);
        var byType = await query.GroupBy(x => x.MovementType).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);
        var dailyIn = await query.Where(x => x.Delta > 0).GroupBy(x => x.MovementDate.Date).Select(g => new { Date = g.Key, Qty = g.Sum(x => x.Delta) }).ToListAsync(ct);
        var dailyOut = await query.Where(x => x.Delta < 0).GroupBy(x => x.MovementDate.Date).Select(g => new { Date = g.Key, Qty = g.Sum(x => -x.Delta) }).ToListAsync(ct);
        var topConsumed = await query.Where(x => x.Delta < 0).GroupBy(x => x.ItemName).Select(g => new { g.Key, Qty = g.Sum(x => -x.Delta) }).ToListAsync(ct);

        var payload = NewPayload("stock-movements");
        payload.TotalCount = totalCount;
        payload.Summary.Add(new("movements", "Movements", totalCount, "number", "primary"));
        payload.Summary.Add(new("qtyIn", "Quantity In", qtyIn, "number", "success"));
        payload.Summary.Add(new("qtyOut", "Quantity Out", qtyOut, "number", "danger"));
        payload.Summary.Add(new("valueIn", "Value In", valueIn, "currency"));
        payload.Summary.Add(new("valueOut", "Value Out", valueOut, "currency"));
        payload.Summary.Add(new("adjustments", "Adjustments", adjustments, "number", "warning"));

        payload.Series.Add(Trend("Stock In (qty)", r, dailyIn.Select(d => (d.Date, d.Qty))));
        payload.Series.Add(Trend("Stock Out (qty)", r, dailyOut.Select(d => (d.Date, d.Qty))));
        payload.Series.Add(Breakdown("By Movement Type", byType.Select(x => ((string?)x.Key.ToString(), (decimal)x.Count))));
        payload.Series.Add(Breakdown("Most Consumed Items", topConsumed.Select(x => ((string?)x.Key, x.Qty))));

        payload.Columns.AddRange(new[]
        {
            new ReportField("movementNumber", "Movement #", "text"),
            new ReportField("date", "Date", "datetime"),
            new ReportField("item", "Item", "text"),
            new ReportField("warehouse", "Warehouse", "text"),
            new ReportField("type", "Type", "status"),
            new ReportField("change", "Change", "number"),
            new ReportField("before", "Before", "number"),
            new ReportField("after", "After", "number"),
            new ReportField("value", "Value", "currency"),
            new ReportField("reference", "Reference", "text"),
        });

        var page = await Page(Sorted(query, r, payload, "date", true,
            ("movementNumber", x => x.MovementNumber), ("date", x => x.MovementDate), ("item", x => x.ItemName),
            ("warehouse", x => x.WarehouseName), ("type", x => x.MovementType), ("change", x => x.Delta),
            ("value", x => x.TotalAmount)), r).ToListAsync(ct);

        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["movementNumber"] = x.MovementNumber, ["date"] = x.MovementDate,
                ["item"] = $"{x.ItemName} ({x.ItemCode})", ["warehouse"] = x.WarehouseName,
                ["type"] = x.MovementType.ToString(), ["change"] = x.Delta, ["before"] = x.QuantityBefore,
                ["after"] = x.QuantityAfter, ["value"] = x.TotalAmount,
                ["reference"] = string.Join(" ", new[] { x.ReferenceType, x.ReferenceNumber }.Where(v => !string.IsNullOrWhiteSpace(v))),
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Expiry / near expiry (as of today)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildStockExpiryAsync(ReportRequest r, CancellationToken ct)
    {
        var today = DateTime.UtcNow.Date;
        var d30 = today.AddDays(30); var d60 = today.AddDays(60); var d90 = today.AddDays(90);

        var query =
            from b in In<StockBatch>(r).Where(b => b.ExpiryDate != null && b.AvailableQuantity > 0 && b.ExpiryDate < d90)
            join i in Raw<Item>() on b.ItemId equals i.Id
            join w in Raw<Warehouse>() on b.WarehouseId equals w.Id into wj
            from w in wj.DefaultIfEmpty()
            select new
            {
                b.BatchNumber, Expiry = b.ExpiryDate!.Value, b.AvailableQuantity, b.PurchasePrice,
                Value = b.AvailableQuantity * b.PurchasePrice,
                ItemName = i.Name, ItemCode = i.Code, WarehouseName = w.Name,
            };

        var expired = await query.CountAsync(x => x.Expiry < today, ct);
        var within30 = await query.CountAsync(x => x.Expiry >= today && x.Expiry < d30, ct);
        var within60 = await query.CountAsync(x => x.Expiry >= d30 && x.Expiry < d60, ct);
        var within90 = await query.CountAsync(x => x.Expiry >= d60 && x.Expiry < d90, ct);
        var expiredValue = await query.Where(x => x.Expiry < today).SumAsync(x => x.Value, ct);
        var atRiskValue = await query.Where(x => x.Expiry >= today).SumAsync(x => x.Value, ct);

        var filtered = r.Status switch
        {
            "Expired" => query.Where(x => x.Expiry < today),
            "Within 30 days" => query.Where(x => x.Expiry >= today && x.Expiry < d30),
            "Within 60 days" => query.Where(x => x.Expiry >= today && x.Expiry < d60),
            "Within 90 days" => query.Where(x => x.Expiry >= today),
            _ => query,
        };
        if (r.Search is { } s)
            filtered = filtered.Where(x => x.ItemName.ToLower().Contains(s) || x.ItemCode.ToLower().Contains(s)
                || (x.BatchNumber != null && x.BatchNumber.ToLower().Contains(s)));

        var payload = NewPayload("stock-expiry");
        payload.TotalCount = await filtered.CountAsync(ct);
        payload.Summary.Add(new("expired", "Expired Batches", expired, "number", "danger"));
        payload.Summary.Add(new("within30", "Expiring ≤ 30 days", within30, "number", "warning"));
        payload.Summary.Add(new("within90", "Expiring ≤ 90 days", within30 + within60 + within90, "number"));
        payload.Summary.Add(new("expiredValue", "Expired Stock Value", expiredValue, "currency", "danger"));
        payload.Summary.Add(new("atRiskValue", "Value at Risk (90 days)", atRiskValue, "currency", "warning"));

        payload.Series.Add(new SeriesData("Batches by Expiry Window", "breakdown", "number", new List<SeriesPoint>
        {
            new("Expired", expired), new("≤ 30 days", within30), new("31–60 days", within60), new("61–90 days", within90),
        }.Where(p => Convert.ToInt32(p.Value) > 0).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("item", "Item", "text"),
            new ReportField("batch", "Batch", "text"),
            new ReportField("warehouse", "Warehouse", "text"),
            new ReportField("expiry", "Expiry", "date"),
            new ReportField("daysLeft", "Days Left", "number"),
            new ReportField("available", "Available", "number"),
            new ReportField("value", "Value", "currency"),
            new ReportField("status", "Status", "status"),
        });

        var page = await Page(Sorted(filtered, r, payload, "expiry", false,
            ("item", x => x.ItemName), ("batch", x => x.BatchNumber), ("warehouse", x => x.WarehouseName),
            ("expiry", x => x.Expiry), ("daysLeft", x => x.Expiry), ("available", x => x.AvailableQuantity),
            ("value", x => x.Value)), r).ToListAsync(ct);

        foreach (var x in page)
        {
            var daysLeft = (int)Math.Floor((x.Expiry.Date - today).TotalDays);
            payload.Rows.Add(new()
            {
                ["item"] = $"{x.ItemName} ({x.ItemCode})", ["batch"] = x.BatchNumber, ["warehouse"] = x.WarehouseName,
                ["expiry"] = x.Expiry.Date, ["daysLeft"] = daysLeft, ["available"] = x.AvailableQuantity,
                ["value"] = x.Value,
                ["status"] = daysLeft < 0 ? "Expired" : daysLeft < 30 ? "Critical" : "Near Expiry",
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Purchase orders
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildPurchasesAsync(ReportRequest r, CancellationToken ct)
    {
        var filtered = In<PurchaseOrder>(r).Where(p => p.OrderDate >= r.Start && p.OrderDate < r.End);
        if (TryEnum<PurchaseOrderStatus>(r.Status, out var status)) filtered = filtered.Where(p => p.Status == status);

        var query =
            from po in filtered
            join s in Raw<Supplier>() on po.SupplierId equals s.Id
            join w in Raw<Warehouse>() on po.WarehouseId equals w.Id into wj
            from w in wj.DefaultIfEmpty()
            select new
            {
                po.PONumber, po.OrderDate, po.Status, po.TotalAmount, po.PaidAmount, po.ExpectedDeliveryDate, po.ReceivedDate,
                SupplierName = s.Name, WarehouseName = w.Name,
            };
        if (r.Search is { } term)
            query = query.Where(x => x.PONumber.ToLower().Contains(term) || x.SupplierName.ToLower().Contains(term));

        var live = query.Where(x => x.Status != PurchaseOrderStatus.Cancelled && x.Status != PurchaseOrderStatus.Rejected);
        var totalCount = await query.CountAsync(ct);
        var value = await live.SumAsync(x => x.TotalAmount, ct);
        var received = await live.Where(x => x.Status == PurchaseOrderStatus.Received || x.Status == PurchaseOrderStatus.Closed).SumAsync(x => x.TotalAmount, ct);
        var paid = await live.SumAsync(x => x.PaidAmount, ct);
        var open = await live.CountAsync(x => x.Status != PurchaseOrderStatus.Received && x.Status != PurchaseOrderStatus.Closed, ct);
        var bySupplier = await live.GroupBy(x => x.SupplierName).Select(g => new { g.Key, Total = g.Sum(x => x.TotalAmount) }).ToListAsync(ct);
        var byStatus = await query.GroupBy(x => x.Status).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);
        var daily = await live.GroupBy(x => x.OrderDate.Date).Select(g => new { Date = g.Key, Total = g.Sum(x => x.TotalAmount) }).ToListAsync(ct);

        var payload = NewPayload("purchases");
        payload.TotalCount = totalCount;
        payload.Summary.Add(new("orders", "Purchase Orders", totalCount, "number", "primary"));
        payload.Summary.Add(new("value", "Order Value", value, "currency"));
        payload.Summary.Add(new("received", "Received Value", received, "currency", "success"));
        payload.Summary.Add(new("open", "Open Orders", open, "number", "warning"));
        payload.Summary.Add(new("unpaid", "Unpaid", value - paid, "currency", "danger"));

        payload.Series.Add(Trend("Purchase Value", r, daily.Select(d => (d.Date, d.Total)), "currency"));
        payload.Series.Add(Breakdown("By Supplier", bySupplier.Select(x => ((string?)x.Key, x.Total)), "currency"));
        payload.Series.Add(Breakdown("By Status", byStatus.Select(x => ((string?)x.Key.ToString(), (decimal)x.Count))));

        payload.Columns.AddRange(new[]
        {
            new ReportField("poNumber", "PO #", "text"),
            new ReportField("orderDate", "Ordered", "date"),
            new ReportField("supplier", "Supplier", "text"),
            new ReportField("warehouse", "Warehouse", "text"),
            new ReportField("status", "Status", "status"),
            new ReportField("total", "Total", "currency"),
            new ReportField("paid", "Paid", "currency"),
            new ReportField("expected", "Expected", "date"),
            new ReportField("receivedOn", "Received", "date"),
        });

        var page = await Page(Sorted(query, r, payload, "orderDate", true,
            ("poNumber", x => x.PONumber), ("orderDate", x => x.OrderDate), ("supplier", x => x.SupplierName),
            ("warehouse", x => x.WarehouseName), ("status", x => x.Status), ("total", x => x.TotalAmount),
            ("paid", x => x.PaidAmount), ("expected", x => x.ExpectedDeliveryDate), ("receivedOn", x => x.ReceivedDate)), r)
            .ToListAsync(ct);

        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["poNumber"] = x.PONumber, ["orderDate"] = x.OrderDate, ["supplier"] = x.SupplierName,
                ["warehouse"] = x.WarehouseName, ["status"] = x.Status.ToString(), ["total"] = x.TotalAmount,
                ["paid"] = x.PaidAmount, ["expected"] = x.ExpectedDeliveryDate, ["receivedOn"] = x.ReceivedDate,
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Suppliers (organization-level master; purchases are location-scoped)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildSuppliersAsync(ReportRequest r, CancellationToken ct)
    {
        var suppliers = Raw<Supplier>().Where(s => s.TenantId == r.TenantId && !s.IsDeleted);
        var purchases = In<PurchaseOrder>(r).Where(p => p.OrderDate >= r.Start && p.OrderDate < r.End
            && p.Status != PurchaseOrderStatus.Cancelled && p.Status != PurchaseOrderStatus.Rejected);

        var query = suppliers.Select(s => new
        {
            s.Name, s.Code, s.ContactPersonName, s.Phone, s.Email, s.City, s.PaymentTermsDays, s.OutstandingPayable, s.IsActive,
            Purchases = purchases.Where(p => p.SupplierId == s.Id).Sum(p => (decimal?)p.TotalAmount) ?? 0m,
            Orders = purchases.Count(p => p.SupplierId == s.Id),
        });

        var totalCount = await query.CountAsync(ct);
        var activeCount = await query.CountAsync(x => x.IsActive, ct);
        var payables = await query.SumAsync(x => x.OutstandingPayable, ct);
        var purchaseTotal = await purchases.SumAsync(p => p.TotalAmount, ct);
        var top = await query.Where(x => x.Purchases > 0).OrderByDescending(x => x.Purchases).Take(10)
            .Select(x => new { x.Name, x.Purchases }).ToListAsync(ct);

        var filtered = r.Status switch
        {
            "Active" => query.Where(x => x.IsActive),
            "Inactive" => query.Where(x => !x.IsActive),
            _ => query,
        };
        if (r.Search is { } s)
            filtered = filtered.Where(x => x.Name.ToLower().Contains(s) || (x.Code != null && x.Code.ToLower().Contains(s))
                || (x.City != null && x.City.ToLower().Contains(s)));

        var payload = NewPayload("suppliers");
        payload.TotalCount = await filtered.CountAsync(ct);
        payload.Summary.Add(new("total", "Suppliers", totalCount, "number"));
        payload.Summary.Add(new("active", "Active", activeCount, "number", "success"));
        payload.Summary.Add(new("purchases", "Purchases (Period)", purchaseTotal, "currency", "primary"));
        payload.Summary.Add(new("payables", "Outstanding Payables", payables, "currency", "warning"));

        payload.Series.Add(Breakdown("Top Suppliers by Purchases", top.Select(x => ((string?)x.Name, x.Purchases)), "currency"));

        payload.Columns.AddRange(new[]
        {
            new ReportField("name", "Supplier", "text"),
            new ReportField("code", "Code", "text"),
            new ReportField("contactPerson", "Contact", "text"),
            new ReportField("phone", "Phone", "text"),
            new ReportField("city", "City", "text"),
            new ReportField("paymentTerms", "Terms (Days)", "number"),
            new ReportField("orders", "Orders (Period)", "number"),
            new ReportField("purchases", "Purchases (Period)", "currency"),
            new ReportField("outstanding", "Outstanding", "currency"),
            new ReportField("status", "Status", "status"),
        });

        var page = await Page(Sorted(filtered, r, payload, "name", false,
            ("name", x => x.Name), ("code", x => x.Code), ("city", x => x.City), ("paymentTerms", x => x.PaymentTermsDays),
            ("orders", x => x.Orders), ("purchases", x => x.Purchases), ("outstanding", x => x.OutstandingPayable),
            ("status", x => x.IsActive)), r).ToListAsync(ct);

        foreach (var x in page)
        {
            payload.Rows.Add(new()
            {
                ["name"] = x.Name, ["code"] = x.Code, ["contactPerson"] = x.ContactPersonName, ["phone"] = x.Phone,
                ["city"] = x.City, ["paymentTerms"] = x.PaymentTermsDays, ["orders"] = x.Orders,
                ["purchases"] = x.Purchases, ["outstanding"] = x.OutstandingPayable,
                ["status"] = x.IsActive ? "Active" : "Inactive",
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Audit activity (requires audit.view — enforced in PrepareAsync)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildAuditActivityAsync(ReportRequest r, CancellationToken ct)
    {
        // All Locations = every row of the tenant. An explicitly chosen location
        // = only that location's rows ("what happened in Lahore?"). The default
        // single-location view also includes organization-level rows
        // (LocationId NULL: roles, settings, subscription) — same rule as the
        // Audit Logs screen.
        var includeOrgRows = !r.ExplicitLocation;
        var query = _context.AuditLogs.AsNoTracking().Where(a =>
            a.TenantId == r.TenantId
            && (r.BranchId == null || a.BranchId == r.BranchId || (includeOrgRows && a.BranchId == null))
            && a.Timestamp >= r.Start && a.Timestamp < r.End);

        query = r.Status switch
        {
            "Success" => query.Where(a => a.Success != false),
            "Failure" => query.Where(a => a.Success == false),
            _ => query,
        };
        if (r.Search is { } s)
            query = query.Where(a => (a.Description != null && a.Description.ToLower().Contains(s))
                || (a.UserName != null && a.UserName.ToLower().Contains(s))
                || (a.UserEmail != null && a.UserEmail.ToLower().Contains(s))
                || a.Action.ToLower().Contains(s) || a.Module.ToLower().Contains(s));

        var totalCount = await query.CountAsync(ct);
        var failures = await query.CountAsync(a => a.Success == false, ct);
        var logins = await query.CountAsync(a => a.Action == "LOGIN", ct);
        var loginFailures = await query.CountAsync(a => a.Action == "LOGIN_FAILED", ct);
        var exports = await query.CountAsync(a => a.Action == "REPORT_EXPORTED", ct);
        var activeUsers = await query.Where(a => a.UserId != null).Select(a => a.UserId).Distinct().CountAsync(ct);
        var daily = await query.GroupBy(a => a.Timestamp.Date).Select(g => new { Date = g.Key, Count = g.Count() }).ToListAsync(ct);
        var byModule = await query.GroupBy(a => a.Module).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);
        var byAction = await query.GroupBy(a => a.Action).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);
        var byUser = await query.Where(a => a.UserName != null).GroupBy(a => a.UserName).Select(g => new { g.Key, Count = g.Count() }).ToListAsync(ct);

        var payload = NewPayload("audit-activity");
        payload.TotalCount = totalCount;
        payload.Summary.Add(new("events", "Events", totalCount, "number", "primary"));
        payload.Summary.Add(new("activeUsers", "Active Users", activeUsers, "number"));
        payload.Summary.Add(new("logins", "Logins", logins, "number", "success"));
        payload.Summary.Add(new("loginFailures", "Failed Logins", loginFailures, "number", "danger"));
        payload.Summary.Add(new("failures", "Failed Actions", failures, "number", "warning"));
        payload.Summary.Add(new("exports", "Report Exports", exports, "number"));

        payload.Series.Add(Trend("Daily Events", r, daily.Select(d => (d.Date, (decimal)d.Count))));
        payload.Series.Add(Breakdown("By Module", byModule.Select(x => ((string?)x.Key, (decimal)x.Count))));
        payload.Series.Add(Breakdown("Top Actions", byAction.Select(x => ((string?)x.Key, (decimal)x.Count))));
        payload.Series.Add(Breakdown("Most Active Users", byUser.Select(x => (x.Key, (decimal)x.Count))));

        payload.Columns.AddRange(new[]
        {
            new ReportField("timestamp", "Date / Time", "datetime"),
            new ReportField("user", "User", "text"),
            new ReportField("module", "Module", "text"),
            new ReportField("action", "Action", "text"),
            new ReportField("entity", "Entity", "text"),
            new ReportField("description", "Description", "text"),
            new ReportField("location", "Location", "text"),
            new ReportField("status", "Status", "status"),
        });

        var page = await Page(Sorted(query, r, payload, "timestamp", true,
            ("timestamp", a => a.Timestamp), ("user", a => a.UserName), ("module", a => a.Module),
            ("action", a => a.Action), ("entity", a => a.EntityType), ("location", a => a.LocationName),
            ("status", a => a.Success)), r).ToListAsync(ct);

        foreach (var a in page)
        {
            payload.Rows.Add(new()
            {
                ["timestamp"] = a.Timestamp,
                ["user"] = a.UserName ?? a.UserEmail ?? "System",
                ["module"] = a.Module,
                ["action"] = a.Action,
                ["entity"] = a.EntityName ?? a.EntityType,
                ["description"] = a.Description,
                ["location"] = a.LocationName ?? (a.BranchId == null ? "Organization / All" : null),
                ["status"] = a.Success == false ? "Failure" : "Success",
            });
        }

        return payload;
    }
}
