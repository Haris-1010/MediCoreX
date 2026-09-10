using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Tenancy;

/// <summary>
/// Junction table for User-Tenant relationship
/// </summary>
public class TenantUser : BaseEntity
{
    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }
    public bool IsOwner { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? JoinedAt { get; set; }

    // Navigation properties
    public virtual Tenant Tenant { get; set; } = null!;
}
