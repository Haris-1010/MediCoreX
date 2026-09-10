namespace ClinIQ.Shared.Constants;

/// <summary>
/// Default permission set for each built-in role. Applied when an organization
/// is provisioned. Custom roles start empty and are configured in the UI.
/// </summary>
public static class RolePermissionDefaults
{
    private static readonly string[] Empty = Array.Empty<string>();

    public static IReadOnlyDictionary<string, string[]> Map { get; } =
        new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase)
        {
            // Owner gets everything the organization is entitled to; resolved at
            // runtime rather than enumerated, so this list stays empty on purpose.
            [Roles.OrganizationOwner] = Empty,
            [Roles.SuperAdmin] = Empty,

            // OrganizationAdmin gets all permissions - the base role for org admins
            [Roles.OrganizationAdmin] = new[]
            {
                Permissions.DashboardView,
                Permissions.PatientsView, Permissions.PatientsCreate, Permissions.PatientsEdit, Permissions.PatientsDelete, Permissions.PatientsMerge, Permissions.PatientsExport,
                Permissions.OpdView,
                Permissions.IpdView,
                Permissions.EmergencyView,
                Permissions.AppointmentsView, Permissions.AppointmentsCreate, Permissions.AppointmentsEdit, Permissions.AppointmentsCancel, Permissions.AppointmentsConfirm, Permissions.AppointmentsCheckIn,
                Permissions.VisitsView, Permissions.VisitsCreate, Permissions.VisitsEdit, Permissions.VisitsDelete,
                Permissions.EmrView, Permissions.EmrEdit, Permissions.EmrViewConfidential,
                Permissions.PrescriptionsView, Permissions.PrescriptionsCreate, Permissions.PrescriptionsEdit, Permissions.PrescriptionsDelete, Permissions.PrescriptionsDispense, Permissions.PrescriptionsPrint,
                Permissions.AdmissionsView, Permissions.AdmissionsCreate, Permissions.AdmissionsEdit, Permissions.AdmissionsDischarge, Permissions.AdmissionsTransfer,
                Permissions.BedsView, Permissions.BedsManage, Permissions.BedsAllocate, Permissions.BedsTransfer, Permissions.BedsRelease,
                Permissions.WardsView,
                Permissions.FacilityView,
                Permissions.BillingView, Permissions.BillingCreate, Permissions.BillingEdit, Permissions.BillingDiscount, Permissions.BillingRefund, Permissions.BillingCancel,
                Permissions.PaymentsView, Permissions.PaymentsCreate, Permissions.PaymentsRefund,
                Permissions.InsuranceView, Permissions.InsuranceCreate, Permissions.InsuranceEdit, Permissions.InsuranceClaims, Permissions.InsuranceApprove,
                Permissions.InventoryView, Permissions.InventoryManage, Permissions.InventoryAdjust, Permissions.InventoryTransfer,
                Permissions.PurchaseOrdersView, Permissions.PurchaseOrdersCreate, Permissions.PurchaseOrdersApprove, Permissions.PurchaseOrdersReceive,
                Permissions.PharmacyView, Permissions.PharmacySale, Permissions.PharmacyDispense,
                Permissions.LaboratoryView,
                Permissions.RadiologyView,
                Permissions.ReportsView, Permissions.ReportsExport, Permissions.ReportsFinancial,
                Permissions.UsersView, Permissions.UsersCreate, Permissions.UsersEdit, Permissions.UsersDelete,
                Permissions.RolesView, Permissions.RolesCreate, Permissions.RolesEdit, Permissions.RolesDelete,
                Permissions.SettingsView, Permissions.SettingsEdit, Permissions.OrganizationBranding,
                Permissions.DoctorsView, Permissions.DoctorsCreate, Permissions.DoctorsEdit, Permissions.DoctorsDelete,
                Permissions.StaffView, Permissions.StaffCreate, Permissions.StaffEdit, Permissions.StaffDelete,
                Permissions.DepartmentsView, Permissions.DepartmentsCreate, Permissions.DepartmentsEdit, Permissions.DepartmentsDelete,
                Permissions.AuditView
            },

            [Roles.HospitalAdministrator] = new[]
            {
                Permissions.PatientsView, Permissions.PatientsCreate, Permissions.PatientsEdit,
                Permissions.AppointmentsView, Permissions.AppointmentsCreate, Permissions.AppointmentsEdit,
                Permissions.AppointmentsCancel, Permissions.AppointmentsConfirm,
                Permissions.AdmissionsView, Permissions.AdmissionsCreate, Permissions.AdmissionsEdit,
                Permissions.AdmissionsDischarge, Permissions.AdmissionsTransfer,
                Permissions.BedsView, Permissions.BedsManage, Permissions.BedsAllocate,
                Permissions.BedsTransfer, Permissions.BedsRelease,
                Permissions.BillingView, Permissions.BillingCreate, Permissions.BillingDiscount,
                Permissions.PaymentsView, Permissions.PaymentsCreate,
                Permissions.InventoryView, Permissions.PurchaseOrdersView, Permissions.PurchaseOrdersApprove,
                Permissions.ReportsView, Permissions.ReportsExport, Permissions.ReportsFinancial,
                Permissions.UsersView, Permissions.UsersCreate, Permissions.UsersEdit,
                Permissions.RolesView, Permissions.SettingsView, Permissions.SettingsEdit,
                Permissions.OrganizationBranding,
                Permissions.DoctorsView, Permissions.DoctorsCreate, Permissions.DoctorsEdit,
                Permissions.StaffView, Permissions.StaffCreate, Permissions.StaffEdit,
                Permissions.DepartmentsView, Permissions.DepartmentsCreate, Permissions.DepartmentsEdit,
                Permissions.AuditView
            },

            [Roles.ClinicManager] = new[]
            {
                Permissions.PatientsView, Permissions.PatientsCreate, Permissions.PatientsEdit,
                Permissions.AppointmentsView, Permissions.AppointmentsCreate, Permissions.AppointmentsEdit,
                Permissions.AppointmentsCancel, Permissions.AppointmentsConfirm, Permissions.AppointmentsCheckIn,
                Permissions.VisitsView, Permissions.VisitsCreate,
                Permissions.BillingView, Permissions.BillingCreate, Permissions.BillingDiscount,
                Permissions.PaymentsView, Permissions.PaymentsCreate,
                Permissions.ReportsView, Permissions.ReportsExport,
                Permissions.UsersView, Permissions.UsersCreate, Permissions.UsersEdit,
                Permissions.DoctorsView, Permissions.StaffView, Permissions.DepartmentsView,
                Permissions.SettingsView
            },

            [Roles.Doctor] = new[]
            {
                Permissions.PatientsView, Permissions.PatientsCreate, Permissions.PatientsEdit,
                Permissions.AppointmentsView, Permissions.AppointmentsEdit,
                Permissions.VisitsView, Permissions.VisitsCreate, Permissions.VisitsEdit,
                Permissions.EmrView, Permissions.EmrEdit, Permissions.EmrViewConfidential,
                Permissions.PrescriptionsView, Permissions.PrescriptionsCreate, Permissions.PrescriptionsEdit, Permissions.PrescriptionsDelete, Permissions.PrescriptionsPrint,
                Permissions.AdmissionsView, Permissions.AdmissionsCreate, Permissions.AdmissionsDischarge,
                Permissions.BedsView,
                Permissions.DoctorsView,
                Permissions.ReportsView
            },

            [Roles.Nurse] = new[]
            {
                Permissions.PatientsView,
                Permissions.AppointmentsView, Permissions.AppointmentsCheckIn,
                Permissions.VisitsView,
                Permissions.EmrView,
                Permissions.PrescriptionsView,
                Permissions.AdmissionsView,
                Permissions.BedsView, Permissions.BedsAllocate, Permissions.BedsRelease
            },

            [Roles.Receptionist] = new[]
            {
                Permissions.PatientsView, Permissions.PatientsCreate, Permissions.PatientsEdit,
                Permissions.AppointmentsView, Permissions.AppointmentsCreate, Permissions.AppointmentsEdit,
                Permissions.AppointmentsCancel, Permissions.AppointmentsConfirm, Permissions.AppointmentsCheckIn,
                Permissions.BillingView, Permissions.BillingCreate,
                Permissions.PaymentsView, Permissions.PaymentsCreate
            },

            [Roles.FrontDesk] = new[]
            {
                Permissions.PatientsView, Permissions.PatientsCreate,
                Permissions.AppointmentsView, Permissions.AppointmentsCreate, Permissions.AppointmentsCheckIn
            },

            [Roles.Pharmacist] = new[]
            {
                Permissions.PatientsView,
                Permissions.PrescriptionsView, Permissions.PrescriptionsDispense,
                Permissions.PharmacyView, Permissions.PharmacySale, Permissions.PharmacyDispense,
                Permissions.InventoryView, Permissions.InventoryAdjust,
                Permissions.ReportsView
            },

            [Roles.Accountant] = new[]
            {
                Permissions.BillingView, Permissions.BillingCreate, Permissions.BillingEdit,
                Permissions.BillingDiscount, Permissions.BillingRefund, Permissions.BillingCancel,
                Permissions.PaymentsView, Permissions.PaymentsCreate, Permissions.PaymentsRefund,
                Permissions.InsuranceView, Permissions.InsuranceClaims,
                Permissions.ReportsView, Permissions.ReportsExport, Permissions.ReportsFinancial
            },

            [Roles.BillingOfficer] = new[]
            {
                Permissions.PatientsView,
                Permissions.BillingView, Permissions.BillingCreate, Permissions.BillingEdit,
                Permissions.PaymentsView, Permissions.PaymentsCreate,
                Permissions.ReportsView
            },

            [Roles.LabStaff] = new[]
            {
                Permissions.PatientsView, Permissions.VisitsView, Permissions.EmrView,
                Permissions.ReportsView
            },

            [Roles.RadiologyStaff] = new[]
            {
                Permissions.PatientsView, Permissions.VisitsView, Permissions.EmrView,
                Permissions.ReportsView
            },

            [Roles.InventoryManager] = new[]
            {
                Permissions.InventoryView, Permissions.InventoryManage,
                Permissions.InventoryAdjust, Permissions.InventoryTransfer,
                Permissions.PurchaseOrdersView, Permissions.PurchaseOrdersCreate,
                Permissions.ReportsView, Permissions.ReportsExport
            },

            [Roles.ProcurementOfficer] = new[]
            {
                Permissions.InventoryView,
                Permissions.PurchaseOrdersView, Permissions.PurchaseOrdersCreate,
                Permissions.PurchaseOrdersApprove, Permissions.PurchaseOrdersReceive,
                Permissions.ReportsView
            },

            [Roles.InsuranceOfficer] = new[]
            {
                Permissions.PatientsView, Permissions.BillingView,
                Permissions.InsuranceView, Permissions.InsuranceCreate, Permissions.InsuranceEdit,
                Permissions.InsuranceClaims, Permissions.InsuranceApprove,
                Permissions.ReportsView
            },

            [Roles.HRStaff] = new[]
            {
                Permissions.UsersView, Permissions.UsersCreate, Permissions.UsersEdit,
                Permissions.StaffView, Permissions.StaffCreate, Permissions.StaffEdit,
                Permissions.DoctorsView,
                Permissions.ReportsView
            }
        };

    public static string[] For(string roleName) =>
        Map.TryGetValue(roleName, out var perms) ? perms : Empty;
}
