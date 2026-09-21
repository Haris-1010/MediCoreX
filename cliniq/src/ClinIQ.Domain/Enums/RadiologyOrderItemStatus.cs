namespace ClinIQ.Domain.Enums;

public enum RadiologyOrderItemStatus
{
    Ordered = 1,
    Scheduled = 2,
    PatientArrived = 3,
    ProcedureInProgress = 4,
    ImagingCompleted = 5,
    ReportPending = 6,
    ReportDrafted = 7,
    Verified = 8,
    Completed = 9,
    Cancelled = 10,
    NoShow = 11
}
