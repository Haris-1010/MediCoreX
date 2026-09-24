using ClinIQ.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace ClinIQ.Infrastructure.Services;

/// <summary>
/// Resolves the tenant for the current request.
///
/// SECURITY — READ BEFORE EDITING.
/// The previous version fell back to the "X-Tenant-Id" request header whenever
/// the tenant_id claim was missing. Because the token generator never emitted a
/// tenant_id claim, that fallback was the only path that ever executed, which
/// meant any authenticated user could read and write another organization's
/// data by changing one header. The fallback is gone.
///
/// The tenant now comes from the signed token only. The header is honoured for
/// exactly one case — a platform super admin impersonating an organization —
/// and TenantResolutionMiddleware re-verifies super-admin status server-side
/// before setting it.
///
/// Branch (location) scope:
///   - branch_id claim = specific location for write stamping and scoped reads
///   - all_locations claim (or super-admin) = read every location in the tenant
///   - X-Branch-Id header is validated by middleware (membership / all-locations)
///     and only then applied as an override
/// </summary>
public class TenantService : ITenantService
{
    public const string TenantHeader = "X-Tenant-Id";
    public const string BranchHeader = "X-Branch-Id";
    public const string AllLocationsHeaderValue = "all";

    private readonly IHttpContextAccessor _httpContextAccessor;

    // Explicit overrides set by middleware, seeders or background jobs.
    // Never set from untrusted input.
    private Guid? _tenantOverride;
    private Guid? _branchOverride;
    private bool? _allLocationsOverride;

    public TenantService(IHttpContextAccessor httpContextAccessor)
        => _httpContextAccessor = httpContextAccessor;

    public Guid? GetCurrentTenantId()
    {
        if (_tenantOverride.HasValue)
            return _tenantOverride;

        var user = _httpContextAccessor.HttpContext?.User;
        if (user is null)
            return null;

        var claim = user.FindFirst("tenant_id")?.Value;
        return Guid.TryParse(claim, out var tenantId) ? tenantId : null;
    }

    public Guid? GetCurrentBranchId()
    {
        if (_branchOverride.HasValue)
            return _branchOverride;

        var user = _httpContextAccessor.HttpContext?.User;
        if (user is null)
            return null;

        var claim = user.FindFirst("branch_id")?.Value;
        return Guid.TryParse(claim, out var branchId) ? branchId : null;
    }

    public bool HasAllLocationAccess()
    {
        if (_allLocationsOverride.HasValue)
            return _allLocationsOverride.Value;

        var user = _httpContextAccessor.HttpContext?.User;
        if (user is null)
            return false;

        // Platform super admins operate across locations inside a tenant.
        if (user.FindFirst("is_super_admin")?.Value == "true")
            return true;

        return user.FindFirst("all_locations")?.Value == "true";
    }

    /// <summary>
    /// Sets the tenant for the remainder of the scope. The caller is
    /// responsible for having authorised the switch — this performs no checks
    /// of its own by design, so it must never be reachable from a controller
    /// action bound to user input.
    /// </summary>
    public void SetCurrentTenant(Guid tenantId) => _tenantOverride = tenantId;

    public void SetCurrentBranch(Guid branchId) => _branchOverride = branchId;

    public void SetAllLocationAccess(bool hasAllLocations) => _allLocationsOverride = hasAllLocations;
}
