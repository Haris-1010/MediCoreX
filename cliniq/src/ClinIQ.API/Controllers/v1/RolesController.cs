using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using ClinIQ.Shared.Constants;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class RolesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;
    private readonly IPermissionService _permissionService;
    private readonly IEntitlementService _entitlementService;

    public RolesController(
        ApplicationDbContext context,
        ITenantService tenantService,
        IPermissionService permissionService,
        IEntitlementService entitlementService)
    {
        _context = context;
        _tenantService = tenantService;
        _permissionService = permissionService;
        _entitlementService = entitlementService;
    }

    [HttpGet("permissions")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RolesView)]
    public async Task<IActionResult> GetPermissions()
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var enabledFeatures = await _entitlementService.GetEnabledFeaturesAsync(tenantId.Value);

        var groups = PermissionCatalog.All
            .Where(permission => IsPermissionAllowed(permission.Name, enabledFeatures))
            .GroupBy(permission => permission.Module)
            .OrderBy(group => group.Key)
            .Select(group => new
            {
                group = group.Key,
                category = group.First().Category,
                items = group.OrderBy(permission => permission.DisplayOrder).Select(permission => new
                {
                    key = permission.Name,
                    label = permission.DisplayName
                })
            });

        return Ok(Result<object[]>.Success(groups.Cast<object>().ToArray()));
    }

    private static bool IsPermissionAllowed(string permissionName, IReadOnlySet<string> enabledFeatures)
    {
        var dot = permissionName.IndexOf('.');
        if (dot <= 0) return true;

        var prefix = permissionName[..dot];

        if (PermissionCatalog.UngatedPrefixes.Contains(prefix))
            return true;

        return PermissionCatalog.PrefixToFeature.TryGetValue(prefix, out var feature)
            ? enabledFeatures.Contains(feature)
            : true;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RolesView)]
    public async Task<IActionResult> GetRoles()
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var roles = await _context.Roles
            .Where(r => !r.IsDeleted && r.IsActive && !r.IsSystemRole && r.TenantId == tenantId.Value)
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.Description,
                r.IsSystemRole,
                r.IsActive,
                UserCount = _context.UserRoles.Count(ur => ur.RoleId == r.Id && ur.TenantId == tenantId.Value),
                PermissionNames = _context.RolePermissions
                    .Where(rp => rp.RoleId == r.Id)
                    .Join(_context.Permissions, rp => rp.PermissionId, p => p.Id, (rp, p) => p.Name)
                    .ToList()
            })
            .OrderBy(r => r.Name)
            .ToListAsync();

        return Ok(Result<object[]>.Success(roles.ToArray()));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RolesView)]
    public async Task<IActionResult> GetRole(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var role = await _context.Roles
            .Where(r => r.Id == id && !r.IsDeleted && r.TenantId == tenantId.Value)
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.Description,
                r.IsSystemRole,
                r.IsActive,
                UserCount = _context.UserRoles.Count(ur => ur.RoleId == r.Id && ur.TenantId == tenantId.Value),
                PermissionNames = _context.RolePermissions
                    .Where(rp => rp.RoleId == r.Id)
                    .Join(_context.Permissions, rp => rp.PermissionId, p => p.Id, (rp, p) => p.Name)
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (role == null)
            return NotFound(Result.Failure("Role not found"));

        return Ok(Result<object>.Success(role));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RolesCreate)]
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var normalizedName = request.Name.Trim().ToUpperInvariant();
        if (await _context.Roles.AnyAsync(r => r.TenantId == tenantId.Value
            && r.NormalizedName == normalizedName
            && !r.IsSystemRole
            && !r.IsDeleted))
            return BadRequest(Result.Failure("Role with this name already exists"));

        var role = new Role
        {
            Name = request.Name.Trim(),
            NormalizedName = normalizedName,
            Description = request.Description,
            IsSystemRole = false,
            IsActive = true,
            TenantId = tenantId.Value
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        // Assign permissions
        if (request.PermissionNames != null && request.PermissionNames.Any())
        {
            foreach (var permName in request.PermissionNames)
            {
                var perm = await _context.Permissions.FirstOrDefaultAsync(p => p.Name == permName);
                if (perm != null)
                {
                    _context.RolePermissions.Add(new RolePermission
                    {
                        RoleId = role.Id,
                        PermissionId = perm.Id
                    });
                }
            }
            await _context.SaveChangesAsync();
        }

        _permissionService.InvalidateTenant(tenantId.Value);
        return Ok(Result<object>.Success(new { id = role.Id }));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RolesEdit)]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateRoleRequest request)
    {
        var role = await GetTenantRoleAsync(id);
        if (role == null || role.IsDeleted)
            return NotFound(Result.Failure("Role not found"));

        if (role.IsSystemRole)
            return BadRequest(Result.Failure("Cannot modify system roles"));

        role.Name = request.Name;
        role.NormalizedName = request.Name.ToUpper();
        role.Description = request.Description;

        // Update permissions
        var existingPerms = await _context.RolePermissions.Where(rp => rp.RoleId == id).ToListAsync();
        _context.RolePermissions.RemoveRange(existingPerms);

        if (request.PermissionNames != null && request.PermissionNames.Any())
        {
            foreach (var permName in request.PermissionNames)
            {
                var perm = await _context.Permissions.FirstOrDefaultAsync(p => p.Name == permName);
                if (perm != null)
                {
                    _context.RolePermissions.Add(new RolePermission
                    {
                        RoleId = id,
                        PermissionId = perm.Id
                    });
                }
            }
        }

        await _context.SaveChangesAsync();

        if (role.TenantId.HasValue)
            _permissionService.InvalidateTenant(role.TenantId.Value);

        return Ok(Result.Success("Role updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.RolesDelete)]
    public async Task<IActionResult> DeleteRole(Guid id)
    {
        var role = await GetTenantRoleAsync(id);
        if (role == null || role.IsDeleted)
            return NotFound(Result.Failure("Role not found"));

        if (role.IsSystemRole)
            return BadRequest(Result.Failure("Cannot delete system roles"));

        role.IsDeleted = true;
        role.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        if (role.TenantId.HasValue)
            _permissionService.InvalidateTenant(role.TenantId.Value);

        return Ok(Result.Success("Role deleted successfully"));
    }

    private async Task<Role?> GetTenantRoleAsync(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return null;
        return await _context.Roles
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted && r.TenantId == tenantId.Value);
    }
}

public record CreateRoleRequest(
    string Name,
    string? Description,
    List<string>? PermissionNames
);

public record UpdateRoleRequest(
    string Name,
    string? Description,
    List<string>? PermissionNames
);
