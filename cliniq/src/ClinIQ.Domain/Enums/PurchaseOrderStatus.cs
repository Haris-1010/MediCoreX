namespace ClinIQ.Domain.Enums;

public enum PurchaseOrderStatus
{
    Draft = 1,
    Pending = 2,
    Approved = 3,
    Rejected = 4,
    Ordered = 5,
    PartiallyReceived = 6,
    Received = 7,
    Cancelled = 8,
    Closed = 9
}
