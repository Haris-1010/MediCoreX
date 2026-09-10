using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Insurance;

/// <summary>
/// Insurance company/provider
/// </summary>
public class InsuranceCompany : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }

    // Contact
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Fax { get; set; }
    public string? Website { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }

    // Contact Person
    public string? ContactPersonName { get; set; }
    public string? ContactPersonPhone { get; set; }
    public string? ContactPersonEmail { get; set; }

    // Claims
    public string? ClaimsEmail { get; set; }
    public string? ClaimsPhone { get; set; }
    public string? ClaimsPortalUrl { get; set; }

    // Contract
    public DateTime? ContractStartDate { get; set; }
    public DateTime? ContractEndDate { get; set; }
    public decimal? DiscountPercent { get; set; }

    // Status
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<InsurancePlan> Plans { get; set; } = new List<InsurancePlan>();
}
