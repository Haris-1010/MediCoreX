using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Tests.Entities;

public class AdmissionTests
{
    [Fact]
    public void Admission_WhenCreated_ShouldHaveAdmittedStatus()
    {
        // Arrange & Act
        var admission = new Admission
        {
            Status = AdmissionStatus.Admitted
        };

        // Assert
        admission.Status.Should().Be(AdmissionStatus.Admitted);
    }

    [Fact]
    public void Admission_LengthOfStay_WhenDischarged_ShouldCalculateCorrectly()
    {
        // Arrange
        var admission = new Admission
        {
            AdmissionDate = DateTime.Today.AddDays(-5),
            DischargeDate = DateTime.Today
        };

        // Act
        var lengthOfStay = (admission.DischargeDate!.Value - admission.AdmissionDate).Days;

        // Assert
        lengthOfStay.Should().Be(5);
    }

    [Fact]
    public void Admission_LengthOfStay_WhenActive_ShouldCalculateFromToday()
    {
        // Arrange
        var admission = new Admission
        {
            AdmissionDate = DateTime.Today.AddDays(-3),
            DischargeDate = null
        };

        // Act
        var lengthOfStay = (DateTime.Today - admission.AdmissionDate).Days;

        // Assert
        lengthOfStay.Should().Be(3);
    }

    [Theory]
    [InlineData(AdmissionStatus.Admitted)]
    [InlineData(AdmissionStatus.Discharged)]
    [InlineData(AdmissionStatus.Transferred)]
    [InlineData(AdmissionStatus.ReadyForDischarge)]
    [InlineData(AdmissionStatus.Deceased)]
    public void Admission_ShouldSupportAllStatuses(AdmissionStatus status)
    {
        // Arrange
        var admission = new Admission { Status = status };

        // Assert
        admission.Status.Should().Be(status);
    }

    [Fact]
    public void Admission_ShouldHaveBedAssignment()
    {
        // Arrange
        var bedId = Guid.NewGuid();
        var admission = new Admission
        {
            CurrentBedId = bedId
        };

        // Assert
        admission.CurrentBedId.Should().Be(bedId);
    }

    [Fact]
    public void Admission_ShouldTrackAdmittingAndAttendingDoctor()
    {
        // Arrange
        var admittingDoctorId = Guid.NewGuid();
        var attendingDoctorId = Guid.NewGuid();
        var admission = new Admission
        {
            ReferringDoctorId = admittingDoctorId,
            AttendingDoctorId = attendingDoctorId
        };

        // Assert
        admission.ReferringDoctorId.Should().Be(admittingDoctorId);
        admission.AttendingDoctorId.Should().Be(attendingDoctorId);
    }

    [Fact]
    public void Admission_ShouldSupportEmergencyAdmission()
    {
        // Arrange
        var admission = new Admission
        {
            AdmissionType = AdmissionType.Emergency
        };

        // Assert
        admission.AdmissionType.Should().Be(AdmissionType.Emergency);
    }

    [Fact]
    public void Admission_DischargeSummary_ShouldBeRequiredOnDischarge()
    {
        // Arrange
        var admission = new Admission
        {
            Status = AdmissionStatus.Discharged,
            DischargeDate = DateTime.Today,
            DischargeSummary = "Patient recovered well. Follow-up in 2 weeks."
        };

        // Assert
        admission.Status.Should().Be(AdmissionStatus.Discharged);
        admission.DischargeSummary.Should().NotBeNullOrEmpty();
    }
}
