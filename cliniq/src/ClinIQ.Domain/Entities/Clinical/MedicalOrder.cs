using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Medical order (Lab, Radiology, Procedure, etc.)
/// </summary>
public class MedicalOrder : BranchEntity
{
    public string OrderNumber { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid OrderedById { get; set; }  // Doctor who ordered
    public Guid? VisitId { get; set; }
    public Guid? AdmissionId { get; set; }

    // Order Details
    public MedicalOrderType OrderType { get; set; }
    public MedicalOrderStatus Status { get; set; } = MedicalOrderStatus.Ordered;
    public DateTime OrderDate { get; set; }
    public int? Priority { get; set; }  // 1 = Urgent, 2 = Routine, etc.
    public bool IsUrgent { get; set; }

    // Items (JSON array for flexibility)
    public string? OrderItems { get; set; }

    // Clinical Details
    public string? ClinicalIndication { get; set; }
    public string? SpecialInstructions { get; set; }
    public string? Notes { get; set; }

    // Processing
    public Guid? AssignedToId { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public Guid? CompletedById { get; set; }

    // Results
    public string? Results { get; set; }  // JSON or text
    public string? ResultNotes { get; set; }
    public string? AbnormalFlags { get; set; }

    // Billing
    public bool IsBilled { get; set; }
    public Guid? InvoiceId { get; set; }

    // Navigation properties
    public virtual Patient Patient { get; set; } = null!;
    public virtual Visit? Visit { get; set; }
    public virtual Admission? Admission { get; set; }
}
