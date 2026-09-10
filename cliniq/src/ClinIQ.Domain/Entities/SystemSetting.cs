using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities;

/// <summary>
/// System/Tenant settings
/// </summary>
public class SystemSetting : BaseEntity
{
    public Guid? TenantId { get; set; }  // Null for system-wide settings
    public Guid? BranchId { get; set; }  // Null for tenant-wide settings
    public string Key { get; set; } = string.Empty;
    public string? Value { get; set; }
    public string? DataType { get; set; }  // string, int, bool, json
    public string? Category { get; set; }
    public string? Description { get; set; }
    public bool IsEncrypted { get; set; }
    public bool IsReadOnly { get; set; }
}
