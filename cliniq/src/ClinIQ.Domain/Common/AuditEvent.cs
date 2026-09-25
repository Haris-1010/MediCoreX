namespace ClinIQ.Domain.Common;

/// <summary>
/// Business-level audit event written explicitly through
/// <c>IAuditService</c> for actions that are not a plain entity change:
/// login, logout, password reset, report generated/exported, and the
/// workflow events where a meaningful action name matters ("Lab result
/// verified", "Payment received", ...).
/// </summary>
public sealed class AuditEvent
{
    /// <summary>Action code, e.g. LOGIN, LOGIN_FAILED, REPORT_GENERATED.</summary>
    public string Action { get; set; } = string.Empty;

    /// <summary>Module code, e.g. Authentication, Reports, Laboratory.</summary>
    public string Module { get; set; } = string.Empty;

    /// <summary>Logical entity, e.g. "Revenue Report", "Authentication", "Payment".</summary>
    public string EntityName { get; set; } = string.Empty;

    public string? EntityId { get; set; }

    public string? Description { get; set; }

    /// <summary>JSON object of previous values.</summary>
    public string? OldValues { get; set; }

    /// <summary>JSON object of new values.</summary>
    public string? NewValues { get; set; }

    /// <summary>JSON array of changed field names.</summary>
    public string? ChangedFields { get; set; }

    /// <summary>Overrides the ambient tenant (e.g. failed login before tenant resolution).</summary>
    public Guid? TenantId { get; set; }

    /// <summary>
    /// When <see cref="BranchSpecified"/> is false the caller's current
    /// location is stamped (normal in-request action). When true,
    /// <see cref="BranchId"/> is stored as-is — NULL means organization-level
    /// or "All Locations".
    /// </summary>
    public Guid? BranchId { get; set; }

    public bool BranchSpecified { get; set; }

    /// <summary>Denormalised location name; looked up when omitted.</summary>
    public string? LocationName { get; set; }

    /// <summary>Overrides the ambient user (e.g. failed login for a known account).</summary>
    public Guid? UserId { get; set; }

    public string? UserName { get; set; }

    public string? UserEmail { get; set; }

    public bool Success { get; set; } = true;

    public string? FailureReason { get; set; }

    public string? Notes { get; set; }

    /// <summary>JSON payload with non-sensitive context (filters, counts, ...).</summary>
    public string? AdditionalData { get; set; }
}
