using ClinIQ.Domain.Enums;
using ClinIQ.Shared.DTOs.Appointments;
using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces;

public interface IAppointmentService
{
    Task<Result<AppointmentDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PaginatedResult<AppointmentDto>> GetPaginatedAsync(AppointmentQuery query, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<AppointmentDto>>> GetByPatientAsync(Guid patientId, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<AppointmentDto>>> GetByDoctorAsync(Guid doctorId, DateTime date, CancellationToken cancellationToken = default);
    Task<Result<AppointmentDetailDto>> CreateAsync(CreateAppointmentRequest request, CancellationToken cancellationToken = default);
    Task<Result<AppointmentDetailDto>> UpdateAsync(Guid id, CreateAppointmentRequest request, CancellationToken cancellationToken = default);
    Task<Result> CancelAsync(Guid id, string? reason, CancellationToken cancellationToken = default);
    Task<Result> ConfirmAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<int>> CheckInAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result> CheckOutAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<AppointmentDetailDto>> RescheduleAsync(Guid id, DateTime newDate, TimeSpan newTime, string? reason, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<TimeSlotDto>>> GetAvailableSlotsAsync(Guid doctorId, DateTime date, int durationMinutes = 15, CancellationToken cancellationToken = default);
}

public class AppointmentQuery : PaginationQuery
{
    public Guid? PatientId { get; set; }
    public Guid? DoctorId { get; set; }
    public Guid? DepartmentId { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public AppointmentStatus? Status { get; set; }
    public AppointmentType? Type { get; set; }
}

public record TimeSlotDto(TimeSpan StartTime, TimeSpan EndTime, bool IsAvailable);
