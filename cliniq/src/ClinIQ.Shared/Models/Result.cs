using System.Text.Json.Serialization;

namespace ClinIQ.Shared.Models;

/// <summary>
/// Generic result wrapper for API responses
/// </summary>
public class Result
{
    public bool Succeeded { get; protected set; }
    public string? Message { get; protected set; }
    public string? Code { get; protected set; }
    public IEnumerable<string> Errors { get; protected set; } = Enumerable.Empty<string>();
    [JsonIgnore]
    public IDictionary<string, string[]>? ValidationErrors { get; protected set; }

    protected Result() { }

    public static Result Success(string? message = null)
    {
        return new Result { Succeeded = true, Message = message };
    }

    public static Result Failure(string message, string? code = null)
    {
        return new Result { Succeeded = false, Message = message, Code = code };
    }

    public static Result Failure(IEnumerable<string> errors)
    {
        return new Result { Succeeded = false, Errors = errors };
    }

    public static Result ValidationFailure(IDictionary<string, string[]> errors)
    {
        return new Result
        {
            Succeeded = false,
            Code = "VALIDATION_ERROR",
            Message = "One or more validation errors occurred.",
            ValidationErrors = errors
        };
    }
}

/// <summary>
/// Generic result wrapper with data
/// </summary>
public class Result<T> : Result
{
    public T? Data { get; protected set; }

    protected Result() { }

    public static Result<T> Success(T data, string? message = null)
    {
        return new Result<T> { Succeeded = true, Data = data, Message = message };
    }

    public new static Result<T> Failure(string message, string? code = null)
    {
        return new Result<T> { Succeeded = false, Message = message, Code = code };
    }

    public new static Result<T> Failure(IEnumerable<string> errors)
    {
        return new Result<T> { Succeeded = false, Errors = errors };
    }

    public new static Result<T> ValidationFailure(IDictionary<string, string[]> errors)
    {
        return new Result<T>
        {
            Succeeded = false,
            Code = "VALIDATION_ERROR",
            Message = "One or more validation errors occurred.",
            ValidationErrors = errors
        };
    }
}
