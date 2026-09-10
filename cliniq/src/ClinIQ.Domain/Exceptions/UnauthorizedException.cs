namespace ClinIQ.Domain.Exceptions;

/// <summary>
/// Exception for unauthorized access
/// </summary>
public class UnauthorizedException : DomainException
{
    public UnauthorizedException(string message = "You are not authorized to perform this action.")
        : base(message, "UNAUTHORIZED")
    {
    }
}
