using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Patient entity - core clinical entity (location-scoped via Branch)
/// </summary>
public class Patient : BranchEntity
{
    // Identification
    public string PatientNumber { get; set; } = string.Empty;
    public string? MRN { get; set; }  // Medical Record Number
    public string? ExternalId { get; set; }

    // Personal Information
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? MiddleName { get; set; }
    public string? Title { get; set; }
    public DateTime? DateOfBirth { get; set; }

    public int? Age
    {
        get
        {
            if (!DateOfBirth.HasValue)
                return null;

            var today = DateTime.Today;
            var dob = DateOfBirth.Value.Date;
            var age = today.Year - dob.Year;
            if (dob > today.AddYears(-age))
                age--;

            return age;
        }
    }

    public Gender? Gender { get; set; }
    public BloodGroup? BloodGroup { get; set; }
    public MaritalStatus? MaritalStatus { get; set; }
    public string? Nationality { get; set; }
    public string? Religion { get; set; }
    public string? Occupation { get; set; }
    public string? PhotoUrl { get; set; }

    // Contact Information
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? AlternatePhone { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }

    // Identification Documents (JSON)
    public string? IdentificationDocuments { get; set; }

    // Emergency Contact
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactRelation { get; set; }
    public string? EmergencyContactPhone { get; set; }

    // Medical Information
    public string? Allergies { get; set; }  // JSON array
    public string? ChronicConditions { get; set; }  // JSON array
    public string? CurrentMedications { get; set; }  // JSON array
    public string? FamilyHistory { get; set; }
    public string? SurgicalHistory { get; set; }
    public string? SocialHistory { get; set; }
    public string? Notes { get; set; }

    // Insurance (Primary)
    public Guid? PrimaryInsuranceId { get; set; }
    public string? InsuranceMemberNumber { get; set; }
    public string? InsurancePolicyNumber { get; set; }

    // Corporate
    public Guid? CorporateClientId { get; set; }
    public string? CorporateEmployeeId { get; set; }

    // Category/Tags
    public Guid? PatientCategoryId { get; set; }
    public string? Tags { get; set; }  // JSON array

    // Status
    public bool IsActive { get; set; } = true;
    public bool IsVerified { get; set; }
    public DateTime? LastVisitDate { get; set; }

    // Computed
    public string FullName => $"{FirstName} {LastName}".Trim();

    // Navigation properties
    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public virtual ICollection<Visit> Visits { get; set; } = new List<Visit>();
    public virtual ICollection<Admission> Admissions { get; set; } = new List<Admission>();
    public virtual ICollection<PatientDocument> Documents { get; set; } = new List<PatientDocument>();
    public virtual ICollection<PatientInsurance> Insurances { get; set; } = new List<PatientInsurance>();
}
