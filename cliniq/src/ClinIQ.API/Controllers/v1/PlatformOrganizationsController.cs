using ClinIQ.API.Authorization;
using ClinIQ.Application.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.DTOs.Platform;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

/// <summary>
/// Platform administration for managing customer organizations.
/// Gated on the super-admin claim rather than a tenant permission.
/// </summary>
[ApiController]
[Route("api/v1/platform/organizations")]
[Authorize]
public class PlatformOrganizationsController : ControllerBase
{
    private readonly IOrganizationProvisioningService _provisioning;
    private readonly ApplicationDbContext _context;

    public PlatformOrganizationsController(
        IOrganizationProvisioningService provisioning,
        ApplicationDbContext context)
    {
        _provisioning = provisioning;
        _context = context;
    }

    private bool IsSuperAdmin => User.FindFirst("is_super_admin")?.Value == "true";

    private IActionResult? RequireSuperAdmin() =>
        IsSuperAdmin ? null : Forbid();

    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? status = null,
        CancellationToken cancellationToken = default)
    {
        if (RequireSuperAdmin() is { } forbid) return forbid;

        var query = _context.Tenants.IgnoreQueryFilters().AsNoTracking().Where(t => !t.IsDeleted);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(t =>
                t.Name.ToLower().Contains(term) ||
                (t.Email != null && t.Email.ToLower().Contains(term)) ||
                (t.RegistrationNumber != null && t.RegistrationNumber.ToLower().Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            if (status.Equals("active", StringComparison.OrdinalIgnoreCase))
                query = query.Where(t => t.IsActive);
            else if (status.Equals("inactive", StringComparison.OrdinalIgnoreCase))
                query = query.Where(t => !t.IsActive);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var page = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new
            {
                t.Id, t.Name, t.RegistrationNumber, t.Email, t.IsActive, t.CreatedAt,
                UserCount = _context.TenantUsers.IgnoreQueryFilters().Count(tu => tu.TenantId == t.Id && tu.IsActive),
                BranchCount = _context.Branches.IgnoreQueryFilters().Count(b => b.TenantId == t.Id && !b.IsDeleted)
            })
            .ToListAsync(cancellationToken);

        var items = page.Select(t => new OrganizationListItemDto(
            t.Id, t.Name, t.RegistrationNumber, t.Email,
            t.IsActive, t.UserCount, t.BranchCount, t.CreatedAt)).ToList();

        return Ok(new
        {
            items,
            totalCount,
            pageNumber,
            pageSize,
            totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
    {
        if (RequireSuperAdmin() is { } forbid) return forbid;

        var result = await _provisioning.GetAsync(id, cancellationToken);
        return result.Succeeded ? Ok(result.Data) : NotFound(new { message = result.Message });
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateOrganizationRequest request,
        CancellationToken cancellationToken)
    {
        if (RequireSuperAdmin() is { } forbid) return forbid;

        var result = await _provisioning.CreateAsync(request, cancellationToken);
        if (!result.Succeeded)
            return BadRequest(new { message = result.Message });

        return CreatedAtAction(nameof(Get), new { id = result.Data!.TenantId }, result.Data);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id, [FromBody] UpdateOrganizationRequest request, CancellationToken cancellationToken)
    {
        if (RequireSuperAdmin() is { } forbid) return forbid;

        var result = await _provisioning.UpdateAsync(id, request, cancellationToken);
        return result.Succeeded ? Ok(new { message = result.Message }) : BadRequest(new { message = result.Message });
    }

    [HttpPut("{id:guid}/entitlements")]
    public async Task<IActionResult> UpdateEntitlements(
        Guid id, [FromBody] UpdateEntitlementsRequest request, CancellationToken cancellationToken)
    {
        if (RequireSuperAdmin() is { } forbid) return forbid;

        var result = await _provisioning.UpdateEntitlementsAsync(id, request, cancellationToken);
        return result.Succeeded ? Ok(new { message = result.Message }) : BadRequest(new { message = result.Message });
    }

    [HttpPost("{id:guid}/suspend")]
    public async Task<IActionResult> Suspend(Guid id, CancellationToken cancellationToken)
    {
        if (RequireSuperAdmin() is { } forbid) return forbid;

        var result = await _provisioning.SetActiveAsync(id, false, cancellationToken);
        return result.Succeeded ? Ok(new { message = result.Message }) : BadRequest(new { message = result.Message });
    }

    [HttpPost("{id:guid}/activate")]
    public async Task<IActionResult> Activate(Guid id, CancellationToken cancellationToken)
    {
        if (RequireSuperAdmin() is { } forbid) return forbid;

        var result = await _provisioning.SetActiveAsync(id, true, cancellationToken);
        return result.Succeeded ? Ok(new { message = result.Message }) : BadRequest(new { message = result.Message });
    }

    [HttpPost("{id:guid}/master-password")]
    public async Task<IActionResult> ResetMasterPassword(
        Guid id, [FromBody] ResetOrganizationPasswordRequest request, CancellationToken cancellationToken)
    {
        if (RequireSuperAdmin() is { } forbid) return forbid;
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
            return BadRequest(new { message = "Password must be at least 8 characters." });

        var owner = await _context.TenantUsers.IgnoreQueryFilters()
            .Where(link => link.TenantId == id && link.IsOwner && link.IsActive)
            .Join(_context.Users.IgnoreQueryFilters(), link => link.UserId, user => user.Id, (_, user) => user)
            .FirstOrDefaultAsync(cancellationToken);

        if (owner is null) return NotFound(new { message = "Organization master user not found." });

        owner.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        owner.MustChangePassword = true;
        owner.PasswordChangedAt = null;
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new ResetPasswordResponse(owner.Id, owner.Email, request.Password, true));
    }
}
