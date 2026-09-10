using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Identity;

/// <summary>
/// Permission entity for granular access control
/// </summary>
public class Permission : BaseEntity
{
    public string Name { get; set; } = string.Empty;  // e.g., "patients.view"
    public string? DisplayName { get; set; }
    public string? Description { get; set; }
    public string? Module { get; set; }  // e.g., "Patients"
    public string? Category { get; set; }  // e.g., "Clinical"
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    public virtual ICollection<UserPermission> UserPermissions { get; set; } = new List<UserPermission>();
}
