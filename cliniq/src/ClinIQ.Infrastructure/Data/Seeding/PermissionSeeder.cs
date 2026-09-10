using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Shared.Constants;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ClinIQ.Infrastructure.Data.Seeding;

/// <summary>
/// Keeps the Permissions and system Roles tables in sync with the code.
/// Runs at startup and is idempotent: it inserts what is missing, updates
/// display metadata that has drifted, and deactivates permissions that were
/// removed from the catalogue (rather than deleting them, so existing grants
/// are not silently orphaned).
/// </summary>
public class PermissionSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<PermissionSeeder> _logger;

    public PermissionSeeder(ApplicationDbContext context, ILogger<PermissionSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        await SeedPermissionsAsync(cancellationToken);
        await SeedSystemRolesAsync(cancellationToken);
        await SeedRolePermissionsAsync(cancellationToken);
    }

    private async Task SeedPermissionsAsync(CancellationToken cancellationToken)
    {
        var existing = await _context.Permissions
            .IgnoreQueryFilters()
            .ToDictionaryAsync(p => p.Name, StringComparer.OrdinalIgnoreCase, cancellationToken);

        var inserted = 0;
        var updated = 0;

        foreach (var def in PermissionCatalog.All)
        {
            if (existing.TryGetValue(def.Name, out var row))
            {
                if (row.DisplayName != def.DisplayName || row.Module != def.Module ||
                    row.Category != def.Category || row.DisplayOrder != def.DisplayOrder || !row.IsActive)
                {
                    row.DisplayName = def.DisplayName;
                    row.Module = def.Module;
                    row.Category = def.Category;
                    row.DisplayOrder = def.DisplayOrder;
                    row.IsActive = true;
                    updated++;
                }
            }
            else
            {
                _context.Permissions.Add(new Permission
                {
                    Name = def.Name,
                    DisplayName = def.DisplayName,
                    Module = def.Module,
                    Category = def.Category,
                    DisplayOrder = def.DisplayOrder,
                    IsActive = true
                });
                inserted++;
            }
        }

        // Retired permissions: deactivate, never delete.
        var catalogueNames = PermissionCatalog.All.Select(p => p.Name)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var (name, row) in existing)
        {
            if (!catalogueNames.Contains(name) && row.IsActive)
            {
                row.IsActive = false;
                updated++;
            }
        }

        if (inserted > 0 || updated > 0)
        {
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Permission seed: {Inserted} inserted, {Updated} updated.", inserted, updated);
        }
    }

    private async Task SeedSystemRolesAsync(CancellationToken cancellationToken)
    {
        var existing = await _context.Roles
            .IgnoreQueryFilters()
            .Where(r => r.TenantId == null)
            .Select(r => r.Name)
            .ToListAsync(cancellationToken);

        var have = existing.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var order = 0;
        var added = 0;

        foreach (var roleName in Roles.AllRoles)
        {
            order += 10;
            if (have.Contains(roleName)) continue;

            _context.Roles.Add(new Role
            {
                Name = roleName,
                NormalizedName = roleName.ToUpperInvariant(),
                TenantId = null,
                IsSystemRole = true,
                IsActive = true,
                DisplayOrder = order
            });
            added++;
        }

        if (added > 0)
        {
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("System role seed: {Added} roles added.", added);
        }
    }

    /// <summary>
    /// Applies RolePermissionDefaults to the system role templates. Only adds
    /// missing grants — never removes, so an administrator's customisations to a
    /// system role survive a restart.
    /// </summary>
    private async Task SeedRolePermissionsAsync(CancellationToken cancellationToken)
    {
        var permissionIds = await _context.Permissions
            .IgnoreQueryFilters()
            .ToDictionaryAsync(p => p.Name, p => p.Id, StringComparer.OrdinalIgnoreCase, cancellationToken);

        var systemRoles = await _context.Roles
            .IgnoreQueryFilters()
            .Where(r => r.TenantId == null && r.IsSystemRole)
            .ToListAsync(cancellationToken);

        var existingGrants = await _context.RolePermissions
            .IgnoreQueryFilters()
            .Select(rp => new { rp.RoleId, rp.PermissionId })
            .ToListAsync(cancellationToken);

        var have = existingGrants
            .Select(g => (g.RoleId, g.PermissionId))
            .ToHashSet();

        var added = 0;

        foreach (var role in systemRoles)
        {
            foreach (var permName in RolePermissionDefaults.For(role.Name))
            {
                if (!permissionIds.TryGetValue(permName, out var permId)) continue;
                if (have.Contains((role.Id, permId))) continue;

                _context.RolePermissions.Add(new RolePermission
                {
                    RoleId = role.Id,
                    PermissionId = permId
                });
                have.Add((role.Id, permId));
                added++;
            }
        }

        if (added > 0)
        {
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Role-permission seed: {Added} grants added.", added);
        }
    }
}
