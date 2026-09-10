using ClinIQ.Domain.Enums;
using ClinIQ.Shared.DTOs.Common;
using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces;

public interface IBedManagementService
{
    Task<Result<BedDetailDto>> GetBedByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<BedDto>>> GetBedsByWardAsync(Guid wardId, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<BedDto>>> GetBedsByRoomAsync(Guid roomId, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<BedDto>>> GetAvailableBedsAsync(Guid? wardId = null, BedType? bedType = null, CancellationToken cancellationToken = default);
    Task<Result<BedOccupancyDto>> GetOccupancySummaryAsync(Guid? wardId = null, CancellationToken cancellationToken = default);
    Task<Result<BedDetailDto>> CreateBedAsync(CreateBedRequest request, CancellationToken cancellationToken = default);
    Task<Result<BedDetailDto>> UpdateBedAsync(Guid id, CreateBedRequest request, CancellationToken cancellationToken = default);
    Task<Result> UpdateBedStatusAsync(Guid id, BedStatus status, string? notes = null, CancellationToken cancellationToken = default);
    Task<Result> DeleteBedAsync(Guid id, CancellationToken cancellationToken = default);
}

public record BedDto(
    Guid Id,
    string BedNumber,
    string? Name,
    Guid RoomId,
    string RoomNumber,
    Guid WardId,
    string WardName,
    BedType BedType,
    BedStatus Status,
    Guid? CurrentPatientId,
    string? CurrentPatientName,
    decimal? DailyRate,
    bool IsActive
);

public record BedDetailDto(
    Guid Id,
    string BedNumber,
    string? Name,
    string? Description,
    Guid RoomId,
    string RoomNumber,
    Guid WardId,
    string WardName,
    BedType BedType,
    BedStatus Status,
    Guid? CurrentPatientId,
    string? CurrentPatientName,
    Guid? CurrentAdmissionId,
    bool HasCallBell,
    bool HasOxygen,
    bool HasSuction,
    bool IsElectric,
    decimal? DailyRate,
    DateTime? LastCleanedAt,
    DateTime? LastMaintenanceAt,
    bool IsActive
);

public record CreateBedRequest(
    Guid RoomId,
    string BedNumber,
    string? Name,
    string? Description,
    BedType BedType,
    bool HasCallBell,
    bool HasOxygen,
    bool HasSuction,
    bool IsElectric,
    decimal? DailyRate
);

public record BedOccupancyDto(
    int TotalBeds,
    int OccupiedBeds,
    int AvailableBeds,
    int ReservedBeds,
    int CleaningBeds,
    int MaintenanceBeds,
    int OutOfServiceBeds,
    decimal OccupancyRate
);
