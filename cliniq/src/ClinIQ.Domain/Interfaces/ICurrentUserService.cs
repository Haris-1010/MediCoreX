namespace ClinIQ.Domain.Interfaces;

/// <summary>
/// Service for accessing current user context
/// </summary>
public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? Email { get; }
    string? FullName { get; }
    Guid? TenantId { get; }
    Guid? BranchId { get; }
    IEnumerable<string> Roles { get; }
    IEnumerable<string> Permissions { get; }
    bool IsAuthenticated { get; }
    bool IsSuperAdmin { get; }
    bool HasPermission(string permission);
    bool HasRole(string role);
    bool HasAnyPermission(params string[] permissions);
    bool HasAllPermissions(params string[] permissions);
}
