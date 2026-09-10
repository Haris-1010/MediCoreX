namespace ClinIQ.Domain.Exceptions;

/// <summary>
/// Exception for forbidden access
/// </summary>
public class ForbiddenException : DomainException
{
    public ForbiddenException(string message = "You do not have permission to access this resource.")
        : base(message, "FORBIDDEN")
    {
    }
}
