using ClinIQ.Shared.DTOs.Appointments;
using FluentValidation;

namespace ClinIQ.Application.Validators.Appointments;

public class CreateAppointmentRequestValidator : AbstractValidator<CreateAppointmentRequest>
{
    public CreateAppointmentRequestValidator()
    {
        RuleFor(x => x.PatientId)
            .NotEmpty().WithMessage("Patient is required");

        RuleFor(x => x.DoctorId)
            .NotEmpty().WithMessage("Doctor is required");

        RuleFor(x => x.AppointmentDate)
            .NotEmpty().WithMessage("Appointment date is required")
            .GreaterThanOrEqualTo(DateTime.Today).WithMessage("Appointment date cannot be in the past");

        RuleFor(x => x.StartTime)
            .NotEmpty().WithMessage("Start time is required");

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0).WithMessage("Duration must be greater than 0")
            .LessThanOrEqualTo(480).WithMessage("Duration cannot exceed 8 hours");

        RuleFor(x => x.ChiefComplaint)
            .MaximumLength(1000).WithMessage("Chief complaint must not exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.ChiefComplaint));

        RuleFor(x => x.Notes)
            .MaximumLength(2000).WithMessage("Notes must not exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.Notes));
    }
}
