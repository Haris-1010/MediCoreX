using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Insurance;

/// <summary>
/// Insurance claim
/// </summary>
public class InsuranceClaim : BranchEntity
{
    public string ClaimNumber { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid PatientInsuranceId { get; set; }
    public Guid InsuranceCompanyId { get; set; }
    public Guid InvoiceId { get; set; }
    public Guid? AdmissionId { get; set; }
    public Guid? VisitId { get; set; }

    // Claim Details
    public DateTime ClaimDate { get; set; }
    public InsuranceClaimStatus Status { get; set; } = InsuranceClaimStatus.Draft;

    // Amounts
    public decimal BilledAmount { get; set; }
    public decimal ClaimedAmount { get; set; }
    public decimal ApprovedAmount { get; set; }
    public decimal RejectedAmount { get; set; }
    public decimal PatientResponsibility { get; set; }
    public decimal SettledAmount { get; set; }

    // Submission
    public DateTime? SubmittedAt { get; set; }
    public Guid? SubmittedById { get; set; }
    public string? SubmissionReference { get; set; }

    // Processing
    public DateTime? ProcessedAt { get; set; }
    public string? ProcessingNotes { get; set; }
    public string? RejectionReason { get; set; }

    // Settlement
    public DateTime? SettledAt { get; set; }
    public string? SettlementReference { get; set; }

    // Documents
    public string? Documents { get; set; }  // JSON array of document URLs

    // Notes
    public string? Notes { get; set; }
    public string? InternalNotes { get; set; }
}
