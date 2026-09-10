using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Facility;

/// <summary>
/// Hospital building
/// </summary>
public class Building : BranchEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Address { get; set; }
    public int? NumberOfFloors { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual ICollection<Floor> Floors { get; set; } = new List<Floor>();
}
