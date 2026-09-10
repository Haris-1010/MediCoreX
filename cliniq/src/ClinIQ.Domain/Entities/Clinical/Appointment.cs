using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Appointment entity
/// </summary>
public class Appointment : BranchEntity
{
    public string AppointmentNumber { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? RoomId { get; set; }

    // Scheduling
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public int DurationMinutes { get; set; } = 15;

    // Type and Status
    public AppointmentType Type { get; set; } = AppointmentType.NewConsultation;
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public int? Priority { get; set; }

    // Details
    public string? ChiefComplaint { get; set; }
    public string? Notes { get; set; }
    public string? CancellationReason { get; set; }

    // Check-in/out
    public DateTime? CheckedInAt { get; set; }
    public DateTime? CheckedOutAt { get; set; }
    public Guid? CheckedInBy { get; set; }

    // Queue
    public int? TokenNumber { get; set; }
    public Guid? QueueId { get; set; }

    // Billing
    public decimal? ConsultationFee { get; set; }
    public bool IsBilled { get; set; }
    public Guid? InvoiceId { get; set; }

    // Follow-up
    public Guid? FollowUpFromId { get; set; }
    public DateTime? FollowUpDate { get; set; }

    // Rescheduling
    public Guid? RescheduledFromId { get; set; }
    public DateTime? RescheduledAt { get; set; }
    public string? ReschedulingReason { get; set; }

    // Telemedicine
    public bool IsTelemedicine { get; set; }
    public string? TelemedicineLink { get; set; }

    // Navigation properties
    public virtual Patient Patient { get; set; } = null!;
    public virtual Visit? Visit { get; set; }
}
