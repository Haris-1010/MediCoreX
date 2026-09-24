using System.Security.Claims;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using ClinIQ.Infrastructure.Data;

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
    private const string TenantServiceBranchHeader = TenantService.BranchHeader;

    private static readonly string[] ExemptPrefixes =
    {
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/auth/refresh-token",
        "/api/v1/auth/forgot-password",
        "/api/v1/auth/reset-password",
        "/api/v1/platform",
        "/api/v1/master",
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
        IPermissionService permissionService,
        ApplicationDbContext dbContext)
    {
        var path = context.Request.Path.Value ?? string.Empty;
        var user = context.User;
        var isMaster = user?.FindFirst("is_master")?.Value == "true";

        // Global kill switch — checked before path exemptions so platform admins
        // are also blocked when the system is paused. Master portal, auth and
        // infra paths bypass it so the master can always resume.
        var pauseBypass =
            path.StartsWith("/api/v1/master", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/api/v1/auth", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/health", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/hubs", StringComparison.OrdinalIgnoreCase);

        if (!pauseBypass)
        {
            var paused = await dbContext.SystemSettings.IgnoreQueryFilters().AsNoTracking()
                .AnyAsync(s => s.TenantId == null && s.Key == "SystemPaused"
                    && s.Value != null && s.Value.ToLower() == "true");

            if (paused && !isMaster)
            {
                await WriteError(context, StatusCodes.Status503ServiceUnavailable,
                    "system_paused",
                    "The system is currently paused by the administrator.");
                return;
            }
        }

        if (ExemptPrefixes.Any(p => path.StartsWith(p, StringComparison.OrdinalIgnoreCase)))
        {
            await _next(context);
            return;
        }

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
                tenantService.SetAllLocationAccess(true);
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

                    // Dependency: if the organization is suspended, block the entire system.
                    var tenant = await dbContext.Tenants
                        .IgnoreQueryFilters().AsNoTracking()
                        .FirstOrDefaultAsync(t => t.Id == tenantId.Value);

                    if (tenant is null || !tenant.IsActive)
                    {
                        _logger.LogWarning(
                            "Request blocked: tenant {TenantId} is inactive. User {UserId}.",
                            tenantId, userId);

                        await WriteError(context, StatusCodes.Status403Forbidden,
                            "organization_inactive",
                            "This organization has been suspended. Contact your administrator.");
                        return;
                    }

                    // ---- Location (branch) scope ----
                    // 1) Optional X-Branch-Id header: "all" or a specific branch Guid.
                    //    Never trusted until membership / all-locations is verified here.
                    // 2) JWT branch_id claim must still be an assigned location.
                    if (!await EnforceBranchScopeAsync(
                            context, tenantService, permissionService, dbContext,
                            userId, tenantId.Value, isSuperAdmin))
                    {
                        return;
                    }
                }
                else if (isSuperAdmin && tenantId is not null)
                {
                    // Super admin inside a customer org sees every location.
                    tenantService.SetAllLocationAccess(true);
                }
                else if (tenantId is not null)
                {
                    // No branch claim and not super admin — still resolve header
                    // membership so All Locations / explicit switch can work.
                    if (!await EnforceBranchScopeAsync(
                            context, tenantService, permissionService, dbContext,
                            userId, tenantId.Value, isSuperAdmin))
                    {
                        return;
                    }
                }
            }
        }

        await _next(context);
    }

    /// <summary>
    /// Validates X-Branch-Id (if present) and the JWT branch_id claim against
    /// server-side BranchUser membership / HasAllLocations. Sets the tenant
    /// service overrides only after validation.
    /// Returns false when the request should stop with an error already written.
    /// </summary>
    private async Task<bool> EnforceBranchScopeAsync(
        HttpContext context,
        ITenantService tenantService,
        IPermissionService permissionService,
        ApplicationDbContext dbContext,
        Guid userId,
        Guid tenantId,
        bool isSuperAdmin)
    {
        if (isSuperAdmin)
        {
            tenantService.SetAllLocationAccess(true);
            return true;
        }

        var membership = await dbContext.TenantUsers
            .IgnoreQueryFilters().AsNoTracking()
            .FirstOrDefaultAsync(tu => tu.UserId == userId && tu.TenantId == tenantId && tu.IsActive);

        var hasAllLocations = membership?.HasAllLocations == true;

        // --- Optional request header override ---
        if (context.Request.Headers.TryGetValue(TenantServiceBranchHeader, out var headerValues))
        {
            var raw = headerValues.FirstOrDefault();
            if (!string.IsNullOrWhiteSpace(raw))
            {
                if (string.Equals(raw, "all", StringComparison.OrdinalIgnoreCase))
                {
                    if (!hasAllLocations)
                    {
                        _logger.LogWarning(
                            "User {UserId} requested All Locations in tenant {TenantId} without HasAllLocations.",
                            userId, tenantId);
                        await WriteError(context, StatusCodes.Status403Forbidden,
                            "all_locations_denied",
                            "You do not have All Locations access in this organization.");
                        return false;
                    }

                    tenantService.SetAllLocationAccess(true);
                }
                else if (Guid.TryParse(raw, out var headerBranchId))
                {
                    var allowed = await dbContext.BranchUsers
                        .IgnoreQueryFilters().AsNoTracking()
                        .AnyAsync(bu => bu.UserId == userId
                                      && bu.TenantId == tenantId
                                      && bu.BranchId == headerBranchId
                                      && bu.IsActive);

                    if (!allowed && !hasAllLocations)
                    {
                        _logger.LogWarning(
                            "User {UserId} presented X-Branch-Id {BranchId} in tenant {TenantId} without membership.",
                            userId, headerBranchId, tenantId);
                        await WriteError(context, StatusCodes.Status403Forbidden,
                            "branch_access_revoked",
                            "You do not have access to that location.");
                        return false;
                    }

                    // Specific location wins for write stamping; clear all-locations
                    // so read filters narrow to this branch.
                    tenantService.SetCurrentBranch(headerBranchId);
                    tenantService.SetAllLocationAccess(false);
                }
                else
                {
                    await WriteError(context, StatusCodes.Status400BadRequest,
                        "invalid_branch_header",
                        "X-Branch-Id must be a location id or 'all'.");
                    return false;
                }
            }
        }
        else if (hasAllLocations)
        {
            // No header: All Locations users still get a JWT branch for writes
            // if present; for reads they may see every location.
            tenantService.SetAllLocationAccess(true);
        }

        // --- JWT branch_id membership (fail closed when claim present but invalid) ---
        var branchClaim = context.User.FindFirst("branch_id")?.Value;
        if (Guid.TryParse(branchClaim, out var tokenBranchId))
        {
            var tokenBranchAllowed = await dbContext.BranchUsers
                .IgnoreQueryFilters().AsNoTracking()
                .AnyAsync(bu => bu.UserId == userId
                              && bu.TenantId == tenantId
                              && bu.BranchId == tokenBranchId
                              && bu.IsActive);

            if (!tokenBranchAllowed && !hasAllLocations && !isSuperAdmin)
            {
                _logger.LogWarning(
                    "User {UserId} token carries branch {BranchId} in tenant {TenantId} but membership is missing.",
                    userId, tokenBranchId, tenantId);
                await WriteError(context, StatusCodes.Status403Forbidden,
                    "branch_access_revoked",
                    "Your access to the current location has been removed. Sign in again.");
                return false;
            }
        }

        return true;
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
