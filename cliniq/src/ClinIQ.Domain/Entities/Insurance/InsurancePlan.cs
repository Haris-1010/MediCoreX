using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Insurance;

/// <summary>
/// Insurance plan/product
/// </summary>
public class InsurancePlan : TenantEntity
{
    public Guid InsuranceCompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
    public string? PlanType { get; set; }  // Individual, Family, Corporate, etc.

    // Coverage
    public decimal? CoverageLimit { get; set; }
    public decimal? DeductibleAmount { get; set; }
    public decimal? CoPayPercent { get; set; }
    public decimal? CoPayAmount { get; set; }

    // Covered Services (JSON)
    public string? CoveredServices { get; set; }
    public string? Exclusions { get; set; }

    // Pre-authorization
    public bool RequiresPreAuthorization { get; set; }
    public string? PreAuthorizationServices { get; set; }  // JSON array

    // Reimbursement
    public decimal? ReimbursementPercent { get; set; }

    // Status
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual InsuranceCompany InsuranceCompany { get; set; } = null!;
}
