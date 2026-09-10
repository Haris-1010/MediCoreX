using ClinIQ.Domain.Interfaces;

namespace ClinIQ.Infrastructure.Services;

/// <summary>
/// Stub tenant service for design-time / migrations
/// </summary>
public class StubTenantService : ITenantService
{
    public Guid? GetCurrentTenantId() => null;
    public Guid? GetCurrentBranchId() => null;
    public void SetCurrentTenant(Guid tenantId) { }
    public void SetCurrentBranch(Guid branchId) { }
}

/// <summary>
/// Stub current user service for design-time / migrations
/// </summary>
public class StubCurrentUserService : ICurrentUserService
{
    public Guid? UserId => null;
    public string? Email => null;
    public string? FullName => null;
    public Guid? TenantId => null;
    public Guid? BranchId => null;
    public IEnumerable<string> Roles => Enumerable.Empty<string>();
    public IEnumerable<string> Permissions => Enumerable.Empty<string>();
    public bool IsAuthenticated => false;
    public bool IsSuperAdmin => false;
    public bool HasPermission(string permission) => false;
    public bool HasRole(string role) => false;
    public bool HasAnyPermission(params string[] permissions) => false;
    public bool HasAllPermissions(params string[] permissions) => false;
}

/// <summary>
/// Stub date-time service for design-time / migrations
/// </summary>
public class StubDateTimeService : IDateTimeService
{
    public DateTime Now => DateTime.Now;
    public DateTime UtcNow => DateTime.UtcNow;
    public DateOnly Today => DateOnly.FromDateTime(DateTime.UtcNow);
    public DateTime ConvertToTenantTimezone(DateTime utcDateTime) => utcDateTime;
    public DateTime ConvertToUtc(DateTime localDateTime) => localDateTime;
}
