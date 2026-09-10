namespace ClinIQ.Domain.Enums;

public enum NotificationType
{
    AppointmentReminder = 1,
    AppointmentConfirmation = 2,
    AdmissionNotification = 3,
    DischargeNotification = 4,
    PaymentReceived = 5,
    PaymentDue = 6,
    FollowUpReminder = 7,
    QueueUpdate = 8,
    SystemAlert = 9,
    LabResult = 10,
    PrescriptionReady = 11,
    Custom = 12
}
