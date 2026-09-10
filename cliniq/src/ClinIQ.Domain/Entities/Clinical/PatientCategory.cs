using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Patient category for classification
/// </summary>
public class PatientCategory : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Color { get; set; }
    public decimal? DefaultDiscountPercent { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }
}
