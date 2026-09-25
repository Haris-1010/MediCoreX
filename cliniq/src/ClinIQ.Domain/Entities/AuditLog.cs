using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities;

/// <summary>
/// Audit log entry. One row per meaningful business action: who did what,
/// when, where (tenant + location) and what changed.
///
/// Rows are written from two places:
///   - automatically from <c>ApplicationDbContext.SaveChangesAsync</c> for
///     CREATE / UPDATE / DELETE / SOFT_DELETE / RESTORE of audited entities,
///   - explicitly through <c>IAuditService</c> for events that are not an
///     entity change (login, report generation, export, ...).
/// </summary>
public class AuditLog : BaseEntity
{
    public Guid? TenantId { get; set; }

    /// <summary>Location (branch) the action happened in. NULL = organization-level or all-locations action.</summary>
    public Guid? BranchId { get; set; }

    /// <summary>Denormalised location name so the UI can render location even after a branch is renamed/deleted.</summary>
    public string? LocationName { get; set; }

    public Guid? UserId { get; set; }
    public string? UserEmail { get; set; }
    public string? UserName { get; set; }

    // Action
    public string Action { get; set; } = string.Empty;  // CREATE, UPDATE, LOGIN, REPORT_GENERATED...
    public string Module { get; set; } = string.Empty;  // Patients, Authentication, Reports...
    public string EntityType { get; set; } = string.Empty;
    public string? EntityId { get; set; }
    public string? EntityName { get; set; }
    public string? Description { get; set; }

    // Changes
    public string? OldValues { get; set; }  // JSON
    public string? NewValues { get; set; }  // JSON
    public string? AffectedColumns { get; set; }  // JSON array

    // Outcome
    public bool? Success { get; set; }
    public string? FailureReason { get; set; }

    // Request
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? RequestPath { get; set; }
    public string? RequestMethod { get; set; }
    public string? CorrelationId { get; set; }

    // Timestamp
    public DateTime Timestamp { get; set; }

    // Additional
    public string? Notes { get; set; }
    public string? AdditionalData { get; set; }  // JSON
}
