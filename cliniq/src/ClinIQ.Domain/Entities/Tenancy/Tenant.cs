using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Tenancy;

/// <summary>
/// Represents an organization/clinic/hospital in the multi-tenant system
/// </summary>
public class Tenant : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public string? TaxNumber { get; set; }
    public string? RegistrationNumber { get; set; }
    public string? Currency { get; set; } = "USD";
    public string? Timezone { get; set; } = "UTC";
    public string? Locale { get; set; } = "en-US";
    public bool IsActive { get; set; } = true;
    public int Package { get; set; }
    public int SubscriptionStatus { get; set; }
    public DateTime? TrialEndsAt { get; set; }
    public DateTime? SubscriptionStartDate { get; set; }
    public DateTime? SubscriptionEndDate { get; set; }

    // Settings (JSON)
    public string? Settings { get; set; }

    // Navigation properties
    public virtual ICollection<Branch> Branches { get; set; } = new List<Branch>();
    public virtual ICollection<TenantUser> TenantUsers { get; set; } = new List<TenantUser>();
}
