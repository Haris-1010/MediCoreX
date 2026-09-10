using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;
using ClinIQ.Domain.Entities.Facility;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Inpatient admission entity
/// </summary>
public class Admission : BranchEntity
{
    public string AdmissionNumber { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid AttendingDoctorId { get; set; }
    public Guid? ReferringDoctorId { get; set; }
    public Guid? DepartmentId { get; set; }

    // Admission Details
    public AdmissionType AdmissionType { get; set; } = AdmissionType.Planned;
    public AdmissionStatus Status { get; set; } = AdmissionStatus.Admitted;
    public DateTime AdmissionDate { get; set; }
    public DateTime? ExpectedDischargeDate { get; set; }
    public string? AdmissionSource { get; set; }  // Emergency, OPD, Referral, etc.
    public string? AdmissionReason { get; set; }

    // Initial Diagnosis
    public string? ProvisionalDiagnosis { get; set; }
    public string? Diagnoses { get; set; }  // JSON array of ICD codes

    // Current Bed Assignment
    public Guid? CurrentBedId { get; set; }
    public Guid? CurrentRoomId { get; set; }
    public Guid? CurrentWardId { get; set; }

    // Insurance/Payment
    public Guid? InsuranceId { get; set; }
    public string? InsuranceAuthorizationNumber { get; set; }
    public Guid? CorporateClientId { get; set; }
    public decimal? DepositAmount { get; set; }
    public decimal? EstimatedCost { get; set; }

    // Discharge
    public DateTime? DischargeDate { get; set; }
    public DischargeType? DischargeType { get; set; }
    public Guid? DischargedById { get; set; }
    public string? DischargeSummary { get; set; }
    public string? FinalDiagnosis { get; set; }
    public string? DischargeInstructions { get; set; }
    public string? DischargeCondition { get; set; }

    // Follow-up
    public DateTime? FollowUpDate { get; set; }
    public string? FollowUpInstructions { get; set; }

    // Notes
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Patient Patient { get; set; } = null!;
    public virtual ICollection<BedAllocation> BedAllocations { get; set; } = new List<BedAllocation>();
    public virtual ICollection<Visit> Visits { get; set; } = new List<Visit>();
    public virtual ICollection<Vital> Vitals { get; set; } = new List<Vital>();
    public virtual ICollection<NursingNote> NursingNotes { get; set; } = new List<NursingNote>();
    public virtual ICollection<MedicalOrder> MedicalOrders { get; set; } = new List<MedicalOrder>();
}
