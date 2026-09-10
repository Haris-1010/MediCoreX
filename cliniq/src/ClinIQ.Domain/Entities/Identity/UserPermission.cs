using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Identity;

/// <summary>
/// Per-user permission override, layered on top of role permissions.
/// An explicit Deny always beats a role grant, which is what lets a Master User
/// strip one capability from a user without cloning an entire role.
/// </summary>
public class UserPermission : TenantEntity
{
    public Guid UserId { get; set; }
    public Guid PermissionId { get; set; }

    /// <summary>true = explicit grant, false = explicit deny.</summary>
    public bool IsGranted { get; set; } = true;

    /// <summary>Null = applies in every branch the user can reach.</summary>
    public Guid? BranchId { get; set; }

    public Guid? GrantedBy { get; set; }
    public DateTime? GrantedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public string? Reason { get; set; }

    public virtual Permission Permission { get; set; } = null!;
}
