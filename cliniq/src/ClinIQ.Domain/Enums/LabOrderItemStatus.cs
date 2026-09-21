namespace ClinIQ.Domain.Enums;

public enum LabOrderItemStatus
{
    Ordered = 1,
    SamplePending = 2,
    SampleCollected = 3,
    Processing = 4,
    ResultEntered = 5,
    Verified = 6,
    Completed = 7,
    Cancelled = 8,
    Rejected = 9
}
