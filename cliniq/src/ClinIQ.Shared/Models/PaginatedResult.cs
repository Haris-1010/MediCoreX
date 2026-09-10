namespace ClinIQ.Shared.Models;

/// <summary>
/// Paginated result wrapper
/// </summary>
public class PaginatedResult<T> : Result<IReadOnlyList<T>>
{
    public int PageNumber { get; private set; }
    public int PageSize { get; private set; }
    public int TotalCount { get; private set; }
    public int TotalPages { get; private set; }
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;

    private PaginatedResult() { }

    public static PaginatedResult<T> Success(
        IReadOnlyList<T> data,
        int totalCount,
        int pageNumber,
        int pageSize)
    {
        return new PaginatedResult<T>
        {
            Succeeded = true,
            Data = data,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }

    public new static PaginatedResult<T> Failure(string message, string? code = null)
    {
        return new PaginatedResult<T>
        {
            Succeeded = false,
            Message = message,
            Code = code
        };
    }
}
