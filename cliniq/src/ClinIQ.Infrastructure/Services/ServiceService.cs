using ClinIQ.Application.Interfaces;
using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.DTOs.Billing;
using ClinIQ.Shared.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.Infrastructure.Services;

public class ServiceService : IServiceService
{
    private readonly ApplicationDbContext _context;

    public ServiceService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ServiceDto>> GetServiceByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var service = await _context.Services
            .Include(s => s.Category)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted, cancellationToken);

        if (service is null)
            return Result<ServiceDto>.Failure("Service not found");

        return Result<ServiceDto>.Success(MapToDto(service));
    }

    public async Task<PaginatedResult<ServiceDto>> GetServicesPaginatedAsync(ServiceQuery query, CancellationToken cancellationToken = default)
    {
        var q = _context.Services
            .Include(s => s.Category)
            .Where(s => !s.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.SearchTerm))
        {
            var term = query.SearchTerm.ToLower();
            q = q.Where(s => s.Name.ToLower().Contains(term) || s.Code.ToLower().Contains(term));
        }

        if (query.CategoryId.HasValue)
            q = q.Where(s => s.CategoryId == query.CategoryId.Value);

        if (query.DepartmentId.HasValue)
            q = q.Where(s => s.DepartmentId == query.DepartmentId.Value);

        if (query.IsActive.HasValue)
            q = q.Where(s => s.IsActive == query.IsActive.Value);

        if (query.Type.HasValue)
            q = q.Where(s => s.Type == (Domain.Enums.ServiceType)query.Type.Value);

        q = q.OrderBy(s => s.DisplayOrder).ThenBy(s => s.Name);

        var totalCount = await q.CountAsync(cancellationToken);
        var items = await q
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(s => MapToDto(s))
            .ToListAsync(cancellationToken);

        return PaginatedResult<ServiceDto>.Success(items, totalCount, query.PageNumber, query.PageSize);
    }

    public async Task<Result<IEnumerable<ServiceDto>>> GetActiveServicesAsync(int? type = null, CancellationToken cancellationToken = default)
    {
        var q = _context.Services
            .Include(s => s.Category)
            .Where(s => !s.IsDeleted && s.IsActive);

        if (type.HasValue)
            q = q.Where(s => s.Type == (Domain.Enums.ServiceType)type.Value);

        var services = await q
            .OrderBy(s => s.DisplayOrder)
            .ThenBy(s => s.Name)
            .ToListAsync(cancellationToken);

        return Result<IEnumerable<ServiceDto>>.Success(services.Select(MapToDto));
    }

    public async Task<Result<IEnumerable<ServiceDto>>> GetServicesByCategoryAsync(Guid categoryId, int? type = null, CancellationToken cancellationToken = default)
    {
        var q = _context.Services
            .Include(s => s.Category)
            .Where(s => !s.IsDeleted && s.CategoryId == categoryId && s.IsActive);

        if (type.HasValue)
            q = q.Where(s => s.Type == (Domain.Enums.ServiceType)type.Value);

        var services = await q
            .OrderBy(s => s.DisplayOrder)
            .ThenBy(s => s.Name)
            .ToListAsync(cancellationToken);

        return Result<IEnumerable<ServiceDto>>.Success(services.Select(MapToDto));
    }

    public async Task<Result<ServiceDto>> CreateServiceAsync(CreateServiceRequest request, CancellationToken cancellationToken = default)
    {
        var codeExists = await _context.Services
            .AnyAsync(s => s.Code == request.Code && !s.IsDeleted, cancellationToken);

        if (codeExists)
            return Result<ServiceDto>.Failure($"A service with code '{request.Code}' already exists");

        var service = new Service
        {
            Name = request.Name,
            Code = request.Code,
            Description = request.Description,
            CategoryId = request.CategoryId,
            DepartmentId = request.DepartmentId,
            Type = (Domain.Enums.ServiceType)request.Type,
            Price = request.Price,
            Cost = request.Cost,
            MinPrice = request.MinPrice,
            MaxPrice = request.MaxPrice,
            IsTaxable = request.IsTaxable,
            TaxPercent = request.TaxPercent,
            IsCoveredByInsurance = request.IsCoveredByInsurance,
            InsuranceCode = request.InsuranceCode,
            DurationMinutes = request.DurationMinutes,
            IsActive = request.IsActive,
            DisplayOrder = request.DisplayOrder
        };

        _context.Services.Add(service);
        await _context.SaveChangesAsync(cancellationToken);

        var created = await _context.Services
            .Include(s => s.Category)
            .FirstAsync(s => s.Id == service.Id, cancellationToken);

        return Result<ServiceDto>.Success(MapToDto(created));
    }

    public async Task<Result<ServiceDto>> UpdateServiceAsync(Guid id, UpdateServiceRequest request, CancellationToken cancellationToken = default)
    {
        var service = await _context.Services.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted, cancellationToken);
        if (service is null)
            return Result<ServiceDto>.Failure("Service not found");

        var codeConflict = await _context.Services
            .AnyAsync(s => s.Id != id && s.Code == request.Code && !s.IsDeleted, cancellationToken);

        if (codeConflict)
            return Result<ServiceDto>.Failure($"Another service with code '{request.Code}' already exists");

        service.Name = request.Name;
        service.Code = request.Code;
        service.Description = request.Description;
        service.CategoryId = request.CategoryId;
        service.DepartmentId = request.DepartmentId;
        service.Type = (Domain.Enums.ServiceType)request.Type;
        service.Price = request.Price;
        service.Cost = request.Cost;
        service.MinPrice = request.MinPrice;
        service.MaxPrice = request.MaxPrice;
        service.IsTaxable = request.IsTaxable;
        service.TaxPercent = request.TaxPercent;
        service.IsCoveredByInsurance = request.IsCoveredByInsurance;
        service.InsuranceCode = request.InsuranceCode;
        service.DurationMinutes = request.DurationMinutes;
        service.IsActive = request.IsActive;
        service.DisplayOrder = request.DisplayOrder;

        await _context.SaveChangesAsync(cancellationToken);

        var updated = await _context.Services
            .Include(s => s.Category)
            .FirstAsync(s => s.Id == service.Id, cancellationToken);

        return Result<ServiceDto>.Success(MapToDto(updated));
    }

    public async Task<Result> DeleteServiceAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var service = await _context.Services.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted, cancellationToken);
        if (service is null)
            return Result.Failure("Service not found");

        service.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Service deleted successfully");
    }

    public async Task<Result> ToggleServiceStatusAsync(Guid id, bool isActive, CancellationToken cancellationToken = default)
    {
        var service = await _context.Services.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted, cancellationToken);
        if (service is null)
            return Result.Failure("Service not found");

        service.IsActive = isActive;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success(isActive ? "Service activated" : "Service deactivated");
    }

    public async Task<Result<ServiceCategoryDto>> GetCategoryByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await _context.ServiceCategories
            .Include(c => c.ParentCategory)
            .Include(c => c.Services.Where(s => !s.IsDeleted))
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted, cancellationToken);

        if (category is null)
            return Result<ServiceCategoryDto>.Failure("Category not found");

        return Result<ServiceCategoryDto>.Success(MapCategoryToDto(category));
    }

    public async Task<Result<IEnumerable<ServiceCategoryDto>>> GetCategoriesAsync(CancellationToken cancellationToken = default)
    {
        var categories = await _context.ServiceCategories
            .Include(c => c.ParentCategory)
            .Include(c => c.Services.Where(s => !s.IsDeleted))
            .Where(c => !c.IsDeleted)
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.Name)
            .ToListAsync(cancellationToken);

        return Result<IEnumerable<ServiceCategoryDto>>.Success(categories.Select(MapCategoryToDto));
    }

    public async Task<Result<ServiceCategoryDto>> CreateCategoryAsync(CreateServiceCategoryRequest request, CancellationToken cancellationToken = default)
    {
        if (request.ParentCategoryId.HasValue)
        {
            var parentExists = await _context.ServiceCategories
                .AnyAsync(c => c.Id == request.ParentCategoryId.Value && !c.IsDeleted, cancellationToken);
            if (!parentExists)
                return Result<ServiceCategoryDto>.Failure("Parent category not found");
        }

        var category = new ServiceCategory
        {
            Name = request.Name,
            Code = request.Code,
            Description = request.Description,
            ParentCategoryId = request.ParentCategoryId,
            IsActive = request.IsActive,
            DisplayOrder = request.DisplayOrder
        };

        _context.ServiceCategories.Add(category);
        await _context.SaveChangesAsync(cancellationToken);

        var created = await _context.ServiceCategories
            .Include(c => c.ParentCategory)
            .Include(c => c.Services.Where(s => !s.IsDeleted))
            .FirstAsync(c => c.Id == category.Id, cancellationToken);

        return Result<ServiceCategoryDto>.Success(MapCategoryToDto(created));
    }

    public async Task<Result<ServiceCategoryDto>> UpdateCategoryAsync(Guid id, UpdateServiceCategoryRequest request, CancellationToken cancellationToken = default)
    {
        var category = await _context.ServiceCategories.FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted, cancellationToken);
        if (category is null)
            return Result<ServiceCategoryDto>.Failure("Category not found");

        if (request.ParentCategoryId.HasValue && request.ParentCategoryId.Value == id)
            return Result<ServiceCategoryDto>.Failure("A category cannot be its own parent");

        category.Name = request.Name;
        category.Code = request.Code;
        category.Description = request.Description;
        category.ParentCategoryId = request.ParentCategoryId;
        category.IsActive = request.IsActive;
        category.DisplayOrder = request.DisplayOrder;

        await _context.SaveChangesAsync(cancellationToken);

        var updated = await _context.ServiceCategories
            .Include(c => c.ParentCategory)
            .Include(c => c.Services.Where(s => !s.IsDeleted))
            .FirstAsync(c => c.Id == category.Id, cancellationToken);

        return Result<ServiceCategoryDto>.Success(MapCategoryToDto(updated));
    }

    public async Task<Result> DeleteCategoryAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await _context.ServiceCategories.FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted, cancellationToken);
        if (category is null)
            return Result.Failure("Category not found");

        var hasServices = await _context.Services.AnyAsync(s => s.CategoryId == id && !s.IsDeleted, cancellationToken);
        if (hasServices)
            return Result.Failure("Cannot delete category with active services. Reassign or remove services first.");

        var hasSubCategories = await _context.ServiceCategories.AnyAsync(c => c.ParentCategoryId == id && !c.IsDeleted, cancellationToken);
        if (hasSubCategories)
            return Result.Failure("Cannot delete category with sub-categories. Remove sub-categories first.");

        category.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Category deleted successfully");
    }

    private static ServiceDto MapToDto(Service service) => new(
        service.Id,
        service.Name,
        service.Code,
        service.Description,
        service.CategoryId,
        service.Category?.Name,
        service.DepartmentId,
        null,
        service.Price,
        service.Cost,
        service.MinPrice,
        service.MaxPrice,
        service.IsTaxable,
        service.TaxPercent,
        service.IsCoveredByInsurance,
        service.InsuranceCode,
        service.DurationMinutes,
        service.IsActive,
        service.DisplayOrder,
        service.CreatedAt,
        (int)service.Type
    );

    private static ServiceCategoryDto MapCategoryToDto(ServiceCategory category) => new(
        category.Id,
        category.Name,
        category.Code,
        category.Description,
        category.ParentCategoryId,
        category.ParentCategory?.Name,
        category.IsActive,
        category.DisplayOrder,
        category.Services.Count,
        category.CreatedAt
    );
}
