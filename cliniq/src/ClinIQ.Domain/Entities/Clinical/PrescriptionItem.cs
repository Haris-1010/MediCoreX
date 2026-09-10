using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Individual medicine in a prescription
/// </summary>
public class PrescriptionItem : BaseEntity
{
    public Guid PrescriptionId { get; set; }
    public Guid? MedicineId { get; set; }  // Reference to inventory item

    // Medicine Details
    public string MedicineName { get; set; } = string.Empty;
    public string? GenericName { get; set; }
    public string? Strength { get; set; }
    public string? Form { get; set; }  // Tablet, Capsule, Syrup, etc.

    // Dosage
    public string? Dosage { get; set; }  // e.g., "1 tablet"
    public PrescriptionFrequency Frequency { get; set; } = PrescriptionFrequency.OnceDaily;
    public string? FrequencyText { get; set; }  // Custom frequency
    public MedicineRoute Route { get; set; } = MedicineRoute.Oral;
    public int? DurationDays { get; set; }
    public string? DurationText { get; set; }  // e.g., "2 weeks"
    public decimal? Quantity { get; set; }

    // Instructions
    public string? Instructions { get; set; }  // Before/after food, etc.
    public string? SpecialInstructions { get; set; }
    public string? Warnings { get; set; }

    // Timing
    public bool Morning { get; set; }
    public bool Afternoon { get; set; }
    public bool Evening { get; set; }
    public bool Night { get; set; }

    // Substitution
    public bool AllowSubstitution { get; set; } = true;

    // Dispensing
    public bool IsDispensed { get; set; }
    public decimal? DispensedQuantity { get; set; }
    public Guid? DispensedBatchId { get; set; }

    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual Prescription Prescription { get; set; } = null!;
}
