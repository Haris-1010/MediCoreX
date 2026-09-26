using System.Security.Claims;
using ClinIQ.API.Controllers.v1;
using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RolesConst = ClinIQ.Shared.Constants.Roles;

namespace ClinIQ.API.Tests.Controllers;

/// <summary>
/// User creation must never leave an account without a role, must only
/// assign roles that belong to this organization (or global system roles),
/// and only an all-location user may grant All Locations.
/// </summary>
public class UsersControllerAccessTests : IDisposable
{
    private static readonly Guid TenantA = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static readonly Guid TenantB = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    private static readonly Guid Lahore = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid Owner = Guid.Parse("0000000a-0000-0000-0000-000000000001");
    private static readonly Guid BranchManager = Guid.Parse("0000000a-0000-0000-0000-000000000002");

    private readonly Mock<ITenantService> _tenant = new();
    private readonly Mock<ICurrentUserService> _currentUser = new();
    private readonly ApplicationDbContext _db;

    private readonly Guid _adminRole = Guid.NewGuid();
    private readonly Guid _doctorRole = Guid.NewGuid();
    private readonly Guid _ownerRole = Guid.NewGuid();
    private readonly Guid _superAdminRole = Guid.NewGuid();
    private readonly Guid _otherTenantRole = Guid.NewGuid();

    public UsersControllerAccessTests()
    {
        var dateTime = new Mock<IDateTimeService>();
        dateTime.Setup(d => d.UtcNow).Returns(DateTime.UtcNow);
        _tenant.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenant.Setup(t => t.GetCurrentBranchId()).Returns(Lahore);

        _db = new ApplicationDbContext(
            new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options,
            _tenant.Object, _currentUser.Object, dateTime.Object);

        _db.Branches.Add(new Branch { Id = Lahore, TenantId = TenantA, Name = "Lahore", Code = "LHR" });
        _db.Roles.AddRange(
            Role(_adminRole, RolesConst.OrganizationAdmin, null, system: true),
            Role(_doctorRole, RolesConst.Doctor, null, system: true),
            Role(_ownerRole, RolesConst.OrganizationOwner, null, system: true),
            Role(_superAdminRole, RolesConst.SuperAdmin, null, system: true),
            Role(_otherTenantRole, "Other Org Custom", TenantB, system: false));
        _db.TenantUsers.AddRange(
            new TenantUser { Id = Guid.NewGuid(), TenantId = TenantA, UserId = Owner, IsOwner = true, IsActive = true, HasAllLocations = true },
            new TenantUser { Id = Guid.NewGuid(), TenantId = TenantA, UserId = BranchManager, IsActive = true, HasAllLocations = false });
        _db.SaveChanges();
    }

    private static Role Role(Guid id, string name, Guid? tenant, bool system) =>
        new() { Id = id, Name = name, NormalizedName = name.ToUpperInvariant(), TenantId = tenant, IsSystemRole = system, IsActive = true };

    private UsersController As(Guid actor)
    {
        var controller = new UsersController(_db, _tenant.Object, new Mock<IPermissionService>().Object);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, actor.ToString()) }, "test")),
            },
        };
        return controller;
    }

    private static CreateUserRequest NewUser(string email, string type, List<Guid>? roles = null, bool? allLocations = null) =>
        new(email, "Secret#123", "Test", "User", null, roles, UserType: type,
            BranchIds: new List<Guid> { Lahore }, HasAllLocations: allLocations);

    private TenantUser Membership(string email)
    {
        var id = _db.Users.IgnoreQueryFilters().Single(u => u.Email == email).Id;
        return _db.TenantUsers.IgnoreQueryFilters().Single(tu => tu.UserId == id && tu.TenantId == TenantA);
    }

    private List<Guid> RolesOf(string email)
    {
        var id = _db.Users.IgnoreQueryFilters().Single(u => u.Email == email).Id;
        return _db.UserRoles.IgnoreQueryFilters().Where(ur => ur.UserId == id).Select(ur => ur.RoleId).ToList();
    }

    [Fact]
    public async Task Admin_CreatedByOwner_GetsAdminRole_AndAllLocations()
    {
        var result = await As(Owner).CreateUser(NewUser("admin@a.test", "Admin"));

        result.Should().BeOfType<OkObjectResult>();
        RolesOf("admin@a.test").Should().Equal(_adminRole);
        Membership("admin@a.test").HasAllLocations.Should().BeTrue();
    }

    [Fact]
    public async Task Doctor_WithoutRoles_GetsDoctorRole_NotAllLocations()
    {
        await As(Owner).CreateUser(NewUser("doc@a.test", "Doctor"));

        RolesOf("doc@a.test").Should().Equal(_doctorRole);
        Membership("doc@a.test").HasAllLocations.Should().BeFalse();
    }

    [Fact]
    public async Task AnotherOrganizationsRole_IsRejected()
    {
        var result = await As(Owner).CreateUser(NewUser("x@a.test", "Doctor", new List<Guid> { _otherTenantRole }));

        result.Should().BeOfType<ObjectResult>().Which.StatusCode.Should().Be(StatusCodes.Status403Forbidden);
        _db.Users.IgnoreQueryFilters().Any(u => u.Email == "x@a.test").Should().BeFalse();
    }

    [Theory]
    [InlineData(true)]   // SuperAdmin: never assignable
    [InlineData(false)]  // OrganizationOwner: only by someone who manages owners
    public async Task PrivilegedRoles_CannotBeAssignedByNonOwner(bool superAdmin)
    {
        var role = superAdmin ? _superAdminRole : _ownerRole;
        var result = await As(BranchManager).CreateUser(NewUser("p@a.test", "Admin", new List<Guid> { role }));

        result.Should().BeOfType<ObjectResult>().Which.StatusCode.Should().Be(StatusCodes.Status403Forbidden);
    }

    [Fact]
    public async Task NonAllLocationCaller_CreatingAdmin_DoesNotGrantAllLocations()
    {
        await As(BranchManager).CreateUser(NewUser("a2@a.test", "Admin"));

        Membership("a2@a.test").HasAllLocations.Should().BeFalse();
    }

    [Fact]
    public async Task NonAllLocationCaller_ExplicitlyGrantingAllLocations_IsForbidden()
    {
        var result = await As(BranchManager).CreateUser(NewUser("a3@a.test", "Nurse", allLocations: true));

        result.Should().BeOfType<ObjectResult>().Which.StatusCode.Should().Be(StatusCodes.Status403Forbidden);
    }

    [Fact]
    public async Task Update_ChangingAllLocations_RequiresAllLocationCaller()
    {
        await As(Owner).CreateUser(NewUser("n@a.test", "Nurse"));
        var id = _db.Users.IgnoreQueryFilters().Single(u => u.Email == "n@a.test").Id;
        var update = new UpdateUserRequest("n@a.test", "Test", "User", null, true, null, UserType: "Nurse", HasAllLocations: true);

        var denied = await As(BranchManager).UpdateUser(id, update);
        denied.Should().BeOfType<ObjectResult>().Which.StatusCode.Should().Be(StatusCodes.Status403Forbidden);

        var allowed = await As(Owner).UpdateUser(id, update);
        allowed.Should().BeOfType<OkObjectResult>();
        Membership("n@a.test").HasAllLocations.Should().BeTrue();
        // RoleIds = null leaves the existing role in place.
        RolesOf("n@a.test").Should().BeEmpty(); // no Nurse system role seeded here
    }

    public void Dispose() => _db.Dispose();
}
