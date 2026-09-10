using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Tenancy;

/// <summary>
/// Represents a branch/facility within a tenant organization
/// </summary>
public class Branch : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Timezone { get; set; }
    public bool IsMainBranch { get; set; }
    public bool IsActive { get; set; } = true;

    // Operating hours (JSON)
    public string? OperatingHours { get; set; }

    // Settings (JSON)
    public string? Settings { get; set; }

    // Navigation properties
    public virtual Tenant Tenant { get; set; } = null!;
    public virtual ICollection<Department> Departments { get; set; } = new List<Department>();
    public virtual ICollection<BranchUser> BranchUsers { get; set; } = new List<BranchUser>();
}
