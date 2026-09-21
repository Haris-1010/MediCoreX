namespace ClinIQ.Domain.Enums;

public enum MedicalOrderStatus
{
    Draft = 1,
    Ordered = 2,
    Accepted = 3,
    InProgress = 4,
    Completed = 5,
    Cancelled = 6,
    OnHold = 7,
    SamplePending = 10,
    SampleCollected = 11,
    Processing = 12,
    ResultEntered = 13,
    Verified = 14,
    Scheduled = 20,
    PatientArrived = 21,
    ProcedureInProgress = 22,
    ImagingCompleted = 23,
    ReportPending = 24,
    ReportDrafted = 25,
    NoShow = 26
}
