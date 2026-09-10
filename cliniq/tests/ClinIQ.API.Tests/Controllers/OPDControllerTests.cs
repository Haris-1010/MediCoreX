using ClinIQ.API.Controllers;
using ClinIQ.Application.Interfaces;
using ClinIQ.Application.DTOs.OPD;
using ClinIQ.Shared.Models;
using Microsoft.AspNetCore.Mvc;

namespace ClinIQ.API.Tests.Controllers;

public class OPDControllerTests
{
    private readonly Mock<IOPDService> _opdServiceMock;
    private readonly Mock<IQueueService> _queueServiceMock;
    private readonly OPDController _controller;
    private readonly Fixture _fixture;

    public OPDControllerTests()
    {
        _opdServiceMock = new Mock<IOPDService>();
        _queueServiceMock = new Mock<IQueueService>();
        _controller = new OPDController(_opdServiceMock.Object, _queueServiceMock.Object);
        _fixture = new Fixture();
    }

    [Fact]
    public async Task GetConsultations_ReturnsOkResult_WithPagedConsultations()
    {
        // Arrange
        var consultations = _fixture.CreateMany<ConsultationListDto>(10).ToList();
        var pagedResult = new PagedResult<ConsultationListDto>
        {
            Items = consultations,
            TotalCount = 10,
            PageNumber = 1,
            PageSize = 10
        };
        _opdServiceMock.Setup(s => s.GetConsultationsAsync(It.IsAny<ConsultationQueryParameters>()))
            .ReturnsAsync(pagedResult);

        // Act
        var result = await _controller.GetConsultations(new ConsultationQueryParameters());

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeOfType<PagedResult<ConsultationListDto>>().Subject;
        returnValue.Items.Should().HaveCount(10);
    }

    [Fact]
    public async Task GetTodaysQueue_ReturnsQueueForToday()
    {
        // Arrange
        var queueItems = _fixture.CreateMany<QueueItemDto>(5).ToList();
        _queueServiceMock.Setup(s => s.GetTodaysQueueAsync(It.IsAny<Guid?>()))
            .ReturnsAsync(queueItems);

        // Act
        var result = await _controller.GetTodaysQueue(null);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeAssignableTo<IEnumerable<QueueItemDto>>().Subject;
        returnValue.Should().HaveCount(5);
    }

    [Fact]
    public async Task AddToQueue_WithValidData_ReturnsCreatedResult()
    {
        // Arrange
        var addDto = _fixture.Create<AddToQueueDto>();
        var queueItem = _fixture.Create<QueueItemDto>();
        _queueServiceMock.Setup(s => s.AddToQueueAsync(addDto))
            .ReturnsAsync(queueItem);

        // Act
        var result = await _controller.AddToQueue(addDto);

        // Assert
        result.Result.Should().BeOfType<CreatedAtActionResult>();
    }

    [Fact]
    public async Task CallNextPatient_ReturnsNextPatientInQueue()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var queueItem = _fixture.Create<QueueItemDto>();
        _queueServiceMock.Setup(s => s.CallNextAsync(doctorId))
            .ReturnsAsync(queueItem);

        // Act
        var result = await _controller.CallNextPatient(doctorId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeOfType<QueueItemDto>();
    }

    [Fact]
    public async Task CallNextPatient_WhenQueueEmpty_ReturnsNoContent()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        _queueServiceMock.Setup(s => s.CallNextAsync(doctorId))
            .ReturnsAsync((QueueItemDto?)null);

        // Act
        var result = await _controller.CallNextPatient(doctorId);

        // Assert
        result.Result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task StartConsultation_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var queueItemId = Guid.NewGuid();
        var consultation = _fixture.Create<ConsultationDetailDto>();
        _opdServiceMock.Setup(s => s.StartConsultationAsync(queueItemId))
            .ReturnsAsync(consultation);

        // Act
        var result = await _controller.StartConsultation(queueItemId);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task CompleteConsultation_WithValidData_ReturnsOkResult()
    {
        // Arrange
        var consultationId = Guid.NewGuid();
        var completeDto = _fixture.Create<CompleteConsultationDto>();
        var consultation = _fixture.Create<ConsultationDetailDto>();
        _opdServiceMock.Setup(s => s.CompleteConsultationAsync(consultationId, completeDto))
            .ReturnsAsync(consultation);

        // Act
        var result = await _controller.CompleteConsultation(consultationId, completeDto);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetQueueStatus_ReturnsDashboardStats()
    {
        // Arrange
        var stats = _fixture.Create<QueueStatusDto>();
        _queueServiceMock.Setup(s => s.GetQueueStatusAsync())
            .ReturnsAsync(stats);

        // Act
        var result = await _controller.GetQueueStatus();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeOfType<QueueStatusDto>();
    }

    [Fact]
    public async Task SkipPatient_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var queueItemId = Guid.NewGuid();
        var skipDto = new SkipPatientDto { Reason = "Patient not present" };
        _queueServiceMock.Setup(s => s.SkipPatientAsync(queueItemId, skipDto.Reason))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.SkipPatient(queueItemId, skipDto);

        // Assert
        result.Should().BeOfType<OkResult>();
    }

    [Fact]
    public async Task GetVitals_ReturnsPatientVitals()
    {
        // Arrange
        var consultationId = Guid.NewGuid();
        var vitals = _fixture.Create<VitalsDto>();
        _opdServiceMock.Setup(s => s.GetVitalsAsync(consultationId))
            .ReturnsAsync(vitals);

        // Act
        var result = await _controller.GetVitals(consultationId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeOfType<VitalsDto>();
    }

    [Fact]
    public async Task RecordVitals_WithValidData_ReturnsOkResult()
    {
        // Arrange
        var consultationId = Guid.NewGuid();
        var vitalsDto = _fixture.Create<RecordVitalsDto>();
        var vitals = _fixture.Create<VitalsDto>();
        _opdServiceMock.Setup(s => s.RecordVitalsAsync(consultationId, vitalsDto))
            .ReturnsAsync(vitals);

        // Act
        var result = await _controller.RecordVitals(consultationId, vitalsDto);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }
}
