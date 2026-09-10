using ClinIQ.Domain.Enums;

namespace ClinIQ.Shared.DTOs.Admissions;

public record AdmissionDto(
    Guid Id,
    string AdmissionNumber,
    Guid PatientId,
    string PatientName,
    Guid AttendingDoctorId,
    string AttendingDoctorName,
    string? DepartmentName,
    AdmissionType AdmissionType,
    AdmissionStatus Status,
    DateTime AdmissionDate,
    DateTime? ExpectedDischargeDate,
    string? CurrentWardName,
    string? CurrentRoomNumber,
    string? CurrentBedNumber,
    string? ProvisionalDiagnosis,
    DateTime CreatedAt
);

public record AdmissionDetailDto(
    Guid Id,
    string AdmissionNumber,
    Guid PatientId,
    string PatientName,
    string? PatientPhone,
    Guid AttendingDoctorId,
    string AttendingDoctorName,
    Guid? ReferringDoctorId,
    string? ReferringDoctorName,
    Guid? DepartmentId,
    string? DepartmentName,
    AdmissionType AdmissionType,
    AdmissionStatus Status,
    DateTime AdmissionDate,
    DateTime? ExpectedDischargeDate,
    string? AdmissionSource,
    string? AdmissionReason,
    string? ProvisionalDiagnosis,
    Guid? CurrentBedId,
    Guid? CurrentRoomId,
    Guid? CurrentWardId,
    string? CurrentBedNumber,
    string? CurrentRoomNumber,
    string? CurrentWardName,
    decimal? DepositAmount,
    decimal? EstimatedCost,
    DateTime? DischargeDate,
    DischargeType? DischargeType,
    string? DischargeSummary,
    string? Notes,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateAdmissionRequest(
    Guid PatientId,
    Guid AttendingDoctorId,
    Guid? ReferringDoctorId,
    Guid? DepartmentId,
    AdmissionType AdmissionType,
    DateTime? ExpectedDischargeDate,
    string? AdmissionSource,
    string? AdmissionReason,
    string? ProvisionalDiagnosis,
    Guid? BedId,
    Guid? InsuranceId,
    decimal? DepositAmount,
    decimal? EstimatedCost,
    string? Notes
);

public record DischargeRequest(
    DischargeType DischargeType,
    string? DischargeSummary,
    string? FinalDiagnosis,
    string? DischargeInstructions,
    string? DischargeCondition,
    DateTime? FollowUpDate,
    string? FollowUpInstructions
);
