using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Facility;

/// <summary>
/// Bed allocation history - tracks patient bed assignments
/// </summary>
public class BedAllocation : BranchEntity
{
    public Guid BedId { get; set; }
    public Guid RoomId { get; set; }
    public Guid WardId { get; set; }
    public Guid PatientId { get; set; }
    public Guid AdmissionId { get; set; }

    // Allocation Details
    public DateTime AllocatedAt { get; set; }
    public Guid AllocatedById { get; set; }
    public DateTime? ReleasedAt { get; set; }
    public Guid? ReleasedById { get; set; }
    public string? ReleaseReason { get; set; }  // Discharge, Transfer, etc.

    // Transfer Details
    public Guid? TransferredFromBedId { get; set; }
    public Guid? TransferredToBedId { get; set; }
    public string? TransferReason { get; set; }

    // Status
    public bool IsActive { get; set; } = true;

    // Notes
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Bed Bed { get; set; } = null!;
    public virtual Room Room { get; set; } = null!;
    public virtual Ward Ward { get; set; } = null!;
}
