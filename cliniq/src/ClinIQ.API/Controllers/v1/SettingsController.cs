using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class SettingsController : ControllerBase
{
    [HttpGet("{section}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SettingsView)]
    public IActionResult GetSettings(string section)
    {
        var settings = section.ToLower() switch
        {
            "general" => (object)new
            {
                organizationName = "ClinIQ Hospital",
                phone = "+92-42-1234567",
                email = "info@cliniq.com",
                address = "123 Healthcare Avenue, Lahore, Pakistan",
                currency = "PKR",
                dateFormat = "dd/MM/yyyy",
                timezone = "Asia/Karachi",
                logoUrl = (string?)null
            },
            "appointments" => (object)new
            {
                slotDuration = 15,
                advanceBookingDays = 30,
                allowOnlineBooking = true,
                appointmentPrefix = "APT-",
                defaultConsultationFee = 2000.00,
                cancellationPolicy = "24 hours before appointment"
            },
            "billing" => (object)new
            {
                invoicePrefix = "INV-",
                defaultTax = 0.0,
                paymentDueDays = 30,
                allowPartialPayments = true,
                lateFeePercent = 2.5,
                currency = "PKR"
            },
            _ => (object)new { section, message = "Settings section not found" }
        };

        return Ok(Result<object>.Success(settings));
    }

    [HttpPut("{section}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SettingsEdit)]
    public IActionResult UpdateSettings(string section, [FromBody] object request)
    {
        return Ok(Result.Success("Settings saved"));
    }
}
