using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Inventory;

/// <summary>
/// Supplier/Vendor
/// </summary>
public class Supplier : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }

    // Contact
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Fax { get; set; }
    public string? Website { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }

    // Tax
    public string? TaxNumber { get; set; }
    public string? PanNumber { get; set; }

    // Contact Person
    public string? ContactPersonName { get; set; }
    public string? ContactPersonPhone { get; set; }
    public string? ContactPersonEmail { get; set; }

    // Payment Terms
    public int? PaymentTermsDays { get; set; }
    public decimal? CreditLimit { get; set; }
    public string? PaymentMethod { get; set; }

    // Bank Details
    public string? BankName { get; set; }
    public string? BankAccountNumber { get; set; }
    public string? BankBranch { get; set; }
    public string? IFSC { get; set; }

    // Balance
    public decimal OutstandingPayable { get; set; }

    // Rating
    public decimal? Rating { get; set; }

    // Status
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
}
