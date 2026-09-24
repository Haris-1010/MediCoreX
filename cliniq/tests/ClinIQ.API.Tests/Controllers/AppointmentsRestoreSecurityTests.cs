using ClinIQ.API.Controllers.v1;
using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Enums;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Tests.Controllers;

/// <summary>
/// SECURITY: restoring a soft-deleted appointment must re-apply tenant +
/// location scope even though IgnoreQueryFilters is required to see the row.
/// </summary>
public class AppointmentsRestoreSecurityTests : IDisposable
{
    private static readonly Guid TenantA = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static readonly Guid TenantB = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    private static readonly Guid Branch1 = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid Branch2 = Guid.Parse("22222222-2222-2222-2222-222222222222");

    private readonly Mock<ITenantService> _tenantService = new();
    private readonly Mock<ICurrentUserService> _currentUser = new();
    private readonly Mock<IDateTimeService> _dateTime = new();
    private readonly ApplicationDbContext _db;
    private readonly AppointmentsController _controller;

    private readonly Appointment _ownLocationDeleted;
    private readonly Appointment _otherLocationDeleted;
    private readonly Appointment _otherTenantDeleted;

    public AppointmentsRestoreSecurityTests()
    {
        _dateTime.Setup(d => d.UtcNow).Returns(DateTime.UtcNow);
        _dateTime.Setup(d => d.Now).Returns(DateTime.Now);

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _db = new ApplicationDbContext(
            options,
            _tenantService.Object,
            _currentUser.Object,
            _dateTime.Object);

        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns(Branch1);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(false);

        // SaveChanges stamps TenantId/BranchId from ambient context — seed per scope.
        _ownLocationDeleted = MakeAppointment("APT-OWN");
        _db.Appointments.Add(_ownLocationDeleted);
        _db.SaveChanges();

        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns(Branch2);
        _otherLocationDeleted = MakeAppointment("APT-OTHER-LOC");
        _db.Appointments.Add(_otherLocationDeleted);
        _db.SaveChanges();

        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantB);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns(Branch1);
        _otherTenantDeleted = MakeAppointment("APT-OTHER-TEN");
        _db.Appointments.Add(_otherTenantDeleted);
        _db.SaveChanges();

        // Restore test caller: Tenant A, Branch 1, not all-locations.
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns(Branch1);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(false);

        _controller = new AppointmentsController(_db, _tenantService.Object);
    }

    private static Appointment MakeAppointment(string number) => new()
    {
        Id = Guid.NewGuid(),
        AppointmentNumber = number,
        PatientId = Guid.NewGuid(),
        DoctorId = Guid.NewGuid(),
        AppointmentDate = DateTime.Today,
        StartTime = TimeSpan.FromHours(9),
        Status = AppointmentStatus.Cancelled,
        IsDeleted = true,
        DeletedAt = DateTime.UtcNow
    };

    public void Dispose() => _db.Dispose();

    [Fact]
    public async Task Restore_OwnLocation_Succeeds()
    {
        var result = await _controller.RestoreAppointment(_ownLocationDeleted.Id);

        result.Should().BeOfType<OkObjectResult>();

        var reloaded = await _db.Appointments.IgnoreQueryFilters>()
            .SingleAsync(a => a.Id == _ownLocationDeleted.Id);
        reloaded.IsDeleted.Should().BeFalse();
        reloaded.Status.Should().Be(AppointmentStatus.Scheduled);
    }

    [Fact]
    public async Task Restore_OtherLocation_ReturnsNotFound()
    {
        var result = await _controller.RestoreAppointment(_otherLocationDeleted.Id);

        result.Should().BeOfType<NotFoundObjectResult>();

        var reloaded = await _db.Appointments.IgnoreQueryFilters>()
            .SingleAsync(a => a.Id == _otherLocationDeleted.Id);
        reloaded.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public async Task Restore_OtherTenant_ReturnsNotFound()
    {
        var result = await _controller.RestoreAppointment(_otherTenantDeleted.Id);

        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task Restore_AllLocationAccess_CanRestoreOtherLocation()
    {
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(true);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns((Guid?)null);

        var result = await _controller.RestoreAppointment(_otherLocationDeleted.Id);

        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Restore_WithoutBranchContext_ReturnsNotFound()
    {
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns((Guid?)null);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(false);

        var result = await _controller.RestoreAppointment(_ownLocationDeleted.Id);

        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task Restore_WithoutTenantContext_ReturnsBadRequest()
    {
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns((Guid?)null);

        var result = await _controller.RestoreAppointment(_ownLocationDeleted.Id);

        result.Should().BeOfType<BadRequestObjectResult>();
    }
}
