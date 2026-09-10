using ClinIQ.API.Controllers;
using ClinIQ.Application.Interfaces;
using ClinIQ.Application.DTOs.Appointment;
using ClinIQ.Shared.Models;
using Microsoft.AspNetCore.Mvc;

namespace ClinIQ.API.Tests.Controllers;

public class AppointmentsControllerTests
{
    private readonly Mock<IAppointmentService> _appointmentServiceMock;
    private readonly AppointmentsController _controller;
    private readonly Fixture _fixture;

    public AppointmentsControllerTests()
    {
        _appointmentServiceMock = new Mock<IAppointmentService>();
        _controller = new AppointmentsController(_appointmentServiceMock.Object);
        _fixture = new Fixture();
    }

    [Fact]
    public async Task GetAll_ReturnsOkResult_WithPagedAppointments()
    {
        // Arrange
        var appointments = _fixture.CreateMany<AppointmentListDto>(10).ToList();
        var pagedResult = new PagedResult<AppointmentListDto>
        {
            Items = appointments,
            TotalCount = 10,
            PageNumber = 1,
            PageSize = 10
        };
        _appointmentServiceMock.Setup(s => s.GetAllAsync(It.IsAny<AppointmentQueryParameters>()))
            .ReturnsAsync(pagedResult);

        // Act
        var result = await _controller.GetAll(new AppointmentQueryParameters());

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeOfType<PagedResult<AppointmentListDto>>().Subject;
        returnValue.Items.Should().HaveCount(10);
    }

    [Fact]
    public async Task GetByDate_ReturnsAppointmentsForDate()
    {
        // Arrange
        var date = DateTime.Today;
        var appointments = _fixture.CreateMany<AppointmentListDto>(5).ToList();
        _appointmentServiceMock.Setup(s => s.GetByDateAsync(date))
            .ReturnsAsync(appointments);

        // Act
        var result = await _controller.GetByDate(date);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeAssignableTo<IEnumerable<AppointmentListDto>>().Subject;
        returnValue.Should().HaveCount(5);
    }

    [Fact]
    public async Task GetByDoctor_ReturnsAppointmentsForDoctor()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var startDate = DateTime.Today;
        var endDate = DateTime.Today.AddDays(7);
        var appointments = _fixture.CreateMany<AppointmentListDto>(3).ToList();
        _appointmentServiceMock.Setup(s => s.GetByDoctorAsync(doctorId, startDate, endDate))
            .ReturnsAsync(appointments);

        // Act
        var result = await _controller.GetByDoctor(doctorId, startDate, endDate);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeAssignableTo<IEnumerable<AppointmentListDto>>().Subject;
        returnValue.Should().HaveCount(3);
    }

    [Fact]
    public async Task Create_WithValidData_ReturnsCreatedResult()
    {
        // Arrange
        var createDto = _fixture.Create<CreateAppointmentDto>();
        var createdAppointment = _fixture.Create<AppointmentDetailDto>();
        _appointmentServiceMock.Setup(s => s.CreateAsync(createDto))
            .ReturnsAsync(createdAppointment);

        // Act
        var result = await _controller.Create(createDto);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        createdResult.ActionName.Should().Be(nameof(AppointmentsController.GetById));
    }

    [Fact]
    public async Task CheckIn_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var appointmentId = Guid.NewGuid();
        var appointment = _fixture.Create<AppointmentDetailDto>();
        _appointmentServiceMock.Setup(s => s.CheckInAsync(appointmentId))
            .ReturnsAsync(appointment);

        // Act
        var result = await _controller.CheckIn(appointmentId);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Cancel_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var appointmentId = Guid.NewGuid();
        var cancellationDto = new CancelAppointmentDto { Reason = "Patient request" };
        var appointment = _fixture.Create<AppointmentDetailDto>();
        _appointmentServiceMock.Setup(s => s.CancelAsync(appointmentId, cancellationDto.Reason))
            .ReturnsAsync(appointment);

        // Act
        var result = await _controller.Cancel(appointmentId, cancellationDto);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetAvailableSlots_ReturnsAvailableTimeSlots()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var date = DateTime.Today;
        var slots = new List<TimeSlotDto>
        {
            new() { StartTime = TimeSpan.FromHours(9), EndTime = TimeSpan.FromHours(9.5), IsAvailable = true },
            new() { StartTime = TimeSpan.FromHours(9.5), EndTime = TimeSpan.FromHours(10), IsAvailable = false },
            new() { StartTime = TimeSpan.FromHours(10), EndTime = TimeSpan.FromHours(10.5), IsAvailable = true }
        };
        _appointmentServiceMock.Setup(s => s.GetAvailableSlotsAsync(doctorId, date))
            .ReturnsAsync(slots);

        // Act
        var result = await _controller.GetAvailableSlots(doctorId, date);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeAssignableTo<IEnumerable<TimeSlotDto>>().Subject;
        returnValue.Should().HaveCount(3);
    }

    [Fact]
    public async Task Reschedule_WithValidData_ReturnsOkResult()
    {
        // Arrange
        var appointmentId = Guid.NewGuid();
        var rescheduleDto = new RescheduleAppointmentDto
        {
            NewDate = DateTime.Today.AddDays(1),
            NewTime = TimeSpan.FromHours(14)
        };
        var appointment = _fixture.Create<AppointmentDetailDto>();
        _appointmentServiceMock.Setup(s => s.RescheduleAsync(appointmentId, rescheduleDto))
            .ReturnsAsync(appointment);

        // Act
        var result = await _controller.Reschedule(appointmentId, rescheduleDto);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }
}
