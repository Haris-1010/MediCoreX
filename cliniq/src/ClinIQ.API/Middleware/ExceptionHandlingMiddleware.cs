using System.Net;
using System.Text.Json;
using ClinIQ.Domain.Exceptions;
using ClinIQ.Shared.Models;

namespace ClinIQ.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var correlationId = context.Items["CorrelationId"]?.ToString();

        _logger.LogError(exception, "An error occurred. CorrelationId: {CorrelationId}", correlationId);

        var (statusCode, result) = exception switch
        {
            ValidationException validationEx => (
                HttpStatusCode.BadRequest,
                Result.ValidationFailure(validationEx.Errors)
            ),
            NotFoundException => (
                HttpStatusCode.NotFound,
                Result.Failure(exception.Message, "NOT_FOUND")
            ),
            UnauthorizedException => (
                HttpStatusCode.Unauthorized,
                Result.Failure(exception.Message, "UNAUTHORIZED")
            ),
            ForbiddenException => (
                HttpStatusCode.Forbidden,
                Result.Failure(exception.Message, "FORBIDDEN")
            ),
            ConflictException => (
                HttpStatusCode.Conflict,
                Result.Failure(exception.Message, "CONFLICT")
            ),
            DomainException domainEx => (
                HttpStatusCode.BadRequest,
                Result.Failure(domainEx.Message, domainEx.Code)
            ),
            _ => (
                HttpStatusCode.InternalServerError,
                Result.Failure("An unexpected error occurred. Please try again later.", "INTERNAL_ERROR")
            )
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(result, options);

        await context.Response.WriteAsync(json);
    }
}
