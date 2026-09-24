using ClinIQ.API.Controllers.v1;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Tests.Controllers;

/// <summary>
/// SECURITY: org resolution must fail closed — never fall back to an
/// arbitrary tenant, and GetTenant must not expose other organizations.
/// </summary>
public class TenantsControllerSecurityTests : IDisposable
{
    private static readonly Guid TenantA = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static readonly Guid TenantB = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

    private readonly Mock<ITenantService> _tenantService = new();
    private readonly Mock<ICurrentUserService> _currentUser = new();
    private readonly Mock<IDateTimeService> _dateTime = new();
    private readonly Mock<IWebHostEnvironment> _env = new();
    private readonly ApplicationDbContext _db;
    private readonly TenantsController _controller;

    public TenantsControllerSecurityTests()
    {
        _dateTime.Setup(d => d.UtcNow).Returns(DateTime.UtcNow);
        _dateTime.Setup(d => d.Now).Returns(DateTime.Now);
        _env.Setup(e => e.WebRootPath).Returns(Path.GetTempPath());
        _env.Setup(e => e.ContentRootPath).Returns(Path.GetTempPath());

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _db = new ApplicationDbContext(
            options,
            _tenantService.Object,
            _currentUser.Object,
            _dateTime.Object);

        _db.Tenants.AddRange(
            new ClinIQ.Domain.Entities.Tenancy.Tenant { Id = TenantA, Name = "Org A", Slug = "org-a", IsActive = true },
            new ClinIQ.Domain.Entities.Tenancy.Tenant { Id = TenantB, Name = "Org B", Slug = "org-b", IsActive = true });
        // Tenant is not ITenantEntity — no ambient stamping — but save explicitly.
        _db.SaveChanges();

        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _controller = new TenantsController(_db, _tenantService.Object, _env.Object);
    }

    public void Dispose() => _db.Dispose();

    [Fact]
    public async Task GetTenant_WithCurrentTenantId_ReturnsOrg()
    {
        var result = await _controller.GetTenant(TenantA);

        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        ok.Value.Should().NotBeNull();
    }

    [Fact]
    public async Task GetTenant_WithOtherTenantId_ReturnsNotFound()
    {
        var result = await _controller.GetTenant(TenantB);

        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GetTenant_WithoutTenantContext_ReturnsNotFound()
    {
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns((Guid?)null);

        var result = await _controller.GetTenant(TenantA);

        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GetCurrentTenant_WithoutTenantContext_DoesNotFallBackToOtherOrg()
    {
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns((Guid?)null);

        var result = await _controller.GetCurrentTenant();

        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        // Fallback payload must not leak another organization.
        ok.Value!.ToString().Should().NotContain("Org B");
        ok.Value.ToString().Should().NotContain(TenantB.ToString());
    }

    [Fact]
    public async Task GetCurrentTenant_WithTenantContext_ReturnsThatOrg()
    {
        var result = await _controller.GetCurrentTenant();

        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        ok.Value!.ToString().Should().Contain("Org A");
        ok.Value.ToString().Should().NotContain("Org B");
    }
}
