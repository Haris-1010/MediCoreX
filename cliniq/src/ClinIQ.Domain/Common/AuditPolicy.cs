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

/// <summary>A named business action replacing the generic change-capture verb.</summary>
public sealed record AuditSemantic(string Action, string Description);

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
        // A location is described at organization level: LocationId NULL, EntityId = the location.
        { typeof(Branch),            new("Locations", "Location", AuditLocationScope.Organization) },
        { typeof(Department),        new("Administration", "Department") },
        { typeof(Service),           new("Services", "Service", AuditLocationScope.Organization) },
        { typeof(Discount),          new("Billing", "Discount", AuditLocationScope.Organization) },
        { typeof(Supplier),          new("Inventory", "Supplier", AuditLocationScope.Organization) },
        { typeof(SystemSetting),     new("Settings", "System Setting", AuditLocationScope.Organization) },

        // ---- Subscription (organization level) ----
        { typeof(TenantEntitlement), new("Organization", "Subscription Feature", AuditLocationScope.Organization) },
        { typeof(TenantLimit),       new("Organization", "Subscription Limit", AuditLocationScope.Organization) },

        // ---- Facility (location scoped) ----
        { typeof(Building),          new("Facility", "Building") },
        { typeof(Floor),             new("Facility", "Floor") },
        { typeof(Ward),              new("IPD", "Ward") },
        { typeof(Room),              new("IPD", "Room") },
        { typeof(Bed),               new("IPD", "Bed") },

        // ---- Clinical masters / scheduling ----
        { typeof(DoctorSchedule),    new("Doctors", "Doctor Schedule") },
        { typeof(EmergencyVisit),    new("Emergency", "Emergency Visit") },
        { typeof(LabTestParameter),  new("Laboratory", "Lab Test Parameter", AuditLocationScope.Organization) },
        { typeof(PatientCategory),   new("Patients", "Patient Category", AuditLocationScope.Organization) },
        { typeof(PatientInsurance),  new("Insurance", "Patient Insurance") },

        // ---- Billing / insurance masters ----
        { typeof(ServiceCategory),   new("Services", "Service Category", AuditLocationScope.Organization) },
        { typeof(TaxConfiguration),  new("Billing", "Tax Configuration", AuditLocationScope.Organization) },
        { typeof(InsuranceCompany),  new("Insurance", "Insurance Company", AuditLocationScope.Organization) },
        { typeof(InsurancePlan),     new("Insurance", "Insurance Plan", AuditLocationScope.Organization) },
        { typeof(CorporateClient),   new("Insurance", "Corporate Client", AuditLocationScope.Organization) },

        // ---- Inventory masters / stock ----
        { typeof(ItemCategory),      new("Inventory", "Item Category", AuditLocationScope.Organization) },
        { typeof(Manufacturer),      new("Inventory", "Manufacturer", AuditLocationScope.Organization) },
        { typeof(Warehouse),         new("Inventory", "Warehouse") },
        { typeof(StockBatch),        new("Inventory", "Stock Batch") },
    };

    // ------------------------------------------------------------------
    // Semantic business actions
    //
    // Change capture produces CREATE / UPDATE / DELETE. For the transitions a
    // hospital actually asks about ("who verified this lab result?", "who
    // cancelled that appointment?") the generic verb is replaced with a named
    // business action, so the trail reads "LAB_RESULT_VERIFIED" rather than
    // "UPDATE (1 field)" and can be filtered on directly.
    // ------------------------------------------------------------------

    /// <summary>(entity, new Status value) -> (action, past-tense verb).</summary>
    private static readonly Dictionary<(Type, string), (string Action, string Verb)> StatusActions = new()
    {
        { (typeof(Appointment), "Confirmed"),   ("APPOINTMENT_CONFIRMED", "confirmed") },
        { (typeof(Appointment), "CheckedIn"),   ("APPOINTMENT_CHECKED_IN", "checked in") },
        { (typeof(Appointment), "Completed"),   ("APPOINTMENT_COMPLETED", "completed") },
        { (typeof(Appointment), "Cancelled"),   ("APPOINTMENT_CANCELLED", "cancelled") },
        { (typeof(Appointment), "NoShow"),      ("APPOINTMENT_NO_SHOW", "marked no-show") },
        { (typeof(Appointment), "Rescheduled"), ("APPOINTMENT_RESCHEDULED", "rescheduled") },

        { (typeof(Admission), "Discharged"),    ("PATIENT_DISCHARGED", "discharged") },
        { (typeof(Admission), "Transferred"),   ("PATIENT_TRANSFERRED", "transferred") },
        { (typeof(Admission), "Deceased"),      ("PATIENT_DECEASED", "marked deceased") },
        { (typeof(Admission), "Cancelled"),     ("ADMISSION_CANCELLED", "cancelled") },

        { (typeof(LabOrderItem), "SampleCollected"), ("LAB_SAMPLE_COLLECTED", "sample collected") },
        { (typeof(LabOrderItem), "ResultEntered"),   ("LAB_RESULT_ENTERED", "result entered") },
        { (typeof(LabOrderItem), "Verified"),        ("LAB_RESULT_VERIFIED", "result verified") },
        { (typeof(LabOrderItem), "Rejected"),        ("LAB_SAMPLE_REJECTED", "sample rejected") },
        { (typeof(LabOrderItem), "Cancelled"),       ("LAB_ORDER_CANCELLED", "cancelled") },

        { (typeof(RadiologyOrderItem), "ImagingCompleted"), ("RADIOLOGY_IMAGING_COMPLETED", "imaging completed") },
        { (typeof(RadiologyOrderItem), "ReportDrafted"),    ("RADIOLOGY_REPORT_DRAFTED", "report drafted") },
        { (typeof(RadiologyOrderItem), "Verified"),         ("RADIOLOGY_REPORT_VERIFIED", "report verified") },
        { (typeof(RadiologyOrderItem), "Cancelled"),        ("RADIOLOGY_ORDER_CANCELLED", "cancelled") },

        { (typeof(MedicalOrder), "Completed"),  ("ORDER_COMPLETED", "completed") },
        { (typeof(MedicalOrder), "Cancelled"),  ("ORDER_CANCELLED", "cancelled") },

        { (typeof(Invoice), "Finalized"),        ("INVOICE_FINALIZED", "finalized") },
        { (typeof(Invoice), "PartiallyPaid"),    ("INVOICE_PARTIALLY_PAID", "partially paid") },
        { (typeof(Invoice), "Paid"),             ("INVOICE_PAID", "paid") },
        { (typeof(Invoice), "Cancelled"),        ("INVOICE_CANCELLED", "cancelled") },
        { (typeof(Invoice), "Refunded"),         ("INVOICE_REFUNDED", "refunded") },
        { (typeof(Invoice), "PartiallyRefunded"),("INVOICE_REFUNDED", "partially refunded") },
        { (typeof(Invoice), "WrittenOff"),       ("INVOICE_WRITTEN_OFF", "written off") },

        { (typeof(Payment), "Refunded"),          ("PAYMENT_REFUNDED", "refunded") },
        { (typeof(Payment), "PartiallyRefunded"), ("PAYMENT_REFUNDED", "partially refunded") },
        { (typeof(Payment), "Cancelled"),         ("PAYMENT_CANCELLED", "cancelled") },

        { (typeof(PurchaseOrder), "Approved"),          ("PURCHASE_ORDER_APPROVED", "approved") },
        { (typeof(PurchaseOrder), "Rejected"),          ("PURCHASE_ORDER_REJECTED", "rejected") },
        { (typeof(PurchaseOrder), "PartiallyReceived"), ("PURCHASE_PARTIALLY_RECEIVED", "partially received") },
        { (typeof(PurchaseOrder), "Received"),          ("PURCHASE_RECEIVED", "received") },
        { (typeof(PurchaseOrder), "Cancelled"),         ("PURCHASE_ORDER_CANCELLED", "cancelled") },

        { (typeof(InsuranceClaim), "Submitted"), ("CLAIM_SUBMITTED", "submitted") },
        { (typeof(InsuranceClaim), "Approved"),  ("CLAIM_APPROVED", "approved") },
        { (typeof(InsuranceClaim), "PartiallyApproved"), ("CLAIM_APPROVED", "partially approved") },
        { (typeof(InsuranceClaim), "Rejected"),  ("CLAIM_REJECTED", "rejected") },
        { (typeof(InsuranceClaim), "Settled"),   ("CLAIM_SETTLED", "settled") },
    };

    /// <summary>Entities whose IsActive toggle gets a named action.</summary>
    private static readonly Dictionary<Type, string> ActivationPrefixes = new()
    {
        { typeof(ApplicationUser), "USER" },
        { typeof(Branch), "LOCATION" },
        { typeof(Tenant), "ORGANIZATION" },
        { typeof(TenantUser), "MEMBERSHIP" },
    };

    /// <summary>Join rows whose insert/delete means "access granted/removed".</summary>
    private static readonly Dictionary<Type, (string Added, string Removed, string Noun)> AccessRows = new()
    {
        { typeof(UserRole),       ("ROLE_ASSIGNED", "ROLE_REMOVED", "Role") },
        { typeof(BranchUser),     ("LOCATION_ACCESS_ADDED", "LOCATION_ACCESS_REMOVED", "Location access") },
        { typeof(RolePermission), ("PERMISSION_GRANTED", "PERMISSION_REVOKED", "Role permission") },
        { typeof(UserPermission), ("PERMISSION_CHANGED", "PERMISSION_REVOKED", "User permission override") },
    };

    /// <summary>
    /// Maps a captured change to a named business action. Returns NULL when the
    /// generic verb (CREATE / UPDATE / DELETE / SOFT_DELETE / RESTORE) should stay.
    /// </summary>
    /// <param name="baseAction">The generic verb from change capture.</param>
    /// <param name="changes">field -> (before, after), already normalised; UPDATE only.</param>
    /// <param name="values">Current values of the entity (CREATE) — used for discriminators like IsRefund.</param>
    /// <param name="passwordChanged">True when the (never captured) password hash was modified.</param>
    public static AuditSemantic? ResolveSemantic(
        Type entityType,
        string baseAction,
        string entityLabel,
        string subject,
        IReadOnlyDictionary<string, (object? Before, object? After)> changes,
        IReadOnlyDictionary<string, object?> values,
        bool passwordChanged)
    {
        if (AccessRows.TryGetValue(entityType, out var access))
        {
            if (baseAction == "CREATE")
                return new(access.Added, $"{access.Noun} added: {subject}");
            if (baseAction is "DELETE" or "SOFT_DELETE")
                return new(access.Removed, $"{access.Noun} removed: {subject}");
            if (baseAction == "RESTORE")
                return new(access.Added, $"{access.Noun} restored: {subject}");
            if (baseAction == "UPDATE")
            {
                if (changes.TryGetValue("IsActive", out var accessActive) && accessActive.After is bool on)
                    return on
                        ? new(access.Added, $"{access.Noun} re-enabled: {subject}")
                        : new(access.Removed, $"{access.Noun} disabled: {subject}");
                if (changes.ContainsKey("IsGranted"))
                    return new("PERMISSION_CHANGED", $"{access.Noun} changed: {subject}");
            }
        }

        if (baseAction == "CREATE")
        {
            if (entityType == typeof(Payment))
                return values.TryGetValue("IsRefund", out var refund) && refund is true
                    ? new("PAYMENT_REFUNDED", $"Refund issued: {subject}")
                    : new("PAYMENT_RECEIVED", $"Payment received: {subject}");

            if (entityType == typeof(StockMovement) && values.TryGetValue("MovementType", out var mt))
            {
                return (mt?.ToString()) switch
                {
                    "Adjustment" => new("STOCK_ADJUSTED", $"Stock adjusted: {subject}"),
                    "Purchase" or "OpeningStock" => new("STOCK_IN", $"Stock received: {subject}"),
                    "Sale" or "Consumption" => new("STOCK_OUT", $"Stock issued: {subject}"),
                    "Transfer" => new("STOCK_TRANSFERRED", $"Stock transferred: {subject}"),
                    "Return" => new("STOCK_RETURNED", $"Stock returned: {subject}"),
                    "Expiry" or "Damage" or "WriteOff" => new("STOCK_WRITTEN_OFF", $"Stock written off: {subject}"),
                    _ => null,
                };
            }

            if (entityType == typeof(GoodsReceipt))
                return new("PURCHASE_RECEIVED", $"Goods received: {subject}");

            return null;
        }

        if (baseAction != "UPDATE")
            return null;

        if (passwordChanged && entityType == typeof(ApplicationUser))
            return new("PASSWORD_RESET", $"Password reset: {subject}");

        if (changes.TryGetValue("Status", out var status))
        {
            var after = status.After?.ToString() ?? string.Empty;
            if (StatusActions.TryGetValue((entityType, after), out var named))
                return new(named.Action, $"{entityLabel} {named.Verb}: {subject}");

            return new("STATUS_CHANGED",
                $"{entityLabel} status changed: {subject} ({status.Before ?? "none"} → {after})");
        }

        if (entityType == typeof(Prescription)
            && changes.TryGetValue("IsDispensed", out var dispensed) && dispensed.After is true)
            return new("MEDICINE_DISPENSED", $"Prescription dispensed: {subject}");

        if (entityType == typeof(Tenant)
            && (changes.ContainsKey("Package") || changes.ContainsKey("SubscriptionStatus")
                || changes.ContainsKey("SubscriptionEndDate")))
            return new("SUBSCRIPTION_CHANGED", $"Subscription changed: {subject}");

        if (entityType == typeof(TenantEntitlement) || entityType == typeof(TenantLimit))
            return new("SUBSCRIPTION_CHANGED", $"{entityLabel} changed: {subject}");

        if (changes.TryGetValue("IsActive", out var active) && active.After is bool isActive)
        {
            var prefix = ActivationPrefixes.TryGetValue(entityType, out var p) ? p + "_" : string.Empty;
            return new(prefix + (isActive ? "ACTIVATED" : "DEACTIVATED"),
                $"{entityLabel} {(isActive ? "activated" : "deactivated")}: {subject}");
        }

        return null;
    }

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
