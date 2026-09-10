namespace ClinIQ.Shared.DTOs.Auth;

public record RegisterRequest(
    string Email,
    string Password,
    string ConfirmPassword,
    string FirstName,
    string LastName,
    string? Phone,
    string OrganizationName
);
