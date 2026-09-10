namespace ClinIQ.Shared.Constants;

/// <summary>
/// Default feature sets and usage limits per subscription package.
/// A tenant's real entitlements live in TenantEntitlement rows so an operator
/// can override per organization; this supplies the defaults at provisioning
/// time and the ceiling that a downgrade clamps back to.
///
/// Package is passed as int to keep ClinIQ.Shared free of a Domain reference.
/// Values match ClinIQ.Domain.Enums.SubscriptionPackage.
/// </summary>
public static class PackageCatalog
{
    public const int Free = 1;
    public const int Basic = 2;
    public const int Professional = 3;
    public const int Enterprise = 4;

    public static IReadOnlyDictionary<int, string[]> FeaturesByPackage { get; } =
        new Dictionary<int, string[]>
        {
            [Free] = new[]
            {
                Features.Dashboard, Features.Patients, Features.Appointments, Features.OPD
            },
            [Basic] = new[]
            {
                Features.Dashboard, Features.Patients, Features.Appointments, Features.OPD,
                Features.EMR, Features.Prescriptions, Features.Billing, Features.Reports,
                Features.VitalForms
            },
            [Professional] = new[]
            {
                Features.Dashboard, Features.Patients, Features.Appointments, Features.OPD,
                Features.IPD, Features.Beds, Features.Wards, Features.Rooms,
                Features.EMR, Features.Prescriptions, Features.Billing, Features.Insurance,
                Features.Pharmacy, Features.Inventory, Features.Procurement, Features.Reports,
                Features.FormDesigner, Features.VitalForms, Features.SMS,
                Features.MultiBranch, Features.CustomRoles
            },
            [Enterprise] = new[]
            {
                Features.Dashboard, Features.Patients, Features.Appointments, Features.OPD,
                Features.IPD, Features.Beds, Features.Wards, Features.Rooms,
                Features.EMR, Features.Prescriptions, Features.Billing, Features.Insurance,
                Features.Pharmacy, Features.Inventory, Features.Procurement,
                Features.Reports, Features.AdvancedAnalytics, Features.FormDesigner,
                Features.VitalForms, Features.SMS, Features.WhatsApp, Features.Telemedicine,
                Features.Attendance, Features.Integrations, Features.API,
                Features.MultiBranch, Features.CustomRoles, Features.AuditLogs
            }
        };

    public static IReadOnlyDictionary<int, Dictionary<string, int>> LimitsByPackage { get; } =
        new Dictionary<int, Dictionary<string, int>>
        {
            [Free] = new()
            {
                ["users"] = 3, ["branches"] = 1, ["doctors"] = 2,
                ["patients"] = 500, ["beds"] = 0, ["storage_mb"] = 250, ["sms"] = 0
            },
            [Basic] = new()
            {
                ["users"] = 15, ["branches"] = 2, ["doctors"] = 10,
                ["patients"] = 10_000, ["beds"] = 0, ["storage_mb"] = 5_000, ["sms"] = 500
            },
            [Professional] = new()
            {
                ["users"] = 75, ["branches"] = 10, ["doctors"] = 50,
                ["patients"] = 100_000, ["beds"] = 200, ["storage_mb"] = 50_000, ["sms"] = 5_000
            },
            [Enterprise] = new()
            {
                ["users"] = -1, ["branches"] = -1, ["doctors"] = -1,
                ["patients"] = -1, ["beds"] = -1, ["storage_mb"] = -1, ["sms"] = -1
            }
        };

    public static string[] GetFeatures(int package) =>
        FeaturesByPackage.TryGetValue(package, out var f) ? f : FeaturesByPackage[Free];

    public static int GetLimit(int package, string limitType) =>
        LimitsByPackage.TryGetValue(package, out var l) && l.TryGetValue(limitType, out var v) ? v : -1;
}
