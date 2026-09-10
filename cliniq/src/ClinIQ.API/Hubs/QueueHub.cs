using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ClinIQ.API.Hubs;

[Authorize]
public class QueueHub : Hub
{
    public async Task JoinDepartmentQueue(string departmentId)
    {
        var tenantId = Context.User?.FindFirst("tenant_id")?.Value;

        if (!string.IsNullOrEmpty(tenantId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"queue_{tenantId}_{departmentId}");
        }
    }

    public async Task LeaveDepartmentQueue(string departmentId)
    {
        var tenantId = Context.User?.FindFirst("tenant_id")?.Value;

        if (!string.IsNullOrEmpty(tenantId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"queue_{tenantId}_{departmentId}");
        }
    }

    public async Task JoinDoctorQueue(string doctorId)
    {
        var tenantId = Context.User?.FindFirst("tenant_id")?.Value;

        if (!string.IsNullOrEmpty(tenantId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"doctor_queue_{tenantId}_{doctorId}");
        }
    }

    public async Task LeaveDoctorQueue(string doctorId)
    {
        var tenantId = Context.User?.FindFirst("tenant_id")?.Value;

        if (!string.IsNullOrEmpty(tenantId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"doctor_queue_{tenantId}_{doctorId}");
        }
    }
}
