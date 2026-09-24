using ClinIQ.Domain.Enums;

namespace ClinIQ.Shared.DTOs.Patients;

public record CreatePatientRequest(
    string? FirstName,
    string? LastName,
    string? FullName,
    string? MiddleName,
    string? Title,
    DateTime? DateOfBirth,
    int? Age,
    Gender? Gender,
    BloodGroup? BloodGroup,
    MaritalStatus? MaritalStatus,
    string? Nationality,
    string? Religion,
    string? Occupation,
    string? Email,
    string? Phone,
    string? AlternatePhone,
    string? Address,
    string? City,
    string? State,
    string? Country,
    string? PostalCode,
    string? EmergencyContactName,
    string? EmergencyContactRelation,
    string? EmergencyContactPhone,
    IEnumerable<string>? Allergies,
    IEnumerable<string>? ChronicConditions,
    string? Notes,
    Guid? PatientCategoryId
);
