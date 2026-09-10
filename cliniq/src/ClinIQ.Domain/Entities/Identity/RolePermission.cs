using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Identity;

/// <summary>
/// Junction table for Role-Permission relationship
/// </summary>
public class RolePermission : BaseEntity
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }

    // Navigation properties
    public virtual Role Role { get; set; } = null!;
    public virtual Permission Permission { get; set; } = null!;
}
