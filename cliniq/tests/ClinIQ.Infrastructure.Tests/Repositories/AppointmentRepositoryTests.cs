using ClinIQ.Domain.Entities;
using ClinIQ.Domain.Enums;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Infrastructure.Repositories;
using ClinIQ.Application.Interfaces;

namespace ClinIQ.Infrastructure.Tests.Repositories;

public class AppointmentRepositoryTests : IDisposable
{
    private readonly ClinIQDbContext _context;
    private readonly AppointmentRepository _repository;
    private readonly Guid _tenantId = Guid.NewGuid();
    private readonly Mock<ITenantService> _tenantServiceMock;

    public AppointmentRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<ClinIQDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _tenantServiceMock = new Mock<ITenantService>();
        _tenantServiceMock.Setup(t => t.TenantId).Returns(_tenantId);

        _context = new ClinIQDbContext(options, _tenantServiceMock.Object);
        _repository = new AppointmentRepository(_context);
    }

    [Fact]
    public async Task GetByDateAsync_ShouldReturnAppointmentsForDate()
    {
        // Arrange
        var today = DateTime.Today;
        var doctorId = Guid.NewGuid();
        var patientId = Guid.NewGuid();

        var appointments = new List<Appointment>
        {
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, DoctorId = doctorId, PatientId = patientId, AppointmentDate = today, StartTime = TimeSpan.FromHours(9), EndTime = TimeSpan.FromHours(9.5), Status = AppointmentStatus.Scheduled },
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, DoctorId = doctorId, PatientId = patientId, AppointmentDate = today, StartTime = TimeSpan.FromHours(10), EndTime = TimeSpan.FromHours(10.5), Status = AppointmentStatus.Scheduled },
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, DoctorId = doctorId, PatientId = patientId, AppointmentDate = today.AddDays(1), StartTime = TimeSpan.FromHours(9), EndTime = TimeSpan.FromHours(9.5), Status = AppointmentStatus.Scheduled }
        };
        await _context.Appointments.AddRangeAsync(appointments);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByDateAsync(today);

        // Assert
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetByDoctorAsync_ShouldReturnDoctorAppointments()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var otherDoctorId = Guid.NewGuid();
        var patientId = Guid.NewGuid();
        var startDate = DateTime.Today;
        var endDate = DateTime.Today.AddDays(7);

        var appointments = new List<Appointment>
        {
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, DoctorId = doctorId, PatientId = patientId, AppointmentDate = startDate, StartTime = TimeSpan.FromHours(9), EndTime = TimeSpan.FromHours(9.5), Status = AppointmentStatus.Scheduled },
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, DoctorId = doctorId, PatientId = patientId, AppointmentDate = startDate.AddDays(2), StartTime = TimeSpan.FromHours(10), EndTime = TimeSpan.FromHours(10.5), Status = AppointmentStatus.Scheduled },
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, DoctorId = otherDoctorId, PatientId = patientId, AppointmentDate = startDate, StartTime = TimeSpan.FromHours(9), EndTime = TimeSpan.FromHours(9.5), Status = AppointmentStatus.Scheduled }
        };
        await _context.Appointments.AddRangeAsync(appointments);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByDoctorAsync(doctorId, startDate, endDate);

        // Assert
        result.Should().HaveCount(2);
        result.All(a => a.DoctorId == doctorId).Should().BeTrue();
    }

    [Fact]
    public async Task IsSlotAvailableAsync_WhenSlotFree_ShouldReturnTrue()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var date = DateTime.Today;
        var time = TimeSpan.FromHours(11);

        // Act
        var result = await _repository.IsSlotAvailableAsync(doctorId, date, time);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task IsSlotAvailableAsync_WhenSlotTaken_ShouldReturnFalse()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var patientId = Guid.NewGuid();
        var date = DateTime.Today;
        var time = TimeSpan.FromHours(9);

        var appointment = new Appointment
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            DoctorId = doctorId,
            PatientId = patientId,
            AppointmentDate = date,
            StartTime = time,
            EndTime = time.Add(TimeSpan.FromMinutes(30)),
            Status = AppointmentStatus.Scheduled
        };
        await _context.Appointments.AddAsync(appointment);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.IsSlotAvailableAsync(doctorId, date, time);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task GetByPatientAsync_ShouldReturnPatientAppointments()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        var otherPatientId = Guid.NewGuid();
        var doctorId = Guid.NewGuid();

        var appointments = new List<Appointment>
        {
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, DoctorId = doctorId, PatientId = patientId, AppointmentDate = DateTime.Today, StartTime = TimeSpan.FromHours(9), EndTime = TimeSpan.FromHours(9.5), Status = AppointmentStatus.Scheduled },
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, DoctorId = doctorId, PatientId = patientId, AppointmentDate = DateTime.Today.AddDays(1), StartTime = TimeSpan.FromHours(10), EndTime = TimeSpan.FromHours(10.5), Status = AppointmentStatus.Completed },
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, DoctorId = doctorId, PatientId = otherPatientId, AppointmentDate = DateTime.Today, StartTime = TimeSpan.FromHours(11), EndTime = TimeSpan.FromHours(11.5), Status = AppointmentStatus.Scheduled }
        };
        await _context.Appointments.AddRangeAsync(appointments);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByPatientAsync(patientId);

        // Assert
        result.Should().HaveCount(2);
        result.All(a => a.PatientId == patientId).Should().BeTrue();
    }

    [Fact]
    public async Task GetUpcomingAsync_ShouldReturnFutureAppointments()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var patientId = Guid.NewGuid();

        var appointments = new List<Appointment>
        {
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, DoctorId = doctorId, PatientId = patientId, AppointmentDate = DateTime.Today.AddDays(1), StartTime = TimeSpan.FromHours(9), EndTime = TimeSpan.FromHours(9.5), Status = AppointmentStatus.Scheduled },
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, DoctorId = doctorId, PatientId = patientId, AppointmentDate = DateTime.Today.AddDays(-1), StartTime = TimeSpan.FromHours(10), EndTime = TimeSpan.FromHours(10.5), Status = AppointmentStatus.Completed }
        };
        await _context.Appointments.AddRangeAsync(appointments);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetUpcomingAsync(patientId);

        // Assert
        result.Should().HaveCount(1);
        result.First().AppointmentDate.Should().BeAfter(DateTime.Today);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
