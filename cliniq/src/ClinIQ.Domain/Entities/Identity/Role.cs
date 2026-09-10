using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Identity;

/// <summary>
/// Application role entity
/// </summary>
public class Role : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string NormalizedName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? TenantId { get; set; }  // Null for system roles
    public bool IsSystemRole { get; set; }  // Cannot be deleted/modified
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }

    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
