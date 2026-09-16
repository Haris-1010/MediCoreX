namespace ClinIQ.Shared.Constants;

/// <summary>
/// Metadata for every permission in <see cref="Permissions"/>. Drives the
/// database seeder and the grouped permission-matrix UI, so the DB can never
/// drift from the code.
/// </summary>
public record PermissionDefinition(
    string Name,
    string DisplayName,
    string Module,
    string Category,
    int DisplayOrder);

public static class PermissionCatalog
{
    public static IReadOnlyList<PermissionDefinition> All { get; } = new List<PermissionDefinition>
    {
        // ---- Dashboard ----
        new(Permissions.DashboardView, "View", "Dashboard", "Analytics", 10),

        // ---- Patients ----
        new(Permissions.PatientsView,   "View",   "Patients", "Clinical", 10),
        new(Permissions.PatientsCreate, "Create", "Patients", "Clinical", 20),
        new(Permissions.PatientsEdit,   "Edit",   "Patients", "Clinical", 30),
        new(Permissions.PatientsDelete, "Delete", "Patients", "Clinical", 40),
        new(Permissions.PatientsMerge,  "Merge",  "Patients", "Clinical", 50),
        new(Permissions.PatientsExport, "Export", "Patients", "Clinical", 60),

        // ---- OPD ----
        new(Permissions.OpdView, "View", "OPD", "Clinical", 10),

        // ---- IPD ----
        new(Permissions.IpdView, "View", "IPD", "Clinical", 10),

        // ---- Emergency ----
        new(Permissions.EmergencyView, "View", "Emergency", "Clinical", 10),

        // ---- Appointments ----
        new(Permissions.AppointmentsView,    "View",     "Appointments", "Clinical", 10),
        new(Permissions.AppointmentsCreate,  "Create",   "Appointments", "Clinical", 20),
        new(Permissions.AppointmentsEdit,    "Edit",     "Appointments", "Clinical", 30),
        new(Permissions.AppointmentsCancel,  "Cancel",   "Appointments", "Clinical", 40),
        new(Permissions.AppointmentsConfirm, "Confirm",  "Appointments", "Clinical", 50),
        new(Permissions.AppointmentsCheckIn, "Check In", "Appointments", "Clinical", 60),
        new(Permissions.AppointmentsDelete,  "Delete",   "Appointments", "Clinical", 70),

        // ---- Visits ----
        new(Permissions.VisitsView,   "View",   "Visits", "Clinical", 10),
        new(Permissions.VisitsCreate, "Create", "Visits", "Clinical", 20),
        new(Permissions.VisitsEdit,   "Edit",   "Visits", "Clinical", 30),
        new(Permissions.VisitsDelete, "Delete", "Visits", "Clinical", 40),

        // ---- EMR ----
        new(Permissions.EmrView,             "View",              "EMR", "Clinical", 10),
        new(Permissions.EmrEdit,             "Edit",              "EMR", "Clinical", 20),
        new(Permissions.EmrViewConfidential, "View Confidential", "EMR", "Clinical", 30),

        // ---- Prescriptions ----
        new(Permissions.PrescriptionsView,     "View",     "Prescriptions", "Clinical", 10),
        new(Permissions.PrescriptionsCreate,   "Create",   "Prescriptions", "Clinical", 20),
        new(Permissions.PrescriptionsEdit,     "Edit",     "Prescriptions", "Clinical", 30),
        new(Permissions.PrescriptionsDelete,   "Delete",   "Prescriptions", "Clinical", 40),
        new(Permissions.PrescriptionsDispense, "Dispense", "Prescriptions", "Clinical", 50),
        new(Permissions.PrescriptionsPrint,    "Print",    "Prescriptions", "Clinical", 60),

        // ---- Admissions ----
        new(Permissions.AdmissionsView,      "View",      "Admissions", "IPD", 10),
        new(Permissions.AdmissionsCreate,    "Admit",     "Admissions", "IPD", 20),
        new(Permissions.AdmissionsEdit,      "Edit",      "Admissions", "IPD", 30),
        new(Permissions.AdmissionsDischarge, "Discharge", "Admissions", "IPD", 40),
        new(Permissions.AdmissionsTransfer,  "Transfer",  "Admissions", "IPD", 50),

        // ---- Beds ----
        new(Permissions.BedsView,     "View",     "Beds", "IPD", 10),
        new(Permissions.BedsManage,   "Manage",   "Beds", "IPD", 20),
        new(Permissions.BedsAllocate, "Allocate", "Beds", "IPD", 30),
        new(Permissions.BedsTransfer, "Transfer", "Beds", "IPD", 40),
        new(Permissions.BedsRelease,  "Release",  "Beds", "IPD", 50),

        // ---- Wards ----
        new(Permissions.WardsView, "View", "Wards", "IPD", 10),

        // ---- Facility ----
        new(Permissions.FacilityView, "View", "Facility", "Administration", 10),

        // ---- Services ----
        new(Permissions.ServicesView,   "View",   "Services", "Financial", 10),
        new(Permissions.ServicesCreate, "Create", "Services", "Financial", 20),
        new(Permissions.ServicesEdit,   "Edit",   "Services", "Financial", 30),
        new(Permissions.ServicesDelete, "Delete", "Services", "Financial", 40),

        // ---- Billing ----
        new(Permissions.BillingView,              "View",                 "Billing", "Financial", 10),
        new(Permissions.BillingCreate,            "Create Invoice",       "Billing", "Financial", 20),
        new(Permissions.BillingEdit,              "Edit Invoice",         "Billing", "Financial", 30),
        new(Permissions.BillingDiscount,          "Apply Discount",       "Billing", "Financial", 40),
        new(Permissions.BillingManageDiscounts,   "Manage Discount Templates", "Billing", "Financial", 45),
        new(Permissions.BillingRefund,            "Refund",               "Billing", "Financial", 50),
        new(Permissions.BillingCancel,            "Cancel Invoice",       "Billing", "Financial", 60),
        new(Permissions.BillingDelete,            "Delete Invoice",       "Billing", "Financial", 70),

        // ---- Payments ----
        new(Permissions.PaymentsView,   "View",   "Payments", "Financial", 10),
        new(Permissions.PaymentsCreate, "Create", "Payments", "Financial", 20),
        new(Permissions.PaymentsRefund, "Refund", "Payments", "Financial", 30),

        // ---- Insurance ----
        new(Permissions.InsuranceView,    "View",          "Insurance", "Financial", 10),
        new(Permissions.InsuranceCreate,  "Create Policy", "Insurance", "Financial", 20),
        new(Permissions.InsuranceEdit,    "Edit Policy",   "Insurance", "Financial", 30),
        new(Permissions.InsuranceClaims,  "Submit Claim",  "Insurance", "Financial", 40),
        new(Permissions.InsuranceApprove, "Approve Claim", "Insurance", "Financial", 50),

        // ---- Inventory ----
        new(Permissions.InventoryView,     "View",     "Inventory", "Supply", 10),
        new(Permissions.InventoryManage,   "Manage",   "Inventory", "Supply", 20),
        new(Permissions.InventoryAdjust,   "Adjust",   "Inventory", "Supply", 30),
        new(Permissions.InventoryTransfer, "Transfer", "Inventory", "Supply", 40),

        // ---- Suppliers ----
        new(Permissions.SuppliersView,   "View",   "Suppliers", "Supply", 10),
        new(Permissions.SuppliersManage, "Manage", "Suppliers", "Supply", 20),

        // ---- Purchase Orders ----
        new(Permissions.PurchaseOrdersView,    "View",    "PurchaseOrders", "Supply", 10),
        new(Permissions.PurchaseOrdersCreate,  "Create",  "PurchaseOrders", "Supply", 20),
        new(Permissions.PurchaseOrdersApprove, "Approve", "PurchaseOrders", "Supply", 30),
        new(Permissions.PurchaseOrdersReceive, "Receive", "PurchaseOrders", "Supply", 40),

        // ---- Pharmacy ----
        new(Permissions.PharmacyView,     "View",     "Pharmacy", "Supply", 10),
        new(Permissions.PharmacySale,     "Sale",     "Pharmacy", "Supply", 20),
        new(Permissions.PharmacyDispense, "Dispense", "Pharmacy", "Supply", 30),

        // ---- Laboratory ----
        new(Permissions.LaboratoryView, "View", "Laboratory", "Clinical", 10),

        // ---- Radiology ----
        new(Permissions.RadiologyView, "View", "Radiology", "Clinical", 10),

        // ---- Reports ----
        new(Permissions.ReportsView,      "View",      "Reports", "Analytics", 10),
        new(Permissions.ReportsExport,    "Export",    "Reports", "Analytics", 20),
        new(Permissions.ReportsFinancial, "Financial", "Reports", "Analytics", 30),

        // ---- Users ----
        new(Permissions.UsersView,   "View",   "Users", "Administration", 10),
        new(Permissions.UsersCreate, "Create", "Users", "Administration", 20),
        new(Permissions.UsersEdit,   "Edit",   "Users", "Administration", 30),
        new(Permissions.UsersDelete, "Delete", "Users", "Administration", 40),

        // ---- Roles ----
        new(Permissions.RolesView,   "View",   "Roles", "Administration", 10),
        new(Permissions.RolesCreate, "Create", "Roles", "Administration", 20),
        new(Permissions.RolesEdit,   "Edit",   "Roles", "Administration", 30),
        new(Permissions.RolesDelete, "Delete", "Roles", "Administration", 40),

        // ---- Settings / Audit ----
        new(Permissions.SettingsView, "View", "Settings", "Administration", 10),
        new(Permissions.SettingsEdit, "Edit", "Settings", "Administration", 20),
        new(Permissions.OrganizationBranding, "Branding", "Organization", "Administration", 25),
        new(Permissions.AuditView,    "View", "Audit",    "Administration", 10),

        // ---- Doctors ----
        new(Permissions.DoctorsView,   "View",   "Doctors", "Administration", 10),
        new(Permissions.DoctorsCreate, "Create", "Doctors", "Administration", 20),
        new(Permissions.DoctorsEdit,   "Edit",   "Doctors", "Administration", 30),
        new(Permissions.DoctorsDelete, "Delete", "Doctors", "Administration", 40),

        // ---- Staff ----
        new(Permissions.StaffView,   "View",   "Staff", "Administration", 10),
        new(Permissions.StaffCreate, "Create", "Staff", "Administration", 20),
        new(Permissions.StaffEdit,   "Edit",   "Staff", "Administration", 30),
        new(Permissions.StaffDelete, "Delete", "Staff", "Administration", 40),

        // ---- Departments ----
        new(Permissions.DepartmentsView,   "View",   "Departments", "Administration", 10),
        new(Permissions.DepartmentsCreate, "Create", "Departments", "Administration", 20),
        new(Permissions.DepartmentsEdit,   "Edit",   "Departments", "Administration", 30),
        new(Permissions.DepartmentsDelete, "Delete", "Departments", "Administration", 40),
    };

    /// <summary>
    /// Maps a permission prefix to the feature key that gates it.
    /// Administration permissions are intentionally absent — they are never
    /// module-gated, or an owner could lock themselves out of their own org.
    /// </summary>
    public static IReadOnlyDictionary<string, string> PrefixToFeature { get; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["dashboard"]        = Features.Dashboard,
            ["patients"]        = Features.Patients,
            ["opd"]             = Features.OPD,
            ["ipd"]             = Features.IPD,
            ["emergency"]       = Features.IPD,
            ["appointments"]    = Features.Appointments,
            ["visits"]          = Features.EMR,
            ["emr"]             = Features.EMR,
            ["prescriptions"]   = Features.Prescriptions,
            ["admissions"]      = Features.IPD,
            ["beds"]            = Features.IPD,
            ["wards"]           = Features.IPD,
            ["facility"]        = Features.IPD,
            ["billing"]         = Features.Billing,
            ["services"]        = Features.Services,
            ["payments"]        = Features.Billing,
            ["insurance"]       = Features.Insurance,
            ["inventory"]       = Features.Inventory,
            ["suppliers"]       = Features.Inventory,
            ["purchase_orders"] = Features.Procurement,
            ["pharmacy"]        = Features.Pharmacy,
            ["laboratory"]      = Features.EMR,
            ["radiology"]       = Features.EMR,
            ["reports"]         = Features.Reports,
        };

    /// <summary>Prefixes that are never gated by the subscription.</summary>
    public static IReadOnlySet<string> UngatedPrefixes { get; } =
        new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "users", "roles", "settings", "audit", "doctors", "staff", "departments", "dashboard", "suppliers", "purchase_orders" };
}
