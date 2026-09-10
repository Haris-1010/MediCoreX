using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Facility;

/// <summary>
/// Floor within a building
/// </summary>
public class Floor : BranchEntity
{
    public Guid BuildingId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public int FloorNumber { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual Building Building { get; set; } = null!;
    public virtual ICollection<Ward> Wards { get; set; } = new List<Ward>();
}
