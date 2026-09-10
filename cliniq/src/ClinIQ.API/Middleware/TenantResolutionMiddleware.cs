using System.Security.Claims;
using ClinIQ.Domain.Interfaces;

namespace ClinIQ.API.Middleware;

/// <summary>
/// Runs after authentication and before authorization.
///
/// Two jobs:
///   1. Re-verify that the tenant in the token is one the user is still an
///      active member of. Tokens stay valid for their full lifetime, so a user
///      removed from an organization would otherwise keep access until expiry.
///   2. Allow a platform super admin — and only a super admin — to impersonate
///      an organization via X-Tenant-Id, verified here against the signed claim
///      rather than anything the client asserts.
/// </summary>
public class TenantResolutionMiddleware
{
    private static readonly string[] ExemptPrefixes =
    {
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/auth/refresh-token",
        "/api/v1/auth/forgot-password",
        "/api/v1/auth/reset-password",
        "/api/v1/platform",
        "/health",
        "/swagger",
        "/hubs"
    };

    private readonly RequestDelegate _next;
    private readonly ILogger<TenantResolutionMiddleware> _logger;

    public TenantResolutionMiddleware(RequestDelegate next, ILogger<TenantResolutionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(
        HttpContext context,
        ITenantService tenantService,
        IPermissionService permissionService)
    {
        var path = context.Request.Path.Value ?? string.Empty;
        if (ExemptPrefixes.Any(p => path.StartsWith(p, StringComparison.OrdinalIgnoreCase)))
        {
            await _next(context);
            return;
        }

        var user = context.User;

        if (user?.Identity?.IsAuthenticated == true)
        {
            var isSuperAdmin = user.FindFirst("is_super_admin")?.Value == "true";
            Guid.TryParse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId);

            if (isSuperAdmin &&
                context.Request.Headers.TryGetValue("X-Tenant-Id", out var header) &&
                Guid.TryParse(header.FirstOrDefault(), out var impersonatedTenantId))
            {
                // Platform operator acting inside a customer organization.
                // This is the one path that legitimately crosses tenants, so it
                // is logged at Warning for the audit trail.
                tenantService.SetCurrentTenant(impersonatedTenantId);
                _logger.LogWarning(
                    "Super admin {UserId} is operating in tenant {TenantId} via impersonation header.",
                    userId, impersonatedTenantId);
            }
            else
            {
                var tenantId = tenantService.GetCurrentTenantId();

                if (tenantId is null && !isSuperAdmin)
                {
                    // An authenticated token with no tenant is not usable against
                    // tenant-scoped endpoints. Fail closed rather than silently
                    // disabling the global query filters.
                    await WriteError(context, StatusCodes.Status403Forbidden,
                        "no_tenant_context",
                        "This token carries no organization context. Sign in again.");
                    return;
                }

                if (tenantId is not null && userId != Guid.Empty && !isSuperAdmin)
                {
                    if (!await permissionService.IsMemberOfTenantAsync(userId, tenantId.Value))
                    {
                        _logger.LogWarning(
                            "User {UserId} presented a token for tenant {TenantId} but is no longer a member.",
                            userId, tenantId);

                        await WriteError(context, StatusCodes.Status403Forbidden,
                            "tenant_membership_revoked",
                            "Your access to this organization has been removed.");
                        return;
                    }
                }
            }
        }

        await _next(context);
    }

    private static async Task WriteError(HttpContext context, int status, string error, string message)
    {
        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error, message });
    }
}

public static class TenantResolutionMiddlewareExtensions
{
    public static IApplicationBuilder UseTenantResolution(this IApplicationBuilder app)
        => app.UseMiddleware<TenantResolutionMiddleware>();
}
