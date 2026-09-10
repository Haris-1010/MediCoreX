namespace ClinIQ.Shared.DTOs.Admissions;

public record BedAllocationDto(
    Guid Id,
    Guid BedId,
    string BedNumber,
    Guid RoomId,
    string RoomNumber,
    Guid WardId,
    string WardName,
    Guid PatientId,
    string PatientName,
    Guid AdmissionId,
    DateTime AllocatedAt,
    string AllocatedByName,
    DateTime? ReleasedAt,
    string? ReleasedByName,
    string? ReleaseReason,
    bool IsActive
);

public record AllocateBedRequest(
    Guid AdmissionId,
    Guid BedId,
    string? Notes
);

public record TransferBedRequest(
    Guid AdmissionId,
    Guid NewBedId,
    string? TransferReason,
    string? Notes
);
