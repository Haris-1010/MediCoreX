namespace ClinIQ.Shared.Extensions;

/// <summary>
/// DateTime extension methods
/// </summary>
public static class DateTimeExtensions
{
    public static DateTime StartOfDay(this DateTime date)
    {
        return date.Date;
    }

    public static DateTime EndOfDay(this DateTime date)
    {
        return date.Date.AddDays(1).AddTicks(-1);
    }

    public static DateTime StartOfWeek(this DateTime date, DayOfWeek startOfWeek = DayOfWeek.Monday)
    {
        int diff = (7 + (date.DayOfWeek - startOfWeek)) % 7;
        return date.AddDays(-diff).Date;
    }

    public static DateTime EndOfWeek(this DateTime date, DayOfWeek startOfWeek = DayOfWeek.Monday)
    {
        return date.StartOfWeek(startOfWeek).AddDays(7).AddTicks(-1);
    }

    public static DateTime StartOfMonth(this DateTime date)
    {
        return new DateTime(date.Year, date.Month, 1, 0, 0, 0, date.Kind);
    }

    public static DateTime EndOfMonth(this DateTime date)
    {
        return date.StartOfMonth().AddMonths(1).AddTicks(-1);
    }

    public static int GetAge(this DateTime dateOfBirth)
    {
        var today = DateTime.Today;
        var age = today.Year - dateOfBirth.Year;

        if (dateOfBirth.Date > today.AddYears(-age))
            age--;

        return age;
    }

    public static string ToRelativeTime(this DateTime dateTime)
    {
        var timeSpan = DateTime.UtcNow - dateTime;

        if (timeSpan <= TimeSpan.Zero)
            return "just now";

        if (timeSpan < TimeSpan.FromMinutes(1))
            return "just now";

        if (timeSpan < TimeSpan.FromMinutes(60))
            return $"{timeSpan.Minutes} minute{(timeSpan.Minutes > 1 ? "s" : "")} ago";

        if (timeSpan < TimeSpan.FromHours(24))
            return $"{timeSpan.Hours} hour{(timeSpan.Hours > 1 ? "s" : "")} ago";

        if (timeSpan < TimeSpan.FromDays(7))
            return $"{timeSpan.Days} day{(timeSpan.Days > 1 ? "s" : "")} ago";

        if (timeSpan < TimeSpan.FromDays(30))
        {
            var weeks = timeSpan.Days / 7;
            return $"{weeks} week{(weeks > 1 ? "s" : "")} ago";
        }

        if (timeSpan < TimeSpan.FromDays(365))
        {
            var months = timeSpan.Days / 30;
            return $"{months} month{(months > 1 ? "s" : "")} ago";
        }

        var years = timeSpan.Days / 365;
        return $"{years} year{(years > 1 ? "s" : "")} ago";
    }

    public static bool IsBetween(this DateTime date, DateTime start, DateTime end)
    {
        return date >= start && date <= end;
    }

    public static bool IsWeekend(this DateTime date)
    {
        return date.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday;
    }
}
