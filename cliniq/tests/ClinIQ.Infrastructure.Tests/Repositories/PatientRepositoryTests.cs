using ClinIQ.Domain.Entities;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Infrastructure.Repositories;
using ClinIQ.Application.Interfaces;

namespace ClinIQ.Infrastructure.Tests.Repositories;

public class PatientRepositoryTests : IDisposable
{
    private readonly ClinIQDbContext _context;
    private readonly PatientRepository _repository;
    private readonly Guid _tenantId = Guid.NewGuid();
    private readonly Mock<ITenantService> _tenantServiceMock;

    public PatientRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<ClinIQDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _tenantServiceMock = new Mock<ITenantService>();
        _tenantServiceMock.Setup(t => t.TenantId).Returns(_tenantId);

        _context = new ClinIQDbContext(options, _tenantServiceMock.Object);
        _repository = new PatientRepository(_context);
    }

    [Fact]
    public async Task AddAsync_ShouldAddPatient()
    {
        // Arrange
        var patient = new Patient
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = new DateTime(1990, 1, 1),
            Gender = "Male",
            MRN = "MRN-001"
        };

        // Act
        var result = await _repository.AddAsync(patient);
        await _context.SaveChangesAsync();

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().NotBe(Guid.Empty);
        var savedPatient = await _context.Patients.FindAsync(patient.Id);
        savedPatient.Should().NotBeNull();
    }

    [Fact]
    public async Task GetByIdAsync_WithValidId_ShouldReturnPatient()
    {
        // Arrange
        var patient = new Patient
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            FirstName = "Jane",
            LastName = "Smith",
            DateOfBirth = new DateTime(1985, 5, 15),
            Gender = "Female",
            MRN = "MRN-002"
        };
        await _context.Patients.AddAsync(patient);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByIdAsync(patient.Id);

        // Assert
        result.Should().NotBeNull();
        result!.FirstName.Should().Be("Jane");
    }

    [Fact]
    public async Task GetByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Act
        var result = await _repository.GetByIdAsync(Guid.NewGuid());

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllPatients()
    {
        // Arrange
        var patients = new List<Patient>
        {
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, FirstName = "Patient1", LastName = "Test", DateOfBirth = DateTime.Today, Gender = "Male", MRN = "MRN-003" },
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, FirstName = "Patient2", LastName = "Test", DateOfBirth = DateTime.Today, Gender = "Female", MRN = "MRN-004" }
        };
        await _context.Patients.AddRangeAsync(patients);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetAllAsync();

        // Assert
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task Update_ShouldModifyPatient()
    {
        // Arrange
        var patient = new Patient
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            FirstName = "Original",
            LastName = "Name",
            DateOfBirth = DateTime.Today,
            Gender = "Male",
            MRN = "MRN-005"
        };
        await _context.Patients.AddAsync(patient);
        await _context.SaveChangesAsync();

        // Act
        patient.FirstName = "Updated";
        _repository.Update(patient);
        await _context.SaveChangesAsync();

        // Assert
        var updatedPatient = await _context.Patients.FindAsync(patient.Id);
        updatedPatient!.FirstName.Should().Be("Updated");
    }

    [Fact]
    public async Task Delete_ShouldRemovePatient()
    {
        // Arrange
        var patient = new Patient
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            FirstName = "ToDelete",
            LastName = "Patient",
            DateOfBirth = DateTime.Today,
            Gender = "Male",
            MRN = "MRN-006"
        };
        await _context.Patients.AddAsync(patient);
        await _context.SaveChangesAsync();

        // Act
        _repository.Delete(patient);
        await _context.SaveChangesAsync();

        // Assert
        var deletedPatient = await _context.Patients.FindAsync(patient.Id);
        deletedPatient.Should().BeNull();
    }

    [Fact]
    public async Task SearchAsync_ShouldFindMatchingPatients()
    {
        // Arrange
        var patients = new List<Patient>
        {
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, FirstName = "John", LastName = "Doe", DateOfBirth = DateTime.Today, Gender = "Male", MRN = "MRN-007" },
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, FirstName = "Jane", LastName = "Doe", DateOfBirth = DateTime.Today, Gender = "Female", MRN = "MRN-008" },
            new() { Id = Guid.NewGuid(), TenantId = _tenantId, FirstName = "Bob", LastName = "Smith", DateOfBirth = DateTime.Today, Gender = "Male", MRN = "MRN-009" }
        };
        await _context.Patients.AddRangeAsync(patients);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.SearchAsync("Doe");

        // Assert
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetByMRNAsync_ShouldReturnCorrectPatient()
    {
        // Arrange
        var patient = new Patient
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            FirstName = "Test",
            LastName = "Patient",
            DateOfBirth = DateTime.Today,
            Gender = "Male",
            MRN = "MRN-UNIQUE-001"
        };
        await _context.Patients.AddAsync(patient);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByMRNAsync("MRN-UNIQUE-001");

        // Assert
        result.Should().NotBeNull();
        result!.MRN.Should().Be("MRN-UNIQUE-001");
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
