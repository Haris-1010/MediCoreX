using ClinIQ.Domain.Entities;
using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Enums;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;

namespace ClinIQ.Infrastructure.Tests.Data;

/// <summary>
/// Business audit capture in ApplicationDbContext: named actions, location
/// attribution, and the rule that secrets and clinical text never reach the
/// audit table.
/// </summary>
public class AuditCaptureTests : IDisposable
{
    private static readonly Guid Tenant = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static readonly Guid Lahore = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid Islamabad = Guid.Parse("22222222-2222-2222-2222-222222222222");
    private static readonly Guid Actor = Guid.Parse("99999999-9999-9999-9999-999999999999");

    private readonly Mock<ITenantService> _tenant = new();
    private readonly Mock<ICurrentUserService> _user = new();
    private readonly ApplicationDbContext _db;

    public AuditCaptureTests()
    {
        // A ticking clock so audit rows have a stable order.
        var clock = new DateTime(2026, 9, 1, 8, 0, 0, DateTimeKind.Utc);
        var dateTime = new Mock<IDateTimeService>();
        dateTime.Setup(d => d.UtcNow).Returns(() => clock = clock.AddSeconds(1));

        _tenant.Setup(t => t.GetCurrentTenantId()).Returns(Tenant);
        _tenant.Setup(t => t.GetCurrentBranchId()).Returns(Lahore);
        _tenant.Setup(t => t.HasAllLocationAccess()).Returns(true);
        _user.Setup(u => u.UserId).Returns(Actor);
        _user.Setup(u => u.FullName).Returns("Dr. Ali");
        _user.Setup(u => u.Email).Returns("ali@example.test");

        _db = new ApplicationDbContext(
            new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options,
            _tenant.Object, _user.Object, dateTime.Object);

        _db.Branches.AddRange(
            new Branch { Id = Lahore, TenantId = Tenant, Name = "Lahore", Code = "LHR" },
            new Branch { Id = Islamabad, TenantId = Tenant, Name = "Islamabad", Code = "ISB" });
        _db.SaveChanges();
        _db.AuditLogs.RemoveRange(_db.AuditLogs);
        _db.SaveChanges();
        _db.ChangeTracker.Clear();
    }

    private List<AuditLog> Logs() => _db.AuditLogs.AsNoTracking().OrderBy(a => a.Timestamp).ToList();

    private Appointment SeedAppointment(Guid branch)
    {
        var appointment = new Appointment
        {
            Id = Guid.NewGuid(), TenantId = Tenant, BranchId = branch, AppointmentNumber = "APT-1",
            PatientId = Guid.NewGuid(), DoctorId = Guid.NewGuid(), AppointmentDate = DateTime.Today,
            Status = AppointmentStatus.Scheduled,
        };
        _db.Appointments.Add(appointment);
        _db.SaveChanges();
        return appointment;
    }

    [Fact]
    public void Create_IsAudited_WithTenantUserAndEntityLocation()
    {
        // New rows are stamped with the caller's current location (by design,
        // nobody creates records in a location they are not working in).
        _tenant.Setup(t => t.GetCurrentBranchId()).Returns(Islamabad);
        var appointment = SeedAppointment(Islamabad);

        var log = Logs().Single();
        log.Action.Should().Be("CREATE");
        log.Module.Should().Be("Appointments");
        log.EntityType.Should().Be("Appointment");
        log.EntityId.Should().Be(appointment.Id.ToString());
        log.TenantId.Should().Be(Tenant);
        log.UserId.Should().Be(Actor);
        log.UserName.Should().Be("Dr. Ali");
        log.BranchId.Should().Be(Islamabad);
        log.LocationName.Should().Be("Islamabad");
    }

    [Fact]
    public void Update_IsAttributedToTheRecordsLocation_NotTheActorsCurrentOne()
    {
        _tenant.Setup(t => t.GetCurrentBranchId()).Returns(Islamabad);
        var appointment = SeedAppointment(Islamabad);

        // An All Locations admin currently working in Lahore edits it.
        _tenant.Setup(t => t.GetCurrentBranchId()).Returns(Lahore);
        appointment.Status = AppointmentStatus.Confirmed;
        _db.SaveChanges();

        var log = Logs().Last();
        log.Action.Should().Be("APPOINTMENT_CONFIRMED");
        log.BranchId.Should().Be(Islamabad);
    }

    [Fact]
    public void StatusChange_BecomesNamedBusinessAction_WithBeforeAfter()
    {
        var appointment = SeedAppointment(Lahore);

        appointment.Status = AppointmentStatus.Cancelled;
        _db.SaveChanges();

        var log = Logs().Last();
        log.Action.Should().Be("APPOINTMENT_CANCELLED");
        log.Description.Should().Contain("cancelled");
        log.OldValues.Should().Contain("Scheduled");
        log.NewValues.Should().Contain("Cancelled");
        log.AffectedColumns.Should().Contain("Status");
    }

    [Fact]
    public void LabResultVerification_IsNamed()
    {
        var item = new LabOrderItem { Id = Guid.NewGuid(), MedicalOrderId = Guid.NewGuid(), ServiceId = Guid.NewGuid(), ServiceName = "CBC", Status = LabOrderItemStatus.ResultEntered };
        _db.LabOrderItems.Add(item);
        _db.SaveChanges();

        item.Status = LabOrderItemStatus.Verified;
        _db.SaveChanges();

        Logs().Last().Action.Should().Be("LAB_RESULT_VERIFIED");
    }

    [Theory]
    [InlineData(false, "PAYMENT_RECEIVED")]
    [InlineData(true, "PAYMENT_REFUNDED")]
    public void Payment_Create_IsNamed(bool isRefund, string expected)
    {
        _db.Payments.Add(new Payment
        {
            Id = Guid.NewGuid(), TenantId = Tenant, BranchId = Lahore, PaymentNumber = "PAY-1",
            PatientId = Guid.NewGuid(), Amount = 500, PaymentDate = DateTime.UtcNow, IsRefund = isRefund,
        });
        _db.SaveChanges();

        Logs().Single().Action.Should().Be(expected);
    }

    [Fact]
    public void PasswordReset_IsAudited_ButHashNeverStored()
    {
        var user = new ApplicationUser { Id = Guid.NewGuid(), Email = "nurse@example.test", FirstName = "Sara", LastName = "Khan", PasswordHash = "hash-one" };
        _db.Users.Add(user);
        _db.SaveChanges();

        user.PasswordHash = "hash-two";
        _db.SaveChanges();

        var logs = Logs();
        logs.Last().Action.Should().Be("PASSWORD_RESET");
        foreach (var log in logs)
        {
            (log.OldValues ?? "").Should().NotContain("hash-");
            (log.NewValues ?? "").Should().NotContain("hash-");
            (log.OldValues ?? "").Should().NotContain("PasswordHash");
            (log.NewValues ?? "").Should().NotContain("PasswordHash");
        }
    }

    [Fact]
    public void ClinicalFreeText_IsNeverCopiedIntoAudit()
    {
        var patient = new Patient
        {
            Id = Guid.NewGuid(), TenantId = Tenant, BranchId = Lahore, PatientNumber = "P-1",
            FirstName = "Amna", LastName = "Riaz", Allergies = "Penicillin", ChronicConditions = "Asthma",
        };
        _db.Patients.Add(patient);
        _db.SaveChanges();

        patient.Allergies = "Penicillin, Latex";
        patient.FirstName = "Amna B.";
        _db.SaveChanges();

        foreach (var log in Logs())
        {
            (log.OldValues ?? "").Should().NotContain("Penicillin").And.NotContain("Asthma");
            (log.NewValues ?? "").Should().NotContain("Penicillin").And.NotContain("Asthma");
        }
        Logs().Last().AffectedColumns.Should().Contain("FirstName").And.NotContain("Allergies");
    }

    [Fact]
    public void LocationAccess_AddAndRemove_AreNamed_AndBelongToThatLocation()
    {
        var target = new ApplicationUser { Id = Guid.NewGuid(), Email = "dr@example.test", FirstName = "Ali", LastName = "Khan", PasswordHash = "x" };
        _db.Users.Add(target);
        _db.SaveChanges();

        var access = new BranchUser { Id = Guid.NewGuid(), TenantId = Tenant, UserId = target.Id, BranchId = Islamabad, IsActive = true };
        _db.BranchUsers.Add(access);
        _db.SaveChanges();

        var added = Logs().Last();
        added.Action.Should().Be("LOCATION_ACCESS_ADDED");
        added.BranchId.Should().Be(Islamabad);
        added.Description.Should().Contain("Ali Khan").And.Contain("Islamabad");

        _db.BranchUsers.Remove(access);
        _db.SaveChanges();

        Logs().Last().Action.Should().Be("LOCATION_ACCESS_REMOVED");
    }

    [Fact]
    public void LocationCreate_IsOrganizationLevel_WithEntityId()
    {
        var karachi = new Branch { Id = Guid.NewGuid(), TenantId = Tenant, Name = "Karachi", Code = "KHI" };
        _db.Branches.Add(karachi);
        _db.SaveChanges();

        var log = Logs().Single();
        log.Module.Should().Be("Locations");
        log.BranchId.Should().BeNull();
        log.EntityId.Should().Be(karachi.Id.ToString());
    }

    [Fact]
    public void LocationDeactivation_IsNamed()
    {
        var branch = _db.Branches.Single(b => b.Id == Lahore);
        branch.IsActive = false;
        _db.SaveChanges();

        Logs().Last().Action.Should().Be("LOCATION_DEACTIVATED");
    }

    [Fact]
    public void SynchronousSaveChanges_StampsTenantAndLocation_AndAudits()
    {
        _tenant.Setup(t => t.GetCurrentBranchId()).Returns(Islamabad);
        var appointment = new Appointment
        {
            Id = Guid.NewGuid(), AppointmentNumber = "APT-SYNC", PatientId = Guid.NewGuid(),
            DoctorId = Guid.NewGuid(), AppointmentDate = DateTime.Today,
        };
        _db.Appointments.Add(appointment);
        _db.SaveChanges();

        var saved = _db.Appointments.IgnoreQueryFilters().AsNoTracking().Single(a => a.Id == appointment.Id);
        saved.TenantId.Should().Be(Tenant);
        saved.BranchId.Should().Be(Islamabad);
        Logs().Should().ContainSingle(l => l.EntityId == appointment.Id.ToString());
    }

    [Fact]
    public void NoiseOnlyUpdate_IsNotAudited()
    {
        var appointment = SeedAppointment(Lahore);
        var before = Logs().Count;

        _db.Entry(appointment).Property(a => a.UpdatedAt).CurrentValue = DateTime.UtcNow.AddMinutes(5);
        _db.Entry(appointment).Property(a => a.UpdatedAt).IsModified = true;
        _db.SaveChanges();

        Logs().Count.Should().Be(before);
    }

    public void Dispose() => _db.Dispose();
}
