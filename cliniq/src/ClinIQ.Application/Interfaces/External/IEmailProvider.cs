using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces.External;

public interface IEmailProvider
{
    Task<Result> SendEmailAsync(EmailMessage message, CancellationToken cancellationToken = default);
    Task<Result> SendTemplateEmailAsync(string templateId, string toEmail, Dictionary<string, string> variables, CancellationToken cancellationToken = default);
    Task<Result> SendBulkEmailAsync(IEnumerable<EmailMessage> messages, CancellationToken cancellationToken = default);
}

public record EmailMessage(
    string ToEmail,
    string Subject,
    string Body,
    bool IsHtml = true,
    string? FromEmail = null,
    string? FromName = null,
    IEnumerable<EmailAttachment>? Attachments = null,
    IEnumerable<string>? Cc = null,
    IEnumerable<string>? Bcc = null
);

public record EmailAttachment(
    string FileName,
    byte[] Content,
    string ContentType
);
