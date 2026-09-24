using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly Domain.Interfaces.ITenantService _tenantService;

    public SettingsController(ApplicationDbContext context, Domain.Interfaces.ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    private static Dictionary<string, object>? ParseSettings(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;
        try
        {
            var doc = JsonDocument.Parse(json);
            var dict = new Dictionary<string, object>();
            foreach (var prop in doc.RootElement.EnumerateObject())
            {
                dict[prop.Name] = prop.Value.ValueKind switch
                {
                    JsonValueKind.String => prop.Value.GetString() ?? "",
                    JsonValueKind.Number => prop.Value.GetDecimal(),
                    JsonValueKind.True => true,
                    JsonValueKind.False => false,
                    JsonValueKind.Null => "",
                    _ => prop.Value.ToString()
                };
            }
            return dict;
        }
        catch { return null; }
    }

    private static string SerializeSettings(Dictionary<string, object> dict)
    {
        return JsonSerializer.Serialize(dict, new JsonSerializerOptions { WriteIndented = false });
    }

    [HttpGet("{section}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SettingsView)]
    public async Task<IActionResult> GetSettings(string section)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return Ok(Result<object>.Success(new { }));

        var tenant = await _context.Tenants
            .FirstOrDefaultAsync(t => t.Id == tenantId.Value);

        if (tenant is null)
            return Ok(Result<object>.Success(new { }));

        var savedSettings = ParseSettings(tenant.Settings) ?? new Dictionary<string, object>();
        var sectionLower = section.ToLower();
        object settings = sectionLower switch
        {
            "general" => new
            {
                organizationName = tenant.Name,
                phone = tenant.Phone ?? "",
                email = tenant.Email ?? "",
                address = tenant.Address ?? "",
                currency = tenant.Currency ?? "USD",
                dateFormat = "dd/MM/yyyy",
                timezone = tenant.Timezone ?? "UTC",
                logoUrl = tenant.LogoUrl
            },
            "billing" => new
            {
                invoicePrefix = savedSettings.ContainsKey("invoicePrefix") ? savedSettings["invoicePrefix"]?.ToString() ?? "INV-" : "INV-",
                defaultTax = savedSettings.ContainsKey("defaultTax") ? Convert.ToDecimal(savedSettings["defaultTax"]) : 0.0m,
                paymentDueDays = savedSettings.ContainsKey("paymentDueDays") ? Convert.ToInt32(savedSettings["paymentDueDays"]) : 30,
                allowPartialPayments = savedSettings.ContainsKey("allowPartialPayments") ? Convert.ToBoolean(savedSettings["allowPartialPayments"]) : true,
                lateFeePercent = savedSettings.ContainsKey("lateFeePercent") ? Convert.ToDecimal(savedSettings["lateFeePercent"]) : 2.5m,
                currency = tenant.Currency ?? "USD"
            },
            _ => (object)new { section, message = "Settings section not found" }
        };

        return Ok(Result<object>.Success(settings));
    }

    [HttpPut("{section}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SettingsEdit)]
    public async Task<IActionResult> UpdateSettings(string section, [FromBody] Dictionary<string, string> request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        var tenant = await _context.Tenants
            .FirstOrDefaultAsync(t => t.Id == tenantId.Value);

        if (tenant is null)
            return NotFound(Result.Failure("Organization not found."));

        var sectionLower = section.ToLower();
        if (sectionLower == "general")
        {
            if (request.TryGetValue("currency", out var currency))
                tenant.Currency = currency.ToString() ?? "USD";
            if (request.TryGetValue("timezone", out var tz))
                tenant.Timezone = tz.ToString() ?? "UTC";
            if (request.TryGetValue("phone", out var phone))
                tenant.Phone = phone.ToString();
            if (request.TryGetValue("email", out var email))
                tenant.Email = email.ToString();
            if (request.TryGetValue("address", out var addr))
                tenant.Address = addr.ToString();
            if (request.TryGetValue("organizationName", out var name))
                tenant.Name = name.ToString() ?? tenant.Name;
        }
        else if (sectionLower == "billing")
        {
            if (request.TryGetValue("currency", out var currency))
                tenant.Currency = currency.ToString() ?? "USD";

            var savedSettings = ParseSettings(tenant.Settings) ?? new Dictionary<string, object>();
            if (request.TryGetValue("invoicePrefix", out var prefix))
                savedSettings["invoicePrefix"] = prefix.ToString() ?? "INV-";
            if (request.TryGetValue("defaultTax", out var tax))
                savedSettings["defaultTax"] = tax.ToString() ?? "0";
            if (request.TryGetValue("paymentDueDays", out var days))
                savedSettings["paymentDueDays"] = days.ToString() ?? "30";
            if (request.TryGetValue("allowPartialPayments", out var partial))
                savedSettings["allowPartialPayments"] = partial.ToString() ?? "true";
            if (request.TryGetValue("lateFeePercent", out var lateFee))
                savedSettings["lateFeePercent"] = lateFee.ToString() ?? "2.5";
            tenant.Settings = SerializeSettings(savedSettings);
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Settings saved successfully"));
    }
}
