using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace ClinIQ.Shared.Extensions;

/// <summary>
/// String extension methods
/// </summary>
public static partial class StringExtensions
{
    public static bool IsNullOrEmpty(this string? value) => string.IsNullOrEmpty(value);

    public static bool IsNullOrWhiteSpace(this string? value) => string.IsNullOrWhiteSpace(value);

    public static string ToSlug(this string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        // Convert to lowercase
        value = value.ToLowerInvariant();

        // Remove diacritics
        value = RemoveDiacritics(value);

        // Replace spaces with hyphens
        value = value.Replace(' ', '-');

        // Remove invalid characters
        value = SlugRegex().Replace(value, "");

        // Replace multiple hyphens with single
        value = MultipleHyphensRegex().Replace(value, "-");

        return value.Trim('-');
    }

    public static string ToTitleCase(this string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        return CultureInfo.CurrentCulture.TextInfo.ToTitleCase(value.ToLower());
    }

    public static string Truncate(this string value, int maxLength, string suffix = "...")
    {
        if (string.IsNullOrEmpty(value) || value.Length <= maxLength)
            return value;

        return value[..(maxLength - suffix.Length)] + suffix;
    }

    public static string? NullIfEmpty(this string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value;
    }

    public static string MaskEmail(this string email)
    {
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
            return email;

        var parts = email.Split('@');
        var name = parts[0];
        var domain = parts[1];

        if (name.Length <= 2)
            return $"{name[0]}***@{domain}";

        return $"{name[0]}{new string('*', Math.Min(name.Length - 2, 5))}{name[^1]}@{domain}";
    }

    public static string MaskPhone(this string phone)
    {
        if (string.IsNullOrWhiteSpace(phone) || phone.Length < 4)
            return phone;

        return $"{new string('*', phone.Length - 4)}{phone[^4..]}";
    }

    private static string RemoveDiacritics(string text)
    {
        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }

    [GeneratedRegex("[^a-z0-9-]")]
    private static partial Regex SlugRegex();

    [GeneratedRegex("-+")]
    private static partial Regex MultipleHyphensRegex();
}
