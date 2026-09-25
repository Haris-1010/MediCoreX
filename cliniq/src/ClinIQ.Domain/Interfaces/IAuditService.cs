using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Interfaces;

/// <summary>
/// Writes business-level audit events (login, report generation, workflow
/// actions). Entity CRUD is captured automatically by
/// <c>ApplicationDbContext.SaveChangesAsync</c> and does not need calls here.
/// </summary>
public interface IAuditService
{
    Task LogAsync(AuditEvent auditEvent, CancellationToken cancellationToken = default);
}
