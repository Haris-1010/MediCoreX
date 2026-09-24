namespace ClinIQ.Shared.DTOs.Auth;

/// <summary>
/// The full client permission context returned by GET /api/v1/auth/me.
///
/// <c>Permissions</c> is the effective set — roles, user overrides and
/// entitlements have all been applied server-side. The client
/// uses this purely for UX (hiding buttons/routes); every action is still
/// re-validated by its own endpoint.
/// </summary>
public record CurrentUserContextDto(
    Guid UserId,
    string FullName,
    string Email,
    bool MustChangePassword,
    Guid? TenantId,
    string? TenantName,
    Guid? BranchId,
    string? BranchName,
    bool IsSuperAdmin,
    bool IsMaster,
    bool IsOwner,
    bool HasAllLocationAccess,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Permissions,
    IReadOnlyList<BranchAccessDto> AccessibleBranches,
    IReadOnlyList<string> EnabledModules
);

public record BranchAccessDto(Guid BranchId, string BranchName, bool IsPrimary);
