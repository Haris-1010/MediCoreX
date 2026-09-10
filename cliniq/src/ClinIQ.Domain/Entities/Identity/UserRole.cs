using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Identity;

/// <summary>
/// Junction table for User-Role relationship (tenant-scoped)
/// </summary>
public class UserRole : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    public Guid TenantId { get; set; }
    public Guid? BranchId { get; set; }  // Optional: role specific to branch

    // Navigation properties
    public virtual ApplicationUser User { get; set; } = null!;
    public virtual Role Role { get; set; } = null!;
}
