using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Patient vitals recording
/// </summary>
public class Vital : BranchEntity
{
    public Guid PatientId { get; set; }
    public Guid? VisitId { get; set; }
    public Guid? AdmissionId { get; set; }
    public DateTime RecordedAt { get; set; }
    public Guid RecordedById { get; set; }

    // Standard Vitals
    public int? SystolicBP { get; set; }
    public int? DiastolicBP { get; set; }
    public int? Pulse { get; set; }
    public decimal? Temperature { get; set; }
    public string? TemperatureUnit { get; set; } = "C";  // C or F
    public int? RespiratoryRate { get; set; }
    public int? SpO2 { get; set; }
    public decimal? Weight { get; set; }
    public string? WeightUnit { get; set; } = "kg";
    public decimal? Height { get; set; }
    public string? HeightUnit { get; set; } = "cm";
    public decimal? BMI { get; set; }
    public decimal? BloodSugar { get; set; }
    public string? BloodSugarType { get; set; }  // Fasting, Random, PP

    // Additional fields (JSON for custom vitals)
    public string? AdditionalVitals { get; set; }

    // Notes
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Patient Patient { get; set; } = null!;
    public virtual Visit? Visit { get; set; }
    public virtual Admission? Admission { get; set; }
}
