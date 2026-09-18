namespace ClinIQ.Shared.DTOs.Billing;

public record ServiceDto(
    Guid Id,
    string Name,
    string Code,
    string? Description,
    Guid? CategoryId,
    string? CategoryName,
    Guid? DepartmentId,
    string? DepartmentName,
    decimal Price,
    decimal? Cost,
    decimal? MinPrice,
    decimal? MaxPrice,
    bool IsTaxable,
    decimal TaxPercent,
    bool IsCoveredByInsurance,
    string? InsuranceCode,
    int? DurationMinutes,
    bool IsActive,
    int DisplayOrder,
    DateTime CreatedAt,
    int Type
);

public record CreateServiceRequest(
    string Name,
    string Code,
    string? Description,
    Guid? CategoryId,
    Guid? DepartmentId,
    decimal Price,
    decimal? Cost,
    decimal? MinPrice,
    decimal? MaxPrice,
    bool IsTaxable,
    decimal TaxPercent,
    bool IsCoveredByInsurance,
    string? InsuranceCode,
    int? DurationMinutes,
    bool IsActive,
    int DisplayOrder,
    int Type
);

public record UpdateServiceRequest(
    string Name,
    string Code,
    string? Description,
    Guid? CategoryId,
    Guid? DepartmentId,
    decimal Price,
    decimal? Cost,
    decimal? MinPrice,
    decimal? MaxPrice,
    bool IsTaxable,
    decimal TaxPercent,
    bool IsCoveredByInsurance,
    string? InsuranceCode,
    int? DurationMinutes,
    bool IsActive,
    int DisplayOrder,
    int Type
);

public record ServiceCategoryDto(
    Guid Id,
    string Name,
    string? Code,
    string? Description,
    Guid? ParentCategoryId,
    string? ParentCategoryName,
    bool IsActive,
    int DisplayOrder,
    int ServiceCount,
    DateTime CreatedAt
);

public record CreateServiceCategoryRequest(
    string Name,
    string? Code,
    string? Description,
    Guid? ParentCategoryId,
    bool IsActive,
    int DisplayOrder
);

public record UpdateServiceCategoryRequest(
    string Name,
    string? Code,
    string? Description,
    Guid? ParentCategoryId,
    bool IsActive,
    int DisplayOrder
);
