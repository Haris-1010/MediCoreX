using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces.External;

public interface IFileStorageService
{
    Task<Result<FileUploadResult>> UploadAsync(Stream stream, string fileName, string contentType, string? folder = null, CancellationToken cancellationToken = default);
    Task<Result<Stream>> DownloadAsync(string path, CancellationToken cancellationToken = default);
    Task<Result<string>> GetUrlAsync(string path, TimeSpan? expiry = null, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(string path, CancellationToken cancellationToken = default);
    Task<Result<bool>> ExistsAsync(string path, CancellationToken cancellationToken = default);
}

public record FileUploadResult(
    string Path,
    string FileName,
    string ContentType,
    long Size,
    string? Url
);
