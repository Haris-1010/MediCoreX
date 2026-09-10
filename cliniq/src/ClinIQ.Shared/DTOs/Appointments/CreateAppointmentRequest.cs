using ClinIQ.Domain.Enums;

namespace ClinIQ.Shared.DTOs.Appointments;

public record CreateAppointmentRequest(
    Guid PatientId,
    Guid DoctorId,
    Guid? DepartmentId,
    Guid? RoomId,
    DateTime AppointmentDate,
    TimeSpan StartTime,
    int DurationMinutes,
    AppointmentType Type,
    string? ChiefComplaint,
    string? Notes,
    bool IsTelemedicine,
    Guid? FollowUpFromId
);
