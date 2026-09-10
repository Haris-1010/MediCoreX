using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ClinIQ.Application.Interfaces;
using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Enums;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.DTOs.Auth;
using ClinIQ.Shared.Models;
using ClinIQ.Shared.Constants;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ClinIQ.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IPermissionService _permissionService;
    private readonly IEntitlementService _entitlementService;

    public AuthService(
        ApplicationDbContext context,
        IConfiguration configuration,
        IPermissionService permissionService,
        IEntitlementService entitlementService)
    {
        _context = context;
        _configuration = configuration;
        _permissionService = permissionService;
        _entitlementService = entitlementService;
    }

    public async Task<Result<LoginResponse>> LoginAsync(LoginRequest request, string ipAddress, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive, cancellationToken);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Result<LoginResponse>.Failure("Invalid email or password");

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        user.LastLoginIp = ipAddress;
        await _context.SaveChangesAsync(cancellationToken);

        // Generate tokens
        var tokenResult = await GenerateJwtTokenAsync(user, cancellationToken);
        if (!tokenResult.Succeeded)
            return Result<LoginResponse>.Failure(tokenResult.Message ?? "Token generation failed");

        return Result<LoginResponse>.Success(tokenResult.Data!);
    }

    public async Task<Result> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken))
            return Result.Failure("User with this email already exists");

        // The first account owns the platform. Later registrations belong to
        // their organization only and must never receive platform privileges.
        var isFirstUser = !await _context.Users.AnyAsync(cancellationToken);

        // Create tenant first
        var tenant = new Tenant
        {
            Name = request.OrganizationName,
            Slug = request.OrganizationName.ToLower().Replace(" ", "-"),
            IsActive = true
        };
        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync(cancellationToken);

        // Create user
        var user = new ApplicationUser
        {
            Email = request.Email,
            NormalizedEmail = request.Email.ToUpper(),
            EmailConfirmed = true,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.Phone,
            IsActive = true,
            IsSuperAdmin = isFirstUser
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        // Create tenant-user membership
        var tenantUser = new TenantUser
        {
            TenantId = tenant.Id,
            UserId = user.Id,
            IsOwner = true,
            IsActive = true
        };
        _context.TenantUsers.Add(tenantUser);
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success("User registered successfully");
    }

    public async Task<Result<LoginResponse>> RefreshTokenAsync(RefreshTokenRequest request, string ipAddress, CancellationToken cancellationToken = default)
    {
        var principal = GetPrincipalFromExpiredToken(request.AccessToken);
        if (principal == null)
            return Result<LoginResponse>.Failure("Invalid access token");

        var userId = Guid.Parse(principal.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? Guid.Empty.ToString());
        var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken);

        if (user == null)
            return Result<LoginResponse>.Failure("User not found");

        var refreshToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken && rt.UserId == userId && rt.RevokedAt == null, cancellationToken);

        if (refreshToken == null || refreshToken.ExpiresAt < DateTime.UtcNow)
            return Result<LoginResponse>.Failure("Invalid or expired refresh token");

        // Revoke old refresh token
        refreshToken.RevokedAt = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;

        // Generate new tokens
        var tokenResult = await GenerateJwtTokenAsync(user, cancellationToken);
        if (!tokenResult.Succeeded)
            return Result<LoginResponse>.Failure(tokenResult.Message ?? "Token generation failed");

        return Result<LoginResponse>.Success(tokenResult.Data!);
    }

    public async Task<Result> LogoutAsync(string refreshToken, string ipAddress, CancellationToken cancellationToken = default)
    {
        var token = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken, cancellationToken);

        if (token != null)
        {
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            await _context.SaveChangesAsync(cancellationToken);
        }

        return Result.Success("Logged out successfully");
    }

    public Task<Result> ForgotPasswordAsync(string email, CancellationToken cancellationToken = default)
    {
        // In production, send email with reset link
        // For now, just return success
        return Task.FromResult(Result.Success("If an account with that email exists, a password reset link has been sent."));
    }

    public Task<Result> ResetPasswordAsync(string email, string token, string newPassword, CancellationToken cancellationToken = default)
    {
        // TODO: Implement password reset with token validation
        return Task.FromResult(Result.Failure("Password reset not yet implemented"));
    }

    public async Task<Result> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user is null)
            return Result.Failure("User not found");

        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            return Result.Failure("Current password is incorrect");

        if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 8)
            return Result.Failure("New password must be at least 8 characters");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.MustChangePassword = false;
        user.PasswordChangedAt = DateTime.UtcNow;

        // Any outstanding refresh token was issued against the old credential.
        var activeTokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.RevokedAt == null)
            .ToListAsync(cancellationToken);
        foreach (var t in activeTokens)
        {
            t.RevokedAt = DateTime.UtcNow;
            t.RevokedByIp = "password-change";
        }

        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success("Password changed successfully");
    }

    public Task<Result> VerifyEmailAsync(string email, string token, CancellationToken cancellationToken = default)
    {
        // TODO: Implement email verification
        return Task.FromResult(Result.Failure("Email verification not yet implemented"));
    }

    /// <summary>
    /// Builds the access token.
    ///
    /// SECURITY: emits tenant_id and branch_id claims, resolved from server-side
    /// membership rows rather than from anything the client sent. Without these
    /// claims TenantService cannot scope queries, which is what let the old
    /// X-Tenant-Id header fallback cross organizations.
    ///
    /// Permissions are deliberately NOT stamped into the token. A hospital user
    /// can hold 60+ of them, which bloats every request, and a revoked
    /// permission would stay live until expiry. The authorization handler
    /// resolves them per request through IPermissionService (cached 5 minutes,
    /// invalidated on change). The client fetches the same set from
    /// GET /api/v1/auth/me for UX only.
    /// </summary>
    private async Task<Result<LoginResponse>> GenerateJwtTokenAsync(
        ApplicationUser user,
        CancellationToken cancellationToken,
        Guid? requestedTenantId = null,
        Guid? requestedBranchId = null)
    {
        var jwtSecret = _configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? "ClinIQ";
        var jwtAudience = _configuration["Jwt:Audience"] ?? "ClinIQ.Web";
        var expiryMinutes = int.Parse(_configuration["Jwt:AccessTokenExpirationMinutes"] ?? "60");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // ---- resolve tenant from server-side membership, never from the request ----
        var memberships = await _context.TenantUsers
            .IgnoreQueryFilters()
            .Where(tu => tu.UserId == user.Id && tu.IsActive)
            .Join(_context.Tenants.IgnoreQueryFilters(), tu => tu.TenantId, t => t.Id,
                  (tu, t) => new { tu.TenantId, tu.IsOwner, TenantName = t.Name, t.IsActive })
            .Where(x => x.IsActive)
            .ToListAsync(cancellationToken);

        if (memberships.Count == 0 && !user.IsSuperAdmin)
            return Result<LoginResponse>.Failure("This account is not linked to any active organization.");

        // Honour an explicitly requested organization ONLY when the user is
        // genuinely a member of it.
        var membership = requestedTenantId.HasValue
            ? memberships.FirstOrDefault(m => m.TenantId == requestedTenantId.Value)
            : memberships.FirstOrDefault();

        if (requestedTenantId.HasValue && membership is null && !user.IsSuperAdmin)
            return Result<LoginResponse>.Failure("You do not have access to that organization.");

        Guid? tenantId = membership?.TenantId;

        // ---- resolve branch the same way ----
        Guid? branchId = null;
        if (tenantId.HasValue)
        {
            var branchIds = await _context.BranchUsers
                .IgnoreQueryFilters()
                .Where(bu => bu.UserId == user.Id && bu.TenantId == tenantId.Value && bu.IsActive)
                .OrderByDescending(bu => bu.IsPrimary)
                .Select(bu => bu.BranchId)
                .ToListAsync(cancellationToken);

            if (requestedBranchId.HasValue && branchIds.Contains(requestedBranchId.Value))
                branchId = requestedBranchId.Value;
            else if (branchIds.Count > 0)
                branchId = branchIds[0];
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.GivenName, user.FirstName),
            new Claim(ClaimTypes.Surname, user.LastName),
            new Claim("full_name", user.FullName),
            new Claim("is_super_admin", user.IsSuperAdmin.ToString().ToLower()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (tenantId.HasValue)
            claims.Add(new Claim("tenant_id", tenantId.Value.ToString()));

        if (branchId.HasValue)
            claims.Add(new Claim("branch_id", branchId.Value.ToString()));

        if (membership?.IsOwner == true)
            claims.Add(new Claim("is_owner", "true"));

        // Roles scoped to the tenant we just resolved.
        var userRoles = await _context.UserRoles
            .IgnoreQueryFilters()
            .Where(ur => ur.UserId == user.Id && (tenantId == null || ur.TenantId == tenantId))
            .Join(_context.Roles.IgnoreQueryFilters(), ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
            .Distinct()
            .ToListAsync(cancellationToken);

        foreach (var role in userRoles)
            claims.Add(new Claim(ClaimTypes.Role, role));

        var expiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes);

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds);

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        var refreshToken = new RefreshToken
        {
            Token = GenerateRefreshToken(),
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(int.Parse(_configuration["Jwt:RefreshTokenExpirationDays"] ?? "7")),
            CreatedByIp = "system"
        };
        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync(cancellationToken);

        // Branch list for the org switcher in the UI.
        var branchLookup = await _context.BranchUsers
            .IgnoreQueryFilters()
            .Where(bu => bu.UserId == user.Id && bu.IsActive)
            .Join(_context.Branches.IgnoreQueryFilters(), bu => bu.BranchId, b => b.Id,
                  (bu, b) => new { bu.TenantId, b.Id, b.Name, bu.IsPrimary })
            .ToListAsync(cancellationToken);

        var tenantDtos = memberships.Select(m => new TenantMembershipDto(
            m.TenantId,
            m.TenantName,
            m.IsOwner,
            m.TenantId == tenantId ? userRoles : Enumerable.Empty<string>(),
            branchLookup.Where(b => b.TenantId == m.TenantId)
                        .Select(b => new BranchMembershipDto(b.Id, b.Name, b.IsPrimary))
                        .ToList()
        )).ToList();

        var loginResponse = new LoginResponse(
            accessToken,
            refreshToken.Token,
            expiresAt,
            new UserDto(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.ProfilePictureUrl,
                user.IsSuperAdmin,
                tenantDtos
            )
        );

        return Result<LoginResponse>.Success(loginResponse);
    }

    private static string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var jwtSecret = _configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidAudience = _configuration["Jwt:Audience"],
            ValidateLifetime = false // Allow expired tokens
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
            if (securityToken is not JwtSecurityToken jwtToken ||
                !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                return null;

            return principal;
        }
        catch
        {
            return null;
        }
    }

    public async Task<Result<CurrentUserContextDto>> GetCurrentUserContextAsync(
        Guid userId, Guid? tenantId, Guid? branchId, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.IgnoreQueryFilters().AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user is null)
            return Result<CurrentUserContextDto>.Failure("User not found.");

        Guid? effectiveTenantId = tenantId;
        bool isOwner = false;
        string? tenantName = null;
        IReadOnlySet<string> enabledFeatures = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        if (user.IsSuperAdmin)
        {
            if (effectiveTenantId.HasValue)
            {
                var ambTenant = await _context.Tenants.IgnoreQueryFilters().AsNoTracking()
                    .FirstOrDefaultAsync(t => t.Id == effectiveTenantId.Value, cancellationToken);
                if (ambTenant is not null)
                {
                    tenantName = ambTenant.Name;
                    enabledFeatures = await _entitlementService.GetEnabledFeaturesAsync(ambTenant.Id, cancellationToken);
                    isOwner = await _context.TenantUsers.IgnoreQueryFilters()
                        .AnyAsync(tu => tu.TenantId == ambTenant.Id && tu.UserId == userId && tu.IsOwner, cancellationToken);
                }
            }
        }
        else
        {
            var membership = effectiveTenantId.HasValue
                ? await _context.TenantUsers.IgnoreQueryFilters().AsNoTracking()
                    .Where(tu => tu.UserId == userId && tu.TenantId == effectiveTenantId.Value && tu.IsActive)
                    .Select(tu => new { tu.TenantId, tu.IsOwner })
                    .FirstOrDefaultAsync(cancellationToken)
                : null;

            if (membership is null)
            {
                membership = await _context.TenantUsers.IgnoreQueryFilters().AsNoTracking()
                    .Where(tu => tu.UserId == userId && tu.IsActive)
                    .Join(_context.Tenants.IgnoreQueryFilters().Where(t => t.IsActive), tu => tu.TenantId, t => t.Id,
                          (tu, t) => new { tu.TenantId, tu.IsOwner })
                    .FirstOrDefaultAsync(cancellationToken);
            }

            if (membership is null)
                return Result<CurrentUserContextDto>.Failure("This account is not linked to any active organization.");

            effectiveTenantId = membership.TenantId;
            isOwner = membership.IsOwner;

            var tenant = await _context.Tenants.IgnoreQueryFilters().AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == effectiveTenantId.Value, cancellationToken);
            if (tenant is null)
                return Result<CurrentUserContextDto>.Failure("Organization not found.");

            tenantName = tenant.Name;
            enabledFeatures = await _entitlementService.GetEnabledFeaturesAsync(effectiveTenantId.Value, cancellationToken);
        }

        // ---- Roles scoped to the effective tenant ----
        var roles = new List<string>();
        if (effectiveTenantId.HasValue)
        {
            roles = await _context.UserRoles.IgnoreQueryFilters().AsNoTracking()
                .Where(ur => ur.UserId == userId && ur.TenantId == effectiveTenantId.Value)
                .Join(_context.Roles.IgnoreQueryFilters(), ur => ur.RoleId, r => r.Id, (_, r) => r.Name)
                .Distinct()
                .ToListAsync(cancellationToken);
        }

        // ---- Effective permissions (server-side truth) ----
        IReadOnlySet<string> permissions;
        if (user.IsSuperAdmin)
        {
            permissions = PermissionCatalog.All.Select(p => p.Name).ToHashSet(StringComparer.OrdinalIgnoreCase);
        }
        else if (effectiveTenantId.HasValue)
        {
            permissions = await _permissionService.GetEffectivePermissionsAsync(
                userId, effectiveTenantId.Value, branchId, cancellationToken);
        }
        else
        {
            permissions = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        }

        // ---- Enabled modules / accessible branches ----
        List<BranchAccessDto> branches = new();
        if (effectiveTenantId.HasValue)
        {
            branches = await _context.BranchUsers.IgnoreQueryFilters().AsNoTracking()
                .Where(bu => bu.UserId == userId && bu.TenantId == effectiveTenantId.Value && bu.IsActive)
                .Join(_context.Branches.IgnoreQueryFilters().Where(b => b.IsActive && !b.IsDeleted),
                      bu => bu.BranchId, b => b.Id,
                      (bu, b) => new { b.Id, b.Name, bu.IsPrimary })
                .Select(x => new BranchAccessDto(x.Id, x.Name, x.IsPrimary))
                .ToListAsync(cancellationToken);
        }

        Guid? effectiveBranchId = branchId;
        string? branchName = branches.FirstOrDefault(b => b.BranchId == effectiveBranchId)?.BranchName;
        if (effectiveBranchId is null && branches.Count > 0)
        {
            effectiveBranchId = branches.OrderByDescending(b => b.IsPrimary).First().BranchId;
            branchName = branches.First(b => b.BranchId == effectiveBranchId).BranchName;
        }

        var modules = enabledFeatures.ToList();

        var dto = new CurrentUserContextDto(
            user.Id,
            user.FullName,
            user.Email,
            user.MustChangePassword,
            effectiveTenantId,
            tenantName,
            effectiveBranchId,
            branchName,
            user.IsSuperAdmin,
            isOwner,
            roles,
            permissions.ToList(),
            branches,
            modules);

        return Result<CurrentUserContextDto>.Success(dto);
    }
}
