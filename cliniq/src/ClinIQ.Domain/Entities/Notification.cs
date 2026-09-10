using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities;

/// <summary>
/// User notification
/// </summary>
public class Notification : TenantEntity
{
    public Guid UserId { get; set; }
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string? Data { get; set; }  // JSON with additional data

    // Related Entity
    public string? EntityType { get; set; }
    public Guid? EntityId { get; set; }

    // Status
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }

    // Delivery
    public bool SentByEmail { get; set; }
    public bool SentBySms { get; set; }
    public bool SentByWhatsApp { get; set; }
    public bool SentInApp { get; set; } = true;

    // Scheduling
    public DateTime? ScheduledFor { get; set; }
    public DateTime? SentAt { get; set; }
}
