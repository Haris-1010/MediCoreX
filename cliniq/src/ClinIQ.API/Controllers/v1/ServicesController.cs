using ClinIQ.Application.Interfaces;
using ClinIQ.API.Authorization;
using ClinIQ.Shared.Constants;
using ClinIQ.Shared.DTOs.Billing;
using ClinIQ.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ServicesController : ControllerBase
{
    private readonly IServiceService _serviceService;

    public ServicesController(IServiceService serviceService)
    {
        _serviceService = serviceService;
    }

    [HttpGet]
    [RequirePermission(Permissions.ServicesView)]
    public async Task<IActionResult> GetServices(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] Guid? departmentId = null,
        [FromQuery] bool? isActive = null,
        [FromQuery] int? type = null,
        CancellationToken ct = default)
    {
        var query = new ServiceQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            SearchTerm = searchTerm,
            CategoryId = categoryId,
            DepartmentId = departmentId,
            IsActive = isActive,
            Type = type
        };

        var result = await _serviceService.GetServicesPaginatedAsync(query, ct);
        return Ok(result);
    }

    [HttpGet("active")]
    [RequirePermission(Permissions.ServicesView)]
    public async Task<IActionResult> GetActiveServices([FromQuery] int? type = null, CancellationToken ct = default)
    {
        var result = await _serviceService.GetActiveServicesAsync(type, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(Permissions.ServicesView)]
    public async Task<IActionResult> GetService(Guid id, CancellationToken ct = default)
    {
        var result = await _serviceService.GetServiceByIdAsync(id, ct);
        if (!result.Succeeded)
            return NotFound(result);
        return Ok(result);
    }

    [HttpGet("category/{categoryId:guid}")]
    [RequirePermission(Permissions.ServicesView)]
    public async Task<IActionResult> GetServicesByCategory(Guid categoryId, CancellationToken ct = default)
    {
        var result = await _serviceService.GetServicesByCategoryAsync(categoryId, ct);
        return Ok(result);
    }

    [HttpPost]
    [RequirePermission(Permissions.ServicesCreate)]
    public async Task<IActionResult> CreateService([FromBody] CreateServiceRequest request, CancellationToken ct = default)
    {
        if (!ModelState.IsValid)
            return BadRequest(Result.ValidationFailure(ModelState.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>())));

        var result = await _serviceService.CreateServiceAsync(request, ct);
        if (!result.Succeeded)
            return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(Permissions.ServicesEdit)]
    public async Task<IActionResult> UpdateService(Guid id, [FromBody] UpdateServiceRequest request, CancellationToken ct = default)
    {
        if (!ModelState.IsValid)
            return BadRequest(Result.ValidationFailure(ModelState.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>())));

        var result = await _serviceService.UpdateServiceAsync(id, request, ct);
        if (!result.Succeeded)
            return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(Permissions.ServicesDelete)]
    public async Task<IActionResult> DeleteService(Guid id, CancellationToken ct = default)
    {
        var result = await _serviceService.DeleteServiceAsync(id, ct);
        if (!result.Succeeded)
            return BadRequest(result);
        return Ok(result);
    }

    [HttpPatch("{id:guid}/status")]
    [RequirePermission(Permissions.ServicesEdit)]
    public async Task<IActionResult> ToggleServiceStatus(Guid id, [FromBody] bool isActive, CancellationToken ct = default)
    {
        var result = await _serviceService.ToggleServiceStatusAsync(id, isActive, ct);
        if (!result.Succeeded)
            return BadRequest(result);
        return Ok(result);
    }
}

[ApiController]
[Route("api/v1/service-categories")]
[Authorize]
public class ServiceCategoriesController : ControllerBase
{
    private readonly IServiceService _serviceService;

    public ServiceCategoriesController(IServiceService serviceService)
    {
        _serviceService = serviceService;
    }

    [HttpGet]
    [RequirePermission(Permissions.ServicesView)]
    public async Task<IActionResult> GetCategories(CancellationToken ct = default)
    {
        var result = await _serviceService.GetCategoriesAsync(ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(Permissions.ServicesView)]
    public async Task<IActionResult> GetCategory(Guid id, CancellationToken ct = default)
    {
        var result = await _serviceService.GetCategoryByIdAsync(id, ct);
        if (!result.Succeeded)
            return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [RequirePermission(Permissions.ServicesCreate)]
    public async Task<IActionResult> CreateCategory([FromBody] CreateServiceCategoryRequest request, CancellationToken ct = default)
    {
        if (!ModelState.IsValid)
            return BadRequest(Result.ValidationFailure(ModelState.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>())));

        var result = await _serviceService.CreateCategoryAsync(request, ct);
        if (!result.Succeeded)
            return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(Permissions.ServicesEdit)]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateServiceCategoryRequest request, CancellationToken ct = default)
    {
        if (!ModelState.IsValid)
            return BadRequest(Result.ValidationFailure(ModelState.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>())));

        var result = await _serviceService.UpdateCategoryAsync(id, request, ct);
        if (!result.Succeeded)
            return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(Permissions.ServicesDelete)]
    public async Task<IActionResult> DeleteCategory(Guid id, CancellationToken ct = default)
    {
        var result = await _serviceService.DeleteCategoryAsync(id, ct);
        if (!result.Succeeded)
            return BadRequest(result);
        return Ok(result);
    }
}
