using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Nursing notes for inpatients
/// </summary>
public class NursingNote : BranchEntity
{
    public Guid PatientId { get; set; }
    public Guid AdmissionId { get; set; }
    public Guid NurseId { get; set; }
    public DateTime NoteDate { get; set; }
    public string? Shift { get; set; }  // Morning, Afternoon, Night

    // Notes
    public string? Assessment { get; set; }
    public string? Interventions { get; set; }
    public string? PatientResponse { get; set; }
    public string? CarePlan { get; set; }
    public string? Notes { get; set; }

    // Observations
    public string? PainScore { get; set; }
    public string? FallRisk { get; set; }
    public string? Mobility { get; set; }
    public string? Diet { get; set; }
    public string? IntakeOutput { get; set; }  // JSON

    // Medication Administration (JSON)
    public string? MedicationAdministration { get; set; }

    // Navigation properties
    public virtual Patient Patient { get; set; } = null!;
    public virtual Admission Admission { get; set; } = null!;
}
