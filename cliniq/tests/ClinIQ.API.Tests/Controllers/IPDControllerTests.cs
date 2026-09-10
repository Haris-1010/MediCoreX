using ClinIQ.API.Controllers;
using ClinIQ.Application.Interfaces;
using ClinIQ.Application.DTOs.IPD;
using ClinIQ.Shared.Models;
using Microsoft.AspNetCore.Mvc;

namespace ClinIQ.API.Tests.Controllers;

public class IPDControllerTests
{
    private readonly Mock<IIPDService> _ipdServiceMock;
    private readonly Mock<IBedService> _bedServiceMock;
    private readonly IPDController _controller;
    private readonly Fixture _fixture;

    public IPDControllerTests()
    {
        _ipdServiceMock = new Mock<IIPDService>();
        _bedServiceMock = new Mock<IBedService>();
        _controller = new IPDController(_ipdServiceMock.Object, _bedServiceMock.Object);
        _fixture = new Fixture();
    }

    [Fact]
    public async Task GetAdmissions_ReturnsOkResult_WithPagedAdmissions()
    {
        // Arrange
        var admissions = _fixture.CreateMany<AdmissionListDto>(10).ToList();
        var pagedResult = new PagedResult<AdmissionListDto>
        {
            Items = admissions,
            TotalCount = 10,
            PageNumber = 1,
            PageSize = 10
        };
        _ipdServiceMock.Setup(s => s.GetAdmissionsAsync(It.IsAny<AdmissionQueryParameters>()))
            .ReturnsAsync(pagedResult);

        // Act
        var result = await _controller.GetAdmissions(new AdmissionQueryParameters());

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeOfType<PagedResult<AdmissionListDto>>().Subject;
        returnValue.Items.Should().HaveCount(10);
    }

    [Fact]
    public async Task GetAdmissionById_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var admissionId = Guid.NewGuid();
        var admission = _fixture.Build<AdmissionDetailDto>()
            .With(a => a.Id, admissionId)
            .Create();
        _ipdServiceMock.Setup(s => s.GetAdmissionByIdAsync(admissionId))
            .ReturnsAsync(admission);

        // Act
        var result = await _controller.GetAdmissionById(admissionId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeOfType<AdmissionDetailDto>().Subject;
        returnValue.Id.Should().Be(admissionId);
    }

    [Fact]
    public async Task AdmitPatient_WithValidData_ReturnsCreatedResult()
    {
        // Arrange
        var admitDto = _fixture.Create<AdmitPatientDto>();
        var admission = _fixture.Create<AdmissionDetailDto>();
        _ipdServiceMock.Setup(s => s.AdmitPatientAsync(admitDto))
            .ReturnsAsync(admission);

        // Act
        var result = await _controller.AdmitPatient(admitDto);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        createdResult.ActionName.Should().Be(nameof(IPDController.GetAdmissionById));
    }

    [Fact]
    public async Task DischargePatient_WithValidData_ReturnsOkResult()
    {
        // Arrange
        var admissionId = Guid.NewGuid();
        var dischargeDto = _fixture.Create<DischargePatientDto>();
        var admission = _fixture.Create<AdmissionDetailDto>();
        _ipdServiceMock.Setup(s => s.DischargePatientAsync(admissionId, dischargeDto))
            .ReturnsAsync(admission);

        // Act
        var result = await _controller.DischargePatient(admissionId, dischargeDto);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task TransferBed_WithValidData_ReturnsOkResult()
    {
        // Arrange
        var admissionId = Guid.NewGuid();
        var transferDto = _fixture.Create<TransferBedDto>();
        var admission = _fixture.Create<AdmissionDetailDto>();
        _ipdServiceMock.Setup(s => s.TransferBedAsync(admissionId, transferDto))
            .ReturnsAsync(admission);

        // Act
        var result = await _controller.TransferBed(admissionId, transferDto);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetAvailableBeds_ReturnsAvailableBeds()
    {
        // Arrange
        var beds = _fixture.CreateMany<BedDto>(10).ToList();
        _bedServiceMock.Setup(s => s.GetAvailableBedsAsync(It.IsAny<Guid?>()))
            .ReturnsAsync(beds);

        // Act
        var result = await _controller.GetAvailableBeds(null);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeAssignableTo<IEnumerable<BedDto>>().Subject;
        returnValue.Should().HaveCount(10);
    }

    [Fact]
    public async Task GetBedOccupancy_ReturnsBedOccupancyStats()
    {
        // Arrange
        var occupancy = _fixture.Create<BedOccupancyDto>();
        _bedServiceMock.Setup(s => s.GetBedOccupancyAsync())
            .ReturnsAsync(occupancy);

        // Act
        var result = await _controller.GetBedOccupancy();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeOfType<BedOccupancyDto>();
    }

    [Fact]
    public async Task AddNursingNote_WithValidData_ReturnsOkResult()
    {
        // Arrange
        var admissionId = Guid.NewGuid();
        var noteDto = _fixture.Create<AddNursingNoteDto>();
        var note = _fixture.Create<NursingNoteDto>();
        _ipdServiceMock.Setup(s => s.AddNursingNoteAsync(admissionId, noteDto))
            .ReturnsAsync(note);

        // Act
        var result = await _controller.AddNursingNote(admissionId, noteDto);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetNursingNotes_ReturnsNotesForAdmission()
    {
        // Arrange
        var admissionId = Guid.NewGuid();
        var notes = _fixture.CreateMany<NursingNoteDto>(5).ToList();
        _ipdServiceMock.Setup(s => s.GetNursingNotesAsync(admissionId))
            .ReturnsAsync(notes);

        // Act
        var result = await _controller.GetNursingNotes(admissionId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeAssignableTo<IEnumerable<NursingNoteDto>>().Subject;
        returnValue.Should().HaveCount(5);
    }

    [Fact]
    public async Task GetActiveAdmissions_ReturnsActiveAdmissions()
    {
        // Arrange
        var admissions = _fixture.CreateMany<AdmissionListDto>(5).ToList();
        _ipdServiceMock.Setup(s => s.GetActiveAdmissionsAsync())
            .ReturnsAsync(admissions);

        // Act
        var result = await _controller.GetActiveAdmissions();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeAssignableTo<IEnumerable<AdmissionListDto>>().Subject;
        returnValue.Should().HaveCount(5);
    }
}
