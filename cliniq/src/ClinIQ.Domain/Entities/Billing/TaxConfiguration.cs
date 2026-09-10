using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Billing;

/// <summary>
/// Tax configuration
/// </summary>
public class TaxConfiguration : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
    public decimal Percentage { get; set; }
    public decimal? FixedAmount { get; set; }
    public bool IsInclusive { get; set; }  // Tax-inclusive pricing
    public bool IsDefault { get; set; }
    public bool IsActive { get; set; } = true;
    public string? ApplicableCategories { get; set; }  // JSON array of category IDs
    public int DisplayOrder { get; set; }
}
