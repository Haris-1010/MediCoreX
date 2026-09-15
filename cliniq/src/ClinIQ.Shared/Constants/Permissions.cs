namespace ClinIQ.Shared.Constants;

/// <summary>
/// Application permission constants
/// </summary>
public static class Permissions
{
    // Dashboard
    public const string DashboardView = "dashboard.view";

    // Patients
    public const string PatientsView = "patients.view";
    public const string PatientsCreate = "patients.create";
    public const string PatientsEdit = "patients.edit";
    public const string PatientsDelete = "patients.delete";
    public const string PatientsMerge = "patients.merge";
    public const string PatientsExport = "patients.export";

    // OPD
    public const string OpdView = "opd.view";

    // IPD
    public const string IpdView = "ipd.view";

    // Emergency
    public const string EmergencyView = "emergency.view";

    // Appointments
    public const string AppointmentsView = "appointments.view";
    public const string AppointmentsCreate = "appointments.create";
    public const string AppointmentsEdit = "appointments.edit";
    public const string AppointmentsCancel = "appointments.cancel";
    public const string AppointmentsConfirm = "appointments.confirm";
    public const string AppointmentsCheckIn = "appointments.checkin";

    // Visits
    public const string VisitsView = "visits.view";
    public const string VisitsCreate = "visits.create";
    public const string VisitsEdit = "visits.edit";
    public const string VisitsDelete = "visits.delete";

    // EMR
    public const string EmrView = "emr.view";
    public const string EmrEdit = "emr.edit";
    public const string EmrViewConfidential = "emr.view_confidential";

    // Prescriptions
    public const string PrescriptionsView = "prescriptions.view";
    public const string PrescriptionsCreate = "prescriptions.create";
    public const string PrescriptionsEdit = "prescriptions.edit";
    public const string PrescriptionsDelete = "prescriptions.delete";
    public const string PrescriptionsDispense = "prescriptions.dispense";
    public const string PrescriptionsPrint = "prescriptions.print";

    // Admissions
    public const string AdmissionsView = "admissions.view";
    public const string AdmissionsCreate = "admissions.create";
    public const string AdmissionsEdit = "admissions.edit";
    public const string AdmissionsDischarge = "admissions.discharge";
    public const string AdmissionsTransfer = "admissions.transfer";

    // Beds
    public const string BedsView = "beds.view";
    public const string BedsManage = "beds.manage";
    public const string BedsAllocate = "beds.allocate";
    public const string BedsTransfer = "beds.transfer";
    public const string BedsRelease = "beds.release";

    // Wards
    public const string WardsView = "wards.view";

    // Facility
    public const string FacilityView = "facility.view";

    // Services
    public const string ServicesView = "services.view";
    public const string ServicesCreate = "services.create";
    public const string ServicesEdit = "services.edit";
    public const string ServicesDelete = "services.delete";

    // Billing
    public const string BillingView = "billing.view";
    public const string BillingCreate = "billing.create";
    public const string BillingEdit = "billing.edit";
    public const string BillingDiscount = "billing.discount";
    public const string BillingManageDiscounts = "billing.manage_discounts";
    public const string BillingRefund = "billing.refund";
    public const string BillingCancel = "billing.cancel";
    public const string BillingDelete = "billing.delete";

    // Payments
    public const string PaymentsView = "payments.view";
    public const string PaymentsCreate = "payments.create";
    public const string PaymentsRefund = "payments.refund";

    // Insurance
    public const string InsuranceView = "insurance.view";
    public const string InsuranceCreate = "insurance.create";
    public const string InsuranceEdit = "insurance.edit";
    public const string InsuranceClaims = "insurance.claims";
    public const string InsuranceApprove = "insurance.approve";

    // Inventory
    public const string InventoryView = "inventory.view";
    public const string InventoryManage = "inventory.manage";
    public const string InventoryAdjust = "inventory.adjust";
    public const string InventoryTransfer = "inventory.transfer";

    // Suppliers
    public const string SuppliersView = "suppliers.view";
    public const string SuppliersManage = "suppliers.manage";

    // Purchase Orders
    public const string PurchaseOrdersView = "purchase_orders.view";
    public const string PurchaseOrdersCreate = "purchase_orders.create";
    public const string PurchaseOrdersApprove = "purchase_orders.approve";
    public const string PurchaseOrdersReceive = "purchase_orders.receive";

    // Pharmacy
    public const string PharmacyView = "pharmacy.view";
    public const string PharmacySale = "pharmacy.sale";
    public const string PharmacyDispense = "pharmacy.dispense";

    // Laboratory
    public const string LaboratoryView = "laboratory.view";

    // Radiology
    public const string RadiologyView = "radiology.view";

    // Reports
    public const string ReportsView = "reports.view";
    public const string ReportsExport = "reports.export";
    public const string ReportsFinancial = "reports.financial";

    // Users
    public const string UsersView = "users.view";
    public const string UsersCreate = "users.create";
    public const string UsersEdit = "users.edit";
    public const string UsersDelete = "users.delete";

    // Roles
    public const string RolesView = "roles.view";
    public const string RolesCreate = "roles.create";
    public const string RolesEdit = "roles.edit";
    public const string RolesDelete = "roles.delete";

    // Settings
    public const string SettingsView = "settings.view";
    public const string SettingsEdit = "settings.edit";
    public const string OrganizationBranding = "organization.branding";

    // Doctors
    public const string DoctorsView = "doctors.view";
    public const string DoctorsCreate = "doctors.create";
    public const string DoctorsEdit = "doctors.edit";
    public const string DoctorsDelete = "doctors.delete";

    // Staff
    public const string StaffView = "staff.view";
    public const string StaffCreate = "staff.create";
    public const string StaffEdit = "staff.edit";
    public const string StaffDelete = "staff.delete";

    // Departments
    public const string DepartmentsView = "departments.view";
    public const string DepartmentsCreate = "departments.create";
    public const string DepartmentsEdit = "departments.edit";
    public const string DepartmentsDelete = "departments.delete";

    // Audit
    public const string AuditView = "audit.view";
}
