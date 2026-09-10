namespace ClinIQ.Shared.DTOs.Auth;

public record LoginResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User
);

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? ProfilePictureUrl,
    bool IsSuperAdmin,
    IEnumerable<TenantMembershipDto> Tenants
);

public record TenantMembershipDto(
    Guid TenantId,
    string TenantName,
    bool IsOwner,
    IEnumerable<string> Roles,
    IEnumerable<BranchMembershipDto> Branches
);

public record BranchMembershipDto(
    Guid BranchId,
    string BranchName,
    bool IsPrimary
);
