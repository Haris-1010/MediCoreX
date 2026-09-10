using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Prescription header entity
/// </summary>
public class Prescription : BranchEntity
{
    public string PrescriptionNumber { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid? VisitId { get; set; }
    public Guid? AdmissionId { get; set; }

    public DateTime PrescriptionDate { get; set; }
    public DateTime? ValidUntil { get; set; }

    // General Instructions
    public string? GeneralInstructions { get; set; }
    public string? DietaryAdvice { get; set; }
    public string? LifestyleAdvice { get; set; }

    // Diagnosis (for reference on prescription)
    public string? Diagnosis { get; set; }

    // Status
    public bool IsDispensed { get; set; }
    public DateTime? DispensedAt { get; set; }
    public Guid? DispensedById { get; set; }

    // Template
    public Guid? TemplateId { get; set; }

    // Navigation properties
    public virtual Patient Patient { get; set; } = null!;
    public virtual Visit? Visit { get; set; }
    public virtual ICollection<PrescriptionItem> Items { get; set; } = new List<PrescriptionItem>();
}
