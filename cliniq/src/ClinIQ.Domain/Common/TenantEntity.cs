namespace ClinIQ.Domain.Common;

/// <summary>
/// Base entity for tenant-scoped entities
/// </summary>
public abstract class TenantEntity : BaseAuditableEntity, ITenantEntity
{
    public Guid? TenantId { get; set; }
}
