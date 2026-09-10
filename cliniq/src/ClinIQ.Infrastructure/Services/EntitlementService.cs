using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Constants;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace ClinIQ.Infrastructure.Services;

/// <summary>
/// Resolves what an organization is entitled to use based on explicitly
/// configured TenantEntitlement rows. No package tiers — just module toggles.
/// </summary>
public class EntitlementService : IEntitlementService
{
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(10);

    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;
    private readonly IMemoryCache _cache;

    public EntitlementService(
        ApplicationDbContext context,
        ITenantService tenantService,
        IMemoryCache cache)
    {
        _context = context;
        _tenantService = tenantService;
        _cache = cache;
    }

    private static string CacheKey(Guid tenantId) => $"entitlements:{tenantId:N}";

    private Guid RequireTenant() =>
        _tenantService.GetCurrentTenantId()
        ?? throw new InvalidOperationException("No tenant in the current request context.");

    public async Task<IReadOnlySet<string>> GetEnabledFeaturesAsync(
        Guid tenantId, CancellationToken cancellationToken = default)
    {
        if (_cache.TryGetValue<IReadOnlySet<string>>(CacheKey(tenantId), out var cached) && cached is not null)
            return cached;

        var tenant = await _context.Tenants
            .IgnoreQueryFilters().AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == tenantId, cancellationToken);

        if (tenant is null || !tenant.IsActive)
        {
            IReadOnlySet<string> none = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            _cache.Set(CacheKey(tenantId), none, CacheTtl);
            return none;
        }

        var now = DateTime.UtcNow;
        var explicitRows = await _context.TenantEntitlements
            .IgnoreQueryFilters().AsNoTracking()
            .Where(e => e.TenantId == tenantId && e.IsEnabled && !e.IsDeleted && (e.ExpiresAt == null || e.ExpiresAt > now))
            .Select(e => e.Feature)
            .ToListAsync(cancellationToken);

        var features = explicitRows.Count > 0
            ? explicitRows.ToHashSet(StringComparer.OrdinalIgnoreCase)
            : GetAllFeatures();

        IReadOnlySet<string> result = features;
        _cache.Set(CacheKey(tenantId), result, CacheTtl);
        return result;
    }

    private static HashSet<string> GetAllFeatures()
    {
        return PermissionCatalog.PrefixToFeature.Values
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    public async Task<bool> CanAccessModuleAsync(string module, CancellationToken cancellationToken = default)
    {
        var features = await GetEnabledFeaturesAsync(RequireTenant(), cancellationToken);
        return features.Contains(module);
    }

    public Task<bool> HasFeatureAsync(string feature, CancellationToken cancellationToken = default)
        => CanAccessModuleAsync(feature, cancellationToken);

    public async Task<int> GetLimitAsync(string limitType, CancellationToken cancellationToken = default)
    {
        var tenantId = RequireTenant();

        var explicitLimit = await _context.TenantLimits
            .IgnoreQueryFilters().AsNoTracking()
            .Where(l => l.TenantId == tenantId && l.LimitType == limitType && !l.IsDeleted)
            .Select(l => (int?)l.MaxValue)
            .FirstOrDefaultAsync(cancellationToken);

        if (explicitLimit.HasValue)
            return explicitLimit.Value;

        return -1;
    }

    public async Task<bool> IsWithinLimitAsync(string limitType, int currentCount, CancellationToken cancellationToken = default)
    {
        var limit = await GetLimitAsync(limitType, cancellationToken);
        return limit < 0 || currentCount < limit;
    }

    public async Task<bool> IsSubscriptionActiveAsync(CancellationToken cancellationToken = default)
    {
        var tenantId = RequireTenant();
        var tenant = await _context.Tenants.IgnoreQueryFilters().AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == tenantId, cancellationToken);
        return tenant is not null && tenant.IsActive;
    }

    public void Invalidate(Guid tenantId) => _cache.Remove(CacheKey(tenantId));
}
