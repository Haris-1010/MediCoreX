using ClinIQ.Domain.Common;

namespace ClinIQ.API.Middleware;

/// <summary>
/// Captures the request facts every audit row should carry (IP, user agent,
/// path, method, correlation id) into an AsyncLocal slot that the EF audit
/// capture and IAuditService read later. Path is stored without the query
/// string so search terms and ad-hoc identifiers never leak into the audit
/// trail. Cleared after the response so the slot never outlives the request.
/// </summary>
public class AuditContextMiddleware
{
    private const int MaxPathLength = 400;
    private const int MaxUserAgentLength = 400;
    private readonly RequestDelegate _next;

    public AuditContextMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value ?? "/";
        if (path.Length > MaxPathLength)
            path = path[..MaxPathLength];

        var userAgent = context.Request.Headers.UserAgent.ToString();
        if (userAgent.Length > MaxUserAgentLength)
            userAgent = userAgent[..MaxUserAgentLength];

        AuditContext.Info = new AuditRequestInfo
        {
            IpAddress = context.Connection.RemoteIpAddress?.ToString(),
            UserAgent = userAgent,
            RequestPath = path,
            RequestMethod = context.Request.Method,
            CorrelationId = context.Items["CorrelationId"]?.ToString(),
        };

        try
        {
            await _next(context);
        }
        finally
        {
            AuditContext.Info = null;
        }
    }
}
