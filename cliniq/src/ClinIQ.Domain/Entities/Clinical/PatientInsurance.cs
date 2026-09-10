using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Patient insurance policy
/// </summary>
public class PatientInsurance : TenantEntity
{
    public Guid PatientId { get; set; }
    public Guid InsuranceCompanyId { get; set; }
    public Guid? InsurancePlanId { get; set; }

    // Policy Details
    public string PolicyNumber { get; set; } = string.Empty;
    public string? MemberNumber { get; set; }
    public string? GroupNumber { get; set; }
    public DateTime? EffectiveDate { get; set; }
    public DateTime? ExpiryDate { get; set; }

    // Coverage
    public decimal? CoverageLimit { get; set; }
    public decimal? UsedAmount { get; set; }
    public decimal? RemainingAmount { get; set; }
    public decimal? DeductibleAmount { get; set; }
    public decimal? CoPayPercent { get; set; }
    public decimal? CoPayAmount { get; set; }

    // Subscriber (if different from patient)
    public string? SubscriberName { get; set; }
    public string? SubscriberRelation { get; set; }
    public string? SubscriberDOB { get; set; }

    // Verification
    public bool IsVerified { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public Guid? VerifiedById { get; set; }
    public string? VerificationNotes { get; set; }

    // Status
    public bool IsPrimary { get; set; }
    public bool IsActive { get; set; } = true;

    // Documents
    public string? CardFrontUrl { get; set; }
    public string? CardBackUrl { get; set; }

    // Navigation properties
    public virtual Patient Patient { get; set; } = null!;
}
