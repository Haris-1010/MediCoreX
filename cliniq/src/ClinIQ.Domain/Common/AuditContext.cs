namespace ClinIQ.Domain.Common;

/// <summary>
/// Per-request HTTP facts captured by API middleware so audit rows written
/// deep inside EF Core (Infrastructure) can record IP / user agent / path /
/// correlation id without the Domain or Infrastructure layers taking a
/// dependency on ASP.NET Core types.
/// </summary>
public sealed class AuditRequestInfo
{
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? RequestPath { get; set; }
    public string? RequestMethod { get; set; }
    public string? CorrelationId { get; set; }
}

/// <summary>
/// Ambient (AsyncLocal) holder for the current request's audit facts. Set by
/// <c>AuditContextMiddleware</c> for every HTTP request and cleared afterwards.
/// </summary>
public static class AuditContext
{
    private static readonly AsyncLocal<AuditRequestInfo?> _info = new();

    public static AuditRequestInfo? Info
    {
        get => _info.Value;
        set => _info.Value = value;
    }
}

/// <summary>
/// Opt-out for endpoints that write their own business-level audit event
/// (e.g. "Lab result verified") so the automatic change-tracker capture does
/// not also emit a plain UPDATE row for the very same save.
///
///   using (AuditCapture.Suppress()) { await _context.SaveChangesAsync(); }
///   await _audit.LogAsync(new AuditEvent { ... });
/// </summary>
public static class AuditCapture
{
    private static readonly AsyncLocal<bool> _suppressed = new();

    public static bool Suppressed
    {
        get => _suppressed.Value;
        set => _suppressed.Value = value;
    }

    /// <summary>Suppresses automatic audit capture until the returned scope is disposed.</summary>
    public static IDisposable Suppress()
    {
        var previous = _suppressed.Value;
        _suppressed.Value = true;
        return new Scope(previous);
    }

    private sealed class Scope : IDisposable
    {
        private readonly bool _previous;
        private bool _disposed;

        public Scope(bool previous) => _previous = previous;

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;
            _suppressed.Value = _previous;
        }
    }
}
