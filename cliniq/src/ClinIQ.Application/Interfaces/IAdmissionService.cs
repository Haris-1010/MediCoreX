using ClinIQ.Domain.Enums;
using ClinIQ.Shared.DTOs.Admissions;
using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces;

public interface IAdmissionService
{
    Task<Result<AdmissionDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PaginatedResult<AdmissionDto>> GetPaginatedAsync(AdmissionQuery query, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<AdmissionDto>>> GetActiveByPatientAsync(Guid patientId, CancellationToken cancellationToken = default);
    Task<Result<AdmissionDetailDto>> CreateAsync(CreateAdmissionRequest request, CancellationToken cancellationToken = default);
    Task<Result<AdmissionDetailDto>> UpdateAsync(Guid id, CreateAdmissionRequest request, CancellationToken cancellationToken = default);
    Task<Result> DischargeAsync(Guid id, DischargeRequest request, CancellationToken cancellationToken = default);
    Task<Result<BedAllocationDto>> AllocateBedAsync(AllocateBedRequest request, CancellationToken cancellationToken = default);
    Task<Result<BedAllocationDto>> TransferBedAsync(TransferBedRequest request, CancellationToken cancellationToken = default);
    Task<Result> ReleaseBedAsync(Guid admissionId, string? reason, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<BedAllocationDto>>> GetBedHistoryAsync(Guid admissionId, CancellationToken cancellationToken = default);
}

public class AdmissionQuery : PaginationQuery
{
    public Guid? PatientId { get; set; }
    public Guid? DoctorId { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? WardId { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public AdmissionStatus? Status { get; set; }
    public AdmissionType? Type { get; set; }
}
