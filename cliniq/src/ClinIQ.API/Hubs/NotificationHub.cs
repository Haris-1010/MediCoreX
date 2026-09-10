using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ClinIQ.API.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst("sub")?.Value
            ?? Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        var tenantId = Context.User?.FindFirst("tenant_id")?.Value;
        var branchId = Context.User?.FindFirst("branch_id")?.Value;

        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }

        if (!string.IsNullOrEmpty(tenantId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"tenant_{tenantId}");
        }

        if (!string.IsNullOrEmpty(branchId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"branch_{branchId}");
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst("sub")?.Value
            ?? Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        var tenantId = Context.User?.FindFirst("tenant_id")?.Value;
        var branchId = Context.User?.FindFirst("branch_id")?.Value;

        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        }

        if (!string.IsNullOrEmpty(tenantId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"tenant_{tenantId}");
        }

        if (!string.IsNullOrEmpty(branchId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"branch_{branchId}");
        }

        await base.OnDisconnectedAsync(exception);
    }
}
