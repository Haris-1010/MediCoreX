using ClinIQ.Domain.Enums;
using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces;

public interface INotificationService
{
    Task<Result<NotificationDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PaginatedResult<NotificationDto>> GetUserNotificationsAsync(Guid userId, bool? unreadOnly = null, int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<Result<int>> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Result> MarkAsReadAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result> MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Result> SendNotificationAsync(CreateNotificationRequest request, CancellationToken cancellationToken = default);
    Task<Result> SendBulkNotificationAsync(IEnumerable<CreateNotificationRequest> requests, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public record NotificationDto(
    Guid Id,
    NotificationType Type,
    string Title,
    string? Message,
    string? EntityType,
    Guid? EntityId,
    bool IsRead,
    DateTime? ReadAt,
    DateTime CreatedAt
);

public record CreateNotificationRequest(
    Guid UserId,
    NotificationType Type,
    string Title,
    string? Message,
    string? Data,
    string? EntityType,
    Guid? EntityId,
    bool SendEmail,
    bool SendSms,
    bool SendWhatsApp,
    DateTime? ScheduledFor
);
