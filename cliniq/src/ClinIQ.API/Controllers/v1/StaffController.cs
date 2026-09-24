using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class StaffController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public StaffController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    private Guid? CurrentTenantId() => _tenantService.GetCurrentTenantId();

    private async Task<bool> IsCallerOwnerAsync(Guid tenantId)
    {
        var userId = Guid.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var id) ? id : Guid.Empty;
        return await _context.TenantUsers.IgnoreQueryFilters()
            .AnyAsync(tu => tu.TenantId == tenantId && tu.UserId == userId && tu.IsOwner && tu.IsActive);
    }

    private async Task<bool> IsCallerAdminAsync(Guid tenantId)
    {
        var userId = Guid.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var id) ? id : Guid.Empty;
        var adminRoleName = ClinIQ.Shared.Constants.Roles.OrganizationAdmin.ToUpperInvariant();
        return await _context.UserRoles.IgnoreQueryFilters()
            .AnyAsync(ur => ur.TenantId == tenantId && ur.UserId == userId
                && _context.Roles.IgnoreQueryFilters().Any(r => r.Id == ur.RoleId
                    && r.NormalizedName == adminRoleName && !r.IsDeleted));
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersView)]
    public async Task<IActionResult> GetStaff(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? role = null)
    {
        var tenantId = CurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var callerIsOwner = await IsCallerOwnerAsync(tenantId.Value);
        var callerIsAdmin = await IsCallerAdminAsync(tenantId.Value);

        // Staff are Users who are NOT doctors (no specialization), not super
        // admin, and members of THIS tenant only.
        var query = _context.Users
            .Where(u => !u.IsDeleted && !u.IsSuperAdmin && u.Specialization == null
                && _context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value));

        if (!callerIsOwner && !callerIsAdmin)
        {
            query = query.Where(u =>
                !_context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value && tu.IsOwner)
                && !_context.UserRoles.Any(ur => ur.UserId == u.Id && ur.TenantId == tenantId.Value
                    && _context.Roles.IgnoreQueryFilters().Any(r => r.Id == ur.RoleId && !r.IsDeleted
                        && (r.NormalizedName == ClinIQ.Shared.Constants.Roles.OrganizationOwner.ToUpperInvariant()
                            || r.NormalizedName == ClinIQ.Shared.Constants.Roles.OrganizationAdmin.ToUpperInvariant()))));
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(u =>
                u.FirstName.ToLower().Contains(term) ||
                u.LastName.ToLower().Contains(term) ||
                u.Email.ToLower().Contains(term));
        }

        // Filter by role name if provided
        if (!string.IsNullOrWhiteSpace(role))
        {
            var roleEntity = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name == role && r.TenantId == tenantId.Value);
            if (roleEntity != null)
            {
                var userIds = _context.UserRoles
                    .Where(ur => ur.RoleId == roleEntity.Id && ur.TenantId == tenantId.Value)
                    .Select(ur => ur.UserId);
                query = query.Where(u => userIds.Contains(u.Id));
            }
            else
            {
                // No users if role not found
                query = query.Where(u => false);
            }
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
                u.IsActive,
                u.LastLoginAt,
                RoleId = _context.UserRoles
                    .Where(ur => ur.UserId == u.Id && ur.TenantId == tenantId.Value)
                    .Select(ur => ur.RoleId)
                    .FirstOrDefault(),
                RoleNames = _context.UserRoles
                    .Where(ur => ur.UserId == u.Id && ur.TenantId == tenantId.Value)
                    .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
                    .ToList()
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new
        {
            items = users.Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.PhoneNumber,
                u.RoleId,
                Role = u.RoleNames.FirstOrDefault() ?? "Staff",
                Status = u.IsActive ? "Active" : "Inactive",
                u.LastLoginAt
            }),
            totalCount,
            pageNumber,
            pageSize,
            totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            hasPreviousPage = pageNumber > 1,
            hasNextPage = pageNumber * pageSize < totalCount
        }));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.StaffView)]
    public async Task<IActionResult> GetStaffMember(Guid id)
    {
        var tenantId = CurrentTenantId();
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
                u.IsActive,
                RoleId = _context.UserRoles
                    .Where(ur => ur.UserId == u.Id && ur.TenantId == tenantId.Value)
                    .Select(ur => ur.RoleId)
                    .FirstOrDefault(),
                RoleNames = _context.UserRoles
                    .Where(ur => ur.UserId == u.Id && ur.TenantId == tenantId.Value)
                    .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound(Result.Failure("Staff member not found"));

        return Ok(Result<object>.Success(new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.PhoneNumber,
            user.RoleId,
            Role = user.RoleNames.FirstOrDefault() ?? "Staff",
            Status = user.IsActive ? "Active" : "Inactive"
        }));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersCreate)]
    public async Task<IActionResult> CreateStaff([FromBody] CreateStaffRequest request)
    {
        var tenantId = CurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest(Result.Failure("User with this email already exists"));

        var user = new ApplicationUser
        {
            Email = request.Email,
            NormalizedEmail = request.Email.ToUpper(),
            EmailConfirmed = true,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password ?? "ChangeMe@123"),
            PlainPassword = request.Password ?? "ChangeMe@123",
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.Phone,
            IsActive = true
        };

        _context.Users.Add(user);

        // Member of THIS tenant only, so they never appear elsewhere.
        _context.TenantUsers.Add(new TenantUser
        {
            TenantId = tenantId.Value,
            UserId = user.Id,
            IsOwner = false,
            IsActive = true,
            JoinedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        // Assign role if provided - scoped to this tenant and stamped with TenantId
        if (request.RoleId.HasValue)
        {
            var role = await _context.Roles
            .FirstOrDefaultAsync(r => r.Id == request.RoleId.Value && r.TenantId == tenantId.Value && !r.IsDeleted && r.IsActive);
            if (role != null)
            {
                _context.UserRoles.Add(new UserRole
                {
                    UserId = user.Id,
                    RoleId = role.Id,
                    TenantId = tenantId.Value
                });
                await _context.SaveChangesAsync();
            }
        }

        return Ok(Result<object>.Success(new { id = user.Id }));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersEdit)]
    public async Task<IActionResult> UpdateStaff(Guid id, [FromBody] UpdateStaffRequest request)
    {
        var tenantId = CurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted
                && _context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value));
        if (user == null)
            return NotFound(Result.Failure("Staff member not found"));

        var membership = await _context.TenantUsers
            .FirstOrDefaultAsync(tu => tu.UserId == id && tu.TenantId == tenantId.Value);
        if (membership != null && membership.IsOwner)
            return Forbid();

        var targetRoleNames = await _context.UserRoles
            .Where(ur => ur.UserId == id && ur.TenantId == tenantId.Value)
            .Join(_context.Roles.IgnoreQueryFilters(), ur => ur.RoleId, r => r.Id, (_, r) => r.NormalizedName)
            .ToListAsync();

        if (targetRoleNames.Contains(ClinIQ.Shared.Constants.Roles.OrganizationAdmin.ToUpperInvariant())
            || targetRoleNames.Contains(ClinIQ.Shared.Constants.Roles.OrganizationOwner.ToUpperInvariant()))
            return Forbid();

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;
        user.NormalizedEmail = request.Email.ToUpper();
        user.PhoneNumber = request.Phone;
        user.IsActive = request.IsActive;

        // Update role assignment if provided - scoped to this tenant
        if (request.RoleId.HasValue)
        {
            var existingRoles = await _context.UserRoles
                .Where(ur => ur.UserId == id && ur.TenantId == tenantId.Value)
                .ToListAsync();
            if (existingRoles.Any())
            {
                _context.UserRoles.RemoveRange(existingRoles);
            }

            if (request.RoleId.HasValue)
            {
                var role = await _context.Roles
                    .FirstOrDefaultAsync(r => r.Id == request.RoleId.Value && r.TenantId == tenantId.Value && !r.IsDeleted && r.IsActive);
                if (role != null)
                {
                    _context.UserRoles.Add(new UserRole { UserId = id, RoleId = role.Id, TenantId = tenantId.Value });
                }
            }
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Staff updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersDelete)]
    public async Task<IActionResult> DeleteStaff(Guid id)
    {
        var tenantId = CurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted
                && _context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value));
        if (user == null)
            return NotFound(Result.Failure("Staff member not found"));

        if (user.IsSuperAdmin)
            return Forbid();

        var membership = await _context.TenantUsers
            .FirstOrDefaultAsync(tu => tu.UserId == id && tu.TenantId == tenantId.Value);
        if (membership != null && membership.IsOwner)
            return Forbid();

        var targetRoleNames = await _context.UserRoles
            .Where(ur => ur.UserId == id && ur.TenantId == tenantId.Value)
            .Join(_context.Roles.IgnoreQueryFilters(), ur => ur.RoleId, r => r.Id, (_, r) => r.NormalizedName)
            .ToListAsync();

        if (targetRoleNames.Contains(ClinIQ.Shared.Constants.Roles.OrganizationAdmin.ToUpperInvariant())
            || targetRoleNames.Contains(ClinIQ.Shared.Constants.Roles.OrganizationOwner.ToUpperInvariant()))
            return Forbid();

        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;

        if (membership != null)
            membership.IsActive = false;

        await _context.SaveChangesAsync();

        return Ok(Result.Success("Staff deleted successfully"));
    }
}

public record CreateStaffRequest(
    string Email,
    string? Password,
    string FirstName,
    string LastName,
    string? Phone,
    Guid? RoleId
);

public record UpdateStaffRequest(
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    bool IsActive,
    Guid? RoleId
);
