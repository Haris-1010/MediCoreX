using ClinIQ.Domain.Entities;
using ClinIQ.Domain.Enums;
using ClinIQ.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

/// <summary>
/// Report payload records + per-report query builders.
///
/// Every builder returns one unified shape: summary cards, chart series,
/// column definitions and paged rows (rows are materialized then mapped in
/// memory so computed fields like age/full name never need to be translated
/// by EF). Queries stay tenant/location scoped with explicit predicates
/// (mirroring the global filters, which remain active as defence in depth).
/// </summary>
public partial class ReportsController
{
    private sealed record ReportField(string Key, string Label, string Type);

    private sealed record SummaryValue(string Key, string Label, object? Value, string Format);

    private sealed record SeriesPoint(string Label, object? Value);

    private sealed record SeriesData(string Name, List<SeriesPoint> Points);

    private sealed class ReportPayload
    {
        public string ReportKey { get; init; } = string.Empty;
        public string ReportName { get; init; } = string.Empty;
        public Guid? LocationId { get; set; }
        public string LocationName { get; set; } = "All Locations";
        public DateTime Start { get; init; }
        public DateTime End { get; init; }
        public List<SummaryValue> Summary { get; } = new();
        public List<SeriesData> Series { get; } = new();
        public List<ReportField> Columns { get; } = new();
        public List<Dictionary<string, object?>> Rows { get; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; init; }
        public int PageSize { get; init; }
    }

    private async Task<ReportPayload> BuildReportAsync(
        string key, Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken cancellationToken) => key switch
    {
        "patients" => await BuildPatientsAsync(tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        "appointments" => await BuildAppointmentsAsync(tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        "opd" => await BuildOpdAsync(tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        "ipd" => await BuildIpdAsync(tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        "beds" => await BuildBedsAsync(tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        "laboratory" => await BuildOrderReportAsync("laboratory", MedicalOrderType.Lab, tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        "radiology" => await BuildOrderReportAsync("radiology", MedicalOrderType.Radiology, tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        "pharmacy" => await BuildPharmacyAsync(tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        "inventory" => await BuildInventoryAsync(tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        "suppliers" => await BuildSuppliersAsync(tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        "billing" => await BuildBillingAsync(tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        "management" => await BuildManagementAsync(tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        "audit-activity" => await BuildAuditActivityAsync(tenantId, branchId, start, end, pageNumber, pageSize, cancellationToken),
        _ => throw new InvalidOperationException($"Unknown report '{key}'."),
    };

    private static ReportPayload MakePayload(string key, DateTime start, DateTime end, int pageNumber, int pageSize, int totalCount) => new()
    {
        ReportKey = key,
        ReportName = ReportDefs[key].Name,
        Start = start,
        End = end,
        PageNumber = pageNumber,
        PageSize = pageSize,
        TotalCount = totalCount,
    };

    // ------------------------------------------------------------------
    // Patients
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildPatientsAsync(
        Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken ct)
    {
        var scope = _context.Patients.Where(p =>
            p.TenantId == tenantId && !p.IsDeleted && (branchId == null || p.BranchId == branchId));
        var inPeriod = scope.Where(p => p.CreatedAt >= start && p.CreatedAt < end);

        var totalPatients = await scope.CountAsync(ct);
        var newInPeriod = await inPeriod.CountAsync(ct);
        var activeCount = await scope.CountAsync(p => p.IsActive, ct);
        var maleCount = await inPeriod.CountAsync(p => p.Gender == Gender.Male, ct);
        var femaleCount = await inPeriod.CountAsync(p => p.Gender == Gender.Female, ct);
        var unspecifiedCount = newInPeriod - maleCount - femaleCount;

        var daily = await inPeriod
            .GroupBy(p => p.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var genderSplit = await inPeriod
            .GroupBy(p => p.Gender)
            .Select(g => new { Gender = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var page = await inPeriod
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.PatientNumber, p.FirstName, p.LastName, p.Gender, p.DateOfBirth,
                p.Phone, p.Email, p.IsActive, p.CreatedAt,
            })
            .ToListAsync(ct);

        var payload = MakePayload("patients", start, end, pageNumber, pageSize, newInPeriod);
        payload.Summary.Add(new("totalPatients", "Total Patients", totalPatients, "number"));
        payload.Summary.Add(new("newInPeriod", "New This Period", newInPeriod, "number"));
        payload.Summary.Add(new("activePatients", "Active Patients", activeCount, "number"));
        payload.Summary.Add(new("femaleInPeriod", "Female (Period)", femaleCount, "number"));
        payload.Summary.Add(new("otherGenderInPeriod", "Other / Not Specified", unspecifiedCount, "number"));

        payload.Series.Add(new("Registrations",
            daily.Select(d => new SeriesPoint(d.Date.ToString("yyyy-MM-dd"), d.Count)).ToList()));
        payload.Series.Add(new("Gender",
            genderSplit.Select(g => new SeriesPoint(g.Gender?.ToString() ?? "Not specified", g.Count)).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("patientNumber", "Patient #", "text"),
            new ReportField("name", "Name", "text"),
            new ReportField("gender", "Gender", "text"),
            new ReportField("age", "Age", "number"),
            new ReportField("phone", "Phone", "text"),
            new ReportField("email", "Email", "text"),
            new ReportField("registeredOn", "Registered On", "date"),
            new ReportField("status", "Status", "status"),
        });

        var today = DateTime.Today;
        foreach (var p in page)
        {
            int? age = null;
            if (p.DateOfBirth.HasValue)
            {
                var dob = p.DateOfBirth.Value.Date;
                age = today.Year - dob.Year;
                if (dob > today.AddYears(-age.Value))
                    age--;
            }

            payload.Rows.Add(new Dictionary<string, object?>
            {
                ["patientNumber"] = p.PatientNumber,
                ["name"] = $"{p.FirstName} {p.LastName}".Trim(),
                ["gender"] = p.Gender?.ToString(),
                ["age"] = age,
                ["phone"] = p.Phone,
                ["email"] = p.Email,
                ["registeredOn"] = p.CreatedAt,
                ["status"] = p.IsActive ? "Active" : "Inactive",
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Appointments
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildAppointmentsAsync(
        Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken ct)
    {
        var query =
            from a in _context.Appointments
            join p in _context.Patients on a.PatientId equals p.Id
            join u in _context.Users on a.DoctorId equals u.Id into uj
            from u in uj.DefaultIfEmpty()
            where a.TenantId == tenantId && !a.IsDeleted
                  && (branchId == null || a.BranchId == branchId)
                  && a.AppointmentDate >= start && a.AppointmentDate < end
            select new
            {
                a.AppointmentNumber, a.AppointmentDate, a.StartTime, a.Status, a.Type,
                a.IsTelemedicine, a.CheckedInAt,
                PatientName = p.FirstName + " " + p.LastName,
                DoctorName = u.FirstName + " " + u.LastName,
            };

        var totalCount = await query.CountAsync(ct);

        var statusSplit = await query
            .GroupBy(x => x.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var daily = await query
            .GroupBy(x => x.AppointmentDate.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var page = await query
            .OrderByDescending(x => x.AppointmentDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var payload = MakePayload("appointments", start, end, pageNumber, pageSize, totalCount);
        payload.Summary.Add(new("total", "Appointments", totalCount, "number"));
        payload.Summary.Add(new("completed", "Completed",
            statusSplit.Where(s => s.Status == AppointmentStatus.Completed).Sum(s => s.Count), "number"));
        payload.Summary.Add(new("cancelled", "Cancelled",
            statusSplit.Where(s => s.Status == AppointmentStatus.Cancelled).Sum(s => s.Count), "number"));
        payload.Summary.Add(new("noShow", "No Show",
            statusSplit.Where(s => s.Status == AppointmentStatus.NoShow).Sum(s => s.Count), "number"));

        payload.Series.Add(new("Daily Volume",
            daily.Select(d => new SeriesPoint(d.Date.ToString("yyyy-MM-dd"), d.Count)).ToList()));
        payload.Series.Add(new("By Status",
            statusSplit.Select(s => new SeriesPoint(s.Status.ToString(), s.Count)).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("appointmentNumber", "Appointment #", "text"),
            new ReportField("scheduledFor", "Scheduled For", "date"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("doctor", "Doctor", "text"),
            new ReportField("type", "Type", "text"),
            new ReportField("status", "Status", "status"),
            new ReportField("telemedicine", "Telemedicine", "text"),
        });

        foreach (var x in page)
        {
            payload.Rows.Add(new Dictionary<string, object?>
            {
                ["appointmentNumber"] = x.AppointmentNumber,
                ["scheduledFor"] = x.AppointmentDate.Date.Add(x.StartTime),
                ["patient"] = x.PatientName,
                ["doctor"] = x.DoctorName,
                ["type"] = x.Type.ToString(),
                ["status"] = x.Status.ToString(),
                ["telemedicine"] = x.IsTelemedicine ? "Yes" : "No",
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // OPD visits
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildOpdAsync(
        Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken ct)
    {
        var query =
            from v in _context.Visits
            join p in _context.Patients on v.PatientId equals p.Id
            join u in _context.Users on v.DoctorId equals u.Id into uj
            from u in uj.DefaultIfEmpty()
            where v.TenantId == tenantId && !v.IsDeleted
                  && (branchId == null || v.BranchId == branchId)
                  && v.VisitType == VisitType.OPD
                  && v.VisitDate >= start && v.VisitDate < end
            select new
            {
                v.VisitNumber, v.VisitDate, v.IsCompleted, v.IsBilled, v.ChiefComplaint,
                PatientName = p.FirstName + " " + p.LastName,
                DoctorName = u.FirstName + " " + u.LastName,
            };

        var totalCount = await query.CountAsync(ct);
        var completedCount = await query.CountAsync(x => x.IsCompleted, ct);
        var billedCount = await query.CountAsync(x => x.IsBilled, ct);

        var daily = await query
            .GroupBy(x => x.VisitDate.Date)
            .Select(g => new { Date = g.Key, Total = g.Count(), Completed = g.Count(x => x.IsCompleted) })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var page = await query
            .OrderByDescending(x => x.VisitDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var payload = MakePayload("opd", start, end, pageNumber, pageSize, totalCount);
        payload.Summary.Add(new("total", "OPD Visits", totalCount, "number"));
        payload.Summary.Add(new("completed", "Completed", completedCount, "number"));
        payload.Summary.Add(new("inProgress", "In Progress", totalCount - completedCount, "number"));
        payload.Summary.Add(new("billed", "Billed", billedCount, "number"));

        payload.Series.Add(new("Daily Visits",
            daily.Select(d => new SeriesPoint(d.Date.ToString("yyyy-MM-dd"), d.Total)).ToList()));
        payload.Series.Add(new("Daily Completed",
            daily.Select(d => new SeriesPoint(d.Date.ToString("yyyy-MM-dd"), d.Completed)).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("visitNumber", "Visit #", "text"),
            new ReportField("visitDate", "Visit Date", "date"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("doctor", "Doctor", "text"),
            new ReportField("chiefComplaint", "Chief Complaint", "text"),
            new ReportField("completed", "Completed", "text"),
            new ReportField("billed", "Billed", "text"),
        });

        foreach (var x in page)
        {
            payload.Rows.Add(new Dictionary<string, object?>
            {
                ["visitNumber"] = x.VisitNumber,
                ["visitDate"] = x.VisitDate,
                ["patient"] = x.PatientName,
                ["doctor"] = x.DoctorName,
                ["chiefComplaint"] = x.ChiefComplaint,
                ["completed"] = x.IsCompleted ? "Yes" : "No",
                ["billed"] = x.IsBilled ? "Yes" : "No",
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // IPD admissions
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildIpdAsync(
        Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken ct)
    {
        var admissionsInPeriod = _context.Admissions.Where(a =>
            a.TenantId == tenantId && !a.IsDeleted
            && (branchId == null || a.BranchId == branchId)
            && a.AdmissionDate >= start && a.AdmissionDate < end);

        var admissionCount = await admissionsInPeriod.CountAsync(ct);
        var dischargeCount = await _context.Admissions.CountAsync(a =>
            a.TenantId == tenantId && !a.IsDeleted
            && (branchId == null || a.BranchId == branchId)
            && a.DischargeDate != null && a.DischargeDate >= start && a.DischargeDate < end, ct);
        var currentlyAdmitted = await _context.Admissions.CountAsync(a =>
            a.TenantId == tenantId && !a.IsDeleted
            && (branchId == null || a.BranchId == branchId)
            && (a.Status == AdmissionStatus.Admitted || a.Status == AdmissionStatus.InTreatment
                || a.Status == AdmissionStatus.ReadyForDischarge), ct);
        var deaths = await admissionsInPeriod.CountAsync(a => a.Status == AdmissionStatus.Deceased, ct);

        var bedScope = _context.Beds.Where(b =>
            b.TenantId == tenantId && !b.IsDeleted && (branchId == null || b.BranchId == branchId));
        var totalBeds = await bedScope.CountAsync(ct);
        var occupiedBeds = await bedScope.CountAsync(b => b.Status == BedStatus.Occupied, ct);
        var occupancyPct = totalBeds > 0 ? Math.Round(occupiedBeds * 100.0 / totalBeds, 1) : 0;

        var dailyAdmissions = await admissionsInPeriod
            .GroupBy(a => a.AdmissionDate.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var dailyDischarges = await _context.Admissions
            .Where(a => a.TenantId == tenantId && !a.IsDeleted
                        && (branchId == null || a.BranchId == branchId)
                        && a.DischargeDate != null && a.DischargeDate >= start && a.DischargeDate < end)
            .GroupBy(a => a.DischargeDate!.Value.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var query =
            from a in _context.Admissions
            join p in _context.Patients on a.PatientId equals p.Id
            join u in _context.Users on a.AttendingDoctorId equals u.Id into uj
            from u in uj.DefaultIfEmpty()
            join b in _context.Beds on a.CurrentBedId equals b.Id into bj
            from b in bj.DefaultIfEmpty()
            where a.TenantId == tenantId && !a.IsDeleted
                  && (branchId == null || a.BranchId == branchId)
                  && a.AdmissionDate >= start && a.AdmissionDate < end
            select new
            {
                a.AdmissionNumber, a.AdmissionDate, a.DischargeDate, a.Status, a.AdmissionType,
                PatientName = p.FirstName + " " + p.LastName,
                DoctorName = u.FirstName + " " + u.LastName,
                BedNumber = b.BedNumber,
            };

        var totalCount = await query.CountAsync(ct);
        var page = await query
            .OrderByDescending(x => x.AdmissionDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var payload = MakePayload("ipd", start, end, pageNumber, pageSize, totalCount);
        payload.Summary.Add(new("admissions", "Admissions", admissionCount, "number"));
        payload.Summary.Add(new("discharges", "Discharges", dischargeCount, "number"));
        payload.Summary.Add(new("currentlyAdmitted", "Currently Admitted", currentlyAdmitted, "number"));
        payload.Summary.Add(new("deaths", "Deaths (Period)", deaths, "number"));
        payload.Summary.Add(new("occupancy", "Bed Occupancy", occupancyPct, "percent"));

        payload.Series.Add(new("Daily Admissions",
            dailyAdmissions.Select(d => new SeriesPoint(d.Date.ToString("yyyy-MM-dd"), d.Count)).ToList()));
        payload.Series.Add(new("Daily Discharges",
            dailyDischarges.Select(d => new SeriesPoint(d.Date.ToString("yyyy-MM-dd"), d.Count)).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("admissionNumber", "Admission #", "text"),
            new ReportField("admittedOn", "Admitted On", "date"),
            new ReportField("dischargedOn", "Discharged On", "date"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("doctor", "Attending Doctor", "text"),
            new ReportField("bed", "Bed", "text"),
            new ReportField("type", "Type", "text"),
            new ReportField("status", "Status", "status"),
        });

        foreach (var x in page)
        {
            payload.Rows.Add(new Dictionary<string, object?>
            {
                ["admissionNumber"] = x.AdmissionNumber,
                ["admittedOn"] = x.AdmissionDate,
                ["dischargedOn"] = x.DischargeDate,
                ["patient"] = x.PatientName,
                ["doctor"] = x.DoctorName,
                ["bed"] = x.BedNumber,
                ["type"] = x.AdmissionType.ToString(),
                ["status"] = x.Status.ToString(),
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Beds / occupancy
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildBedsAsync(
        Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken ct)
    {
        var query =
            from b in _context.Beds
            join r in _context.Rooms on b.RoomId equals r.Id
            join w in _context.Wards on r.WardId equals w.Id
            where b.TenantId == tenantId && !b.IsDeleted
                  && (branchId == null || b.BranchId == branchId)
            select new
            {
                b.BedNumber, b.BedType, b.Status, b.DailyRate, b.IsActive,
                RoomNumber = r.RoomNumber, WardName = w.Name,
            };

        var totalCount = await query.CountAsync(ct);
        var occupiedCount = await query.CountAsync(x => x.Status == BedStatus.Occupied, ct);
        var availableCount = await query.CountAsync(x => x.Status == BedStatus.Available, ct);
        var outOfServiceCount = await query.CountAsync(
            x => x.Status == BedStatus.Maintenance || x.Status == BedStatus.Blocked || x.Status == BedStatus.OutOfService, ct);
        var occupancyPct = totalCount > 0 ? Math.Round(occupiedCount * 100.0 / totalCount, 1) : 0;

        var statusSplit = await query
            .GroupBy(x => x.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var wardSplit = await query
            .GroupBy(x => x.WardName)
            .Select(g => new { Ward = g.Key, Total = g.Count(), Occupied = g.Count(x => x.Status == BedStatus.Occupied) })
            .ToListAsync(ct);

        var page = await query
            .OrderBy(x => x.WardName).ThenBy(x => x.BedNumber)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var payload = MakePayload("beds", start, end, pageNumber, pageSize, totalCount);
        payload.Summary.Add(new("totalBeds", "Total Beds", totalCount, "number"));
        payload.Summary.Add(new("occupied", "Occupied", occupiedCount, "number"));
        payload.Summary.Add(new("available", "Available", availableCount, "number"));
        payload.Summary.Add(new("outOfService", "Out of Service", outOfServiceCount, "number"));
        payload.Summary.Add(new("occupancy", "Occupancy", occupancyPct, "percent"));

        payload.Series.Add(new("By Status",
            statusSplit.Select(s => new SeriesPoint(s.Status.ToString(), s.Count)).ToList()));
        payload.Series.Add(new("Occupied by Ward",
            wardSplit.Select(w => new SeriesPoint(w.Ward, w.Occupied)).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("bedNumber", "Bed", "text"),
            new ReportField("ward", "Ward", "text"),
            new ReportField("room", "Room", "text"),
            new ReportField("type", "Type", "text"),
            new ReportField("status", "Status", "status"),
            new ReportField("dailyRate", "Daily Rate", "currency"),
            new ReportField("active", "Active", "text"),
        });

        foreach (var x in page)
        {
            payload.Rows.Add(new Dictionary<string, object?>
            {
                ["bedNumber"] = x.BedNumber,
                ["ward"] = x.WardName,
                ["room"] = x.RoomNumber,
                ["type"] = x.BedType.ToString(),
                ["status"] = x.Status.ToString(),
                ["dailyRate"] = x.DailyRate,
                ["active"] = x.IsActive ? "Yes" : "No",
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Laboratory / Radiology (shared MedicalOrder report)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildOrderReportAsync(
        string key, MedicalOrderType orderType,
        Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken ct)
    {
        var query =
            from m in _context.MedicalOrders
            join p in _context.Patients on m.PatientId equals p.Id
            join u in _context.Users on m.OrderedById equals u.Id into uj
            from u in uj.DefaultIfEmpty()
            where m.TenantId == tenantId && !m.IsDeleted
                  && (branchId == null || m.BranchId == branchId)
                  && m.OrderType == orderType
                  && m.OrderDate >= start && m.OrderDate < end
            select new
            {
                m.OrderNumber, m.OrderDate, m.Status, m.IsUrgent, m.CompletedAt, m.Priority,
                PatientName = p.FirstName + " " + p.LastName,
                OrderedByName = u.FirstName + " " + u.LastName,
            };

        var totalCount = await query.CountAsync(ct);

        var statusSplit = await query
            .GroupBy(x => x.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var completedCount = statusSplit
            .Where(s => s.Status == MedicalOrderStatus.Completed || s.Status == MedicalOrderStatus.Verified)
            .Sum(s => s.Count);
        var cancelledCount = statusSplit.Where(s => s.Status == MedicalOrderStatus.Cancelled).Sum(s => s.Count);

        var daily = await query
            .GroupBy(x => x.OrderDate.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var page = await query
            .OrderByDescending(x => x.OrderDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var payload = MakePayload(key, start, end, pageNumber, pageSize, totalCount);
        payload.Summary.Add(new("orders", "Orders", totalCount, "number"));
        payload.Summary.Add(new("completed", "Completed / Verified", completedCount, "number"));
        payload.Summary.Add(new("pending", "Pending", totalCount - completedCount - cancelledCount, "number"));
        payload.Summary.Add(new("cancelled", "Cancelled", cancelledCount, "number"));

        payload.Series.Add(new("Daily Orders",
            daily.Select(d => new SeriesPoint(d.Date.ToString("yyyy-MM-dd"), d.Count)).ToList()));
        payload.Series.Add(new("By Status",
            statusSplit.Select(s => new SeriesPoint(s.Status.ToString(), s.Count)).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("orderNumber", "Order #", "text"),
            new ReportField("orderedOn", "Ordered On", "date"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("orderedBy", "Ordered By", "text"),
            new ReportField("status", "Status", "status"),
            new ReportField("urgent", "Urgent", "text"),
            new ReportField("completedOn", "Completed On", "date"),
        });

        foreach (var x in page)
        {
            payload.Rows.Add(new Dictionary<string, object?>
            {
                ["orderNumber"] = x.OrderNumber,
                ["orderedOn"] = x.OrderDate,
                ["patient"] = x.PatientName,
                ["orderedBy"] = x.OrderedByName,
                ["status"] = x.Status.ToString(),
                ["urgent"] = x.IsUrgent ? "Yes" : "No",
                ["completedOn"] = x.CompletedAt,
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Pharmacy / prescriptions
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildPharmacyAsync(
        Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken ct)
    {
        var query =
            from pr in _context.Prescriptions
            join p in _context.Patients on pr.PatientId equals p.Id
            join u in _context.Users on pr.DoctorId equals u.Id into uj
            from u in uj.DefaultIfEmpty()
            where pr.TenantId == tenantId && !pr.IsDeleted
                  && (branchId == null || pr.BranchId == branchId)
                  && pr.PrescriptionDate >= start && pr.PrescriptionDate < end
            select new
            {
                pr.PrescriptionNumber, pr.PrescriptionDate, pr.IsDispensed, pr.DispensedAt,
                pr.Diagnosis, ItemCount = pr.Items.Count,
                PatientName = p.FirstName + " " + p.LastName,
                DoctorName = u.FirstName + " " + u.LastName,
            };

        var totalCount = await query.CountAsync(ct);
        var dispensedCount = await query.CountAsync(x => x.IsDispensed, ct);
        var totalItems = await _context.Prescriptions
            .Where(pr => pr.TenantId == tenantId && !pr.IsDeleted
                         && (branchId == null || pr.BranchId == branchId)
                         && pr.PrescriptionDate >= start && pr.PrescriptionDate < end)
            .Select(pr => pr.Items.Count)
            .SumAsync(ct);

        var daily = await query
            .GroupBy(x => x.PrescriptionDate.Date)
            .Select(g => new { Date = g.Key, Total = g.Count(), Dispensed = g.Count(x => x.IsDispensed) })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var page = await query
            .OrderByDescending(x => x.PrescriptionDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var payload = MakePayload("pharmacy", start, end, pageNumber, pageSize, totalCount);
        payload.Summary.Add(new("prescriptions", "Prescriptions", totalCount, "number"));
        payload.Summary.Add(new("dispensed", "Dispensed", dispensedCount, "number"));
        payload.Summary.Add(new("pendingDispense", "Pending Dispense", totalCount - dispensedCount, "number"));
        payload.Summary.Add(new("itemsPrescribed", "Items Prescribed", totalItems, "number"));

        payload.Series.Add(new("Daily Prescriptions",
            daily.Select(d => new SeriesPoint(d.Date.ToString("yyyy-MM-dd"), d.Total)).ToList()));
        payload.Series.Add(new("Daily Dispensed",
            daily.Select(d => new SeriesPoint(d.Date.ToString("yyyy-MM-dd"), d.Dispensed)).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("prescriptionNumber", "Prescription #", "text"),
            new ReportField("prescribedOn", "Prescribed On", "date"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("doctor", "Doctor", "text"),
            new ReportField("items", "Items", "number"),
            new ReportField("diagnosis", "Diagnosis", "text"),
            new ReportField("dispensed", "Dispensed", "text"),
            new ReportField("dispensedOn", "Dispensed On", "date"),
        });

        foreach (var x in page)
        {
            payload.Rows.Add(new Dictionary<string, object?>
            {
                ["prescriptionNumber"] = x.PrescriptionNumber,
                ["prescribedOn"] = x.PrescriptionDate,
                ["patient"] = x.PatientName,
                ["doctor"] = x.DoctorName,
                ["items"] = x.ItemCount,
                ["diagnosis"] = x.Diagnosis,
                ["dispensed"] = x.IsDispensed ? "Yes" : "No",
                ["dispensedOn"] = x.DispensedAt,
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Inventory / stock
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildInventoryAsync(
        Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken ct)
    {
        var query =
            from i in _context.Items
            join c in _context.ItemCategories on i.CategoryId equals c.Id into cj
            from c in cj.DefaultIfEmpty()
            where i.TenantId == tenantId && !i.IsDeleted
                  && (branchId == null || i.BranchId == branchId)
            select new
            {
                i.Name, i.Code, i.IsMedicine, i.IsActive, i.CurrentStock, i.ReorderLevel,
                i.PurchasePrice, i.SellingPrice, i.IsDiscontinued,
                CategoryName = c.Name,
            };

        var totalCount = await query.CountAsync(ct);
        var activeCount = await query.CountAsync(x => x.IsActive, ct);
        var totalValue = await query.SumAsync(x => x.CurrentStock * x.PurchasePrice, ct);
        var lowStockCount = await query.CountAsync(x => x.IsActive && x.CurrentStock <= x.ReorderLevel && x.CurrentStock > 0, ct);
        var outOfStockCount = await query.CountAsync(x => x.IsActive && x.CurrentStock <= 0, ct);

        var categorySplit = await query
            .GroupBy(x => x.CategoryName)
            .Select(g => new
            {
                Category = g.Key,
                Value = g.Sum(x => x.CurrentStock * x.PurchasePrice),
                Count = g.Count(),
            })
            .ToListAsync(ct);

        var page = await query
            .OrderBy(x => x.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var payload = MakePayload("inventory", start, end, pageNumber, pageSize, totalCount);
        payload.Summary.Add(new("totalItems", "Total Items", totalCount, "number"));
        payload.Summary.Add(new("activeItems", "Active Items", activeCount, "number"));
        payload.Summary.Add(new("stockValue", "Stock Value", totalValue, "currency"));
        payload.Summary.Add(new("lowStock", "Low Stock", lowStockCount, "number"));

        payload.Series.Add(new("Stock Value by Category",
            categorySplit
                .OrderByDescending(c => c.Value)
                .Select(c => new SeriesPoint(c.Category ?? "Uncategorized", c.Value))
                .ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("code", "Code", "text"),
            new ReportField("name", "Name", "text"),
            new ReportField("category", "Category", "text"),
            new ReportField("type", "Type", "text"),
            new ReportField("stock", "Stock", "number"),
            new ReportField("reorderLevel", "Reorder Level", "number"),
            new ReportField("purchasePrice", "Purchase Price", "currency"),
            new ReportField("sellingPrice", "Selling Price", "currency"),
            new ReportField("stockValue", "Stock Value", "currency"),
            new ReportField("status", "Status", "status"),
        });

        foreach (var x in page)
        {
            payload.Rows.Add(new Dictionary<string, object?>
            {
                ["code"] = x.Code,
                ["name"] = x.Name,
                ["category"] = x.CategoryName ?? "Uncategorized",
                ["type"] = x.IsMedicine ? "Medicine" : "Non-medicine",
                ["stock"] = x.CurrentStock,
                ["reorderLevel"] = x.ReorderLevel,
                ["purchasePrice"] = x.PurchasePrice,
                ["sellingPrice"] = x.SellingPrice,
                ["stockValue"] = x.CurrentStock * x.PurchasePrice,
                ["status"] = !x.IsActive ? "Inactive"
                    : x.CurrentStock <= 0 ? "Out of Stock"
                    : x.CurrentStock <= x.ReorderLevel ? "Low Stock"
                    : "In Stock",
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Suppliers (organization-level, no location scope)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildSuppliersAsync(
        Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken ct)
    {
        var query = _context.Suppliers.Where(s => s.TenantId == tenantId && !s.IsDeleted);

        var totalCount = await query.CountAsync(ct);
        var activeCount = await query.CountAsync(s => s.IsActive, ct);
        var payables = await query.SumAsync(s => (decimal?)s.OutstandingPayable, ct) ?? 0m;

        var page = await query
            .OrderBy(s => s.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var payload = MakePayload("suppliers", start, end, pageNumber, pageSize, totalCount);
        payload.Summary.Add(new("total", "Suppliers", totalCount, "number"));
        payload.Summary.Add(new("active", "Active", activeCount, "number"));
        payload.Summary.Add(new("inactive", "Inactive", totalCount - activeCount, "number"));
        payload.Summary.Add(new("payables", "Outstanding Payables", payables, "currency"));

        payload.Columns.AddRange(new[]
        {
            new ReportField("name", "Supplier", "text"),
            new ReportField("code", "Code", "text"),
            new ReportField("contactPerson", "Contact Person", "text"),
            new ReportField("phone", "Phone", "text"),
            new ReportField("email", "Email", "text"),
            new ReportField("city", "City", "text"),
            new ReportField("paymentTerms", "Terms (Days)", "number"),
            new ReportField("outstanding", "Outstanding", "currency"),
            new ReportField("status", "Status", "status"),
        });

        foreach (var s in page)
        {
            payload.Rows.Add(new Dictionary<string, object?>
            {
                ["name"] = s.Name,
                ["code"] = s.Code,
                ["contactPerson"] = s.ContactPersonName,
                ["phone"] = s.Phone,
                ["email"] = s.Email,
                ["city"] = s.City,
                ["paymentTerms"] = s.PaymentTermsDays,
                ["outstanding"] = s.OutstandingPayable,
                ["status"] = s.IsActive ? "Active" : "Inactive",
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Billing (financial)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildBillingAsync(
        Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken ct)
    {
        var invoices =
            from i in _context.Invoices
            join p in _context.Patients on i.PatientId equals p.Id
            where i.TenantId == tenantId && !i.IsDeleted
                  && (branchId == null || i.BranchId == branchId)
                  && i.InvoiceDate >= start && i.InvoiceDate < end
            select new
            {
                i.InvoiceNumber, i.InvoiceDate, i.Status, i.TotalAmount, i.PaidAmount,
                i.OutstandingAmount, i.RefundedAmount,
                PatientName = p.FirstName + " " + p.LastName,
            };

        var totalCount = await invoices.CountAsync(ct);
        var revenue = await invoices.Where(x => x.Status != InvoiceStatus.Cancelled).SumAsync(x => x.TotalAmount, ct);
        var collected = await invoices.SumAsync(x => x.PaidAmount, ct);
        var outstanding = await invoices.SumAsync(x => x.OutstandingAmount, ct);
        var refunds = await invoices.SumAsync(x => x.RefundedAmount, ct);
        var cancelledCount = await invoices.CountAsync(x => x.Status == InvoiceStatus.Cancelled, ct);

        var payments = _context.Payments.Where(p =>
            p.TenantId == tenantId && !p.IsDeleted
            && (branchId == null || p.BranchId == branchId)
            && p.PaymentDate >= start && p.PaymentDate < end);
        var paymentTotal = await payments.SumAsync(p => p.Amount, ct);

        var dailyRevenue = await invoices
            .Where(x => x.Status != InvoiceStatus.Cancelled)
            .GroupBy(x => x.InvoiceDate.Date)
            .Select(g => new { Date = g.Key, Total = g.Sum(x => x.TotalAmount), Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var dailyCollections = await payments
            .GroupBy(p => p.PaymentDate.Date)
            .Select(g => new { Date = g.Key, Total = g.Sum(p => p.Amount) })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var page = await invoices
            .OrderByDescending(x => x.InvoiceDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var payload = MakePayload("billing", start, end, pageNumber, pageSize, totalCount);
        payload.Summary.Add(new("revenue", "Revenue", revenue, "currency"));
        payload.Summary.Add(new("collected", "Collected", paymentTotal, "currency"));
        payload.Summary.Add(new("outstanding", "Outstanding", outstanding, "currency"));
        payload.Summary.Add(new("invoices", "Invoices", totalCount, "number"));

        payload.Series.Add(new("Daily Revenue",
            dailyRevenue.Select(d => new SeriesPoint(d.Date.ToString("yyyy-MM-dd"), d.Total)).ToList()));
        payload.Series.Add(new("Daily Collections",
            dailyCollections.Select(d => new SeriesPoint(d.Date.ToString("yyyy-MM-dd"), d.Total)).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("invoiceNumber", "Invoice #", "text"),
            new ReportField("invoiceDate", "Invoice Date", "date"),
            new ReportField("patient", "Patient", "text"),
            new ReportField("status", "Status", "status"),
            new ReportField("total", "Total", "currency"),
            new ReportField("paid", "Paid", "currency"),
            new ReportField("outstanding", "Outstanding", "currency"),
        });

        foreach (var x in page)
        {
            payload.Rows.Add(new Dictionary<string, object?>
            {
                ["invoiceNumber"] = x.InvoiceNumber,
                ["invoiceDate"] = x.InvoiceDate,
                ["patient"] = x.PatientName,
                ["status"] = x.Status.ToString(),
                ["total"] = x.TotalAmount,
                ["paid"] = x.PaidAmount,
                ["outstanding"] = x.OutstandingAmount,
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Management overview (financial)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildManagementAsync(
        Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken ct)
    {
        var patientsRegistered = await _context.Patients.CountAsync(p =>
            p.TenantId == tenantId && !p.IsDeleted
            && (branchId == null || p.BranchId == branchId)
            && p.CreatedAt >= start && p.CreatedAt < end, ct);

        var appointmentsCompleted = await _context.Appointments.CountAsync(a =>
            a.TenantId == tenantId && !a.IsDeleted
            && (branchId == null || a.BranchId == branchId)
            && a.AppointmentDate >= start && a.AppointmentDate < end
            && a.Status == AppointmentStatus.Completed, ct);

        var visitsTotal = await _context.Visits.CountAsync(v =>
            v.TenantId == tenantId && !v.IsDeleted
            && (branchId == null || v.BranchId == branchId)
            && v.VisitDate >= start && v.VisitDate < end, ct);

        var admissions = await _context.Admissions.CountAsync(a =>
            a.TenantId == tenantId && !a.IsDeleted
            && (branchId == null || a.BranchId == branchId)
            && a.AdmissionDate >= start && a.AdmissionDate < end, ct);

        var discharges = await _context.Admissions.CountAsync(a =>
            a.TenantId == tenantId && !a.IsDeleted
            && (branchId == null || a.BranchId == branchId)
            && a.DischargeDate != null && a.DischargeDate >= start && a.DischargeDate < end, ct);

        var revenue = await _context.Invoices.Where(i =>
                i.TenantId == tenantId && !i.IsDeleted
                && (branchId == null || i.BranchId == branchId)
                && i.InvoiceDate >= start && i.InvoiceDate < end
                && i.Status != InvoiceStatus.Cancelled)
            .SumAsync(i => i.TotalAmount, ct);

        var collected = await _context.Payments.Where(p =>
                p.TenantId == tenantId && !p.IsDeleted
                && (branchId == null || p.BranchId == branchId)
                && p.PaymentDate >= start && p.PaymentDate < end)
            .SumAsync(p => p.Amount, ct);

        var labOrders = await _context.MedicalOrders.CountAsync(m =>
            m.TenantId == tenantId && !m.IsDeleted
            && (branchId == null || m.BranchId == branchId)
            && m.OrderType == MedicalOrderType.Lab
            && m.OrderDate >= start && m.OrderDate < end, ct);

        var prescriptions = await _context.Prescriptions.CountAsync(pr =>
            pr.TenantId == tenantId && !pr.IsDeleted
            && (branchId == null || pr.BranchId == branchId)
            && pr.PrescriptionDate >= start && pr.PrescriptionDate < end, ct);

        var totalBeds = await _context.Beds.CountAsync(b =>
            b.TenantId == tenantId && !b.IsDeleted && (branchId == null || b.BranchId == branchId), ct);
        var occupiedBeds = await _context.Beds.CountAsync(b =>
            b.TenantId == tenantId && !b.IsDeleted && (branchId == null || b.BranchId == branchId)
            && b.Status == BedStatus.Occupied, ct);
        var occupancyPct = totalBeds > 0 ? Math.Round(occupiedBeds * 100.0 / totalBeds, 1) : 0;

        var dailyRevenue = await _context.Invoices
            .Where(i => i.TenantId == tenantId && !i.IsDeleted
                        && (branchId == null || i.BranchId == branchId)
                        && i.InvoiceDate >= start && i.InvoiceDate < end
                        && i.Status != InvoiceStatus.Cancelled)
            .GroupBy(i => i.InvoiceDate.Date)
            .Select(g => new { Date = g.Key, Revenue = g.Sum(i => i.TotalAmount), Invoices = g.Count() })
            .ToListAsync(ct);

        var dailyCollections = await _context.Payments
            .Where(p => p.TenantId == tenantId && !p.IsDeleted
                        && (branchId == null || p.BranchId == branchId)
                        && p.PaymentDate >= start && p.PaymentDate < end)
            .GroupBy(p => p.PaymentDate.Date)
            .Select(g => new { Date = g.Key, Collected = g.Sum(p => p.Amount) })
            .ToListAsync(ct);

        var dailyAppointments = await _context.Appointments
            .Where(a => a.TenantId == tenantId && !a.IsDeleted
                        && (branchId == null || a.BranchId == branchId)
                        && a.AppointmentDate >= start && a.AppointmentDate < end)
            .GroupBy(a => a.AppointmentDate.Date)
            .Select(g => new
            {
                Date = g.Key,
                Appointments = g.Count(),
                Completed = g.Count(a => a.Status == AppointmentStatus.Completed),
            })
            .ToListAsync(ct);

        var dates = dailyRevenue.Select(x => x.Date)
            .Union(dailyCollections.Select(x => x.Date))
            .Union(dailyAppointments.Select(x => x.Date))
            .Distinct()
            .OrderBy(d => d)
            .ToList();

        var merged = dates.Select(d => new
        {
            Date = d,
            Revenue = dailyRevenue.FirstOrDefault(x => x.Date == d)?.Revenue ?? 0m,
            Invoices = dailyRevenue.FirstOrDefault(x => x.Date == d)?.Invoices ?? 0,
            Collected = dailyCollections.FirstOrDefault(x => x.Date == d)?.Collected ?? 0m,
            Appointments = dailyAppointments.FirstOrDefault(x => x.Date == d)?.Appointments ?? 0,
            Completed = dailyAppointments.FirstOrDefault(x => x.Date == d)?.Completed ?? 0,
        }).ToList();

        var page = merged.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

        var payload = MakePayload("management", start, end, pageNumber, pageSize, merged.Count);
        payload.Summary.Add(new("revenue", "Revenue", revenue, "currency"));
        payload.Summary.Add(new("collected", "Collected", collected, "currency"));
        payload.Summary.Add(new("patientsRegistered", "New Patients", patientsRegistered, "number"));
        payload.Summary.Add(new("appointmentsCompleted", "Appointments Completed", appointmentsCompleted, "number"));
        payload.Summary.Add(new("visitsTotal", "OPD Visits", visitsTotal, "number"));
        payload.Summary.Add(new("admissions", "Admissions", admissions, "number"));
        payload.Summary.Add(new("discharges", "Discharges", discharges, "number"));
        payload.Summary.Add(new("labOrders", "Lab Orders", labOrders, "number"));
        payload.Summary.Add(new("prescriptions", "Prescriptions", prescriptions, "number"));
        payload.Summary.Add(new("occupancy", "Bed Occupancy", occupancyPct, "percent"));

        payload.Series.Add(new("Revenue",
            merged.Select(x => new SeriesPoint(x.Date.ToString("yyyy-MM-dd"), x.Revenue)).ToList()));
        payload.Series.Add(new("Collections",
            merged.Select(x => new SeriesPoint(x.Date.ToString("yyyy-MM-dd"), x.Collected)).ToList()));
        payload.Series.Add(new("Appointments",
            merged.Select(x => new SeriesPoint(x.Date.ToString("yyyy-MM-dd"), x.Appointments)).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("date", "Date", "date"),
            new ReportField("appointments", "Appointments", "number"),
            new ReportField("completed", "Completed", "number"),
            new ReportField("invoices", "Invoices", "number"),
            new ReportField("revenue", "Revenue", "currency"),
            new ReportField("collected", "Collected", "currency"),
        });

        foreach (var x in page)
        {
            payload.Rows.Add(new Dictionary<string, object?>
            {
                ["date"] = x.Date,
                ["appointments"] = x.Appointments,
                ["completed"] = x.Completed,
                ["invoices"] = x.Invoices,
                ["revenue"] = x.Revenue,
                ["collected"] = x.Collected,
            });
        }

        return payload;
    }

    // ------------------------------------------------------------------
    // Audit activity (requires AuditView — enforced at the endpoint)
    // ------------------------------------------------------------------

    private async Task<ReportPayload> BuildAuditActivityAsync(
        Guid tenantId, Guid? branchId, DateTime start, DateTime end,
        int pageNumber, int pageSize, CancellationToken ct)
    {
        var query = _context.AuditLogs.Where(a =>
            a.TenantId == tenantId
            && (branchId == null || a.BranchId == branchId)
            && a.Timestamp >= start && a.Timestamp < end);

        var totalCount = await query.CountAsync(ct);
        var failures = await query.CountAsync(a => a.Success == false, ct);
        var logins = await query.CountAsync(a => a.Action == "LOGIN", ct);
        var loginFailures = await query.CountAsync(a => a.Action == "LOGIN_FAILED", ct);
        var activeUsers = await query
            .Where(a => a.UserId != null)
            .Select(a => a.UserId)
            .Distinct()
            .CountAsync(ct);

        var daily = await query
            .GroupBy(a => a.Timestamp.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(ct);

        var moduleSplit = await query
            .GroupBy(a => a.Module)
            .Select(g => new { Module = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(8)
            .ToListAsync(ct);

        var page = await query
            .OrderByDescending(a => a.Timestamp)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var payload = MakePayload("audit-activity", start, end, pageNumber, pageSize, totalCount);
        payload.Summary.Add(new("events", "Events", totalCount, "number"));
        payload.Summary.Add(new("failures", "Failures", failures, "number"));
        payload.Summary.Add(new("logins", "Logins", logins, "number"));
        payload.Summary.Add(new("loginFailures", "Failed Logins", loginFailures, "number"));
        payload.Summary.Add(new("activeUsers", "Active Users", activeUsers, "number"));

        payload.Series.Add(new("Daily Events",
            daily.Select(d => new SeriesPoint(d.Date.ToString("yyyy-MM-dd"), d.Count)).ToList()));
        payload.Series.Add(new("By Module",
            moduleSplit.Select(m => new SeriesPoint(m.Module, m.Count)).ToList()));

        payload.Columns.AddRange(new[]
        {
            new ReportField("timestamp", "Timestamp", "date"),
            new ReportField("user", "User", "text"),
            new ReportField("module", "Module", "text"),
            new ReportField("action", "Action", "text"),
            new ReportField("entity", "Entity", "text"),
            new ReportField("description", "Description", "text"),
            new ReportField("location", "Location", "text"),
            new ReportField("status", "Status", "status"),
        });

        foreach (var a in page)
        {
            payload.Rows.Add(new Dictionary<string, object?>
            {
                ["timestamp"] = a.Timestamp,
                ["user"] = a.UserName ?? a.UserEmail ?? "System",
                ["module"] = a.Module,
                ["action"] = a.Action,
                ["entity"] = a.EntityName ?? a.EntityType,
                ["description"] = a.Description,
                ["location"] = a.LocationName,
                ["status"] = a.Success == null ? "—" : (a.Success == true ? "Success" : "Failure"),
            });
        }

        return payload;
    }
}
