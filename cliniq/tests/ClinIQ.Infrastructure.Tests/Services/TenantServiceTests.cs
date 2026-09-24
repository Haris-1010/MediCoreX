using System.Security.Claims;
using ClinIQ.Infrastructure.Services;
using Microsoft.AspNetCore.Http;

namespace ClinIQ.Infrastructure.Tests.Services;

/// <summary>
/// SECURITY: tenant/branch resolution comes only from signed claims or
/// trusted overrides — never from untrusted client input.
/// </summary>
public class TenantServiceTests
{
    private static readonly Guid TenantId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static readonly Guid BranchId = Guid.Parse("11111111-1111-1111-1111-111111111111");

    private static TenantService CreateService(ClaimsPrincipal? principal)
    {
        var accessor = new Mock<IHttpContextAccessor>();
        if (principal != null)
        {
            accessor.Setup(a => a.HttpContext).Returns(new DefaultHttpContext { User = principal });
        }

        return new TenantService(accessor.Object);
    }

    private static ClaimsPrincipal Principal(params Claim[] claims) => new(new ClaimsIdentity(claims, "Test"));

    [Fact]
    public void GetCurrentTenantId_FromClaim_ReturnsTenant()
    {
        var svc = CreateService(Principal(new Claim("tenant_id", TenantId.ToString())));

        svc.GetCurrentTenantId().Should().Be(TenantId);
    }

    [Fact]
    public void GetCurrentTenantId_WithoutClaim_ReturnsNull()
    {
        var svc = CreateService(Principal());

        svc.GetCurrentTenantId().Should().BeNull();
    }

    [Fact]
    public void GetCurrentTenantId_WithoutHttpContext_ReturnsNull()
    {
        var svc = CreateService(null);

        svc.GetCurrentTenantId().Should().BeNull();
    }

    [Fact]
    public void GetCurrentBranchId_FromClaim_ReturnsBranch()
    {
        var svc = CreateService(Principal(new Claim("branch_id", BranchId.ToString())));

        svc.GetCurrentBranchId().Should().Be(BranchId);
    }

    [Fact]
    public void GetCurrentBranchId_WithoutClaim_ReturnsNull()
    {
        var svc = CreateService(Principal());

        svc.GetCurrentBranchId().Should().BeNull();
    }

    [Fact]
    public void HasAllLocationAccess_AllLocationsClaim_True()
    {
        var svc = CreateService(Principal(
            new Claim("tenant_id", TenantId.ToString()),
            new Claim("all_locations", "true")));

        svc.HasAllLocationAccess().Should().BeTrue();
    }

    [Fact]
    public void HasAllLocationAccess_SuperAdminClaim_True()
    {
        var svc = CreateService(Principal(new Claim("is_super_admin", "true")));

        svc.HasAllLocationAccess().Should().BeTrue();
    }

    [Fact]
    public void HasAllLocationAccess_NoClaim_False()
    {
        var svc = CreateService(Principal(
            new Claim("tenant_id", TenantId.ToString()),
            new Claim("branch_id", BranchId.ToString())));

        svc.HasAllLocationAccess().Should().BeFalse();
    }

    [Fact]
    public void Overrides_TakePrecedenceOverClaims()
    {
        var svc = CreateService(Principal(
            new Claim("tenant_id", TenantId.ToString()),
            new Claim("branch_id", BranchId.ToString()),
            new Claim("all_locations", "false")));

        var otherTenant = Guid.NewGuid();
        var otherBranch = Guid.NewGuid();

        svc.SetCurrentTenant(otherTenant);
        svc.SetCurrentBranch(otherBranch);
        svc.SetAllLocationAccess(true);

        svc.GetCurrentTenantId().Should().Be(otherTenant);
        svc.GetCurrentBranchId().Should().Be(otherBranch);
        svc.HasAllLocationAccess().Should().BeTrue();
    }

    [Fact]
    public void AllLocationsHeaderValue_IsLiteralAll()
    {
        TenantService.AllLocationsHeaderValue.Should().Be("all");
        TenantService.BranchHeader.Should().Be("X-Branch-Id");
        TenantService.TenantHeader.Should().Be("X-Tenant-Id");
    }
}
