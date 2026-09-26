using ClinIQ.Application.Interfaces;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.Infrastructure.Services;

/// <inheritdoc />
public class LocationScopeService : ILocationScopeService
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPermissionService _permissionService;

    private IReadOnlyList<(Guid Id, string Name)>? _allowed;
    private bool? _canSeeAll;

    public LocationScopeService(
        ApplicationDbContext context,
        ITenantService tenantService,
        ICurrentUserService currentUserService,
        IPermissionService permissionService)
    {
        _context = context;
        _tenantService = tenantService;
        _currentUserService = currentUserService;
        _permissionService = permissionService;
    }

    public async Task<(LocationScope? Scope, string? Error)> ResolveAsync(
        Guid? requestedLocationId, CancellationToken cancellationToken = default, bool requestAllLocations = false)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return (null, "No organization context.");

        var canSeeAll = await CanSeeAllAsync(tenantId.Value, cancellationToken);
        var allowed = await GetAllowedAsync(tenantId.Value, canSeeAll, cancellationToken);
        var allowedIds = allowed.Select(a => a.Id).ToList();

        if (requestAllLocations && !requestedLocationId.HasValue)
        {
            return canSeeAll
                ? (new LocationScope(tenantId.Value, null, "All Locations", true, allowedIds), null)
                : (null, "You do not have All Locations access in this organization.");
        }

        if (requestedLocationId.HasValue)
        {
            var match = allowed.FirstOrDefault(a => a.Id == requestedLocationId.Value);
            if (match == default)
                return (null, "You do not have access to this location.");

            return (new LocationScope(tenantId.Value, match.Id, match.Name, canSeeAll, allowedIds), null);
        }

        // No explicit request: the header-selected context decides the default.
        // An all-location caller who is currently viewing "All Locations" gets
        // the whole organization; otherwise the current location.
        if (canSeeAll && _tenantService.HasAllLocationAccess())
            return (new LocationScope(tenantId.Value, null, "All Locations", true, allowedIds), null);

        var currentBranchId = _tenantService.GetCurrentBranchId();
        if (currentBranchId.HasValue)
        {
            var current = allowed.FirstOrDefault(a => a.Id == currentBranchId.Value);
            if (current != default)
                return (new LocationScope(tenantId.Value, current.Id, current.Name, canSeeAll, allowedIds), null);
        }

        if (canSeeAll)
            return (new LocationScope(tenantId.Value, null, "All Locations", true, allowedIds), null);

        return (null, "No location context.");
    }

    public async Task<IReadOnlyList<LocationOption>> GetSelectableAsync(CancellationToken cancellationToken = default)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return Array.Empty<LocationOption>();

        var canSeeAll = await CanSeeAllAsync(tenantId.Value, cancellationToken);
        var allowed = await GetAllowedAsync(tenantId.Value, canSeeAll, cancellationToken);
        var (scope, _) = await ResolveAsync(null, cancellationToken);

        var options = new List<LocationOption>();
        if (canSeeAll)
            options.Add(new LocationOption(null, "All Locations", scope?.BranchId is null));
        options.AddRange(allowed.Select(a => new LocationOption(a.Id, a.Name, scope?.BranchId == a.Id)));
        return options;
    }

    public async Task<bool> HasPermissionAsync(string permission, CancellationToken cancellationToken = default)
    {
        if (_currentUserService.IsSuperAdmin)
            return true;

        var userId = _currentUserService.UserId;
        var tenantId = _tenantService.GetCurrentTenantId();
        if (userId is null || tenantId is null)
            return false;

        return await _permissionService.HasPermissionAsync(
            userId.Value, tenantId.Value, permission, _tenantService.GetCurrentBranchId(), cancellationToken);
    }

    private async Task<bool> CanSeeAllAsync(Guid tenantId, CancellationToken cancellationToken)
    {
        if (_canSeeAll.HasValue)
            return _canSeeAll.Value;

        if (_currentUserService.IsSuperAdmin || _tenantService.HasAllLocationAccess())
            return (_canSeeAll = true).Value;

        var userId = _currentUserService.UserId;
        _canSeeAll = userId.HasValue && await _context.TenantUsers
            .IgnoreQueryFilters()
            .AnyAsync(tu => tu.UserId == userId.Value && tu.TenantId == tenantId
                            && tu.IsActive && tu.HasAllLocations, cancellationToken);
        return _canSeeAll.Value;
    }

    private async Task<IReadOnlyList<(Guid Id, string Name)>> GetAllowedAsync(
        Guid tenantId, bool canSeeAll, CancellationToken cancellationToken)
    {
        if (_allowed is not null)
            return _allowed;

        var branches = _context.Branches
            .IgnoreQueryFilters()
            .Where(b => b.TenantId == tenantId && !b.IsDeleted);

        if (!canSeeAll)
        {
            var userId = _currentUserService.UserId;
            var memberBranchIds = _context.BranchUsers
                .IgnoreQueryFilters()
                .Where(bu => bu.UserId == userId && bu.TenantId == tenantId && bu.IsActive)
                .Select(bu => bu.BranchId);
            branches = branches.Where(b => memberBranchIds.Contains(b.Id));
        }

        var rows = await branches
            .OrderBy(b => b.Name)
            .Select(b => new { b.Id, b.Name })
            .ToListAsync(cancellationToken);

        _allowed = rows.Select(r => (r.Id, r.Name)).ToList();
        return _allowed;
    }
}
