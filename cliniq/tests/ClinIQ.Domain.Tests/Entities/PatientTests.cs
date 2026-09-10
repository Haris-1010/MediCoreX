using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Tests.Entities;

public class PatientTests
{
    [Fact]
    public void Patient_WhenCreated_ShouldHaveDefaultValues()
    {
        // Arrange & Act
        var patient = new Patient();

        // Assert
        patient.Id.Should().Be(Guid.Empty);
        patient.IsActive.Should().BeTrue();
        patient.Appointments.Should().BeEmpty();
        patient.Admissions.Should().BeEmpty();
        patient.Documents.Should().BeEmpty();
    }

    [Fact]
    public void Patient_FullName_ShouldCombineFirstAndLastName()
    {
        // Arrange
        var patient = new Patient
        {
            FirstName = "John",
            LastName = "Doe"
        };

        // Act
        var fullName = patient.FullName;

        // Assert
        fullName.Should().Be("John Doe");
    }

    [Fact]
    public void Patient_Age_ShouldCalculateCorrectly()
    {
        // Arrange
        var patient = new Patient
        {
            DateOfBirth = DateTime.Today.AddYears(-30)
        };

        // Act
        var age = patient.Age;

        // Assert
        age.Should().Be(30);
    }

    [Fact]
    public void Patient_Age_ShouldAccountForBirthdayNotYetOccurred()
    {
        // Arrange
        var patient = new Patient
        {
            DateOfBirth = DateTime.Today.AddYears(-30).AddDays(1)
        };

        // Act
        var age = patient.Age;

        // Assert
        age.Should().Be(29);
    }

    [Fact]
    public void Patient_MRN_ShouldBeUnique()
    {
        // Arrange
        var patient1 = new Patient { MRN = "MRN-001" };
        var patient2 = new Patient { MRN = "MRN-002" };

        // Assert
        patient1.MRN.Should().NotBe(patient2.MRN);
    }

    [Fact]
    public void Patient_ShouldSupportMultipleEmergencyContacts()
    {
        // Arrange
        var patient = new Patient
        {
            EmergencyContactName = "Jane Doe",
            EmergencyContactPhone = "1234567890",
            EmergencyContactRelation = "Spouse"
        };

        // Assert
        patient.EmergencyContactName.Should().NotBeNullOrEmpty();
        patient.EmergencyContactPhone.Should().NotBeNullOrEmpty();
        patient.EmergencyContactRelation.Should().NotBeNullOrEmpty();
    }

    [Theory]
    [InlineData("A+")]
    [InlineData("A-")]
    [InlineData("B+")]
    [InlineData("B-")]
    [InlineData("AB+")]
    [InlineData("AB-")]
    [InlineData("O+")]
    [InlineData("O-")]
    public void Patient_BloodGroup_ShouldAcceptValidValues(string bloodGroup)
    {
        // Arrange
        BloodGroup? bg = bloodGroup switch
        {
            "A+" => BloodGroup.APositive,
            "A-" => BloodGroup.ANegative,
            "B+" => BloodGroup.BPositive,
            "B-" => BloodGroup.BNegative,
            "AB+" => BloodGroup.ABPositive,
            "AB-" => BloodGroup.ABNegative,
            "O+" => BloodGroup.OPositive,
            "O-" => BloodGroup.ONegative,
            _ => BloodGroup.Unknown
        };

        var patient = new Patient { BloodGroup = bg };

        // Assert
        patient.BloodGroup.Should().Be(bg);
    }
}
