using ClinIQ.API.Authorization;
using ClinIQ.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

/// <summary>
/// Master control portal — only the IsMaster account can access.
/// Pause/resume the entire system, all platform admins, and all organizations.
/// </summary>
[ApiController]
[Route("api/v1/master")]
[Authorize]
public class MasterController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<MasterController> _logger;

    private const string SystemPausedKey = "SystemPaused";

    public MasterController(ApplicationDbContext context, ILogger<MasterController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private Guid? CurrentUserId =>
        Guid.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var id)
            ? id : null;

    private async Task<bool> IsMasterAsync(CancellationToken ct)
    {
        if (CurrentUserId is not { } uid) return false;
        return await _context.Users.IgnoreQueryFilters().AsNoTracking()
            .AnyAsync(u => u.Id == uid && u.IsMaster && u.IsActive && !u.IsDeleted, ct);
    }

    private async Task<IActionResult> RequireMasterAsync(CancellationToken ct)
    {
        if (await IsMasterAsync(ct)) return null!;
        return Forbid();
    }

    // ── Status ──────────────────────────────────────────────

    [HttpGet("status")]
    public async Task<IActionResult> GetStatus(CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;

        var paused = await IsSystemPausedAsync(ct);
        var orgCount = await _context.Tenants.IgnoreQueryFilters().CountAsync(t => !t.IsDeleted, ct);
        var activeOrgs = await _context.Tenants.IgnoreQueryFilters().CountAsync(t => !t.IsDeleted && t.IsActive, ct);
        var adminCount = await _context.Users.IgnoreQueryFilters().CountAsync(u => u.IsSuperAdmin && !u.IsDeleted, ct);
        var activeAdmins = await _context.Users.IgnoreQueryFilters().CountAsync(u => u.IsSuperAdmin && u.IsActive && !u.IsDeleted, ct);

        return Ok(new
        {
            systemPaused = paused,
            organizations = new { total = orgCount, active = activeOrgs, paused = orgCount - activeOrgs },
            platformAdmins = new { total = adminCount, active = activeAdmins, paused = adminCount - activeAdmins }
        });
    }

    // ── System pause / resume ───────────────────────────────

    [HttpPost("pause-system")]
    public async Task<IActionResult> PauseSystem(CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;
        await SetSystemPausedAsync(true, ct);
        _logger.LogWarning("Master {UserId} PAUSED the entire system.", CurrentUserId);
        return Ok(new { message = "System paused. All organizations and platform admins are blocked." });
    }

    [HttpPost("resume-system")]
    public async Task<IActionResult> ResumeSystem(CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;
        await SetSystemPausedAsync(false, ct);
        _logger.LogWarning("Master {UserId} RESUMED the system.", CurrentUserId);
        return Ok(new { message = "System resumed." });
    }

    // ── Organizations ───────────────────────────────────────

    [HttpGet("organizations")]
    public async Task<IActionResult> GetOrganizations(CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;

        var orgs = await _context.Tenants.IgnoreQueryFilters().AsNoTracking()
            .Where(t => !t.IsDeleted)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new { t.Id, t.Name, t.Email, t.IsActive, t.CreatedAt })
            .ToListAsync(ct);

        return Ok(orgs);
    }

    [HttpPost("organizations/{id:guid}/pause")]
    public async Task<IActionResult> PauseOrg(Guid id, CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;
        return await SetOrgActiveAsync(id, false, ct);
    }

    [HttpPost("organizations/{id:guid}/resume")]
    public async Task<IActionResult> ResumeOrg(Guid id, CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;
        return await SetOrgActiveAsync(id, true, ct);
    }

    [HttpPost("organizations/pause-all")]
    public async Task<IActionResult> PauseAllOrgs(CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;
        var orgs = await _context.Tenants.IgnoreQueryFilters()
            .Where(t => !t.IsDeleted && t.IsActive).ToListAsync(ct);
        foreach (var o in orgs) o.IsActive = false;
        await _context.SaveChangesAsync(ct);
        _logger.LogWarning("Master {UserId} paused ALL {Count} organizations.", CurrentUserId, orgs.Count);
        return Ok(new { message = $"{orgs.Count} organizations paused.", count = orgs.Count });
    }

    [HttpPost("organizations/resume-all")]
    public async Task<IActionResult> ResumeAllOrgs(CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;
        var orgs = await _context.Tenants.IgnoreQueryFilters()
            .Where(t => !t.IsDeleted && !t.IsActive).ToListAsync(ct);
        foreach (var o in orgs) o.IsActive = true;
        await _context.SaveChangesAsync(ct);
        _logger.LogWarning("Master {UserId} resumed ALL {Count} organizations.", CurrentUserId, orgs.Count);
        return Ok(new { message = $"{orgs.Count} organizations resumed.", count = orgs.Count });
    }

    // ── Platform admins ─────────────────────────────────────

    [HttpGet("admins")]
    public async Task<IActionResult> GetAdmins(CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;

        var admins = await _context.Users.IgnoreQueryFilters().AsNoTracking()
            .Where(u => u.IsSuperAdmin && !u.IsDeleted)
            .OrderBy(u => u.FirstName)
            .Select(u => new
            {
                u.Id, u.FirstName, u.LastName, u.Email,
                u.IsActive, u.IsMaster, u.LastLoginAt
            })
            .ToListAsync(ct);

        return Ok(admins);
    }

    [HttpPost("admins/{id:guid}/pause")]
    public async Task<IActionResult> PauseAdmin(Guid id, CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;
        if (id == CurrentUserId)
            return BadRequest(new { message = "You cannot deactivate your own account." });
        return await SetAdminActiveAsync(id, false, ct);
    }

    [HttpPost("admins/{id:guid}/resume")]
    public async Task<IActionResult> ResumeAdmin(Guid id, CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;
        return await SetAdminActiveAsync(id, true, ct);
    }

    [HttpPost("admins/pause-all")]
    public async Task<IActionResult> PauseAllAdmins(CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;
        var admins = await _context.Users.IgnoreQueryFilters()
            .Where(u => u.IsSuperAdmin && u.IsActive && !u.IsDeleted && u.Id != CurrentUserId && !u.IsMaster)
            .ToListAsync(ct);
        foreach (var a in admins) a.IsActive = false;
        await _context.SaveChangesAsync(ct);
        _logger.LogWarning("Master {UserId} paused ALL {Count} platform admins.", CurrentUserId, admins.Count);
        return Ok(new { message = $"{admins.Count} platform admins paused (you remain active).", count = admins.Count });
    }

    [HttpPost("admins/resume-all")]
    public async Task<IActionResult> ResumeAllAdmins(CancellationToken ct)
    {
        if (await RequireMasterAsync(ct) is { } forbid) return forbid;
        var admins = await _context.Users.IgnoreQueryFilters()
            .Where(u => u.IsSuperAdmin && !u.IsActive && !u.IsDeleted)
            .ToListAsync(ct);
        foreach (var a in admins) a.IsActive = true;
        await _context.SaveChangesAsync(ct);
        _logger.LogWarning("Master {UserId} resumed ALL {Count} platform admins.", CurrentUserId, admins.Count);
        return Ok(new { message = $"{admins.Count} platform admins resumed.", count = admins.Count });
    }

    // ── Helpers ─────────────────────────────────────────────

    private async Task<bool> IsSystemPausedAsync(CancellationToken ct)
    {
        var row = await _context.SystemSettings.IgnoreQueryFilters().AsNoTracking()
            .FirstOrDefaultAsync(s => s.TenantId == null && s.Key == SystemPausedKey, ct);
        return row?.Value?.Equals("true", StringComparison.OrdinalIgnoreCase) == true;
    }

    private async Task SetSystemPausedAsync(bool paused, CancellationToken ct)
    {
        var row = await _context.SystemSettings.IgnoreQueryFilters()
            .FirstOrDefaultAsync(s => s.TenantId == null && s.Key == SystemPausedKey, ct);

        if (row is null)
        {
            _context.SystemSettings.Add(new Domain.Entities.SystemSetting
            {
                Id = Guid.NewGuid(),
                TenantId = null,
                Key = SystemPausedKey,
                Value = paused.ToString().ToLowerInvariant(),
                DataType = "bool",
                Category = "System",
                Description = "Global kill switch — when true all tenant traffic is blocked.",
                IsReadOnly = false
            });
        }
        else
        {
            row.Value = paused.ToString().ToLowerInvariant();
            row.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(ct);
    }

    private async Task<IActionResult> SetOrgActiveAsync(Guid id, bool active, CancellationToken ct)
    {
        var org = await _context.Tenants.IgnoreQueryFilters()
            .FirstOrDefaultAsync(t => t.Id == id, ct);
        if (org is null) return NotFound(new { message = "Organization not found." });

        org.IsActive = active;
        await _context.SaveChangesAsync(ct);
        return Ok(new { message = $"Organization {(active ? "resumed" : "paused")}." });
    }

    private async Task<IActionResult> SetAdminActiveAsync(Guid id, bool active, CancellationToken ct)
    {
        var admin = await _context.Users.IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == id && u.IsSuperAdmin, ct);
        if (admin is null) return NotFound(new { message = "Platform admin not found." });
        if (admin.IsMaster && !active)
            return BadRequest(new { message = "You cannot suspend this admin." });

        admin.IsActive = active;
        await _context.SaveChangesAsync(ct);
        return Ok(new { message = $"Platform admin {(active ? "resumed" : "paused")}." });
    }
}
