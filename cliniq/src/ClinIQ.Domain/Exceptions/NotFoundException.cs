namespace ClinIQ.Domain.Exceptions;

/// <summary>
/// Exception for entity not found
/// </summary>
public class NotFoundException : DomainException
{
    public NotFoundException(string entityName, object key)
        : base($"Entity \"{entityName}\" ({key}) was not found.", "NOT_FOUND")
    {
    }
}
