namespace ClinIQ.Shared.DTOs.Platform;

/// <summary>Payload for the transactional create-organization workflow.</summary>
public record CreateOrganizationRequest(
    string Name,
    string? Code,
    string? OrganizationType,
    string ContactPersonName,
    string ContactEmail,
    string? ContactPhone,
    string? Address,
    string? City,
    string? Country,
    string? Timezone,
    string? Currency,
    string? LogoUrl,
    string[]? EnabledFeatures,
    Dictionary<string, int>? Limits,
    string? Notes,
    CreateMasterUserRequest MasterUser,
    string? InitialBranchName
);

public record CreateMasterUserRequest(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? TemporaryPassword
);

/// <summary>
/// Returned once, at creation time. TemporaryPassword is the only moment the
/// plaintext exists — it is hashed on write and can never be read back.
/// </summary>
public record CreateOrganizationResponse(
    Guid TenantId,
    string TenantName,
    Guid MasterUserId,
    string MasterUserEmail,
    string TemporaryPassword,
    Guid? InitialBranchId,
    IReadOnlyList<string> EnabledFeatures
);

public record OrganizationListItemDto(
    Guid Id,
    string Name,
    string? Code,
    string? ContactEmail,
    bool IsActive,
    int UserCount,
    int BranchCount,
    DateTime CreatedAt
);

public record OrganizationDetailDto(
    Guid Id,
    string Name,
    string? Code,
    string? Email,
    string? Phone,
    string? Address,
    string? City,
    string? Country,
    string? Timezone,
    string? Currency,
    string? LogoUrl,
    bool IsActive,
    IReadOnlyList<string> EnabledFeatures,
    IReadOnlyDictionary<string, int> Limits,
    IReadOnlyList<OrganizationUserDto> Users
);

public record OrganizationUserDto(
    Guid Id,
    string FullName,
    string Email,
    bool IsOwner,
    bool IsActive,
    IReadOnlyList<string> Roles,
    string? PlainPassword = null
);

public record UpdateOrganizationRequest(
    string Name,
    string? Code,
    string? Email,
    string? Phone,
    string? Address,
    string? City,
    string? Country,
    string? Timezone,
    string? Currency,
    string? LogoUrl
);

public record UpdateEntitlementsRequest(
    string[] EnabledFeatures,
    Dictionary<string, int>? Limits
);

public record ResetPasswordResponse(
    Guid UserId,
    string Email,
    string TemporaryPassword,
    bool MustChangePassword
);

public record ResetOrganizationPasswordRequest(string Password);
