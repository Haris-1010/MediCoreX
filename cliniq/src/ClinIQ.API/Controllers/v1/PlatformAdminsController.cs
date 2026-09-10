using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.DTOs.Platform;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/platform/admins")]
[Authorize]
public class PlatformAdminsController : ControllerBase
{
    private readonly ApplicationDbContext context;

    public PlatformAdminsController(ApplicationDbContext context)
    {
        this.context = context;
    }

    private bool IsSuperAdmin => User.FindFirst("is_super_admin")?.Value == "true";

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken cancellationToken)
    {
        if (!IsSuperAdmin) return Forbid();

        var admins = await context.Users
            .IgnoreQueryFilters()
            .AsNoTracking()
            .Where(user => user.IsSuperAdmin && !user.IsDeleted)
            .OrderBy(user => user.FirstName)
            .Select(user => new PlatformAdminListItem(
                user.Id, user.FirstName, user.LastName, user.Email, user.PhoneNumber,
                user.IsActive, user.LastLoginAt, user.CreatedAt))
            .ToListAsync(cancellationToken);

        return Ok(admins);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreatePlatformAdminRequest request,
        CancellationToken cancellationToken)
    {
        if (!IsSuperAdmin) return Forbid();
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
            return BadRequest(new { message = "Password must be at least 8 characters." });

        var email = request.Email.Trim();
        if (await context.Users.IgnoreQueryFilters().AnyAsync(user => user.Email == email, cancellationToken))
            return Conflict(new { message = "A user with this email already exists." });

        var user = new ApplicationUser
        {
            Email = email,
            NormalizedEmail = email.ToUpperInvariant(),
            EmailConfirmed = true,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            PhoneNumber = request.Phone,
            IsActive = true,
            IsSuperAdmin = true,
            MustChangePassword = true
        };

        context.Users.Add(user);
        await context.SaveChangesAsync(cancellationToken);

        return Ok(new CreatePlatformAdminResponse(user.Id, user.FullName, user.Email, request.Password));
    }

    [HttpPost("{id:guid}/suspend")]
    public async Task<IActionResult> Suspend(Guid id, CancellationToken cancellationToken)
    {
        return await SetActive(id, false, cancellationToken);
    }

    [HttpPost("{id:guid}/activate")]
    public async Task<IActionResult> Activate(Guid id, CancellationToken cancellationToken)
    {
        return await SetActive(id, true, cancellationToken);
    }

    private async Task<IActionResult> SetActive(Guid id, bool active, CancellationToken cancellationToken)
    {
        if (!IsSuperAdmin) return Forbid();

        var user = await context.Users.IgnoreQueryFilters().FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (user is null || !user.IsSuperAdmin) return NotFound(new { message = "Platform admin not found." });

        user.IsActive = active;
        await context.SaveChangesAsync(cancellationToken);
        return Ok(new { message = active ? "Platform admin activated." : "Platform admin suspended." });
    }
}
