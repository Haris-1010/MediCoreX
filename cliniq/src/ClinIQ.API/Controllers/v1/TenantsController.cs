using ClinIQ.API.Authorization;
using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class TenantsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;
    private readonly IWebHostEnvironment _environment;

    public TenantsController(ApplicationDbContext context, ITenantService tenantService, IWebHostEnvironment environment)
    {
        _context = context;
        _tenantService = tenantService;
        _environment = environment;
    }

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentTenant()
    {
        var tenant = await ResolveCurrentTenantAsync();
        if (tenant == null)
            return Ok(Result<object>.Success(new { id = (Guid?)null, name = "MediCoreX Hospital", slug = "medicorex-hospital", isActive = true }));

        return Ok(Result<object>.Success(new
        {
            tenant.Id,
            tenant.Name,
            tenant.Slug,
            tenant.LogoUrl,
            tenant.Website,
            tenant.Email,
            tenant.Phone,
            tenant.Address,
            tenant.City,
            tenant.State,
            tenant.Country,
            tenant.PostalCode,
            tenant.Currency,
            tenant.Timezone,
            tenant.IsActive
        }));
    }

    [HttpPut("current")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OrganizationBranding)]
    public async Task<IActionResult> UpdateBranding([FromBody] OrganizationBrandingRequest request)
    {
        var tenant = await ResolveCurrentTenantAsync();
        if (tenant == null)
            return NotFound(Result.Failure("No active organization found"));

        tenant.Name = request.Name?.Trim() ?? tenant.Name;
        tenant.LogoUrl = request.LogoUrl?.Trim();
        tenant.Website = request.Website?.Trim();
        tenant.Email = request.Email?.Trim();
        tenant.Phone = request.Phone?.Trim();
        tenant.Address = request.Address?.Trim();
        tenant.City = request.City?.Trim();
        tenant.State = request.State?.Trim();
        tenant.Country = request.Country?.Trim();
        tenant.PostalCode = request.PostalCode?.Trim();
        tenant.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Organization branding updated"));
    }

    [HttpPost("current/logo")]
    [Consumes("multipart/form-data")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.OrganizationBranding)]
    public async Task<IActionResult> UploadLogo(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(Result.Failure("No file uploaded"));

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            return BadRequest(Result.Failure("Invalid file type. Allowed: " + string.Join(", ", allowedExtensions)));

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(Result.Failure("File size must be less than 5MB"));

        var tenant = await ResolveCurrentTenantAsync();
        if (tenant == null)
            return NotFound(Result.Failure("No active organization found"));

        using (var memory = new MemoryStream())
        {
            await file.CopyToAsync(memory);
            tenant.LogoData = memory.ToArray();
        }

        tenant.LogoContentType = GetImageContentType(extension);
        tenant.LogoUrl = $"/api/v1/tenants/{tenant.Id}/logo?v={DateTime.UtcNow:yyyyMMddHHmmssfff}";
        tenant.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { logoUrl = tenant.LogoUrl }, "Logo uploaded successfully"));
    }

    [HttpGet("{id:guid}/logo")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTenantLogo(Guid id)
    {
        var tenant = await _context.Tenants
            .IgnoreQueryFilters().AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);

        if (tenant?.LogoData == null || tenant.LogoData.Length == 0)
            return NotFound();

        return File(tenant.LogoData, tenant.LogoContentType ?? "image/png");
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SettingsView)]
    public async Task<IActionResult> GetTenants()
    {
        var tenant = await ResolveCurrentTenantAsync();
        if (tenant == null)
            return Ok(Result<object[]>.Success(Array.Empty<object>()));

        return Ok(Result<object[]>.Success(new object[]
        {
            new { tenant.Id, tenant.Name, tenant.Slug, tenant.IsActive }
        }));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SettingsView)]
    public async Task<IActionResult> GetTenant(Guid id)
    {
        var currentTenantId = _tenantService.GetCurrentTenantId();
        if (currentTenantId is null || currentTenantId.Value != id)
            return NotFound(Result.Failure("Tenant not found"));

        var tenant = await _context.Tenants
            .Where(t => t.Id == id && !t.IsDeleted)
            .Select(t => new { t.Id, t.Name, t.Slug, t.IsActive })
            .FirstOrDefaultAsync();

        if (tenant == null)
            return NotFound(Result.Failure("Tenant not found"));

        return Ok(Result<object>.Success(tenant));
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

    private async Task<Tenant?> ResolveCurrentTenantAsync()
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (!tenantId.HasValue)
        {
            // Fail closed — never fall back to an arbitrary organization.
            return null;
        }

        return await _context.Tenants
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(t => t.Id == tenantId.Value && !t.IsDeleted);
    }
}

public record OrganizationBrandingRequest(
    string? Name,
    string? LogoUrl,
    string? Website,
    string? Email,
    string? Phone,
    string? Address,
    string? City,
    string? State,
    string? Country,
    string? PostalCode
);