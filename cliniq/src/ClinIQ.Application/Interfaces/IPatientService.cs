using ClinIQ.Shared.DTOs.Patients;
using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces;

public interface IPatientService
{
    Task<Result<PatientDetailDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<PatientDto>> GetByPatientNumberAsync(string patientNumber, CancellationToken cancellationToken = default);
    Task<PaginatedResult<PatientDto>> GetPaginatedAsync(PatientQuery query, CancellationToken cancellationToken = default);
    Task<Result<PatientDetailDto>> CreateAsync(CreatePatientRequest request, CancellationToken cancellationToken = default);
    Task<Result<PatientDetailDto>> UpdateAsync(Guid id, CreatePatientRequest request, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<PatientDto>>> SearchAsync(string searchTerm, int limit = 10, CancellationToken cancellationToken = default);
    Task<Result> VerifyPatientAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result> MergePatientsAsync(Guid primaryId, Guid duplicateId, CancellationToken cancellationToken = default);
}

public class PatientQuery : PaginationQuery
{
    public bool? IsActive { get; set; }
    public bool? IsVerified { get; set; }
    public Guid? PatientCategoryId { get; set; }
    public DateTime? DateOfBirthFrom { get; set; }
    public DateTime? DateOfBirthTo { get; set; }
    public DateTime? LastVisitFrom { get; set; }
    public DateTime? LastVisitTo { get; set; }
}
