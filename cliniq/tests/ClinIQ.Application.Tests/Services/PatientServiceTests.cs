using ClinIQ.Application.Services;
using ClinIQ.Application.DTOs.Patient;
using ClinIQ.Application.Interfaces;
using ClinIQ.Domain.Entities;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Shared.Models;
using AutoMapper;

namespace ClinIQ.Application.Tests.Services;

public class PatientServiceTests
{
    private readonly Mock<IPatientRepository> _patientRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<ITenantService> _tenantServiceMock;
    private readonly PatientService _service;
    private readonly Fixture _fixture;

    public PatientServiceTests()
    {
        _patientRepositoryMock = new Mock<IPatientRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _mapperMock = new Mock<IMapper>();
        _tenantServiceMock = new Mock<ITenantService>();
        _service = new PatientService(
            _patientRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _mapperMock.Object,
            _tenantServiceMock.Object);
        _fixture = new Fixture();

        _tenantServiceMock.Setup(t => t.TenantId).Returns(Guid.NewGuid());
    }

    [Fact]
    public async Task GetByIdAsync_WithValidId_ReturnsPatient()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        var patient = _fixture.Build<Patient>()
            .With(p => p.Id, patientId)
            .Without(p => p.Appointments)
            .Without(p => p.Admissions)
            .Without(p => p.MedicalRecords)
            .Create();
        var patientDto = _fixture.Build<PatientDetailDto>()
            .With(p => p.Id, patientId)
            .Create();

        _patientRepositoryMock.Setup(r => r.GetByIdAsync(patientId))
            .ReturnsAsync(patient);
        _mapperMock.Setup(m => m.Map<PatientDetailDto>(patient))
            .Returns(patientDto);

        // Act
        var result = await _service.GetByIdAsync(patientId);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(patientId);
    }

    [Fact]
    public async Task GetByIdAsync_WithInvalidId_ReturnsNull()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        _patientRepositoryMock.Setup(r => r.GetByIdAsync(patientId))
            .ReturnsAsync((Patient?)null);

        // Act
        var result = await _service.GetByIdAsync(patientId);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateAsync_WithValidData_CreatesAndReturnsPatient()
    {
        // Arrange
        var createDto = _fixture.Create<CreatePatientDto>();
        var patient = _fixture.Build<Patient>()
            .Without(p => p.Appointments)
            .Without(p => p.Admissions)
            .Without(p => p.MedicalRecords)
            .Create();
        var patientDto = _fixture.Create<PatientDetailDto>();

        _mapperMock.Setup(m => m.Map<Patient>(createDto)).Returns(patient);
        _patientRepositoryMock.Setup(r => r.AddAsync(patient)).ReturnsAsync(patient);
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);
        _mapperMock.Setup(m => m.Map<PatientDetailDto>(patient)).Returns(patientDto);

        // Act
        var result = await _service.CreateAsync(createDto);

        // Assert
        result.Should().NotBeNull();
        _patientRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Patient>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_WithValidData_UpdatesAndReturnsPatient()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        var updateDto = _fixture.Build<UpdatePatientDto>()
            .With(p => p.Id, patientId)
            .Create();
        var existingPatient = _fixture.Build<Patient>()
            .With(p => p.Id, patientId)
            .Without(p => p.Appointments)
            .Without(p => p.Admissions)
            .Without(p => p.MedicalRecords)
            .Create();
        var updatedPatientDto = _fixture.Create<PatientDetailDto>();

        _patientRepositoryMock.Setup(r => r.GetByIdAsync(patientId))
            .ReturnsAsync(existingPatient);
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);
        _mapperMock.Setup(m => m.Map<PatientDetailDto>(existingPatient)).Returns(updatedPatientDto);

        // Act
        var result = await _service.UpdateAsync(updateDto);

        // Assert
        result.Should().NotBeNull();
        _patientRepositoryMock.Verify(r => r.Update(It.IsAny<Patient>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WithValidId_DeletesPatient()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        var patient = _fixture.Build<Patient>()
            .With(p => p.Id, patientId)
            .Without(p => p.Appointments)
            .Without(p => p.Admissions)
            .Without(p => p.MedicalRecords)
            .Create();

        _patientRepositoryMock.Setup(r => r.GetByIdAsync(patientId))
            .ReturnsAsync(patient);
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        // Act
        var result = await _service.DeleteAsync(patientId);

        // Assert
        result.Should().BeTrue();
        _patientRepositoryMock.Verify(r => r.Delete(patient), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WithInvalidId_ReturnsFalse()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        _patientRepositoryMock.Setup(r => r.GetByIdAsync(patientId))
            .ReturnsAsync((Patient?)null);

        // Act
        var result = await _service.DeleteAsync(patientId);

        // Assert
        result.Should().BeFalse();
        _patientRepositoryMock.Verify(r => r.Delete(It.IsAny<Patient>()), Times.Never);
    }

    [Fact]
    public async Task SearchAsync_ReturnsMatchingPatients()
    {
        // Arrange
        var searchTerm = "John";
        var patients = _fixture.Build<Patient>()
            .Without(p => p.Appointments)
            .Without(p => p.Admissions)
            .Without(p => p.MedicalRecords)
            .CreateMany(3)
            .ToList();
        var patientDtos = _fixture.CreateMany<PatientListDto>(3).ToList();

        _patientRepositoryMock.Setup(r => r.SearchAsync(searchTerm))
            .ReturnsAsync(patients);
        _mapperMock.Setup(m => m.Map<IEnumerable<PatientListDto>>(patients))
            .Returns(patientDtos);

        // Act
        var result = await _service.SearchAsync(searchTerm);

        // Assert
        result.Should().HaveCount(3);
    }

    [Fact]
    public async Task GetMedicalHistoryAsync_ReturnsPatientMedicalHistory()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        var medicalHistory = _fixture.Create<MedicalHistoryDto>();

        _patientRepositoryMock.Setup(r => r.GetMedicalHistoryAsync(patientId))
            .ReturnsAsync(medicalHistory);

        // Act
        var result = await _service.GetMedicalHistoryAsync(patientId);

        // Assert
        result.Should().NotBeNull();
    }
}
