using ClinIQ.Domain.Common;
using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Individual test item in a Laboratory Order.
/// Each item represents one Laboratory Service ordered.
/// </summary>
public class LabOrderItem : BaseEntity
{
    public Guid MedicalOrderId { get; set; }
    public Guid ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public string? ServiceCode { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; } = 1;
    public decimal Discount { get; set; }
    public decimal NetAmount { get; set; }
    public string? SampleType { get; set; }
    public LabOrderItemStatus Status { get; set; } = LabOrderItemStatus.Ordered;
    public string? SampleId { get; set; }
    public string? Container { get; set; }
    public DateTime? SampleCollectedAt { get; set; }
    public Guid? SampleCollectedById { get; set; }
    public DateTime? ResultEnteredAt { get; set; }
    public Guid? ResultEnteredById { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public Guid? VerifiedById { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public virtual MedicalOrder MedicalOrder { get; set; } = null!;

    public virtual Service Service { get; set; } = null!;
    public virtual ICollection<LabResultParameter> ResultParameters { get; set; } = new List<LabResultParameter>();
}
