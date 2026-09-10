using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Patient queue entity
/// </summary>
public class Queue : BranchEntity
{
    public Guid PatientId { get; set; }
    public Guid? AppointmentId { get; set; }
    public Guid? DoctorId { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? RoomId { get; set; }

    // Queue Details
    public DateTime QueueDate { get; set; }
    public int TokenNumber { get; set; }
    public QueueStatus Status { get; set; } = QueueStatus.Waiting;
    public int? Priority { get; set; }

    // Timing
    public DateTime? JoinedAt { get; set; }
    public DateTime? CalledAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int? WaitTimeMinutes { get; set; }

    // Notes
    public string? Notes { get; set; }

    // Navigation properties
    public virtual Patient Patient { get; set; } = null!;
    public virtual Appointment? Appointment { get; set; }
}
