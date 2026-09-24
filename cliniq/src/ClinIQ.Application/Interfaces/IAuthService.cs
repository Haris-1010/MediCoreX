using ClinIQ.Shared.DTOs.Auth;
using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces;

public interface IAuthService
{
    Task<Result<LoginResponse>> LoginAsync(LoginRequest request, string ipAddress, CancellationToken cancellationToken = default);
    Task<Result<LoginResponse>> RefreshTokenAsync(RefreshTokenRequest request, string ipAddress, CancellationToken cancellationToken = default);
    Task<Result> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
    Task<Result> LogoutAsync(string refreshToken, string ipAddress, CancellationToken cancellationToken = default);
    Task<Result> ForgotPasswordAsync(string email, CancellationToken cancellationToken = default);
    Task<Result> ResetPasswordAsync(string email, string token, string newPassword, CancellationToken cancellationToken = default);
    Task<Result> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword, CancellationToken cancellationToken = default);
    Task<Result> VerifyEmailAsync(string email, string token, CancellationToken cancellationToken = default);

    /// <summary>
    /// Re-issues tokens for the same user/tenant with a different location scope.
    /// <paramref name="branchIdOrAll"/> is a branch Guid, or "all" when the user
    /// holds HasAllLocations. Membership is re-verified server-side.
    /// </summary>
    Task<Result<LoginResponse>> SwitchBranchAsync(
        Guid userId, Guid? tenantId, string branchIdOrAll, CancellationToken cancellationToken = default);

    /// <summary>
    /// Builds the full client permission context for GET /api/v1/auth/me.
    /// Effective permissions, enabled modules, roles, subscription and branch
    /// access are all resolved server-side for the supplied user/tenant/branch.
    /// </summary>
    Task<Result<CurrentUserContextDto>> GetCurrentUserContextAsync(
        Guid userId, Guid? tenantId, Guid? branchId, CancellationToken cancellationToken = default);
}
