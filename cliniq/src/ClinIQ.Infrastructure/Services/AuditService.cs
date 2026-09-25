using System.Text.Json;
using ClinIQ.Domain.Common;
using ClinIQ.Domain.Entities;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ClinIQ.Infrastructure.Services;

/// <summary>
/// Writes explicit business-level audit events. Uses its own DI scope (and
/// therefore its own DbContext) so an audit write can never flush, corrupt or
/// recurse into the caller's pending changes — the automatic change-tracker
/// capture inside SaveChanges skips AuditLog rows by policy.
/// </summary>
public class AuditService : IAuditService
{
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = false };

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ITenantService _tenantService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeService _dateTimeService;

    public AuditService(
        IServiceScopeFactory scopeFactory,
        ITenantService tenantService,
        ICurrentUserService currentUserService,
        IDateTimeService dateTimeService)
    {
        _scopeFactory = scopeFactory;
        _tenantService = tenantService;
        _currentUserService = currentUserService;
        _dateTimeService = dateTimeService;
    }

    public async Task LogAsync(AuditEvent auditEvent, CancellationToken cancellationToken = default)
    {
        var info = AuditContext.Info;

        var tenantId = auditEvent.TenantId ?? _tenantService.GetCurrentTenantId();
        var branchId = auditEvent.BranchSpecified
            ? auditEvent.BranchId
            : _tenantService.GetCurrentBranchId();

        var ambientUserId = _currentUserService.UserId;
        var userId = auditEvent.UserId ?? ambientUserId;

        string? userName = auditEvent.UserName;
        string? userEmail = auditEvent.UserEmail;
        if (userName is null && userId.HasValue && userId == ambientUserId)
            userName = _currentUserService.FullName;
        if (userEmail is null && userId.HasValue && userId == ambientUserId)
            userEmail = _currentUserService.Email;

        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var locationName = auditEvent.LocationName;
        if (locationName is null && branchId.HasValue)
            locationName = await db.Branches
                .IgnoreQueryFilters()
                .Where(b => b.Id == branchId.Value)
                .Select(b => b.Name)
                .FirstOrDefaultAsync(cancellationToken);

        db.AuditLogs.Add(new AuditLog
        {
            TenantId = tenantId,
            BranchId = branchId,
            LocationName = locationName,
            UserId = userId,
            UserEmail = userEmail,
            UserName = userName,
            Action = auditEvent.Action,
            Module = auditEvent.Module,
            EntityType = auditEvent.EntityName,
            EntityId = auditEvent.EntityId,
            EntityName = auditEvent.EntityName,
            Description = auditEvent.Description,
            OldValues = auditEvent.OldValues,
            NewValues = auditEvent.NewValues,
            AffectedColumns = auditEvent.ChangedFields,
            Success = auditEvent.Success,
            FailureReason = auditEvent.FailureReason,
            Notes = auditEvent.Notes,
            AdditionalData = auditEvent.AdditionalData,
            IpAddress = info?.IpAddress,
            UserAgent = info?.UserAgent,
            RequestPath = info?.RequestPath,
            RequestMethod = info?.RequestMethod,
            CorrelationId = info?.CorrelationId,
            Timestamp = _dateTimeService.UtcNow,
        });

        await db.SaveChangesAsync(cancellationToken);
    }

    /// <summary>Small helper for events that serialise filter payloads.</summary>
    public static string ToJson(object value) => JsonSerializer.Serialize(value, JsonOptions);
}
