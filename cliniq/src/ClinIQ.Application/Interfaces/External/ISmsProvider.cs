using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces.External;

public interface ISmsProvider
{
    Task<Result<string>> SendSmsAsync(string phoneNumber, string message, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<SmsSendResult>>> SendBulkSmsAsync(IEnumerable<SmsMessage> messages, CancellationToken cancellationToken = default);
    Task<Result<decimal>> GetBalanceAsync(CancellationToken cancellationToken = default);
    Task<Result<SmsDeliveryStatus>> GetDeliveryStatusAsync(string messageId, CancellationToken cancellationToken = default);
}

public record SmsMessage(string PhoneNumber, string Message, string? TemplateId = null);
public record SmsSendResult(string PhoneNumber, bool Success, string? MessageId, string? Error);

public enum SmsDeliveryStatus
{
    Pending,
    Sent,
    Delivered,
    Failed,
    Unknown
}
