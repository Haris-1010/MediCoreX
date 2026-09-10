using ClinIQ.Domain.Enums;

namespace ClinIQ.Shared.DTOs.Appointments;

public record AppointmentDto(
    Guid Id,
    string AppointmentNumber,
    Guid PatientId,
    string PatientName,
    string? PatientPhone,
    Guid DoctorId,
    string DoctorName,
    string? DepartmentName,
    DateTime AppointmentDate,
    TimeSpan StartTime,
    TimeSpan? EndTime,
    int DurationMinutes,
    AppointmentType Type,
    AppointmentStatus Status,
    int? TokenNumber,
    string? ChiefComplaint,
    bool IsTelemedicine,
    DateTime CreatedAt
);

public record AppointmentDetailDto(
    Guid Id,
    string AppointmentNumber,
    Guid PatientId,
    string PatientName,
    string? PatientPhone,
    string? PatientEmail,
    Guid DoctorId,
    string DoctorName,
    Guid? DepartmentId,
    string? DepartmentName,
    Guid? RoomId,
    string? RoomName,
    DateTime AppointmentDate,
    TimeSpan StartTime,
    TimeSpan? EndTime,
    int DurationMinutes,
    AppointmentType Type,
    AppointmentStatus Status,
    int? Priority,
    string? ChiefComplaint,
    string? Notes,
    int? TokenNumber,
    DateTime? CheckedInAt,
    DateTime? CheckedOutAt,
    decimal? ConsultationFee,
    bool IsBilled,
    bool IsTelemedicine,
    string? TelemedicineLink,
    Guid? FollowUpFromId,
    DateTime? FollowUpDate,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
