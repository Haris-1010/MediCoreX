using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class BranchesController : ControllerBase
{
    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SettingsView)]
    public IActionResult GetBranches()
    {
        return Ok(Result<object[]>.Success(new object[]
        {
            new { id = Guid.NewGuid(), name = "Main Branch - Lahore", address = "123 Healthcare Avenue, Lahore", phone = "+92-42-1234567", isPrimary = true },
            new { id = Guid.NewGuid(), name = "Downtown Clinic", address = "45 Mall Road, Lahore", phone = "+92-42-7654321", isPrimary = false }
        }));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SettingsView)]
    public IActionResult GetBranch(Guid id)
    {
        return Ok(Result<object>.Success(new { id, name = "Main Branch - Lahore", address = "123 Healthcare Avenue, Lahore", phone = "+92-42-1234567", isPrimary = true }));
    }
}
