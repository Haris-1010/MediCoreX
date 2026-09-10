using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Tenancy;

/// <summary>
/// A feature/module the organization is entitled to use. Rows are written when
/// the organization is provisioned and can be toggled per-organization by a
/// platform operator afterwards.
/// </summary>
public class TenantEntitlement : BaseAuditableEntity
{
    public Guid TenantId { get; set; }

    /// <summary>Feature key from <see cref="ClinIQ.Shared.Constants.Features"/>, e.g. "ipd".</summary>
    public string Feature { get; set; } = string.Empty;

    public bool IsEnabled { get; set; } = true;
    public DateTime? ExpiresAt { get; set; }
    public string? Notes { get; set; }

    public virtual Tenant Tenant { get; set; } = null!;
}

/// <summary>Numeric usage cap for a tenant. -1 means unlimited.</summary>
public class TenantLimit : BaseAuditableEntity
{
    public Guid TenantId { get; set; }

    /// <summary>Limit key, e.g. "users", "beds", "branches", "storage_mb".</summary>
    public string LimitType { get; set; } = string.Empty;

    public int MaxValue { get; set; } = -1;

    public virtual Tenant Tenant { get; set; } = null!;
}
