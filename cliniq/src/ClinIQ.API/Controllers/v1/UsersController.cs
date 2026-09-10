using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;
    private readonly IPermissionService _permissionService;

    public UsersController(
        ApplicationDbContext context,
        ITenantService tenantService,
        IPermissionService permissionService)
    {
        _context = context;
        _tenantService = tenantService;
        _permissionService = permissionService;
    }

    private Guid CurrentUserId =>
        Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : Guid.Empty;

    private async Task<bool> CanManageOwnersAsync(Guid tenantId)
    {
        if (User.FindFirst("is_super_admin")?.Value?.Equals("true", StringComparison.OrdinalIgnoreCase) == true)
            return true;

        return await _context.TenantUsers.AnyAsync(tu => tu.TenantId == tenantId
            && tu.UserId == CurrentUserId
            && tu.IsOwner
            && tu.IsActive);
    }

    private async Task<bool> IsProtectedOwnerAsync(Guid userId, Guid tenantId)
    {
        var ownerRoleName = ClinIQ.Shared.Constants.Roles.OrganizationOwner.ToUpperInvariant();
        if (await _context.TenantUsers.AnyAsync(tu => tu.TenantId == tenantId
            && tu.UserId == userId
            && tu.IsOwner))
            return true;

        return await _context.UserRoles.AnyAsync(ur =>
                ur.TenantId == tenantId
                && ur.UserId == userId
                && _context.Roles.Any(role => role.Id == ur.RoleId
                    && role.NormalizedName == ownerRoleName
                    && !role.IsDeleted));
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersView)]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var userIds = _context.Users.Select(u => u.Id);
        if (tenantId.HasValue)
        {
            userIds = _context.TenantUsers
                .Where(tu => tu.TenantId == tenantId.Value && tu.IsActive)
                .Select(tu => tu.UserId);
        }

        var canManageOwners = tenantId.HasValue && await CanManageOwnersAsync(tenantId.Value);

        // Doctors have a linked user account because appointments reference
        // the user ID, but they belong in the dedicated Doctors area, not Users.
        var query = _context.Users.Where(u => !u.IsDeleted
            && u.Specialization == null
            && userIds.Contains(u.Id));

        if (!canManageOwners && tenantId.HasValue)
        {
            var ownerRoleName = ClinIQ.Shared.Constants.Roles.OrganizationOwner.ToUpperInvariant();
            var adminRoleName = ClinIQ.Shared.Constants.Roles.OrganizationAdmin.ToUpperInvariant();
            query = query.Where(u => !_context.TenantUsers.Any(tu => tu.TenantId == tenantId.Value
                && tu.UserId == u.Id
                && tu.IsOwner)
                && !_context.UserRoles.Any(ur => ur.TenantId == tenantId.Value
                    && ur.UserId == u.Id
                    && _context.Roles.Any(role => role.Id == ur.RoleId
                        && (role.NormalizedName == ownerRoleName
                            || role.NormalizedName == adminRoleName)
                        && !role.IsDeleted)));
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(u =>
                u.FirstName.ToLower().Contains(term) ||
                u.LastName.ToLower().Contains(term) ||
                u.Email.ToLower().Contains(term));
        }

        var totalCount = await query.CountAsync();
        var users = await query
            .OrderBy(u => u.FirstName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.FirstName,
                u.LastName,
                FullName = u.FirstName + " " + u.LastName,
                u.PhoneNumber,
                u.IsSuperAdmin,
                IsDoctor = u.Specialization != null,
                u.IsActive,
                u.LastLoginAt,
                Roles = _context.UserRoles
                    .Where(ur => ur.UserId == u.Id && (!tenantId.HasValue || ur.TenantId == tenantId.Value))
                    .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
                    .ToList()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new
        {
            items = users,
            totalCount,
            pageNumber,
            pageSize,
            totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            hasPreviousPage = pageNumber > 1,
            hasNextPage = pageNumber * pageSize < totalCount
        }));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersView)]
    public async Task<IActionResult> GetUser(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var user = await _context.Users
            .Where(u => u.Id == id && !u.IsDeleted
                && _context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value))
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.FirstName,
                u.LastName,
                FullName = u.FirstName + " " + u.LastName,
                u.PhoneNumber,
                u.IsSuperAdmin,
                u.IsActive,
                u.LastLoginAt,
                u.CreatedAt,
                RoleIds = _context.UserRoles
                    .Where(ur => ur.UserId == u.Id && ur.TenantId == tenantId.Value)
                    .Select(ur => ur.RoleId)
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound(Result.Failure("User not found"));

        if (tenantId.HasValue && !await CanManageOwnersAsync(tenantId.Value)
            && await IsProtectedOwnerAsync(id, tenantId.Value))
            return Forbid();

        return Ok(Result<object>.Success(user));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersCreate)]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest(Result.Failure("User with this email already exists"));

        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var canManageOwners = await CanManageOwnersAsync(tenantId.Value);
        if (!canManageOwners && request.RoleIds != null && await _context.Roles.AnyAsync(role => request.RoleIds.Contains(role.Id)
            && role.TenantId == tenantId.Value
            && role.IsSystemRole
            && role.NormalizedName == ClinIQ.Shared.Constants.Roles.OrganizationOwner.ToUpper()))
            return Forbid();

        var user = new ApplicationUser
        {
            Email = request.Email,
            NormalizedEmail = request.Email.ToUpper(),
            EmailConfirmed = true,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password ?? "ChangeMe@123"),
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.Phone,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Link the user to the current organization so the permission engine
        // treats them as an active member of this tenant only.
        _context.TenantUsers.Add(new TenantUser
        {
            TenantId = tenantId.Value,
            UserId = user.Id,
            IsOwner = false,
            IsActive = true,
            JoinedAt = DateTime.UtcNow
        });

        // Link to the current branch if the actor is branch-scoped.
        var branchId = _tenantService.GetCurrentBranchId();
        if (branchId.HasValue)
        {
            _context.BranchUsers.Add(new BranchUser
            {
                TenantId = tenantId.Value,
                UserId = user.Id,
                BranchId = branchId.Value,
                IsPrimary = true,
                IsActive = true
            });
        }

        // Assign roles scoped to the current tenant.
        if (request.RoleIds != null && request.RoleIds.Any())
        {
            foreach (var roleId in request.RoleIds)
            {
                _context.UserRoles.Add(new UserRole
                {
                    UserId = user.Id,
                    RoleId = roleId,
                    TenantId = tenantId.Value
                });
            }
        }

        await _context.SaveChangesAsync();

        _permissionService.InvalidateUser(user.Id, tenantId.Value);
        return Ok(Result<object>.Success(new { id = user.Id }));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersEdit)]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted
                && _context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value));
        if (user == null)
            return NotFound(Result.Failure("User not found"));

        if (!await CanManageOwnersAsync(tenantId.Value)
            && await IsProtectedOwnerAsync(id, tenantId.Value))
            return Forbid();

        if (!await CanManageOwnersAsync(tenantId.Value) && request.RoleIds != null
            && await _context.Roles.AnyAsync(role => request.RoleIds.Contains(role.Id)
                && role.TenantId == tenantId.Value
                && role.IsSystemRole
                && role.NormalizedName == ClinIQ.Shared.Constants.Roles.OrganizationOwner.ToUpper()))
            return Forbid();

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;
        user.NormalizedEmail = request.Email.ToUpper();
        user.PhoneNumber = request.Phone;
        user.IsActive = request.IsActive;

        // Update roles scoped to the current tenant.
        var existingRoles = await _context.UserRoles
            .Where(ur => ur.UserId == id && ur.TenantId == tenantId.Value)
            .ToListAsync();
        _context.UserRoles.RemoveRange(existingRoles);

        if (request.RoleIds != null && request.RoleIds.Any())
        {
            foreach (var roleId in request.RoleIds)
            {
                _context.UserRoles.Add(new UserRole { UserId = id, RoleId = roleId, TenantId = tenantId.Value });
            }
        }

        await _context.SaveChangesAsync();
        _permissionService.InvalidateUser(id, tenantId.Value);
        return Ok(Result.Success("User updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersDelete)]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted
                && _context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value));
        if (user == null)
            return NotFound(Result.Failure("User not found"));

        if (id == CurrentUserId)
            return BadRequest(Result.Failure("You cannot delete your own account."));

        if (await IsProtectedOwnerAsync(id, tenantId.Value)
            && !await CanManageOwnersAsync(tenantId.Value))
            return Forbid();

        if (user.IsSuperAdmin)
            return BadRequest(Result.Failure("Cannot delete super admin user"));

        var me = await _context.TenantUsers
            .FirstOrDefaultAsync(tu => tu.UserId == id && tu.TenantId == tenantId.Value);
        if (me != null)
            me.IsActive = false;

        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        _permissionService.InvalidateUser(id, tenantId.Value);
        return Ok(Result.Success("User deleted successfully"));
    }

    [HttpPost("{id:guid}/reset-password")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersEdit)]
    public async Task<IActionResult> ResetPassword(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted
                && _context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value));
        if (user == null)
            return NotFound(Result.Failure("User not found"));

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword("ChangeMe@123");
        await _context.SaveChangesAsync();

        _permissionService.InvalidateUser(id, tenantId.Value);
        return Ok(Result.Success("Password reset to ChangeMe@123"));
    }
}

public record CreateUserRequest(
    string Email,
    string? Password,
    string FirstName,
    string LastName,
    string? Phone,
    List<Guid>? RoleIds
);

public record UpdateUserRequest(
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    bool IsActive,
    List<Guid>? RoleIds
);
