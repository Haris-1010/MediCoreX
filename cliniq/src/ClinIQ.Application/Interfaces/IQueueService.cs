using ClinIQ.Domain.Enums;
using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces;

public interface IQueueService
{
    Task<Result<QueueEntryDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<QueueEntryDto>>> GetCurrentQueueAsync(Guid? doctorId = null, Guid? departmentId = null, CancellationToken cancellationToken = default);
    Task<Result<QueueEntryDto>> AddToQueueAsync(Guid patientId, Guid? appointmentId, Guid? doctorId, Guid? departmentId, int? priority = null, CancellationToken cancellationToken = default);
    Task<Result> CallNextAsync(Guid doctorId, CancellationToken cancellationToken = default);
    Task<Result> CallSpecificAsync(Guid queueId, CancellationToken cancellationToken = default);
    Task<Result> StartConsultationAsync(Guid queueId, CancellationToken cancellationToken = default);
    Task<Result> CompleteAsync(Guid queueId, CancellationToken cancellationToken = default);
    Task<Result> SkipAsync(Guid queueId, CancellationToken cancellationToken = default);
    Task<Result> RecallAsync(Guid queueId, CancellationToken cancellationToken = default);
    Task<Result<QueueStatsDto>> GetQueueStatsAsync(Guid? doctorId = null, Guid? departmentId = null, CancellationToken cancellationToken = default);
}

public record QueueEntryDto(
    Guid Id,
    int TokenNumber,
    Guid PatientId,
    string PatientName,
    string? PatientPhone,
    Guid? AppointmentId,
    Guid? DoctorId,
    string? DoctorName,
    Guid? DepartmentId,
    string? DepartmentName,
    QueueStatus Status,
    int? Priority,
    DateTime? JoinedAt,
    DateTime? CalledAt,
    DateTime? StartedAt,
    int? WaitTimeMinutes
);

public record QueueStatsDto(
    int TotalWaiting,
    int TotalInConsultation,
    int TotalCompleted,
    int TotalSkipped,
    int AverageWaitTimeMinutes,
    int? CurrentTokenNumber,
    int? LastCalledTokenNumber
);
