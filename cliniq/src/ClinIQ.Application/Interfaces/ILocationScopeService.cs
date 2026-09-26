namespace ClinIQ.Application.Interfaces;

/// <summary>
/// The resolved, server-validated location scope for a read (reports, audit).
/// BranchId NULL means "All Locations" and is only ever produced for callers
/// who genuinely hold All Locations access.
/// </summary>
public sealed record LocationScope(
    Guid TenantId,
    Guid? BranchId,
    string LocationName,
    bool CanSeeAllLocations,
    IReadOnlyList<Guid> AllowedBranchIds);

public sealed record LocationOption(Guid? Id, string Name, bool IsCurrent);

/// <summary>
/// Single authority for "which location may this caller read". Every
/// location-scoped read endpoint resolves through here, so a locationId from
/// the query string, route or body is never trusted on its own: it must be a
/// non-deleted branch of the caller's tenant AND one the caller is a member of
/// (or the caller holds All Locations).
/// </summary>
public interface ILocationScopeService
{
    /// <summary>
    /// Validates <paramref name="requestedLocationId"/>. With no request the
    /// scope defaults to All Locations for all-location callers and to the
    /// current location for everyone else. Returns an error message instead
    /// of a scope when the caller may not read the requested location.
    /// </summary>
    /// <param name="requestAllLocations">Explicit "All Locations" request; refused unless the caller holds it.</param>
    Task<(LocationScope? Scope, string? Error)> ResolveAsync(
        Guid? requestedLocationId, CancellationToken cancellationToken = default, bool requestAllLocations = false);

    /// <summary>Locations the caller may pick, including "All Locations" when allowed.</summary>
    Task<IReadOnlyList<LocationOption>> GetSelectableAsync(CancellationToken cancellationToken = default);

    /// <summary>Effective (role + override + entitlement) permission check for the caller.</summary>
    Task<bool> HasPermissionAsync(string permission, CancellationToken cancellationToken = default);
}
