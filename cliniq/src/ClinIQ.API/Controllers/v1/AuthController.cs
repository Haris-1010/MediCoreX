using System.Security.Claims;
using ClinIQ.Application.Interfaces;
using ClinIQ.Shared.DTOs.Auth;
using ClinIQ.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var result = await _authService.LoginAsync(request, ipAddress, cancellationToken);

        if (!result.Succeeded)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await _authService.RegisterAsync(request, cancellationToken);

        if (!result.Succeeded)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("refresh-token")]
    [AllowAnonymous]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var result = await _authService.RefreshTokenAsync(request, ipAddress, cancellationToken);

        if (!result.Succeeded)
            return Unauthorized(result);

        return Ok(result);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] LogoutRequest request, CancellationToken cancellationToken)
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var result = await _authService.LogoutAsync(request.RefreshToken, ipAddress, cancellationToken);

        if (!result.Succeeded)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request, CancellationToken cancellationToken)
    {
        var result = await _authService.ForgotPasswordAsync(request.Email, cancellationToken);
        return Ok(result);
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var result = await _authService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword, cancellationToken);

        if (!result.Succeeded)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("change-password")]
    [Authorize]
    public IActionResult ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        // TODO: Get user ID from claims
        // var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Ok(Result.Failure("Change password not yet implemented"));
    }

    [HttpPost("switch-branch")]
    [Authorize]
    public IActionResult SwitchBranch([FromBody] SwitchBranchRequest request, CancellationToken cancellationToken)
    {
        // TODO: Implement branch switching
        return Ok(Result.Failure("Branch switching not yet implemented"));
    }

    /// <summary>
    /// Full client permission context (effective permissions, enabled modules,
    /// roles, subscription, branch access). Drives the permission directives,
    /// route guards and sidebar on the Angular side. UX only — every action is
    /// still re-validated server-side by its own endpoint.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? Guid.Empty.ToString());
        if (Guid.Empty == userId)
            return Unauthorized(Result.Failure("Invalid token."));

        Guid? tenantId = Guid.TryParse(User.FindFirst("tenant_id")?.Value, out var t) ? t : null;
        Guid? branchId = Guid.TryParse(User.FindFirst("branch_id")?.Value, out var b) ? b : null;

        var result = await _authService.GetCurrentUserContextAsync(userId, tenantId, branchId, cancellationToken);

        if (!result.Succeeded)
            return BadRequest(result);

        return Ok(new { succeeded = true, data = result.Data });
    }
}

public record LogoutRequest(string RefreshToken);
public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest(string Email, string Token, string NewPassword);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword, string ConfirmNewPassword);
public record SwitchBranchRequest(string BranchId);
