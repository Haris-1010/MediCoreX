using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Billing;

/// <summary>
/// Custom discount template that organizations can create and apply to invoices
/// </summary>
public class Discount : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    /// <summary>
    /// "Flat" for fixed amount, "Percent" for percentage
    /// </summary>
    public string Type { get; set; } = "Flat";

    /// <summary>
    /// The discount value: flat amount or percentage (0-100 for percent)
    /// </summary>
    public decimal Value { get; set; }

    public bool IsActive { get; set; } = true;
}
