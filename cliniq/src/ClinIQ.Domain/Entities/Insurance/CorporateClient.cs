using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Insurance;

/// <summary>
/// Corporate client/employer for corporate billing
/// </summary>
public class CorporateClient : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
    public string? Industry { get; set; }
    public string? LogoUrl { get; set; }

    // Contact
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public string? TaxNumber { get; set; }

    // Contact Person
    public string? ContactPersonName { get; set; }
    public string? ContactPersonPhone { get; set; }
    public string? ContactPersonEmail { get; set; }
    public string? ContactPersonDesignation { get; set; }

    // Contract
    public DateTime? ContractStartDate { get; set; }
    public DateTime? ContractEndDate { get; set; }
    public decimal? CreditLimit { get; set; }
    public int? PaymentTermsDays { get; set; }
    public decimal? DiscountPercent { get; set; }

    // Billing
    public string? BillingCycle { get; set; }  // Monthly, Quarterly, etc.
    public string? BillingEmail { get; set; }
    public string? BillingAddress { get; set; }

    // Outstanding
    public decimal OutstandingAmount { get; set; }

    // Status
    public bool IsActive { get; set; } = true;
}
