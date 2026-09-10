namespace ClinIQ.Shared.Constants;

/// <summary>
/// Built-in role constants
/// </summary>
public static class Roles
{
    public const string SuperAdmin = "SuperAdmin";
    public const string OrganizationOwner = "OrganizationOwner";
    public const string OrganizationAdmin = "OrganizationAdmin";
    public const string HospitalAdministrator = "HospitalAdministrator";
    public const string ClinicManager = "ClinicManager";
    public const string Doctor = "Doctor";
    public const string Nurse = "Nurse";
    public const string Receptionist = "Receptionist";
    public const string FrontDesk = "FrontDesk";
    public const string Pharmacist = "Pharmacist";
    public const string Accountant = "Accountant";
    public const string LabStaff = "LabStaff";
    public const string RadiologyStaff = "RadiologyStaff";
    public const string InventoryManager = "InventoryManager";
    public const string ProcurementOfficer = "ProcurementOfficer";
    public const string HRStaff = "HRStaff";
    public const string InsuranceOfficer = "InsuranceOfficer";
    public const string BillingOfficer = "BillingOfficer";

    public static readonly string[] AllRoles = new[]
    {
        SuperAdmin,
        OrganizationOwner,
        OrganizationAdmin,
        HospitalAdministrator,
        ClinicManager,
        Doctor,
        Nurse,
        Receptionist,
        FrontDesk,
        Pharmacist,
        Accountant,
        LabStaff,
        RadiologyStaff,
        InventoryManager,
        ProcurementOfficer,
        HRStaff,
        InsuranceOfficer,
        BillingOfficer
    };
}
