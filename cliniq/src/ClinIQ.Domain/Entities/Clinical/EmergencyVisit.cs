using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Emergency department visit
/// </summary>
public class EmergencyVisit : BranchEntity
{
    public string EmergencyNumber { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid? DoctorId { get; set; }

    // Arrival
    public DateTime ArrivalTime { get; set; }
    public string? ArrivalMode { get; set; }  // Walk-in, Ambulance, etc.
    public string? ChiefComplaint { get; set; }

    // Triage
    public TriageLevel? TriageLevel { get; set; }
    public DateTime? TriageTime { get; set; }
    public Guid? TriagedById { get; set; }
    public string? TriageNotes { get; set; }

    // Treatment
    public string? PresentingSymptoms { get; set; }
    public string? InitialAssessment { get; set; }
    public string? TreatmentNotes { get; set; }
    public string? Procedures { get; set; }  // JSON array

    // Disposition
    public string? Disposition { get; set; }  // Admitted, Discharged, Transferred, etc.
    public DateTime? DispositionTime { get; set; }
    public Guid? AdmissionId { get; set; }  // If admitted

    // Status
    public bool IsActive { get; set; } = true;
    public DateTime? DischargeTime { get; set; }

    // Navigation properties
    public virtual Patient Patient { get; set; } = null!;
    public virtual Admission? Admission { get; set; }
    public virtual ICollection<Vital> Vitals { get; set; } = new List<Vital>();
}
