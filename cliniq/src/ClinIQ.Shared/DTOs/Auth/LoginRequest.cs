namespace ClinIQ.Shared.DTOs.Auth;

public record LoginRequest(
    string Email,
    string Password,
    bool RememberMe = false
);
