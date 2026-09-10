namespace ClinIQ.Shared.DTOs.Platform;

public record CreatePlatformAdminRequest(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string? Phone
);

public record PlatformAdminListItem(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    bool IsActive,
    DateTime? LastLoginAt,
    DateTime CreatedAt
);

public record CreatePlatformAdminResponse(
    Guid Id,
    string FullName,
    string Email,
    string TemporaryPassword
);
