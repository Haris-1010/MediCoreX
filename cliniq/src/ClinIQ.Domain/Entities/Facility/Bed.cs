using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Facility;

/// <summary>
/// Hospital bed
/// </summary>
public class Bed : BranchEntity
{
    public Guid RoomId { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Description { get; set; }
    public BedType BedType { get; set; } = BedType.General;
    public BedStatus Status { get; set; } = BedStatus.Available;

    // Current Occupancy
    public Guid? CurrentPatientId { get; set; }
    public Guid? CurrentAdmissionId { get; set; }

    // Features
    public bool HasCallBell { get; set; }
    public bool HasOxygen { get; set; }
    public bool HasSuction { get; set; }
    public bool IsElectric { get; set; }
    public string? Features { get; set; }  // JSON array

    // Charges
    public decimal? DailyRate { get; set; }

    // Maintenance
    public DateTime? LastCleanedAt { get; set; }
    public DateTime? LastMaintenanceAt { get; set; }
    public string? MaintenanceNotes { get; set; }

    // Status
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual Room Room { get; set; } = null!;
    public virtual ICollection<BedAllocation> BedAllocations { get; set; } = new List<BedAllocation>();
}
