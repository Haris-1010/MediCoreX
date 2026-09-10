using ClinIQ.Domain.Interfaces;

namespace ClinIQ.Infrastructure.Services;

public class DateTimeService : IDateTimeService
{
    public DateTime Now => DateTime.Now;
    public DateTime UtcNow => DateTime.UtcNow;
    public DateOnly Today => DateOnly.FromDateTime(DateTime.Today);

    public DateTime ConvertToTenantTimezone(DateTime utcDateTime)
    {
        // TODO: Get timezone from tenant settings
        // For now, return UTC
        return utcDateTime;
    }

    public DateTime ConvertToUtc(DateTime localDateTime)
    {
        // TODO: Get timezone from tenant settings and convert
        // For now, assume input is already UTC
        return DateTime.SpecifyKind(localDateTime, DateTimeKind.Utc);
    }
}
