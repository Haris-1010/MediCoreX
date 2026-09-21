using ClinIQ.Domain.Common;
using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Individual radiology investigation item in a Radiology Order.
/// </summary>
public class RadiologyOrderItem : BaseEntity
{
    public Guid MedicalOrderId { get; set; }
    public Guid ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public string? ServiceCode { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; } = 1;
    public decimal Discount { get; set; }
    public decimal NetAmount { get; set; }
    public string? Modality { get; set; }
    public string? BodyPart { get; set; }
    public RadiologyOrderItemStatus Status { get; set; } = RadiologyOrderItemStatus.Ordered;
    public DateTime? ScheduledAt { get; set; }
    public DateTime? PatientArrivedAt { get; set; }
    public DateTime? ProcedureStartedAt { get; set; }
    public DateTime? ProcedureEndedAt { get; set; }
    public Guid? PerformedById { get; set; }
    public string? Technique { get; set; }
    public string? Findings { get; set; }
    public string? Impression { get; set; }
    public string? Recommendations { get; set; }
    public bool IsAbnormal { get; set; }
    public DateTime? ReportedAt { get; set; }
    public Guid? ReportedById { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public Guid? VerifiedById { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public virtual MedicalOrder MedicalOrder { get; set; } = null!;

    public virtual Service Service { get; set; } = null!;
}
