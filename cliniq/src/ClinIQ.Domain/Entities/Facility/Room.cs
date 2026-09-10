using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Facility;

/// <summary>
/// Room within a ward
/// </summary>
public class Room : BranchEntity
{
    public Guid WardId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Description { get; set; }
    public RoomType RoomType { get; set; } = RoomType.General;

    // Capacity
    public int Capacity { get; set; } = 1;  // Number of beds
    public Gender? GenderRestriction { get; set; }

    // Features
    public bool HasBathroom { get; set; }
    public bool HasTV { get; set; }
    public bool HasAC { get; set; }
    public bool IsIsolation { get; set; }
    public string? Amenities { get; set; }  // JSON array

    // Charges
    public decimal? DailyRate { get; set; }

    // Status
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual Ward Ward { get; set; } = null!;
    public virtual ICollection<Bed> Beds { get; set; } = new List<Bed>();
}
