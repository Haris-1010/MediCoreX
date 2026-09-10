namespace ClinIQ.Domain.Common;

/// <summary>
/// Base entity with soft delete support
/// </summary>
public abstract class BaseAuditableEntity : BaseEntity
{
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}
