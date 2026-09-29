using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Constants;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class BranchesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public BranchesController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    /// <summary>
    /// Locations the current user may see in this organization.
    /// Non–All-Locations users only get their assigned BranchUser rows.
    /// Super admins and All Locations users get every active location.
    ///
    /// Pass <c>all=true</c> from management screens (assigning locations to a
    /// user, the Locations tab) to get every active location in the org — the
    /// default scoped list only drives the header switcher, which must stay
    /// limited to locations the caller can actually switch into.
    /// </summary>
    [HttpGet]
    [RequirePermission(Permissions.LocationsView, Permissions.SettingsView, RequireAll = false)]
    public async Task<IActionResult> GetBranches([FromQuery] bool all = false)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var userId = GetCurrentUserId();
        if (userId is null)
            return Unauthorized(Result.Failure("User not found."));

        IQueryable<Branch> query = _context.Branches;

        if (!all && !_tenantService.HasAllLocationAccess() && userId.Value != Guid.Empty)
        {
            var accessible = await _context.BranchUsers
                .IgnoreQueryFilters().AsNoTracking()
                .Where(bu => bu.UserId == userId.Value
                          && bu.TenantId == tenantId.Value
                          && bu.IsActive)
                .Select(bu => bu.BranchId)
                .ToListAsync();

            query = query.Where(b => accessible.Contains(b.Id));
        }

        var branches = await query
            .Where(b => b.IsActive)
            .OrderByDescending(b => b.IsMainBranch)
            .ThenBy(b => b.Name)
            .Select(b => new
            {
                b.Id,
                b.Name,
                b.Code,
                b.Description,
                b.LogoUrl,
                b.Website,
                b.Address,
                b.City,
                b.State,
                b.Country,
                b.PostalCode,
                b.Phone,
                b.Email,
                b.Timezone,
                b.IsMainBranch,
                b.IsActive
            })
            .ToListAsync();

        return Ok(Result<object[]>.Success(branches.ToArray()));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(Permissions.LocationsView, Permissions.SettingsView, RequireAll = false)]
    public async Task<IActionResult> GetBranch(Guid id)
    {
        var branch = await _context.Branches
            .Where(b => b.Id == id)
            .Select(b => new
            {
                b.Id,
                b.Name,
                b.Code,
                b.Description,
                b.LogoUrl,
                b.Website,
                b.Address,
                b.City,
                b.State,
                b.Country,
                b.PostalCode,
                b.Phone,
                b.Email,
                b.Timezone,
                b.IsMainBranch,
                b.IsActive,
                b.OperatingHours
            })
            .FirstOrDefaultAsync();

        if (branch is null)
            return NotFound(Result.Failure("Location not found."));

        return Ok(Result<object>.Success(branch));
    }

    [HttpPost]
    [RequirePermission(Permissions.LocationsCreate, Permissions.SettingsEdit, RequireAll = false)]
    public async Task<IActionResult> CreateBranch([FromBody] CreateBranchRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Code))
            return BadRequest(Result.Failure("Name and code are required."));

        var code = request.Code.Trim();
        var exists = await _context.Branches.IgnoreQueryFilters()
            .AnyAsync(b => b.TenantId == tenantId.Value
                        && b.Code == code
                        && !b.IsDeleted);
        if (exists)
            return BadRequest(Result.Failure("A location with this code already exists."));

        var anyBranch = await _context.Branches.IgnoreQueryFilters()
            .AnyAsync(b => b.TenantId == tenantId.Value && !b.IsDeleted);

        var branch = new Branch
        {
            Name = request.Name.Trim(),
            Code = code,
            Description = request.Description,
            LogoUrl = request.LogoUrl?.Trim(),
            Website = request.Website?.Trim(),
            Address = request.Address,
            City = request.City,
            State = request.State,
            Country = request.Country,
            PostalCode = request.PostalCode,
            Phone = request.Phone,
            Email = request.Email,
            Timezone = request.Timezone,
            IsMainBranch = !anyBranch,
            IsActive = true,
            TenantId = tenantId.Value
        };

        _context.Branches.Add(branch);
        await _context.SaveChangesAsync();

        // Link the creator to the location they just made. Without this row the
        // new location is invisible to them everywhere: header switcher, user
        // assignment and their own accessible-location list (both of which read
        // BranchUser, not the org-wide branch table).
        var creatorId = GetCurrentUserId();
        if (creatorId.HasValue
            && await _context.TenantUsers.IgnoreQueryFilters().AnyAsync(tu =>
                tu.TenantId == tenantId.Value && tu.UserId == creatorId.Value && tu.IsActive))
        {
            _context.BranchUsers.Add(new BranchUser
            {
                TenantId = tenantId.Value,
                UserId = creatorId.Value,
                BranchId = branch.Id,
                IsPrimary = false,
                IsActive = true
            });
            await _context.SaveChangesAsync();
        }

        return Ok(Result<object>.Success(new { id = branch.Id }));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(Permissions.LocationsEdit, Permissions.SettingsEdit, RequireAll = false)]
    public async Task<IActionResult> UpdateBranch(Guid id, [FromBody] UpdateBranchRequest request)
    {
        var branch = await _context.Branches.FindAsync(id);
        if (branch is null || branch.IsDeleted)
            return NotFound(Result.Failure("Location not found."));

        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Code))
            return BadRequest(Result.Failure("Name and code are required."));

        var code = request.Code.Trim();
        var codeTaken = await _context.Branches.IgnoreQueryFilters()
            .AnyAsync(b => b.TenantId == branch.TenantId
                        && b.Id != id
                        && b.Code == code
                        && !b.IsDeleted);
        if (codeTaken)
            return BadRequest(Result.Failure("A location with this code already exists."));

        branch.Name = request.Name.Trim();
        branch.Code = code;
        branch.Description = request.Description;
        branch.LogoUrl = request.LogoUrl?.Trim();
        branch.Website = request.Website?.Trim();
        branch.Address = request.Address;
        branch.City = request.City;
        branch.State = request.State;
        branch.Country = request.Country;
        branch.PostalCode = request.PostalCode;
        branch.Phone = request.Phone;
        branch.Email = request.Email;
        branch.Timezone = request.Timezone;
        if (request.IsActive.HasValue)
            branch.IsActive = request.IsActive.Value;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Location updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(Permissions.LocationsDelete, Permissions.SettingsEdit, RequireAll = false)]
    public async Task<IActionResult> DeleteBranch(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var branch = await _context.Branches.IgnoreQueryFilters()
            .FirstOrDefaultAsync(b => b.Id == id && b.TenantId == tenantId.Value && !b.IsDeleted);
        if (branch is null)
            return NotFound(Result.Failure("Location not found."));

        var otherActive = await _context.Branches.IgnoreQueryFilters()
            .CountAsync(b => b.TenantId == tenantId.Value
                          && b.Id != id
                          && b.IsActive
                          && !b.IsDeleted);
        if (otherActive == 0)
            return BadRequest(Result.Failure("Cannot delete the last active location."));

        var usersOnlyHere = await _context.BranchUsers.IgnoreQueryFilters()
            .Where(bu => bu.TenantId == tenantId.Value
                      && bu.IsActive
                      && bu.BranchId == id)
            .Select(bu => bu.UserId)
            .Except(
                _context.BranchUsers.IgnoreQueryFilters()
                    .Where(bu => bu.TenantId == tenantId.Value
                              && bu.IsActive
                              && bu.BranchId != id)
                    .Select(bu => bu.UserId))
            .AnyAsync();
        if (usersOnlyHere)
            return BadRequest(Result.Failure(
                "Some users are only assigned to this location. Reassign them before deleting."));

        branch.IsDeleted = true;
        branch.DeletedAt = DateTime.UtcNow;
        branch.IsActive = false;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Location deleted successfully"));
    }

    [HttpPost("{id:guid}/logo")]
    [Consumes("multipart/form-data")]
    [RequirePermission(Permissions.LocationsEdit, Permissions.SettingsEdit, RequireAll = false)]
    public async Task<IActionResult> UploadBranchLogo(Guid id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(Result.Failure("No file uploaded"));

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            return BadRequest(Result.Failure("Invalid file type. Allowed: " + string.Join(", ", allowedExtensions)));

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(Result.Failure("File size must be less than 5MB"));

        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var branch = await _context.Branches
            .FirstOrDefaultAsync(b => b.Id == id && b.TenantId == tenantId.Value && !b.IsDeleted);
        if (branch is null)
            return NotFound(Result.Failure("Location not found."));

        using (var memory = new MemoryStream())
        {
            await file.CopyToAsync(memory);
            branch.LogoData = memory.ToArray();
        }

        branch.LogoContentType = GetImageContentType(extension);
        branch.LogoUrl = $"/api/v1/branches/{branch.Id}/logo?v={DateTime.UtcNow:yyyyMMddHHmmssfff}";
        branch.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { logoUrl = branch.LogoUrl }, "Logo uploaded successfully"));
    }

    [HttpGet("{id:guid}/logo")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBranchLogo(Guid id)
    {
        var branch = await _context.Branches
            .IgnoreQueryFilters().AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id && !b.IsDeleted);

        if (branch?.LogoData == null || branch.LogoData.Length == 0)
            return NotFound();

        return File(branch.LogoData, branch.LogoContentType ?? "image/png");
    }

    /// <summary>
    /// Returns the effective branding for the current request context.
    /// Branch-level fields override tenant-level when set (non-null/non-empty).
    /// Falls back to the tenant (organization) branding otherwise.
    /// </summary>
    [HttpGet("current/branding")]
    public async Task<IActionResult> GetEffectiveBranding()
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return Ok(Result<object>.Success(new { }));

        var tenant = await _context.Tenants
            .IgnoreQueryFilters().AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == tenantId.Value && !t.IsDeleted);

        var branchId = _tenantService.GetCurrentBranchId();
        Branch? branch = null;
        if (branchId.HasValue)
        {
            branch = await _context.Branches
                .IgnoreQueryFilters().AsNoTracking()
                .FirstOrDefaultAsync(b => b.Id == branchId.Value && !b.IsDeleted);
        }

        string? Resolve(string? branchVal, string? tenantVal) =>
            !string.IsNullOrWhiteSpace(branchVal) ? branchVal : tenantVal;

        return Ok(Result<object>.Success(new
        {
            LogoUrl = Resolve(branch?.LogoUrl, tenant?.LogoUrl),
            Name = tenant?.Name,
            Phone = Resolve(branch?.Phone, tenant?.Phone),
            Email = Resolve(branch?.Email, tenant?.Email),
            Website = Resolve(branch?.Website, tenant?.Website),
            Address = Resolve(branch?.Address, tenant?.Address),
            City = Resolve(branch?.City, tenant?.City),
            State = Resolve(branch?.State, tenant?.State),
            Country = Resolve(branch?.Country, tenant?.Country),
            PostalCode = Resolve(branch?.PostalCode, tenant?.PostalCode),
            BranchName = branch?.Name,
            BranchId = branch?.Id
        }));
    }

    private static string GetImageContentType(string extension) => extension switch
    {
        ".png" => "image/png",
        ".jpg" or ".jpeg" => "image/jpeg",
        ".gif" => "image/gif",
        ".webp" => "image/webp",
        ".svg" => "image/svg+xml",
        _ => "application/octet-stream"
    };

    private Guid? GetCurrentUserId()
    {
        var raw = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(raw, out var id) ? id : null;
    }
}

public record CreateBranchRequest(
    string Name,
    string Code,
    string? Description,
    string? LogoUrl,
    string? Website,
    string? Address,
    string? City,
    string? State,
    string? Country,
    string? PostalCode,
    string? Phone,
    string? Email,
    string? Timezone
);

public record UpdateBranchRequest(
    string Name,
    string Code,
    string? Description,
    string? LogoUrl,
    string? Website,
    string? Address,
    string? City,
    string? State,
    string? Country,
    string? PostalCode,
    string? Phone,
    string? Email,
    string? Timezone,
    bool? IsActive
);
