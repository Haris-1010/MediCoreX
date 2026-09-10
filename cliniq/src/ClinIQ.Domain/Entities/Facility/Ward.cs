using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Facility;

/// <summary>
/// Hospital ward
/// </summary>
public class Ward : BranchEntity
{
    public Guid? FloorId { get; set; }
    public Guid? DepartmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public WardType WardType { get; set; } = WardType.General;

    // Capacity
    public int TotalBeds { get; set; }
    public Gender? GenderRestriction { get; set; }  // Male only, Female only, or null for mixed

    // Staff
    public Guid? NurseInChargeId { get; set; }

    // Charges
    public decimal? DailyRate { get; set; }

    // Status
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual Floor? Floor { get; set; }
    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
}
