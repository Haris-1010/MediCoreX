using System.Text;
using System.Text.Json;
using ClinIQ.API.Authorization;
using ClinIQ.Domain.Common;
using ClinIQ.Domain.Entities;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Constants;
using ClinIQ.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

/// <summary>
/// Read side of the system-wide audit trail.
///
/// Security model (backend is the authority — nothing from Angular is trusted):
///   - every row is filtered to the caller's tenant,
///   - a caller WITHOUT "All Locations" only ever sees rows for their current
///     location plus organization-level rows (BranchId IS NULL); a forged
///     locationId can therefore never widen the result set,
///   - a caller WITH "All Locations" may pick any location of their own tenant,
///   - export enforces the exact same predicates as the list.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class AuditLogsController : ControllerBase
{
    private const int MaxExportRows = 50000;

    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAuditService _auditService;

    public AuditLogsController(
        ApplicationDbContext context,
        ITenantService tenantService,
        ICurrentUserService currentUserService,
        IAuditService auditService)
    {
        _context = context;
        _tenantService = tenantService;
        _currentUserService = currentUserService;
        _auditService = auditService;
    }

    /// <summary>Server-side paged, filtered, sorted audit list.</summary>
    [HttpGet]
    [RequirePermission(Permissions.AuditView)]
    public async Task<IActionResult> GetAuditLogs(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] DateTime? dateFrom = null,
        [FromQuery] DateTime? dateTo = null,
        [FromQuery] Guid? userId = null,
        [FromQuery] Guid? locationId = null,
        [FromQuery] string? module = null,
        [FromQuery] string? action = null,
        [FromQuery] string? entityType = null,
        [FromQuery] string? entityId = null,
        [FromQuery] bool? success = null,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? sortBy = "timestamp",
        [FromQuery] bool sortDescending = true)
    {
        pageNumber = Math.Max(1, pageNumber);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var scoped = ApplyScope(locationId, out var scopeError);
        if (scoped is null)
            return StatusCode(StatusCodes.Status403Forbidden, Result.Failure(scopeError, "FORBIDDEN"));

        var query = ApplyFilters(scoped, dateFrom, dateTo, userId, module, action, entityType, entityId, success, searchTerm);
        query = ApplySort(query, sortBy, sortDescending);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new
            {
                a.Id,
                a.Timestamp,
                a.UserId,
                a.UserName,
                a.UserEmail,
                a.Module,
                a.Action,
                a.EntityType,
                a.EntityId,
                a.EntityName,
                a.Description,
                a.BranchId,
                a.LocationName,
                a.Success,
                a.FailureReason,
                a.IpAddress,
                a.RequestPath,
                a.RequestMethod,
                a.CorrelationId,
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new
        {
            items,
            totalCount,
            pageNumber,
            pageSize,
            totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            hasPreviousPage = pageNumber > 1,
            hasNextPage = pageNumber * pageSize < totalCount,
        }));
    }

    /// <summary>Full detail including field-level before/after changes.</summary>
    [HttpGet("{id:guid}")]
    [RequirePermission(Permissions.AuditView)]
    public async Task<IActionResult> GetAuditLog(Guid id)
    {
        var scoped = ApplyScope(null, out var scopeError);
        if (scoped is null)
            return StatusCode(StatusCodes.Status403Forbidden, Result.Failure(scopeError, "FORBIDDEN"));

        var log = await scoped.FirstOrDefaultAsync(a => a.Id == id);
        if (log is null)
            return NotFound(Result.Failure("Audit log not found.", "NOT_FOUND"));

        var oldValues = DeserializeObject(log.OldValues);
        var newValues = DeserializeObject(log.NewValues);

        var fieldNames = new List<string>();
        foreach (var key in oldValues.Keys) fieldNames.Add(key);
        foreach (var key in newValues.Keys)
            if (!oldValues.ContainsKey(key))
                fieldNames.Add(key);

        var changes = fieldNames
            .Select(field => new
            {
                field,
                before = oldValues.TryGetValue(field, out var before) ? before : null,
                after = newValues.TryGetValue(field, out var after) ? after : null,
            })
            .ToList();

        return Ok(Result<object>.Success(new
        {
            log.Id,
            log.Timestamp,
            log.TenantId,
            log.UserId,
            log.UserName,
            log.UserEmail,
            log.Module,
            log.Action,
            log.EntityType,
            log.EntityId,
            log.EntityName,
            log.Description,
            log.BranchId,
            log.LocationName,
            log.Success,
            log.FailureReason,
            log.IpAddress,
            log.UserAgent,
            log.RequestPath,
            log.RequestMethod,
            log.CorrelationId,
            log.Notes,
            changes,
        }));
    }

    /// <summary>
    /// CSV export. Same tenant/location/permission rules as the list, capped at
    /// 50 000 rows so an export can never become an unbounded table scan, and
    /// the export itself is audited (REPORT_EXPORTED).
    /// </summary>
    [HttpGet("export")]
    [RequirePermission(Permissions.AuditView, Permissions.AuditExport)]
    public async Task<IActionResult> ExportAuditLogs(
        [FromQuery] DateTime? dateFrom = null,
        [FromQuery] DateTime? dateTo = null,
        [FromQuery] Guid? userId = null,
        [FromQuery] Guid? locationId = null,
        [FromQuery] string? module = null,
        [FromQuery] string? action = null,
        [FromQuery] string? entityType = null,
        [FromQuery] string? entityId = null,
        [FromQuery] bool? success = null,
        [FromQuery] string? searchTerm = null)
    {
        var scoped = ApplyScope(locationId, out var scopeError);
        if (scoped is null)
            return StatusCode(StatusCodes.Status403Forbidden, Result.Failure(scopeError, "FORBIDDEN"));

        var query = ApplyFilters(scoped, dateFrom, dateTo, userId, module, action, entityType, entityId, success, searchTerm);

        var rows = await query
            .OrderByDescending(a => a.Timestamp)
            .Take(MaxExportRows)
            .Select(a => new
            {
                a.Timestamp,
                UserName = a.UserName ?? "",
                UserEmail = a.UserEmail ?? "",
                a.Module,
                a.Action,
                EntityType = a.EntityType ?? "",
                EntityId = a.EntityId ?? "",
                EntityName = a.EntityName ?? "",
                Description = a.Description ?? "",
                Location = a.LocationName ?? "",
                Success = a.Success == null ? "" : (a.Success == true ? "Success" : "Failure"),
                FailureReason = a.FailureReason ?? "",
                a.IpAddress,
                a.RequestPath,
                a.RequestMethod,
                a.CorrelationId,
            })
            .ToListAsync();

        var csv = new StringBuilder();
        csv.AppendLine("Timestamp,User,Email,Module,Action,Entity,Entity ID,Entity Name,Description,Location,Status,Failure Reason,IP Address,Path,Method,Correlation ID");
        foreach (var row in rows)
        {
            csv.Append(Csv(row.Timestamp.ToString("yyyy-MM-dd HH:mm:ss"))).Append(',');
            csv.Append(Csv(row.UserName)).Append(',');
            csv.Append(Csv(row.UserEmail)).Append(',');
            csv.Append(Csv(row.Module)).Append(',');
            csv.Append(Csv(row.Action)).Append(',');
            csv.Append(Csv(row.EntityType)).Append(',');
            csv.Append(Csv(row.EntityId)).Append(',');
            csv.Append(Csv(row.EntityName)).Append(',');
            csv.Append(Csv(row.Description)).Append(',');
            csv.Append(Csv(row.Location)).Append(',');
            csv.Append(Csv(row.Success)).Append(',');
            csv.Append(Csv(row.FailureReason)).Append(',');
            csv.Append(Csv(row.IpAddress)).Append(',');
            csv.Append(Csv(row.RequestPath)).Append(',');
            csv.Append(Csv(row.RequestMethod)).Append(',');
            csv.Append(Csv(row.CorrelationId)).AppendLine();
        }

        await _auditService.LogAsync(new AuditEvent
        {
            Action = "REPORT_EXPORTED",
            Module = "Audit",
            EntityName = "Audit Activity Report",
            Description = $"Audit activity report exported ({rows.Count} rows)",
            BranchSpecified = true,
            BranchId = locationId,
            Success = true,
            AdditionalData = JsonSerializer.Serialize(new
            {
                dateFrom,
                dateTo,
                userId,
                locationId,
                module,
                action,
                entityType,
                entityId,
                success,
                searchTerm,
                rowCount = rows.Count,
            }),
        });

        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csv.ToString())).ToArray();
        return File(bytes, "text/csv", $"audit-logs-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv");
    }

    // ------------------------------------------------------------------
    // Security + filtering helpers
    // ------------------------------------------------------------------

    /// <summary>
    /// Tenant + location authorization. Returns NULL (with an error message)
    /// when the caller may not run the query. Non-"All Locations" callers are
    /// pinned to their current location and organization-level rows, so a
    /// forged locationId can only ever narrow, never widen, the scope.
    /// </summary>
    private IQueryable<AuditLog>? ApplyScope(Guid? requestedLocationId, out string error)
    {
        error = string.Empty;

        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
        {
            error = "No organization context.";
            return null;
        }

        var query = _context.AuditLogs.Where(a => a.TenantId == tenantId);

        if (_tenantService.HasAllLocationAccess())
        {
            if (requestedLocationId.HasValue)
            {
                // Must be a real, non-deleted branch of the caller's tenant.
                var belongsToTenant = _context.Branches
                    .IgnoreQueryFilters()
                    .Any(b => b.Id == requestedLocationId.Value
                              && b.TenantId == tenantId
                              && !b.IsDeleted);

                if (!belongsToTenant)
                {
                    error = "You do not have access to this location.";
                    return null;
                }

                return query.Where(a => a.BranchId == requestedLocationId.Value);
            }

            return query;
        }

        // Scoped caller: their current location plus organization-level rows.
        var currentBranchId = _tenantService.GetCurrentBranchId();
        return query.Where(a => a.BranchId == null || a.BranchId == currentBranchId);
    }

    private static IQueryable<AuditLog> ApplyFilters(
        IQueryable<AuditLog> query,
        DateTime? dateFrom,
        DateTime? dateTo,
        Guid? userId,
        string? module,
        string? action,
        string? entityType,
        string? entityId,
        bool? success,
        string? searchTerm)
    {
        if (dateFrom.HasValue)
        {
            var from = dateFrom.Value.Date;
            query = query.Where(a => a.Timestamp >= from);
        }

        if (dateTo.HasValue)
        {
            var toExclusive = dateTo.Value.Date.AddDays(1);
            query = query.Where(a => a.Timestamp < toExclusive);
        }

        if (userId.HasValue)
            query = query.Where(a => a.UserId == userId.Value);

        if (!string.IsNullOrWhiteSpace(module))
            query = query.Where(a => a.Module == module);

        if (!string.IsNullOrWhiteSpace(action))
            query = query.Where(a => a.Action == action);

        if (!string.IsNullOrWhiteSpace(entityType))
            query = query.Where(a => a.EntityType == entityType);

        if (!string.IsNullOrWhiteSpace(entityId))
            query = query.Where(a => a.EntityId == entityId);

        if (success.HasValue)
            query = query.Where(a => a.Success == success.Value);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(a =>
                (a.Description != null && a.Description.ToLower().Contains(term)) ||
                (a.UserName != null && a.UserName.ToLower().Contains(term)) ||
                (a.UserEmail != null && a.UserEmail.ToLower().Contains(term)) ||
                (a.EntityName != null && a.EntityName.ToLower().Contains(term)) ||
                (a.EntityId != null && a.EntityId.ToLower().Contains(term)) ||
                a.Action.ToLower().Contains(term) ||
                a.Module.ToLower().Contains(term));
        }

        return query;
    }

    private static IQueryable<AuditLog> ApplySort(IQueryable<AuditLog> query, string? sortBy, bool descending)
    {
        var key = sortBy?.Trim().ToLowerInvariant();
        return key switch
        {
            "action" => descending ? query.OrderByDescending(a => a.Action) : query.OrderBy(a => a.Action),
            "module" => descending ? query.OrderByDescending(a => a.Module) : query.OrderBy(a => a.Module),
            "user" => descending ? query.OrderByDescending(a => a.UserName) : query.OrderBy(a => a.UserName),
            "entity" => descending ? query.OrderByDescending(a => a.EntityName) : query.OrderBy(a => a.EntityName),
            "success" => descending ? query.OrderByDescending(a => a.Success) : query.OrderBy(a => a.Success),
            _ => descending ? query.OrderByDescending(a => a.Timestamp) : query.OrderBy(a => a.Timestamp),
        };
    }

    private static Dictionary<string, string?> DeserializeObject(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return new Dictionary<string, string?>();

        try
        {
            using var document = JsonDocument.Parse(json);
            if (document.RootElement.ValueKind != JsonValueKind.Object)
                return new Dictionary<string, string?>();

            var result = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);
            foreach (var property in document.RootElement.EnumerateObject())
                result[property.Name] = property.Value.ValueKind == JsonValueKind.String
                    ? property.Value.GetString()
                    : property.Value.GetRawText();
            return result;
        }
        catch (JsonException)
        {
            return new Dictionary<string, string?>();
        }
    }

    private static string Csv(string? value)
    {
        value ??= string.Empty;
        if (value.Contains('"') || value.Contains(',') || value.Contains('\n') || value.Contains('\r'))
            return "\"" + value.Replace("\"", "\"\"") + "\"";
        return value;
    }
}
