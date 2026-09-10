namespace ClinIQ.Domain.Enums;

public enum InvoiceStatus
{
    // Added Pending to maintain compatibility with tests
    Pending = 0,
    Draft = 1,
    Finalized = 2,
    PartiallyPaid = 3,
    Paid = 4,
    Overdue = 5,
    Cancelled = 6,
    Refunded = 7,
    PartiallyRefunded = 8,
    WrittenOff = 9
}
