using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Result value for a specific parameter in a Lab Order Item.
/// Stores historical snapshots of parameter configuration.
/// </summary>
public class LabResultParameter : BaseEntity
{
    public Guid LabOrderItemId { get; set; }
    public Guid? ParameterId { get; set; } // Reference to LabTestParameter (null if parameter was deleted)
    public string ParameterName { get; set; } = string.Empty;
    public string? ParameterCode { get; set; }
    public string? ResultValue { get; set; }
    public string? Unit { get; set; }
    public string? NormalRange { get; set; }
    public TestResultFlag Flag { get; set; } = TestResultFlag.None;
    public TestParameterDataType DataType { get; set; } = TestParameterDataType.Numeric;
    public bool IsAbnormal { get; set; }
    public int DisplayOrder { get; set; }
    public Guid? EnteredById { get; set; }
    public DateTime? EnteredAt { get; set; }
    public Guid? VerifiedById { get; set; }
    public DateTime? VerifiedAt { get; set; }

    // Navigation
    public virtual LabOrderItem LabOrderItem { get; set; } = null!;
}
