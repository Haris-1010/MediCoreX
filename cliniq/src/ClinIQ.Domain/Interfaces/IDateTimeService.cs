namespace ClinIQ.Domain.Interfaces;

/// <summary>
/// Service for date/time operations
/// </summary>
public interface IDateTimeService
{
    DateTime Now { get; }
    DateTime UtcNow { get; }
    DateOnly Today { get; }
    DateTime ConvertToTenantTimezone(DateTime utcDateTime);
    DateTime ConvertToUtc(DateTime localDateTime);
}
