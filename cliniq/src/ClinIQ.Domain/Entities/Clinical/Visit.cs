using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Clinical visit/encounter entity
/// </summary>
public class Visit : BranchEntity
{
    public string VisitNumber { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? AppointmentId { get; set; }
    public Guid? AdmissionId { get; set; }

    // Visit Details
    public VisitType VisitType { get; set; } = VisitType.OPD;
    public DateTime VisitDate { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }

    // Clinical Notes
    public string? ChiefComplaint { get; set; }
    public string? HistoryOfPresentIllness { get; set; }
    public string? PastMedicalHistory { get; set; }
    public string? FamilyHistory { get; set; }
    public string? SocialHistory { get; set; }
    public string? ReviewOfSystems { get; set; }
    public string? PhysicalExamination { get; set; }
    public string? Assessment { get; set; }
    public string? Plan { get; set; }
    public string? ClinicalNotes { get; set; }
    public string? PrivateNotes { get; set; }  // Not shown to patient

    // Diagnosis (JSON array of ICD codes)
    public string? Diagnoses { get; set; }

    // Follow-up
    public DateTime? FollowUpDate { get; set; }
    public string? FollowUpInstructions { get; set; }

    // Status
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    public bool IsBilled { get; set; }

    // Navigation properties
    public virtual Patient Patient { get; set; } = null!;
    public virtual Appointment? Appointment { get; set; }
    public virtual Admission? Admission { get; set; }
    public virtual ICollection<Vital> Vitals { get; set; } = new List<Vital>();
    public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    public virtual ICollection<MedicalOrder> MedicalOrders { get; set; } = new List<MedicalOrder>();
}
