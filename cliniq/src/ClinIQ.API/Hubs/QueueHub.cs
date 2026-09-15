using ClinIQ.Domain.Enums;
using ClinIQ.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Hubs;

[Authorize]
public class QueueHub : Hub
{
    private readonly ApplicationDbContext _context;

    public QueueHub(ApplicationDbContext context)
    {
        _context = context;
    }

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

    public async Task CallNextToken(string doctorId)
    {
        if (!Guid.TryParse(doctorId, out var docId))
            return;

        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        // Find the next waiting patient for this doctor
        var nextInQueue = await _context.Queues
            .Where(q => !q.IsDeleted && q.DoctorId == docId
                && q.QueueDate >= today && q.QueueDate < tomorrow
                && q.Status == QueueStatus.Waiting)
            .OrderBy(q => q.Priority ?? int.MaxValue)
            .ThenBy(q => q.TokenNumber)
            .FirstOrDefaultAsync();

        if (nextInQueue == null)
            return;

        // Mark as called
        nextInQueue.Status = QueueStatus.Called;
        nextInQueue.CalledAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Get patient and doctor info
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == nextInQueue.PatientId);
        var doctor = await _context.Users.FirstOrDefaultAsync(u => u.Id == docId);

        var patientName = patient?.FullName ?? "Unknown";
        var doctorName = doctor?.FullName ?? "Unknown";

        // Broadcast to all clients - display board, queue management, etc.
        await Clients.All.SendAsync("TokenCalled", new
        {
            queueId = nextInQueue.Id.ToString(),
            tokenNumber = nextInQueue.TokenNumber,
            patientName,
            doctorId = doctorId,
            doctorName,
            roomNumber = "",
            status = "Called"
        });

        // Also send queue update
        await Clients.All.SendAsync("QueueUpdated", new
        {
            queueId = nextInQueue.Id.ToString(),
            doctorId,
            status = "Called"
        });
    }

    public async Task RecallToken(string queueId)
    {
        if (!Guid.TryParse(queueId, out var qId))
            return;

        var queue = await _context.Queues.FirstOrDefaultAsync(q => q.Id == qId && !q.IsDeleted);
        if (queue == null)
            return;

        queue.Status = QueueStatus.Recalled;
        queue.CalledAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == queue.PatientId);
        var doctor = queue.DoctorId != null
            ? await _context.Users.FirstOrDefaultAsync(u => u.Id == queue.DoctorId)
            : null;

        await Clients.All.SendAsync("TokenCalled", new
        {
            queueId = queue.Id.ToString(),
            tokenNumber = queue.TokenNumber,
            patientName = patient?.FullName ?? "Unknown",
            doctorId = queue.DoctorId?.ToString() ?? "",
            doctorName = doctor?.FullName ?? "Unknown",
            roomNumber = "",
            status = "Recalled"
        });
    }

    public async Task JoinWardGroup(string wardId)
    {
        var tenantId = Context.User?.FindFirst("tenant_id")?.Value;
        if (!string.IsNullOrEmpty(tenantId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"ward_{tenantId}_{wardId}");
        }
    }

    public async Task LeaveWardGroup(string wardId)
    {
        var tenantId = Context.User?.FindFirst("tenant_id")?.Value;
        if (!string.IsNullOrEmpty(tenantId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"ward_{tenantId}_{wardId}");
        }
    }
}
