using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities;

/// <summary>
/// Audit log entry
/// </summary>
public class AuditLog : BaseEntity
{
    public Guid? TenantId { get; set; }
    public Guid? BranchId { get; set; }
    public Guid? UserId { get; set; }
    public string? UserEmail { get; set; }
    public string? UserName { get; set; }

    // Action
    public string Action { get; set; } = string.Empty;  // Create, Update, Delete, Login, etc.
    public string EntityType { get; set; } = string.Empty;
    public string? EntityId { get; set; }
    public string? EntityName { get; set; }

    // Changes
    public string? OldValues { get; set; }  // JSON
    public string? NewValues { get; set; }  // JSON
    public string? AffectedColumns { get; set; }  // JSON array

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
