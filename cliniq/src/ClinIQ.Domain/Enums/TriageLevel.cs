namespace ClinIQ.Domain.Enums;

public enum TriageLevel
{
    Resuscitation = 1,  // Immediate life-threatening
    Emergency = 2,      // Potentially life-threatening
    Urgent = 3,         // Serious but not immediately life-threatening
    LessUrgent = 4,     // Can wait safely
    NonUrgent = 5       // Can wait or scheduled care
}
