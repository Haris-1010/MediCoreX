using System;
using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Clinical;

public class DoctorSchedule : BranchEntity
{
    public Guid DoctorId { get; set; }
    public int DayOfWeek { get; set; }        // 0=Sunday .. 6=Saturday
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int SlotDuration { get; set; }
    public decimal? ConsultationFee { get; set; }
}
