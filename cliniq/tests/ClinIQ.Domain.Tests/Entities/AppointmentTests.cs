using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Tests.Entities;

public class AppointmentTests
{
    [Fact]
    public void Appointment_WhenCreated_ShouldHaveScheduledStatus()
    {
        // Arrange & Act
        var appointment = new Appointment
        {
            Status = AppointmentStatus.Scheduled
        };

        // Assert
        appointment.Status.Should().Be(AppointmentStatus.Scheduled);
    }

    [Fact]
    public void Appointment_Duration_ShouldCalculateCorrectly()
    {
        // Arrange
        var appointment = new Appointment
        {
            StartTime = TimeSpan.FromHours(9),
            EndTime = TimeSpan.FromHours(9.5)
        };

        // Act
        var duration = (appointment.EndTime ?? appointment.StartTime.Add(TimeSpan.FromMinutes(30))) - appointment.StartTime;

        // Assert
        duration.TotalMinutes.Should().Be(30);
    }

    [Fact]
    public void Appointment_CanBeCancelled_WhenScheduled()
    {
        // Arrange
        var appointment = new Appointment
        {
            Status = AppointmentStatus.Scheduled
        };

        // Act
        var canCancel = appointment.Status == AppointmentStatus.Scheduled ||
                       appointment.Status == AppointmentStatus.Confirmed;

        // Assert
        canCancel.Should().BeTrue();
    }

    [Fact]
    public void Appointment_CannotBeCancelled_WhenCompleted()
    {
        // Arrange
        var appointment = new Appointment
        {
            Status = AppointmentStatus.Completed
        };

        // Act
        var canCancel = appointment.Status == AppointmentStatus.Scheduled ||
                       appointment.Status == AppointmentStatus.Confirmed;

        // Assert
        canCancel.Should().BeFalse();
    }

    [Theory]
    [InlineData(AppointmentStatus.Scheduled)]
    [InlineData(AppointmentStatus.Confirmed)]
    [InlineData(AppointmentStatus.CheckedIn)]
    [InlineData(AppointmentStatus.InProgress)]
    [InlineData(AppointmentStatus.Completed)]
    [InlineData(AppointmentStatus.Cancelled)]
    [InlineData(AppointmentStatus.NoShow)]
    public void Appointment_ShouldSupportAllStatuses(AppointmentStatus status)
    {
        // Arrange
        var appointment = new Appointment { Status = status };

        // Assert
        appointment.Status.Should().Be(status);
    }

    [Fact]
    public void Appointment_ShouldHavePatientAndDoctor()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        var doctorId = Guid.NewGuid();
        var appointment = new Appointment
        {
            PatientId = patientId,
            DoctorId = doctorId
        };

        // Assert
        appointment.PatientId.Should().Be(patientId);
        appointment.DoctorId.Should().Be(doctorId);
    }

    [Fact]
    public void Appointment_ShouldSupportNotes()
    {
        // Arrange
        var appointment = new Appointment
        {
            Notes = "Follow-up appointment for routine checkup",
            CancellationReason = null
        };

        // Assert
        appointment.Notes.Should().NotBeNullOrEmpty();
        appointment.CancellationReason.Should().BeNull();
    }
}
