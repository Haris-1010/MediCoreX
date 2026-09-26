using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Infrastructure.Services;

namespace ClinIQ.Infrastructure.Tests.Services;

/// <summary>
/// SECURITY: the single authority for which location a report / audit read may
/// use. A locationId from the client must never widen the caller's scope.
/// </summary>
public class LocationScopeServiceTests : IDisposable
{
    private static readonly Guid TenantA = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static readonly Guid TenantB = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    private static readonly Guid Lahore = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid Islamabad = Guid.Parse("22222222-2222-2222-2222-222222222222");
    private static readonly Guid Karachi = Guid.Parse("33333333-3333-3333-3333-333333333333");
    private static readonly Guid Closed = Guid.Parse("44444444-4444-4444-4444-444444444444");
    private static readonly Guid OtherTenantBranch = Guid.Parse("55555555-5555-5555-5555-555555555555");

    private static readonly Guid LahoreUser = Guid.NewGuid();
    private static readonly Guid TwoSiteUser = Guid.NewGuid();
    private static readonly Guid Admin = Guid.NewGuid();

    private readonly Mock<ITenantService> _tenant = new();
    private readonly Mock<ICurrentUserService> _user = new();
    private readonly Mock<IPermissionService> _permissions = new();
    private readonly ApplicationDbContext _db;

    public LocationScopeServiceTests()
    {
        var dateTime = new Mock<IDateTimeService>();
        dateTime.Setup(d => d.UtcNow).Returns(DateTime.UtcNow);

        _db = new ApplicationDbContext(
            new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options,
            _tenant.Object, _user.Object, dateTime.Object);

        _db.Branches.AddRange(
            new Branch { Id = Lahore, TenantId = TenantA, Name = "Lahore", Code = "LHR" },
            new Branch { Id = Islamabad, TenantId = TenantA, Name = "Islamabad", Code = "ISB" },
            new Branch { Id = Karachi, TenantId = TenantA, Name = "Karachi", Code = "KHI" },
            new Branch { Id = Closed, TenantId = TenantA, Name = "Closed Site", Code = "OLD", IsDeleted = true },
            new Branch { Id = OtherTenantBranch, TenantId = TenantB, Name = "Other Org", Code = "OTH" });

        _db.TenantUsers.AddRange(
            new TenantUser { Id = Guid.NewGuid(), TenantId = TenantA, UserId = LahoreUser, IsActive = true },
            new TenantUser { Id = Guid.NewGuid(), TenantId = TenantA, UserId = TwoSiteUser, IsActive = true },
            new TenantUser { Id = Guid.NewGuid(), TenantId = TenantA, UserId = Admin, IsActive = true, HasAllLocations = true });

        _db.BranchUsers.AddRange(
            new BranchUser { Id = Guid.NewGuid(), TenantId = TenantA, UserId = LahoreUser, BranchId = Lahore, IsActive = true },
            new BranchUser { Id = Guid.NewGuid(), TenantId = TenantA, UserId = TwoSiteUser, BranchId = Lahore, IsActive = true },
            new BranchUser { Id = Guid.NewGuid(), TenantId = TenantA, UserId = TwoSiteUser, BranchId = Islamabad, IsActive = true },
            // Revoked membership must not count.
            new BranchUser { Id = Guid.NewGuid(), TenantId = TenantA, UserId = LahoreUser, BranchId = Karachi, IsActive = false });

        _db.SaveChanges();
    }

    private LocationScopeService As(Guid userId, Guid? currentBranch, bool allLocationsHeader = false, bool superAdmin = false)
    {
        _user.Setup(u => u.UserId).Returns(userId);
        _user.Setup(u => u.IsSuperAdmin).Returns(superAdmin);
        _tenant.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenant.Setup(t => t.GetCurrentBranchId()).Returns(currentBranch);
        _tenant.Setup(t => t.HasAllLocationAccess()).Returns(allLocationsHeader);
        return new LocationScopeService(_db, _tenant.Object, _user.Object, _permissions.Object);
    }

    [Fact]
    public async Task SingleLocationUser_DefaultsToOwnLocation()
    {
        var (scope, error) = await As(LahoreUser, Lahore).ResolveAsync(null);

        error.Should().BeNull();
        scope!.BranchId.Should().Be(Lahore);
        scope.CanSeeAllLocations.Should().BeFalse();
        scope.AllowedBranchIds.Should().BeEquivalentTo(new[] { Lahore });
    }

    [Theory]
    [InlineData("22222222-2222-2222-2222-222222222222")] // Islamabad — same org, not a member
    [InlineData("33333333-3333-3333-3333-333333333333")] // Karachi — membership revoked
    [InlineData("55555555-5555-5555-5555-555555555555")] // another organization's branch
    [InlineData("99999999-9999-9999-9999-999999999999")] // does not exist
    public async Task SingleLocationUser_ForgedLocationId_IsRejected(string forged)
    {
        var (scope, error) = await As(LahoreUser, Lahore).ResolveAsync(Guid.Parse(forged));

        scope.Should().BeNull();
        error.Should().Contain("do not have access");
    }

    [Fact]
    public async Task SingleLocationUser_CannotGetAllLocations()
    {
        var options = await As(LahoreUser, Lahore).GetSelectableAsync();

        options.Should().ContainSingle();
        options[0].Id.Should().Be(Lahore);
        options.Should().NotContain(o => o.Id == null);
    }

    [Fact]
    public async Task MultiLocationUser_MaySelectOnlyTheirLocations()
    {
        var svc = As(TwoSiteUser, Lahore);

        (await svc.ResolveAsync(Islamabad)).Scope!.BranchId.Should().Be(Islamabad);
        (await svc.ResolveAsync(Karachi)).Scope.Should().BeNull();
        (await svc.GetSelectableAsync()).Select(o => o.Name).Should().BeEquivalentTo("Islamabad", "Lahore");
    }

    [Fact]
    public async Task AllLocationsAdmin_DefaultsToAllLocations_WhenViewingAll()
    {
        var (scope, _) = await As(Admin, null, allLocationsHeader: true).ResolveAsync(null);

        scope!.BranchId.Should().BeNull();
        scope.LocationName.Should().Be("All Locations");
        scope.AllowedBranchIds.Should().BeEquivalentTo(new[] { Lahore, Islamabad, Karachi });
    }

    [Fact]
    public async Task AllLocationsAdmin_CanPickAnyOwnLocation_ButNotOtherTenantOrDeleted()
    {
        var svc = As(Admin, Lahore);

        (await svc.ResolveAsync(Karachi)).Scope!.BranchId.Should().Be(Karachi);
        (await svc.ResolveAsync(OtherTenantBranch)).Scope.Should().BeNull();
        (await svc.ResolveAsync(Closed)).Scope.Should().BeNull();

        var options = await svc.GetSelectableAsync();
        options.Should().Contain(o => o.Id == null && o.Name == "All Locations");
        options.Should().NotContain(o => o.Id == Closed || o.Id == OtherTenantBranch);
    }

    [Fact]
    public async Task ExplicitAllLocations_OnlyForAllLocationCallers()
    {
        (await As(LahoreUser, Lahore).ResolveAsync(null, default, requestAllLocations: true)).Scope.Should().BeNull();
        (await As(TwoSiteUser, Lahore).ResolveAsync(null, default, requestAllLocations: true)).Scope.Should().BeNull();

        // All Locations admin currently working in Lahore can still ask for everything.
        var (scope, _) = await As(Admin, Lahore).ResolveAsync(null, default, requestAllLocations: true);
        scope!.BranchId.Should().BeNull();
    }

    [Fact]
    public async Task NoTenantContext_IsRejected()
    {
        var svc = As(Admin, null, allLocationsHeader: true);
        _tenant.Setup(t => t.GetCurrentTenantId()).Returns((Guid?)null);

        var (scope, error) = await svc.ResolveAsync(null);

        scope.Should().BeNull();
        error.Should().Be("No organization context.");
    }

    [Fact]
    public async Task HasPermission_UsesEffectivePermissions_NotClaims()
    {
        var svc = As(LahoreUser, Lahore);
        _permissions.Setup(p => p.HasPermissionAsync(LahoreUser, TenantA, "reports.financial", Lahore, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        (await svc.HasPermissionAsync("reports.financial")).Should().BeTrue();
        (await svc.HasPermissionAsync("audit.view")).Should().BeFalse();
    }

    public void Dispose() => _db.Dispose();
}
