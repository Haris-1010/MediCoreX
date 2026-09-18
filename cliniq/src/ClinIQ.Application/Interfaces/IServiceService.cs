using ClinIQ.Shared.DTOs.Billing;
using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces;

public interface IServiceService
{
    // Services
    Task<Result<ServiceDto>> GetServiceByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PaginatedResult<ServiceDto>> GetServicesPaginatedAsync(ServiceQuery query, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<ServiceDto>>> GetActiveServicesAsync(int? type = null, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<ServiceDto>>> GetServicesByCategoryAsync(Guid categoryId, int? type = null, CancellationToken cancellationToken = default);
    Task<Result<ServiceDto>> CreateServiceAsync(CreateServiceRequest request, CancellationToken cancellationToken = default);
    Task<Result<ServiceDto>> UpdateServiceAsync(Guid id, UpdateServiceRequest request, CancellationToken cancellationToken = default);
    Task<Result> DeleteServiceAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result> ToggleServiceStatusAsync(Guid id, bool isActive, CancellationToken cancellationToken = default);

    // Categories
    Task<Result<ServiceCategoryDto>> GetCategoryByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<ServiceCategoryDto>>> GetCategoriesAsync(CancellationToken cancellationToken = default);
    Task<Result<ServiceCategoryDto>> CreateCategoryAsync(CreateServiceCategoryRequest request, CancellationToken cancellationToken = default);
    Task<Result<ServiceCategoryDto>> UpdateCategoryAsync(Guid id, UpdateServiceCategoryRequest request, CancellationToken cancellationToken = default);
    Task<Result> DeleteCategoryAsync(Guid id, CancellationToken cancellationToken = default);
}

public class ServiceQuery : PaginationQuery
{
    public new string? SearchTerm { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? DepartmentId { get; set; }
    public bool? IsActive { get; set; }
    public int? Type { get; set; }
}
