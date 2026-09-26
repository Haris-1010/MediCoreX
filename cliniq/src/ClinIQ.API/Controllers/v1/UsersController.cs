using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Entities.Clinical;
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

    private static readonly HashSet<string> AllowedUserTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "Admin", "Doctor", "PharmacyManager", "LabManager", "Receptionist", "Nurse"
    };

    private static TimeSpan? ParseTime(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return null;
        if (TimeSpan.TryParse(input, out var ts)) return ts;
        if (DateTime.TryParse(input, out var dt)) return dt.TimeOfDay;
        return null;
    }

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

    /// <summary>
    /// Who sees the whole organization's user list: All Locations / super admin
    /// callers, the organization owner and anyone holding the OrganizationAdmin
    /// role. Everyone else is limited to the users of their own location.
    /// </summary>
    private async Task<bool> CanSeeAllUsersAsync(Guid tenantId)
    {
        if (_tenantService.HasAllLocationAccess())
            return true;

        if (await _context.TenantUsers.AnyAsync(tu => tu.TenantId == tenantId
            && tu.UserId == CurrentUserId
            && tu.IsOwner
            && tu.IsActive))
            return true;

        var adminRoleName = ClinIQ.Shared.Constants.Roles.OrganizationAdmin.ToUpperInvariant();
        return await _context.UserRoles.AnyAsync(ur => ur.TenantId == tenantId
            && ur.UserId == CurrentUserId
            && _context.Roles.Any(role => role.Id == ur.RoleId
                && role.NormalizedName == adminRoleName
                && !role.IsDeleted));
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersView)]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? userType = null,
        [FromQuery] bool? isActive = null)
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

        var query = _context.Users.Where(u => !u.IsDeleted
            && userIds.Contains(u.Id));

        // Location scope: anyone who is not an org-wide caller (owner,
        // OrganizationAdmin, All Locations, super admin) only sees the users of
        // the location they are currently working in.
        if (tenantId.HasValue && !await CanSeeAllUsersAsync(tenantId.Value))
        {
            var branchId = _tenantService.GetCurrentBranchId();
            var locationUserIds = await _context.BranchUsers
                .Where(bu => bu.TenantId == tenantId.Value
                          && bu.IsActive
                          && (branchId == null || bu.BranchId == branchId))
                .Select(bu => bu.UserId)
                .Distinct()
                .ToListAsync();

            query = query.Where(u => locationUserIds.Contains(u.Id));
        }

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

        if (!string.IsNullOrWhiteSpace(userType))
        {
            if (string.Equals(userType, "Admin", StringComparison.OrdinalIgnoreCase) && tenantId.HasValue)
            {
                var ownerRoleName = ClinIQ.Shared.Constants.Roles.OrganizationOwner.ToUpperInvariant();
                var adminRoleName = ClinIQ.Shared.Constants.Roles.OrganizationAdmin.ToUpperInvariant();
                query = query.Where(u =>
                    _context.TenantUsers.Any(tu => tu.TenantId == tenantId.Value
                        && tu.UserId == u.Id && tu.IsOwner)
                    || _context.UserRoles.Any(ur => ur.TenantId == tenantId.Value
                        && ur.UserId == u.Id
                        && _context.Roles.Any(role => role.Id == ur.RoleId
                            && (role.NormalizedName == ownerRoleName
                                || role.NormalizedName == adminRoleName)
                            && !role.IsDeleted)));
            }
            else
            {
                query = query.Where(u => u.UserType == userType);
            }
        }

        if (isActive.HasValue)
        {
            query = query.Where(u => u.IsActive == isActive.Value);
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
                u.IsMaster,
                u.UserType,
                u.Designation,
                IsDoctor = u.UserType == "Doctor" || u.Specialization != null,
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
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersView, ClinIQ.Shared.Constants.Permissions.UsersEdit, RequireAll = false)]
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
                u.UserType,
                u.Designation,
                u.EmployeeId,
                u.Specialization,
                u.LicenseNumber,
                u.Qualification,
                u.Bio,
                u.DepartmentId,
                RoleIds = _context.UserRoles
                    .Where(ur => ur.UserId == u.Id && ur.TenantId == tenantId.Value)
                    .Select(ur => ur.RoleId)
                    .ToList(),
                BranchIds = _context.BranchUsers
                    .Where(bu => bu.UserId == u.Id && bu.TenantId == tenantId.Value && bu.IsActive)
                    .Select(bu => bu.BranchId)
                    .ToList(),
                Schedule = _context.DoctorSchedules
                    .Where(s => s.DoctorId == u.Id && !s.IsDeleted)
                    .OrderBy(s => s.DayOfWeek)
                    .Select(s => new
                    {
                        s.DayOfWeek,
                        StartTime = s.StartTime.ToString(@"hh\:mm"),
                        EndTime = s.EndTime.ToString(@"hh\:mm"),
                        s.SlotDuration,
                        s.ConsultationFee
                    })
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
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
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

        var userType = string.IsNullOrWhiteSpace(request.UserType) ? null : request.UserType.Trim();
        if (userType != null && !AllowedUserTypes.Contains(userType))
            return BadRequest(Result.Failure("Invalid user type. Allowed: Doctor, PharmacyManager, LabManager, Receptionist, Nurse."));

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
            UserType = userType,
            Designation = request.Designation,
            EmployeeId = request.EmployeeId,
            Specialization = request.Specialization,
            LicenseNumber = request.LicenseNumber,
            Qualification = request.Qualifications,
            Bio = request.Bio,
            DepartmentId = request.DepartmentId,
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

        // Link to the selected branches. Fall back to the actor's current
        // branch when the client sends nothing (or only invalid ids).
        var branchIds = await ResolveBranchIdsAsync(
            tenantId.Value, request.BranchIds, _tenantService.GetCurrentBranchId());

        var currentBranchId = _tenantService.GetCurrentBranchId();
        var primaryBranchId =
            currentBranchId.HasValue && branchIds.Contains(currentBranchId.Value)
                ? currentBranchId.Value
                : branchIds.FirstOrDefault();

        foreach (var assignedBranchId in branchIds)
        {
            _context.BranchUsers.Add(new BranchUser
            {
                TenantId = tenantId.Value,
                UserId = user.Id,
                BranchId = assignedBranchId,
                IsPrimary = assignedBranchId == primaryBranchId,
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

        // Doctor schedule (time slots + fee) created together with the account.
        if (userType == "Doctor" && request.WorkingDays != null && request.WorkingDays.Length > 0)
        {
            var start = ParseTime(request.ConsultationStartTime) ?? new TimeSpan(9, 0, 0);
            var end = ParseTime(request.ConsultationEndTime) ?? new TimeSpan(17, 0, 0);
            var slotDuration = request.SlotDuration ?? 30;
            var scheduleBranchId = _tenantService.GetCurrentBranchId();

            foreach (var day in request.WorkingDays)
            {
                if (Enum.TryParse<DayOfWeek>(day, true, out var dow))
                {
                    _context.DoctorSchedules.Add(new DoctorSchedule
                    {
                        DoctorId = user.Id,
                        TenantId = tenantId.Value,
                        BranchId = scheduleBranchId,
                        DayOfWeek = (int)dow,
                        StartTime = start,
                        EndTime = end,
                        SlotDuration = slotDuration,
                        ConsultationFee = request.ConsultationFee
                    });
                }
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

        var userType = string.IsNullOrWhiteSpace(request.UserType) ? user.UserType : request.UserType.Trim();
        if (userType != null && !AllowedUserTypes.Contains(userType))
            return BadRequest(Result.Failure("Invalid user type. Allowed: Doctor, PharmacyManager, LabManager, Receptionist, Nurse."));
        user.UserType = userType;
        user.Designation = request.Designation;
        user.EmployeeId = request.EmployeeId;
        user.Specialization = request.Specialization;
        user.LicenseNumber = request.LicenseNumber;
        user.Qualification = request.Qualifications;
        user.Bio = request.Bio;
        user.DepartmentId = request.DepartmentId;

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

        // Replace branch assignments when the client sends a location list.
        // null = leave existing assignments alone.
        if (request.BranchIds != null)
        {
            await ReplaceUserBranchesAsync(
                id, tenantId.Value, request.BranchIds, _tenantService.GetCurrentBranchId());
        }

        // Replace doctor schedule when type-specific slots are supplied.
        if (userType == "Doctor" && request.WorkingDays != null && request.WorkingDays.Length > 0)
        {
            var existingSchedules = await _context.DoctorSchedules
                .Where(s => s.DoctorId == id && !s.IsDeleted)
                .ToListAsync();
            foreach (var s in existingSchedules)
            {
                s.IsDeleted = true;
                s.DeletedAt = DateTime.UtcNow;
            }

            var start = ParseTime(request.ConsultationStartTime) ?? new TimeSpan(9, 0, 0);
            var end = ParseTime(request.ConsultationEndTime) ?? new TimeSpan(17, 0, 0);
            var slotDuration = request.SlotDuration ?? 30;
            var scheduleBranchId = _tenantService.GetCurrentBranchId();

            foreach (var day in request.WorkingDays)
            {
                if (Enum.TryParse<DayOfWeek>(day, true, out var dow))
                {
                    _context.DoctorSchedules.Add(new DoctorSchedule
                    {
                        DoctorId = id,
                        TenantId = tenantId.Value,
                        BranchId = scheduleBranchId,
                        DayOfWeek = (int)dow,
                        StartTime = start,
                        EndTime = end,
                        SlotDuration = slotDuration,
                        ConsultationFee = request.ConsultationFee
                    });
                }
            }
        }

        await _context.SaveChangesAsync();
        _permissionService.InvalidateUser(id, tenantId.Value);
        return Ok(Result.Success("User updated successfully"));
    }

    [HttpPost("{id:guid}/suspend")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersEdit)]
    public async Task<IActionResult> SuspendUser(Guid id) => await SetUserActiveAsync(id, false);

    [HttpPost("{id:guid}/activate")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.UsersEdit)]
    public async Task<IActionResult> ActivateUser(Guid id) => await SetUserActiveAsync(id, true);

    private async Task<IActionResult> SetUserActiveAsync(Guid id, bool active)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted
                && _context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value));
        if (user == null)
            return NotFound(Result.Failure("User not found"));

        if (!active && id == CurrentUserId)
            return BadRequest(Result.Failure("You cannot deactivate your own account."));

        if (!await CanManageOwnersAsync(tenantId.Value)
            && await IsProtectedOwnerAsync(id, tenantId.Value))
            return Forbid();

        if (!active && user.IsMaster)
            return BadRequest(Result.Failure("You cannot suspend this admin."));

        if (!active && user.IsSuperAdmin && !user.IsMaster)
            return BadRequest(Result.Failure("You cannot suspend this admin."));

        user.IsActive = active;
        await _context.SaveChangesAsync();
        _permissionService.InvalidateUser(id, tenantId.Value);

        return Ok(Result.Success(active ? "User activated successfully" : "User suspended successfully"));
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

        if (user.IsMaster)
            return BadRequest(Result.Failure("You cannot delete this admin."));

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
    public async Task<IActionResult> ResetPassword(Guid id, [FromBody] AdminResetPasswordRequest? request = null)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted
                && _context.TenantUsers.Any(tu => tu.UserId == u.Id && tu.TenantId == tenantId.Value));
        if (user == null)
            return NotFound(Result.Failure("User not found"));

        var newPassword = request?.NewPassword;
        if (string.IsNullOrWhiteSpace(newPassword))
            newPassword = "ChangeMe@123";

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.PlainPassword = newPassword;
        user.MustChangePassword = true;
        await _context.SaveChangesAsync();

        _permissionService.InvalidateUser(id, tenantId.Value);
        return Ok(Result.Success("Password updated successfully"));
    }

    /// <summary>
    /// Validates requested branch ids against the tenant. Empty/null falls back
    /// to the actor's current branch so a user is never left with zero locations.
    /// </summary>
    private async Task<List<Guid>> ResolveBranchIdsAsync(
        Guid tenantId, List<Guid>? requested, Guid? fallbackBranchId)
    {
        if (requested == null || requested.Count == 0)
        {
            return fallbackBranchId.HasValue
                ? new List<Guid> { fallbackBranchId.Value }
                : new List<Guid>();
        }

        var valid = await _context.Branches
            .IgnoreQueryFilters()
            .Where(b => b.TenantId == tenantId
                        && !b.IsDeleted
                        && b.IsActive
                        && requested.Contains(b.Id))
            .Select(b => b.Id)
            .ToListAsync();

        if (valid.Count == 0 && fallbackBranchId.HasValue)
            return new List<Guid> { fallbackBranchId.Value };

        return valid;
    }

    /// <summary>
    /// Replaces a user's BranchUser rows for this tenant. Empty list falls back
    /// to the actor's current branch so the user always has at least one location.
    /// </summary>
    private async Task ReplaceUserBranchesAsync(
        Guid userId, Guid tenantId, List<Guid> requested, Guid? fallbackBranchId)
    {
        var branchIds = await ResolveBranchIdsAsync(tenantId, requested, fallbackBranchId);

        var existing = await _context.BranchUsers
            .IgnoreQueryFilters()
            .Where(bu => bu.UserId == userId && bu.TenantId == tenantId)
            .ToListAsync();

        // Preserve the previous primary when it is still selected.
        var previousPrimary = existing
            .Where(bu => bu.IsPrimary && bu.IsActive)
            .Select(bu => bu.BranchId)
            .FirstOrDefault();

        _context.BranchUsers.RemoveRange(existing);

        Guid? primary =
            branchIds.Contains(previousPrimary) ? previousPrimary
            : fallbackBranchId.HasValue && branchIds.Contains(fallbackBranchId.Value) ? fallbackBranchId
            : branchIds.Count > 0 ? branchIds[0]
            : null;

        foreach (var branchId in branchIds)
        {
            _context.BranchUsers.Add(new BranchUser
            {
                TenantId = tenantId,
                UserId = userId,
                BranchId = branchId,
                IsPrimary = branchId == primary,
                IsActive = true
            });
        }
    }
}

public record CreateUserRequest(
    string Email,
    string? Password,
    string FirstName,
    string LastName,
    string? Phone,
    List<Guid>? RoleIds,
    string? UserType = null,
    string? Designation = null,
    string? EmployeeId = null,
    string? Specialization = null,
    string? LicenseNumber = null,
    string? Qualifications = null,
    string? Bio = null,
    Guid? DepartmentId = null,
    string? ConsultationStartTime = null,
    string? ConsultationEndTime = null,
    int? SlotDuration = null,
    decimal? ConsultationFee = null,
    string[]? WorkingDays = null,
    List<Guid>? BranchIds = null
);

public record UpdateUserRequest(
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    bool IsActive,
    List<Guid>? RoleIds,
    string? UserType = null,
    string? Designation = null,
    string? EmployeeId = null,
    string? Specialization = null,
    string? LicenseNumber = null,
    string? Qualifications = null,
    string? Bio = null,
    Guid? DepartmentId = null,
    string? ConsultationStartTime = null,
    string? ConsultationEndTime = null,
    int? SlotDuration = null,
    decimal? ConsultationFee = null,
    string[]? WorkingDays = null,
    List<Guid>? BranchIds = null
);

public record AdminResetPasswordRequest(
    string? NewPassword
);
