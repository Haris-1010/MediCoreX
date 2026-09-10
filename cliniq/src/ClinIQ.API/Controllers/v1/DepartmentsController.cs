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
public class DepartmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public DepartmentsController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DepartmentsView)]
    public async Task<IActionResult> GetDepartments()
    {
        var departments = await _context.Departments
            .Where(d => d.IsActive && !d.IsDeleted)
            .OrderBy(d => d.DisplayOrder)
            .Select(d => new
            {
                d.Id,
                d.Name,
                d.Code,
                d.Description,
                HeadOfDepartment = _context.Users.Where(u => u.Id == d.HeadOfDepartmentId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                d.IsActive
            })
            .ToListAsync();

        return Ok(Result<object[]>.Success(departments.ToArray()));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DepartmentsView)]
    public async Task<IActionResult> GetDepartment(Guid id)
    {
        var department = await _context.Departments
            .Where(d => d.Id == id && !d.IsDeleted)
            .Select(d => new
            {
                d.Id,
                d.Name,
                d.Code,
                d.Description,
                HeadOfDepartment = _context.Users.Where(u => u.Id == d.HeadOfDepartmentId).Select(u => u.FirstName + " " + u.LastName).FirstOrDefault(),
                d.IsActive
            })
            .FirstOrDefaultAsync();

        if (department == null)
            return NotFound(Result.Failure("Department not found"));

        return Ok(Result<object>.Success(department));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DepartmentsCreate)]
    public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var department = new Department
        {
            Name = request.Name,
            Code = request.Code,
            Description = request.Description,
            IsActive = true,
            DisplayOrder = _context.Departments.Count() + 1,
            TenantId = tenantId,
            BranchId = _tenantService.GetCurrentBranchId()
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { id = department.Id }));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DepartmentsEdit)]
    public async Task<IActionResult> UpdateDepartment(Guid id, [FromBody] CreateDepartmentRequest request)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null || department.IsDeleted)
            return NotFound(Result.Failure("Department not found"));

        department.Name = request.Name;
        department.Code = request.Code;
        department.Description = request.Description;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Department updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.DepartmentsDelete)]
    public async Task<IActionResult> DeleteDepartment(Guid id)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null || department.IsDeleted)
            return NotFound(Result.Failure("Department not found"));

        department.IsDeleted = true;
        department.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Department deleted successfully"));
    }
}

public record CreateDepartmentRequest(
    string Name,
    string Code,
    string? Description
);
