using ClinIQ.Domain.Entities;
using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Entities.Facility;
using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Domain.Entities.Insurance;
using ClinIQ.Domain.Entities.Inventory;
using ClinIQ.Domain.Entities.Tenancy;

namespace ClinIQ.Domain.Common;

/// <summary>How a row's LocationId is derived for an audited entity.</summary>
public enum AuditLocationScope
{
    /// <summary>IBranchEntity → the entity's own BranchId; otherwise the caller's current location.</summary>
    Entity = 0,

    /// <summary>Always organization level: LocationId stays NULL.</summary>
    Organization = 1,

    /// <summary>Always the caller's current location (user/session scoped actions).</summary>
    Ambient = 2,
}

public sealed record AuditEntityPolicy(string Module, string EntityLabel, AuditLocationScope Location = AuditLocationScope.Entity);

/// <summary>
/// Central registry deciding WHICH entity changes become audit rows and how
/// they are labelled. Anything absent from this map is never audited, so
/// high-frequency clinical noise (vitals, queue tokens, nursing notes) does
/// not flood the audit trail while the business-significant modules are
/// covered.
/// </summary>
public static class AuditPolicy
{
    private static readonly Dictionary<Type, AuditEntityPolicy> Policies = new()
    {
        // ---- Patients / clinical ----
        { typeof(Patient),           new("Patients", "Patient") },
        { typeof(Appointment),       new("Appointments", "Appointment") },
        { typeof(Visit),             new("OPD", "Visit") },
        { typeof(Admission),         new("IPD", "Admission") },
        { typeof(Prescription),      new("Prescriptions", "Prescription") },
        { typeof(MedicalOrder),      new("Laboratory", "Medical Order") },
        { typeof(LabOrderItem),      new("Laboratory", "Lab Order Item") },
        { typeof(RadiologyOrderItem), new("Radiology", "Radiology Order Item") },
        { typeof(BedAllocation),     new("IPD", "Bed Allocation") },

        // ---- Billing ----
        { typeof(Invoice),           new("Billing", "Invoice") },
        { typeof(Payment),           new("Billing", "Payment") },
        { typeof(InsuranceClaim),    new("Insurance", "Insurance Claim") },

        // ---- Inventory / supply ----
        { typeof(Item),              new("Inventory", "Item") },
        { typeof(StockMovement),     new("Inventory", "Stock Movement") },
        { typeof(StockTransfer),     new("Inventory", "Stock Transfer") },
        { typeof(PurchaseOrder),     new("PurchaseOrders", "Purchase Order") },
        { typeof(GoodsReceipt),      new("Inventory", "Goods Receipt") },

        // ---- Identity / access ----
        { typeof(ApplicationUser),   new("Users", "User", AuditLocationScope.Ambient) },
        { typeof(UserRole),          new("Roles", "Role Assignment", AuditLocationScope.Ambient) },
        { typeof(RolePermission),    new("Permissions", "Role Permission", AuditLocationScope.Ambient) },
        { typeof(UserPermission),    new("Permissions", "User Permission", AuditLocationScope.Ambient) },
        { typeof(Role),              new("Roles", "Role", AuditLocationScope.Organization) },
        { typeof(BranchUser),        new("Locations", "Location Access", AuditLocationScope.Ambient) },
        { typeof(TenantUser),        new("Users", "Organization Membership", AuditLocationScope.Organization) },

        // ---- Organization / locations / masters ----
        { typeof(Tenant),            new("Organization", "Organization", AuditLocationScope.Organization) },
        { typeof(Branch),            new("Locations", "Location") },
        { typeof(Department),        new("Administration", "Department") },
        { typeof(Service),           new("Services", "Service", AuditLocationScope.Organization) },
        { typeof(Discount),          new("Billing", "Discount", AuditLocationScope.Organization) },
        { typeof(Supplier),          new("Inventory", "Supplier", AuditLocationScope.Organization) },
        { typeof(SystemSetting),     new("Settings", "System Setting", AuditLocationScope.Organization) },
    };

    /// <summary>Fields that carry no audit value (bookkeeping / concurrency / login telemetry).</summary>
    private static readonly HashSet<string> NoiseFields = new(StringComparer.OrdinalIgnoreCase)
    {
        nameof(BaseEntity.CreatedAt), nameof(BaseEntity.CreatedBy),
        nameof(BaseEntity.UpdatedAt), nameof(BaseEntity.UpdatedBy),
        nameof(BaseEntity.RowVersion),
        nameof(BaseAuditableEntity.DeletedAt), nameof(BaseAuditableEntity.DeletedBy),
        "LastLoginAt", "LastLoginIp", "LockoutEnd", "AccessFailedCount",
        "NormalizedEmail", "NormalizedUserName", "ConcurrencyStamp", "SecurityStamp",
    };

    /// <summary>Secrets/credentials that must NEVER reach the audit table.</summary>
    private static readonly HashSet<string> SensitiveExact = new(StringComparer.OrdinalIgnoreCase)
    {
        "PasswordHash", "PlainPassword", "Password", "CurrentPassword", "NewPassword",
        "Token", "RefreshToken", "Secret", "ApiKey", "MasterPassword", "Signature",
        "ConnectionStrings",
    };

    private static readonly string[] SensitiveFragments =
        { "password", "secret", "token", "apikey", "api_key", "credential", "connectionstring" };

    /// <summary>Clinical/free-text fields excluded so audit rows never duplicate medical records.</summary>
    private static readonly HashSet<string> ClinicalFields = new(StringComparer.OrdinalIgnoreCase)
    {
        "Notes", "ClinicalNotes", "PrivateNotes", "Description", "Bio",
        "PastMedicalHistory", "FamilyHistory", "SocialHistory", "HistoryOfPresentIllness",
        "ReviewOfSystems", "PhysicalExamination", "Assessment", "Plan",
        "Diagnoses", "Diagnosis", "FinalDiagnosis", "ProvisionalDiagnosis",
        "Allergies", "ChronicConditions", "CurrentMedications", "SurgicalHistory",
        "Findings", "Impression", "Recommendations", "Technique",
        "DischargeSummary", "DischargeInstructions", "Results", "ResultNotes",
        "GeneralInstructions", "DietaryAdvice", "LifestyleAdvice", "FollowUpInstructions",
        "ChiefComplaint", "AdmissionReason", "InternalNotes",
    };

    private static readonly string[] LabelCandidates =
    {
        "Name", "FullName", "FirstName", "Email", "InvoiceNumber", "PaymentNumber",
        "PrescriptionNumber", "AdmissionNumber", "AppointmentNumber", "VisitNumber",
        "OrderNumber", "PatientNumber", "PONumber", "GRNNumber", "TransferNumber",
        "MovementNumber", "BedNumber", "RoomNumber", "Code", "MRN", "Key", "Title", "UserName",
    };

    public static AuditEntityPolicy? For(Type entityType) =>
        Policies.TryGetValue(entityType, out var policy) ? policy : null;

    public static bool IsAudited(Type entityType) => Policies.ContainsKey(entityType);

    public static bool IsNoise(string fieldName) => NoiseFields.Contains(fieldName);

    public static bool IsSensitive(string fieldName)
    {
        if (SensitiveExact.Contains(fieldName)) return true;
        foreach (var fragment in SensitiveFragments)
            if (fieldName.Contains(fragment, StringComparison.OrdinalIgnoreCase))
                return true;
        return false;
    }

    public static bool IsClinical(string fieldName) => ClinicalFields.Contains(fieldName);

    /// <summary>True when the field may be serialised into OldValues/NewValues.</summary>
    public static bool IsAuditableField(string fieldName) =>
        !IsNoise(fieldName) && !IsSensitive(fieldName) && !IsClinical(fieldName);

    /// <summary>Human label for the record inside a description, e.g. "Patient updated: John Doe".</summary>
    public static string? DescribeEntity(object entity, IReadOnlyDictionary<string, object?>? fallbackValues = null)
    {
        var type = entity.GetType();
        foreach (var candidate in LabelCandidates)
        {
            var prop = type.GetProperty(candidate);
            if (prop is null || prop.PropertyType != typeof(string)) continue;
            if (prop.GetValue(entity) is string value && !string.IsNullOrWhiteSpace(value))
                return value.Length > 80 ? value[..80] : value;
        }

        if (fallbackValues is not null)
        {
            foreach (var candidate in LabelCandidates)
                if (fallbackValues.TryGetValue(candidate, out var v) && v is string s && !string.IsNullOrWhiteSpace(s))
                    return s.Length > 80 ? s[..80] : s;
        }

        return null;
    }
}
