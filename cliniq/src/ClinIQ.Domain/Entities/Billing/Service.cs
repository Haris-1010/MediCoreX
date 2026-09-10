using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Billing;

/// <summary>
/// Billable service
/// </summary>
public class Service : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? DepartmentId { get; set; }

    // Pricing
    public decimal Price { get; set; }
    public decimal? Cost { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }

    // Tax
    public bool IsTaxable { get; set; }
    public decimal TaxPercent { get; set; }

    // Insurance
    public bool IsCoveredByInsurance { get; set; }
    public string? InsuranceCode { get; set; }

    // Duration
    public int? DurationMinutes { get; set; }

    // Status
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual ServiceCategory? Category { get; set; }
}
