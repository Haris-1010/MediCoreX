using System.Security.Claims;
using System.Text.Json;
using ClinIQ.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace ClinIQ.API.Authorization;

// ---------------------------------------------------------------------------
// Requirement
// ---------------------------------------------------------------------------

public class PermissionRequirement : IAuthorizationRequirement
{
    public IReadOnlyList<string> Permissions { get; }

    /// <summary>true = every listed permission required; false = any one.</summary>
    public bool RequireAll { get; }

    public PermissionRequirement(IReadOnlyList<string> permissions, bool requireAll)
    {
        Permissions = permissions;
        RequireAll = requireAll;
    }
}

// ---------------------------------------------------------------------------
// Attribute
// ---------------------------------------------------------------------------

/// <summary>
/// Declarative endpoint permission check.
///
///   [RequirePermission(Permissions.PatientsCreate)]
///   [RequirePermission(Permissions.BillingRefund, Permissions.BillingEdit, RequireAll = false)]
///
/// The only sanctioned way to gate an endpoint. Do not read permissions out of
/// the ClaimsPrincipal inside a controller.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public class RequirePermissionAttribute : AuthorizeAttribute
{
    internal const string PolicyPrefix = "PERM:";
    private const char Separator = ',';

    private readonly string[] _permissions;
    private bool _requireAll = true;

    public RequirePermissionAttribute(params string[] permissions)
    {
        if (permissions is null || permissions.Length == 0)
            throw new ArgumentException("At least one permission is required.", nameof(permissions));

        _permissions = permissions;
        Rebuild();
    }

    public bool RequireAll
    {
        get => _requireAll;
        set { _requireAll = value; Rebuild(); }
    }

    private void Rebuild() =>
        Policy = $"{PolicyPrefix}{(_requireAll ? "ALL" : "ANY")}:{string.Join(Separator, _permissions)}";

    internal static bool TryParse(string policyName, out IReadOnlyList<string> permissions, out bool requireAll)
    {
        permissions = Array.Empty<string>();
        requireAll = true;

        if (!policyName.StartsWith(PolicyPrefix, StringComparison.Ordinal))
            return false;

        var body = policyName[PolicyPrefix.Length..];
        var split = body.IndexOf(':');
        if (split <= 0) return false;

        requireAll = body[..split].Equals("ALL", StringComparison.Ordinal);
        permissions = body[(split + 1)..]
            .Split(Separator, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        return permissions.Count > 0;
    }
}

// ---------------------------------------------------------------------------
// Policy provider — materialises PERM:* policies on demand
// ---------------------------------------------------------------------------

public class PermissionPolicyProvider : IAuthorizationPolicyProvider
{
    private readonly DefaultAuthorizationPolicyProvider _fallback;

    public PermissionPolicyProvider(IOptions<AuthorizationOptions> options)
        => _fallback = new DefaultAuthorizationPolicyProvider(options);

    public Task<AuthorizationPolicy> GetDefaultPolicyAsync() => _fallback.GetDefaultPolicyAsync();
    public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() => _fallback.GetFallbackPolicyAsync();

    public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        if (RequirePermissionAttribute.TryParse(policyName, out var permissions, out var requireAll))
        {
            var policy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .AddRequirements(new PermissionRequirement(permissions, requireAll))
                .Build();

            return Task.FromResult<AuthorizationPolicy?>(policy);
        }

        return _fallback.GetPolicyAsync(policyName);
    }
}

// ---------------------------------------------------------------------------
// Handler — the actual server-side decision
// ---------------------------------------------------------------------------

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly IPermissionService _permissionService;
    private readonly ITenantService _tenantService;
    private readonly ILogger<PermissionAuthorizationHandler> _logger;

    public PermissionAuthorizationHandler(
        IPermissionService permissionService,
        ITenantService tenantService,
        ILogger<PermissionAuthorizationHandler> logger)
    {
        _permissionService = permissionService;
        _tenantService = tenantService;
        _logger = logger;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        var principal = context.User;
        if (principal?.Identity?.IsAuthenticated != true)
            return; // leave unhandled -> 401

        if (!Guid.TryParse(principal.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId))
            return;

        // Platform super admins bypass tenant permission checks.
        if (principal.FindFirst("is_super_admin")?.Value == "true")
        {
            context.Succeed(requirement);
            return;
        }

        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
        {
            _logger.LogWarning("Authorization denied for user {UserId}: no tenant context.", userId);
            return;
        }

        var branchId = _tenantService.GetCurrentBranchId();

        var effective = await _permissionService.GetEffectivePermissionsAsync(
            userId, tenantId.Value, branchId);

        var granted = requirement.RequireAll
            ? requirement.Permissions.All(effective.Contains)
            : requirement.Permissions.Any(effective.Contains);

        if (granted)
        {
            context.Succeed(requirement);
        }
        else
        {
            _logger.LogInformation(
                "Authorization denied. User {UserId} tenant {TenantId} lacks {Mode} of [{Permissions}].",
                userId, tenantId, requirement.RequireAll ? "all" : "any",
                string.Join(", ", requirement.Permissions));

            context.Fail(new AuthorizationFailureReason(this, $"Missing permission: {string.Join(", ", requirement.Permissions)}"));
        }
    }
}

// ---------------------------------------------------------------------------
// Returns a proper JSON 403 response when authorization fails
// ---------------------------------------------------------------------------

public class PermissionAuthorizationMiddlewareResultHandler : IAuthorizationMiddlewareResultHandler
{
    public async Task HandleAsync(
        RequestDelegate next,
        HttpContext context,
        AuthorizationPolicy policy,
        PolicyAuthorizationResult authorizationResult)
    {
        if (authorizationResult.Succeeded || context.Response.HasStarted)
        {
            await next(context);
            return;
        }

        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        context.Response.ContentType = "application/json";

        var body = JsonSerializer.Serialize(new
        {
            succeeded = false,
            message = "You do not have permission to perform this action.",
            code = "FORBIDDEN"
        }, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

        await context.Response.WriteAsync(body);
    }
}
