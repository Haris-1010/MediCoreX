namespace ClinIQ.Domain.Common;

/// <summary>
/// Interface for tenant-scoped entities
/// </summary>
public interface ITenantEntity
{
    Guid? TenantId { get; set; }
}
