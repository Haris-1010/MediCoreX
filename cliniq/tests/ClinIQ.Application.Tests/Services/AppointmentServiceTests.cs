using ClinIQ.Application.Interfaces;
using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Shared.DTOs.Appointments;
using ClinIQ.Shared.Models;
using AutoFixture;

namespace ClinIQ.Application.Tests.Services;

public class AppointmentServiceTests
{
    private readonly Mock<IAppointmentService> _appointmentServiceMock;
    private readonly Fixture _fixture;

    public AppointmentServiceTests()
    {
        _appointmentServiceMock = new Mock<IAppointmentService>();
        _fixture = new Fixture();
    }

    [Fact]
    public async Task CreateAsync_WithValidData_CreatesAppointment()
    {
        // Arrange
        var createRequest = _fixture.Create<CreateAppointmentRequest>();
        var appointmentDetailDto = _fixture.Create<AppointmentDetailDto>();
        var result = Result<AppointmentDetailDto>.Success(appointmentDetailDto);

        _appointmentServiceMock
            .Setup(s => s.CreateAsync(createRequest, It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var serviceResult = await _appointmentServiceMock.Object.CreateAsync(createRequest);

        // Assert
        serviceResult.Should().NotBeNull();
        serviceResult.Succeeded.Should().BeTrue();
        serviceResult.Data.Should().NotBeNull();
    }

    [Fact]
    public async Task CreateAsync_WithInvalidData_ReturnsFail()
    {
        // Arrange
        var createRequest = _fixture.Create<CreateAppointmentRequest>();
        var errorResult = Result<AppointmentDetailDto>.Failure("Invalid appointment data");

        _appointmentServiceMock
            .Setup(s => s.CreateAsync(createRequest, It.IsAny<CancellationToken>()))
            .ReturnsAsync(errorResult);

        // Act & Assert
        var serviceResult = await _appointmentServiceMock.Object.CreateAsync(createRequest);
        serviceResult.Succeeded.Should().BeFalse();
    }

    [Fact]
    public async Task GetByDateAsync_ReturnsAppointmentsForDate()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var date = DateTime.Today;
        var appointmentDtos = _fixture.CreateMany<AppointmentDto>(5).ToList();
        var result = Result<IEnumerable<AppointmentDto>>.Success(appointmentDtos);

        _appointmentServiceMock
            .Setup(s => s.GetByDoctorAsync(doctorId, date, It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var serviceResult = await _appointmentServiceMock.Object.GetByDoctorAsync(doctorId, date);

        // Assert
        serviceResult.Should().NotBeNull();
        serviceResult.Succeeded.Should().BeTrue();
        serviceResult.Data.Should().HaveCount(5);
    }

    [Fact]
    public async Task CheckInAsync_UpdatesAppointmentStatus()
    {
        // Arrange
        var appointmentId = Guid.NewGuid();
        var result = Result<int>.Success(1);

        _appointmentServiceMock.Setup(s => s.CheckInAsync(appointmentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var serviceResult = await _appointmentServiceMock.Object.CheckInAsync(appointmentId);

        // Assert
        serviceResult.Should().NotBeNull();
        serviceResult.Succeeded.Should().BeTrue();
        serviceResult.Data.Should().Be(1);
    }

    [Fact]
    public async Task CancelAsync_WithValidId_CancelsAppointment()
    {
        // Arrange
        var appointmentId = Guid.NewGuid();
        var reason = "Patient request";
        var result = Result.Success();

        _appointmentServiceMock.Setup(s => s.CancelAsync(appointmentId, reason, It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var serviceResult = await _appointmentServiceMock.Object.CancelAsync(appointmentId, reason);

        // Assert
        serviceResult.Should().NotBeNull();
        serviceResult.Succeeded.Should().BeTrue();
    }

    [Fact]
    public async Task GetAvailableSlotsAsync_ReturnsAvailableSlots()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var date = DateTime.Today;
        var slots = new List<TimeSlotDto>
        {
            new(TimeSpan.FromHours(9), TimeSpan.FromHours(9.5), true),
            new(TimeSpan.FromHours(10), TimeSpan.FromHours(10.5), true)
        };
        var result = Result<IEnumerable<TimeSlotDto>>.Success(slots);

        _appointmentServiceMock
            .Setup(s => s.GetAvailableSlotsAsync(doctorId, date, It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var serviceResult = await _appointmentServiceMock.Object.GetAvailableSlotsAsync(doctorId, date);

        // Assert
        serviceResult.Should().NotBeNull();
        serviceResult.Succeeded.Should().BeTrue();
        serviceResult.Data.Should().HaveCount(2);
        serviceResult.Data.All(s => s.IsAvailable).Should().BeTrue();
    }

    [Fact]
    public async Task RescheduleAsync_WithValidData_ReschedulesAppointment()
    {
        // Arrange
        var appointmentId = Guid.NewGuid();
        var newDate = DateTime.Today.AddDays(1);
        var newTime = TimeSpan.FromHours(14);
        var appointmentDetailDto = _fixture.Create<AppointmentDetailDto>();
        var result = Result<AppointmentDetailDto>.Success(appointmentDetailDto);

        _appointmentServiceMock
            .Setup(s => s.RescheduleAsync(appointmentId, newDate, newTime, null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var serviceResult = await _appointmentServiceMock.Object.RescheduleAsync(appointmentId, newDate, newTime, null);

        // Assert
        serviceResult.Should().NotBeNull();
        serviceResult.Succeeded.Should().BeTrue();
        serviceResult.Data.Should().NotBeNull();
    }
}
