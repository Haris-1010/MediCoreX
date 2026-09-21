using ClinIQ.Domain.Common;
using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Configurable test parameter for a Laboratory Service.
/// A Laboratory Service can have multiple parameters (e.g., CBC has Hemoglobin, WBC, etc.)
/// </summary>
public class LabTestParameter : TenantEntity
{
    public Guid ServiceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public int DisplayOrder { get; set; }
    public string? Unit { get; set; }
    public TestParameterDataType DataType { get; set; } = TestParameterDataType.Numeric;
    public string? NormalRange { get; set; }
    public decimal? MinValue { get; set; }
    public decimal? MaxValue { get; set; }
    public string? MaleRange { get; set; }
    public string? FemaleRange { get; set; }
    public string? ChildRange { get; set; }
    public decimal? CriticalLow { get; set; }
    public decimal? CriticalHigh { get; set; }
    public string? Description { get; set; }
    public string? Options { get; set; } // JSON array for Option data type
    public bool IsActive { get; set; } = true;

    // Navigation
    public virtual Service Service { get; set; } = null!;
}
