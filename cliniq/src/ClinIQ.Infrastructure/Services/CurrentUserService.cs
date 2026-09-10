using System.Security.Claims;
using ClinIQ.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace ClinIQ.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public Guid? UserId
    {
        get
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User?.FindFirst("sub")?.Value;
            return userId != null && Guid.TryParse(userId, out var id) ? id : null;
        }
    }

    public string? Email => User?.FindFirst(ClaimTypes.Email)?.Value
        ?? User?.FindFirst("email")?.Value;

    public string? FullName => User?.FindFirst("name")?.Value
        ?? User?.FindFirst(ClaimTypes.Name)?.Value;

    public Guid? TenantId
    {
        get
        {
            var tenantId = User?.FindFirst("tenant_id")?.Value;
            return tenantId != null && Guid.TryParse(tenantId, out var id) ? id : null;
        }
    }

    public Guid? BranchId
    {
        get
        {
            var branchId = User?.FindFirst("branch_id")?.Value;
            return branchId != null && Guid.TryParse(branchId, out var id) ? id : null;
        }
    }

    public IEnumerable<string> Roles
    {
        get
        {
            return User?.FindAll(ClaimTypes.Role).Select(c => c.Value) ?? Enumerable.Empty<string>();
        }
    }

    public IEnumerable<string> Permissions
    {
        get
        {
            return User?.FindAll("permission").Select(c => c.Value) ?? Enumerable.Empty<string>();
        }
    }

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;

    public bool IsSuperAdmin => User?.FindFirst("is_super_admin")?.Value == "true";

    public bool HasPermission(string permission)
    {
        if (IsSuperAdmin) return true;
        return Permissions.Contains(permission);
    }

    public bool HasRole(string role)
    {
        if (IsSuperAdmin) return true;
        return Roles.Contains(role);
    }

    public bool HasAnyPermission(params string[] permissions)
    {
        if (IsSuperAdmin) return true;
        return permissions.Any(p => Permissions.Contains(p));
    }

    public bool HasAllPermissions(params string[] permissions)
    {
        if (IsSuperAdmin) return true;
        return permissions.All(p => Permissions.Contains(p));
    }
}
