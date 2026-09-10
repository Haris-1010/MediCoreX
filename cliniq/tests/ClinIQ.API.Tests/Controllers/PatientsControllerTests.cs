using ClinIQ.API.Controllers;
using ClinIQ.Application.Interfaces;
using ClinIQ.Application.DTOs.Patient;
using ClinIQ.Shared.Models;
using Microsoft.AspNetCore.Mvc;

namespace ClinIQ.API.Tests.Controllers;

public class PatientsControllerTests
{
    private readonly Mock<IPatientService> _patientServiceMock;
    private readonly PatientsController _controller;
    private readonly Fixture _fixture;

    public PatientsControllerTests()
    {
        _patientServiceMock = new Mock<IPatientService>();
        _controller = new PatientsController(_patientServiceMock.Object);
        _fixture = new Fixture();
    }

    [Fact]
    public async Task GetAll_ReturnsOkResult_WithPagedPatients()
    {
        // Arrange
        var patients = _fixture.CreateMany<PatientListDto>(10).ToList();
        var pagedResult = new PagedResult<PatientListDto>
        {
            Items = patients,
            TotalCount = 10,
            PageNumber = 1,
            PageSize = 10
        };
        _patientServiceMock.Setup(s => s.GetAllAsync(It.IsAny<PatientQueryParameters>()))
            .ReturnsAsync(pagedResult);

        // Act
        var result = await _controller.GetAll(new PatientQueryParameters());

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeOfType<PagedResult<PatientListDto>>().Subject;
        returnValue.Items.Should().HaveCount(10);
    }

    [Fact]
    public async Task GetById_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        var patient = _fixture.Build<PatientDetailDto>()
            .With(p => p.Id, patientId)
            .Create();
        _patientServiceMock.Setup(s => s.GetByIdAsync(patientId))
            .ReturnsAsync(patient);

        // Act
        var result = await _controller.GetById(patientId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeOfType<PatientDetailDto>().Subject;
        returnValue.Id.Should().Be(patientId);
    }

    [Fact]
    public async Task GetById_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        _patientServiceMock.Setup(s => s.GetByIdAsync(patientId))
            .ReturnsAsync((PatientDetailDto?)null);

        // Act
        var result = await _controller.GetById(patientId);

        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task Create_WithValidData_ReturnsCreatedResult()
    {
        // Arrange
        var createDto = _fixture.Create<CreatePatientDto>();
        var createdPatient = _fixture.Build<PatientDetailDto>()
            .With(p => p.FirstName, createDto.FirstName)
            .With(p => p.LastName, createDto.LastName)
            .Create();
        _patientServiceMock.Setup(s => s.CreateAsync(createDto))
            .ReturnsAsync(createdPatient);

        // Act
        var result = await _controller.Create(createDto);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        createdResult.ActionName.Should().Be(nameof(PatientsController.GetById));
    }

    [Fact]
    public async Task Update_WithValidData_ReturnsOkResult()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        var updateDto = _fixture.Build<UpdatePatientDto>()
            .With(p => p.Id, patientId)
            .Create();
        var updatedPatient = _fixture.Build<PatientDetailDto>()
            .With(p => p.Id, patientId)
            .Create();
        _patientServiceMock.Setup(s => s.UpdateAsync(updateDto))
            .ReturnsAsync(updatedPatient);

        // Act
        var result = await _controller.Update(patientId, updateDto);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeOfType<PatientDetailDto>().Subject;
        returnValue.Id.Should().Be(patientId);
    }

    [Fact]
    public async Task Update_WithMismatchedId_ReturnsBadRequest()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        var updateDto = _fixture.Build<UpdatePatientDto>()
            .With(p => p.Id, Guid.NewGuid())
            .Create();

        // Act
        var result = await _controller.Update(patientId, updateDto);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Delete_WithValidId_ReturnsNoContent()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        _patientServiceMock.Setup(s => s.DeleteAsync(patientId))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.Delete(patientId);

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task Delete_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        _patientServiceMock.Setup(s => s.DeleteAsync(patientId))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.Delete(patientId);

        // Assert
        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task Search_ReturnsMatchingPatients()
    {
        // Arrange
        var searchTerm = "John";
        var patients = _fixture.CreateMany<PatientListDto>(5).ToList();
        _patientServiceMock.Setup(s => s.SearchAsync(searchTerm))
            .ReturnsAsync(patients);

        // Act
        var result = await _controller.Search(searchTerm);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeAssignableTo<IEnumerable<PatientListDto>>().Subject;
        returnValue.Should().HaveCount(5);
    }
}
