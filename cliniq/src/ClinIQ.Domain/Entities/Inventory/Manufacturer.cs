using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Inventory;

/// <summary>
/// Medicine/Item manufacturer
/// </summary>
public class Manufacturer : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public string? Address { get; set; }
    public string? Country { get; set; }
    public bool IsActive { get; set; } = true;
}
