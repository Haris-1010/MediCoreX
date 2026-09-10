using System.Net;
using System.Net.Http.Json;
using ClinIQ.Application.DTOs.Patient;
using Microsoft.AspNetCore.Mvc.Testing;

namespace ClinIQ.API.Tests.Integration;

public class PatientsIntegrationTests : IClassFixture<ClinIQWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly ClinIQWebApplicationFactory<Program> _factory;

    public PatientsIntegrationTests(ClinIQWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
    }

    [Fact]
    public async Task GetPatients_WithoutAuth_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/patients");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreatePatient_WithValidData_ReturnsCreated()
    {
        // Arrange
        await AuthenticateAsync();
        var createDto = new CreatePatientDto
        {
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = new DateTime(1990, 1, 1),
            Gender = "Male",
            Email = "john.doe@example.com",
            Phone = "1234567890"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/patients", createDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var patient = await response.Content.ReadFromJsonAsync<PatientDetailDto>();
        patient.Should().NotBeNull();
        patient!.FirstName.Should().Be("John");
    }

    [Fact]
    public async Task GetPatientById_WithValidId_ReturnsPatient()
    {
        // Arrange
        await AuthenticateAsync();
        var patientId = await CreateTestPatient();

        // Act
        var response = await _client.GetAsync($"/api/v1/patients/{patientId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var patient = await response.Content.ReadFromJsonAsync<PatientDetailDto>();
        patient.Should().NotBeNull();
    }

    [Fact]
    public async Task GetPatientById_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        await AuthenticateAsync();
        var invalidId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"/api/v1/patients/{invalidId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdatePatient_WithValidData_ReturnsOk()
    {
        // Arrange
        await AuthenticateAsync();
        var patientId = await CreateTestPatient();
        var updateDto = new UpdatePatientDto
        {
            Id = patientId,
            FirstName = "Jane",
            LastName = "Doe",
            DateOfBirth = new DateTime(1990, 1, 1),
            Gender = "Female"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/v1/patients/{patientId}", updateDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task DeletePatient_WithValidId_ReturnsNoContent()
    {
        // Arrange
        await AuthenticateAsync();
        var patientId = await CreateTestPatient();

        // Act
        var response = await _client.DeleteAsync($"/api/v1/patients/{patientId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task SearchPatients_ReturnsMatchingPatients()
    {
        // Arrange
        await AuthenticateAsync();
        await CreateTestPatient("John", "Smith");
        await CreateTestPatient("Jane", "Smith");

        // Act
        var response = await _client.GetAsync("/api/v1/patients/search?term=Smith");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var patients = await response.Content.ReadFromJsonAsync<List<PatientListDto>>();
        patients.Should().NotBeNull();
        patients!.Count.Should().BeGreaterOrEqualTo(2);
    }

    private async Task AuthenticateAsync()
    {
        // Add authentication token to client
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "test-token");
    }

    private async Task<Guid> CreateTestPatient(string firstName = "Test", string lastName = "Patient")
    {
        var createDto = new CreatePatientDto
        {
            FirstName = firstName,
            LastName = lastName,
            DateOfBirth = new DateTime(1990, 1, 1),
            Gender = "Male",
            Phone = "1234567890"
        };

        var response = await _client.PostAsJsonAsync("/api/v1/patients", createDto);
        var patient = await response.Content.ReadFromJsonAsync<PatientDetailDto>();
        return patient!.Id;
    }
}
