namespace ClinIQ.Shared.DTOs.Common;

/// <summary>
/// Generic lookup/dropdown item
/// </summary>
public record LookupDto(
    Guid Id,
    string Name,
    string? Code = null,
    bool IsActive = true
);

/// <summary>
/// Lookup with additional value
/// </summary>
public record LookupDto<T>(
    Guid Id,
    string Name,
    T? Value,
    string? Code = null,
    bool IsActive = true
);
