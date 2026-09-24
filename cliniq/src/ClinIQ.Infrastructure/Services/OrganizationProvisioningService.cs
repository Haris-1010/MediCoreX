using System.Security.Cryptography;
using ClinIQ.Application.Interfaces;
using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Constants;
using ClinIQ.Shared.DTOs.Platform;
using ClinIQ.Shared.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ClinIQ.Infrastructure.Services;

/// <summary>
/// Organization creation workflow. Creates tenant, entitlements, limits, role
/// templates, master user, ownership link, and first branch in one transaction.
/// No subscription packages or trial periods — just module-based entitlements.
/// </summary>
public class OrganizationProvisioningService : IOrganizationProvisioningService
{
    private readonly ApplicationDbContext _context;
    private readonly IEntitlementService _entitlements;
    private readonly IPermissionService _permissions;
    private readonly ILogger<OrganizationProvisioningService> _logger;

    public OrganizationProvisioningService(
        ApplicationDbContext context,
        IEntitlementService entitlements,
        IPermissionService permissions,
        ILogger<OrganizationProvisioningService> logger)
    {
        _context = context;
        _entitlements = entitlements;
        _permissions = permissions;
        _logger = logger;
    }

    public async Task<Result<CreateOrganizationResponse>> CreateAsync(
        CreateOrganizationRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<CreateOrganizationResponse>.Failure("Organization name is required.");

        if (string.IsNullOrWhiteSpace(request.MasterUser.Email))
            return Result<CreateOrganizationResponse>.Failure("Master user email is required.");

        var email = request.MasterUser.Email.Trim();

        if (await _context.Users.IgnoreQueryFilters()
                .AnyAsync(u => u.NormalizedEmail == email.ToUpperInvariant(), cancellationToken))
            return Result<CreateOrganizationResponse>.Failure("A user with that email already exists.");

        var slug = Slugify(request.Name);
        if (await _context.Tenants.IgnoreQueryFilters().AnyAsync(t => t.Slug == slug, cancellationToken))
            slug = $"{slug}-{Guid.NewGuid().ToString("N")[..6]}";

        await using var tx = await _context.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            var tenant = new Tenant
            {
                Id = Guid.NewGuid(),
                Name = request.Name.Trim(),
                Slug = slug,
                Description = request.OrganizationType,
                Email = request.ContactEmail,
                Phone = request.ContactPhone,
                Address = request.Address,
                Package = 1,
                SubscriptionStatus = 1,
                City = request.City,
                Country = request.Country,
                Timezone = string.IsNullOrWhiteSpace(request.Timezone) ? "UTC" : request.Timezone,
                Currency = string.IsNullOrWhiteSpace(request.Currency) ? "USD" : request.Currency,
                LogoUrl = request.LogoUrl,
                RegistrationNumber = request.Code,
                IsActive = true
            };
            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync(cancellationToken);

            var requested = request.EnabledFeatures is { Length: > 0 }
                ? request.EnabledFeatures
                : GetAllFeatures();

            foreach (var feature in requested.Distinct(StringComparer.OrdinalIgnoreCase))
            {
                _context.TenantEntitlements.Add(new TenantEntitlement
                {
                    TenantId = tenant.Id,
                    Feature = feature,
                    IsEnabled = true
                });
            }

            // ---- 3. Limits -----------------------------------------------------
            if (request.Limits is not null)
            {
                foreach (var (limitType, value) in request.Limits)
                {
                    _context.TenantLimits.Add(new TenantLimit
                    {
                        TenantId = tenant.Id,
                        LimitType = limitType,
                        MaxValue = value
                    });
                }
            }
             
            var permissionIds = await _context.Permissions
                .IgnoreQueryFilters()
                .Where(p => p.IsActive)
                .ToDictionaryAsync(p => p.Name, p => p.Id, StringComparer.OrdinalIgnoreCase, cancellationToken);

            var ownerRoleId = Guid.Empty;
             
            var ownerRole = new Role
            {
                Id = Guid.NewGuid(),
                Name = Roles.OrganizationOwner,
                NormalizedName = Roles.OrganizationOwner.ToUpperInvariant(),
                TenantId = tenant.Id,
                IsSystemRole = true,
                IsActive = true,
                DisplayOrder = 10
            };
            _context.Roles.Add(ownerRole);
            ownerRoleId = ownerRole.Id;

            foreach (var permName in RolePermissionDefaults.For(Roles.OrganizationOwner))
            {
                if (permissionIds.TryGetValue(permName, out var permId))
                {
                    _context.RolePermissions.Add(new RolePermission
                    {
                        RoleId = ownerRole.Id,
                        PermissionId = permId
                    });
                }
            } 
            var tempPassword = string.IsNullOrWhiteSpace(request.MasterUser.TemporaryPassword)
                ? GenerateTemporaryPassword()
                : request.MasterUser.TemporaryPassword!;

            var masterUser = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                Email = email,
                NormalizedEmail = email.ToUpperInvariant(),
                EmailConfirmed = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword),
                FirstName = request.MasterUser.FirstName,
                LastName = request.MasterUser.LastName,
                PhoneNumber = request.MasterUser.Phone,
                IsActive = true,
                IsSuperAdmin = false,
                MustChangePassword = true,
                PasswordChangedAt = null,
                PlainPassword = tempPassword
            };
            _context.Users.Add(masterUser);

            _context.TenantUsers.Add(new TenantUser
            {
                TenantId = tenant.Id,
                UserId = masterUser.Id,
                IsOwner = true,
                IsActive = true,
                JoinedAt = DateTime.UtcNow
            });

            if (ownerRoleId != Guid.Empty)
            {
                _context.UserRoles.Add(new UserRole
                {
                    UserId = masterUser.Id,
                    RoleId = ownerRoleId,
                    TenantId = tenant.Id
                });
            }

            // ---- 6. Initial branch ----------------------------------------------
            Guid? branchId = null;
            var branchName = string.IsNullOrWhiteSpace(request.InitialBranchName)
                ? "Main Branch"
                : request.InitialBranchName!;

            var branch = new Branch
            {
                Id = Guid.NewGuid(),
                TenantId = tenant.Id,
                Name = branchName,
                Code = "MAIN",
                Address = request.Address,
                City = request.City,
                Country = request.Country,
                Phone = request.ContactPhone,
                Email = request.ContactEmail,
                IsActive = true,
                IsMainBranch = true
            };
            _context.Branches.Add(branch);
            branchId = branch.Id;

            _context.BranchUsers.Add(new BranchUser
            {
                BranchId = branch.Id,
                UserId = masterUser.Id,
                TenantId = tenant.Id,
                IsPrimary = true,
                IsActive = true
            });

            await _context.SaveChangesAsync(cancellationToken);
            await tx.CommitAsync(cancellationToken);

            _entitlements.Invalidate(tenant.Id);
            _permissions.InvalidateTenant(tenant.Id);

            _logger.LogInformation(
                "Provisioned organization {TenantName} ({TenantId}) with owner {Email}.",
                tenant.Name, tenant.Id, email);

            return Result<CreateOrganizationResponse>.Success(new CreateOrganizationResponse(
                tenant.Id,
                tenant.Name,
                masterUser.Id,
                masterUser.Email,
                tempPassword,
                branchId,
                requested.ToList()
            ));
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Organization provisioning failed for {Name}.", request.Name);
            return Result<CreateOrganizationResponse>.Failure("Organization creation failed and was rolled back.");
        }
    }

    public async Task<Result<OrganizationDetailDto>> GetAsync(
        Guid tenantId, CancellationToken cancellationToken = default)
    {
        var tenant = await _context.Tenants.IgnoreQueryFilters().AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == tenantId, cancellationToken);

        if (tenant is null)
            return Result<OrganizationDetailDto>.Failure("Organization not found.");

        var features = await _context.TenantEntitlements.IgnoreQueryFilters().AsNoTracking()
            .Where(e => e.TenantId == tenantId && e.IsEnabled && !e.IsDeleted)
            .Select(e => e.Feature)
            .ToListAsync(cancellationToken);

        var limits = await _context.TenantLimits.IgnoreQueryFilters().AsNoTracking()
            .Where(l => l.TenantId == tenantId && !l.IsDeleted)
            .ToDictionaryAsync(l => l.LimitType, l => l.MaxValue, cancellationToken);

        var users = await _context.TenantUsers.IgnoreQueryFilters().AsNoTracking()
            .Where(tu => tu.TenantId == tenantId)
            .Join(_context.Users.IgnoreQueryFilters(), tu => tu.UserId, u => u.Id,
                  (tu, u) => new { u.Id, u.FirstName, u.LastName, u.Email, tu.IsOwner, u.IsActive, u.PlainPassword })
            .ToListAsync(cancellationToken);

        var roleMap = await _context.UserRoles.IgnoreQueryFilters().AsNoTracking()
            .Where(ur => ur.TenantId == tenantId)
            .Join(_context.Roles.IgnoreQueryFilters(), ur => ur.RoleId, r => r.Id,
                  (ur, r) => new { ur.UserId, r.Name })
            .ToListAsync(cancellationToken);

        var userDtos = users.Select(u => new OrganizationUserDto(
            u.Id,
            $"{u.FirstName} {u.LastName}".Trim(),
            u.Email,
            u.IsOwner,
            u.IsActive,
            roleMap.Where(r => r.UserId == u.Id).Select(r => r.Name).ToList(),
            u.IsOwner ? u.PlainPassword : null
        )).ToList();

        return Result<OrganizationDetailDto>.Success(new OrganizationDetailDto(
            tenant.Id, tenant.Name, tenant.RegistrationNumber, tenant.Email, tenant.Phone,
            tenant.Address, tenant.City, tenant.Country, tenant.Timezone, tenant.Currency,
            tenant.LogoUrl, tenant.IsActive, features, limits, userDtos));
    }

    public async Task<Result> UpdateAsync(
        Guid tenantId, UpdateOrganizationRequest request, CancellationToken cancellationToken = default)
    {
        var tenant = await _context.Tenants.IgnoreQueryFilters()
            .FirstOrDefaultAsync(t => t.Id == tenantId, cancellationToken);

        if (tenant is null) return Result.Failure("Organization not found.");

        tenant.Name = request.Name;
        tenant.RegistrationNumber = request.Code;
        tenant.Email = request.Email;
        tenant.Phone = request.Phone;
        tenant.Address = request.Address;
        tenant.City = request.City;
        tenant.Country = request.Country;
        tenant.Timezone = request.Timezone;
        tenant.Currency = request.Currency;
        tenant.LogoUrl = request.LogoUrl;

        await _context.SaveChangesAsync(cancellationToken);
        _entitlements.Invalidate(tenantId);
        _permissions.InvalidateTenant(tenantId);
        return Result.Success("Organization updated.");
    }

    public async Task<Result> UpdateEntitlementsAsync(
        Guid tenantId, UpdateEntitlementsRequest request, CancellationToken cancellationToken = default)
    {
        var tenant = await _context.Tenants.IgnoreQueryFilters()
            .FirstOrDefaultAsync(t => t.Id == tenantId, cancellationToken);

        if (tenant is null) return Result.Failure("Organization not found.");

        var wanted = request.EnabledFeatures
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var rows = await _context.TenantEntitlements.IgnoreQueryFilters()
            .Where(e => e.TenantId == tenantId)
            .ToListAsync(cancellationToken);

        foreach (var row in rows)
            row.IsEnabled = wanted.Contains(row.Feature);

        var existing = rows.Select(r => r.Feature).ToHashSet(StringComparer.OrdinalIgnoreCase);
        foreach (var feature in wanted.Where(f => !existing.Contains(f)))
            _context.TenantEntitlements.Add(new TenantEntitlement { TenantId = tenantId, Feature = feature, IsEnabled = true });

        if (request.Limits is not null)
        {
            var limitRows = await _context.TenantLimits.IgnoreQueryFilters()
                .Where(l => l.TenantId == tenantId).ToListAsync(cancellationToken);

            foreach (var (limitType, value) in request.Limits)
            {
                var row = limitRows.FirstOrDefault(l => l.LimitType == limitType);
                if (row is null)
                    _context.TenantLimits.Add(new TenantLimit { TenantId = tenantId, LimitType = limitType, MaxValue = value });
                else
                    row.MaxValue = value;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        _entitlements.Invalidate(tenantId);
        _permissions.InvalidateTenant(tenantId);
        return Result.Success("Entitlements updated.");
    }

    public async Task<Result> SetActiveAsync(
        Guid tenantId, bool isActive, CancellationToken cancellationToken = default)
    {
        var tenant = await _context.Tenants.IgnoreQueryFilters()
            .FirstOrDefaultAsync(t => t.Id == tenantId, cancellationToken);

        if (tenant is null) return Result.Failure("Organization not found.");

        tenant.IsActive = isActive;

        await _context.SaveChangesAsync(cancellationToken);
        _entitlements.Invalidate(tenantId);
        _permissions.InvalidateTenant(tenantId);

        return Result.Success(isActive ? "Organization activated." : "Organization deactivated.");
    }

    // -----------------------------------------------------------------------

    private static string Slugify(string value)
    {
        var slug = new string(value.ToLowerInvariant()
            .Select(c => char.IsLetterOrDigit(c) ? c : '-')
            .ToArray());

        while (slug.Contains("--")) slug = slug.Replace("--", "-");
        return slug.Trim('-');
    }

    private static string[] GetAllFeatures()
    {
        return PermissionCatalog.PrefixToFeature.Values
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();
    }

    public static string GenerateTemporaryPassword(int length = 14)
    {
        const string upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const string lower = "abcdefghijkmnopqrstuvwxyz";
        const string digits = "23456789";
        const string symbols = "!@#$%^&*";
        var all = upper + lower + digits + symbols;

        var chars = new char[length];
        chars[0] = Pick(upper);
        chars[1] = Pick(lower);
        chars[2] = Pick(digits);
        chars[3] = Pick(symbols);

        for (var i = 4; i < length; i++)
            chars[i] = Pick(all);

        for (var i = chars.Length - 1; i > 0; i--)
        {
            var j = RandomNumberGenerator.GetInt32(i + 1);
            (chars[i], chars[j]) = (chars[j], chars[i]);
        }

        return new string(chars);

        static char Pick(string set) => set[RandomNumberGenerator.GetInt32(set.Length)];
    }
}
