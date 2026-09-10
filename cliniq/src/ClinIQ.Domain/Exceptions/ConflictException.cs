namespace ClinIQ.Domain.Exceptions;

/// <summary>
/// Exception for conflict errors (e.g., duplicate, concurrency)
/// </summary>
public class ConflictException : DomainException
{
    public ConflictException(string message)
        : base(message, "CONFLICT")
    {
    }
}
