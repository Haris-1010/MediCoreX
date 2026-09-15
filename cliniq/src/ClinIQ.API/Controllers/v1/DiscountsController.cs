using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/discounts")]
[Authorize]
public class DiscountsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public DiscountsController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingView)]
    public async Task<IActionResult> GetDiscounts([FromQuery] bool? isActive = null)
    {
        var query = _context.Discounts.AsQueryable();

        if (isActive.HasValue)
            query = query.Where(d => d.IsActive == isActive.Value);

        var discounts = await query
            .OrderBy(d => d.Name)
            .Select(d => new
            {
                d.Id,
                d.Name,
                d.Description,
                d.Type,
                d.Value,
                d.IsActive
            })
            .ToListAsync();

        return Ok(Result<object[]>.Success(discounts.ToArray()));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingView)]
    public async Task<IActionResult> GetDiscount(Guid id)
    {
        var discount = await _context.Discounts
            .Where(d => d.Id == id)
            .Select(d => new
            {
                d.Id,
                d.Name,
                d.Description,
                d.Type,
                d.Value,
                d.IsActive
            })
            .FirstOrDefaultAsync();

        if (discount == null)
            return NotFound(Result.Failure("Discount not found"));

        return Ok(Result<object>.Success(discount));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingManageDiscounts)]
    public async Task<IActionResult> CreateDiscount([FromBody] CreateDiscountRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var discount = new Discount
        {
            Name = request.Name,
            Description = request.Description,
            Type = request.Type,
            Value = request.Value,
            IsActive = true,
            TenantId = tenantId
        };

        _context.Discounts.Add(discount);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { id = discount.Id }));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingManageDiscounts)]
    public async Task<IActionResult> UpdateDiscount(Guid id, [FromBody] CreateDiscountRequest request)
    {
        var discount = await _context.Discounts.FindAsync(id);
        if (discount == null)
            return NotFound(Result.Failure("Discount not found"));

        discount.Name = request.Name;
        discount.Description = request.Description;
        discount.Type = request.Type;
        discount.Value = request.Value;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Discount updated successfully"));
    }

    [HttpPut("{id:guid}/toggle")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingManageDiscounts)]
    public async Task<IActionResult> ToggleDiscount(Guid id)
    {
        var discount = await _context.Discounts.FindAsync(id);
        if (discount == null)
            return NotFound(Result.Failure("Discount not found"));

        discount.IsActive = !discount.IsActive;
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { id = discount.Id, isActive = discount.IsActive }));
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BillingManageDiscounts)]
    public async Task<IActionResult> DeleteDiscount(Guid id)
    {
        var discount = await _context.Discounts.FindAsync(id);
        if (discount == null)
            return NotFound(Result.Failure("Discount not found"));

        _context.Discounts.Remove(discount);
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Discount deleted successfully"));
    }
}

public record CreateDiscountRequest(
    string Name,
    string? Description,
    string Type,
    decimal Value
);
