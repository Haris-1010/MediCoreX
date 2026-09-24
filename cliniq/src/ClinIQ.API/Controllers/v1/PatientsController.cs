using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Enums;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class PatientsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public PatientsController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsView)]
    public async Task<IActionResult> GetPatients(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? status = null,
        [FromQuery] string? gender = null)
    {
        var query = _context.Patients.Where(p => !p.IsDeleted);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(p =>
                p.FirstName.ToLower().Contains(term) ||
                p.LastName.ToLower().Contains(term) ||
                (p.MRN != null && p.MRN.ToLower().Contains(term)) ||
                (p.Email != null && p.Email.ToLower().Contains(term)) ||
                (p.Phone != null && p.Phone.Contains(term)) ||
                (p.IdentificationDocuments != null && p.IdentificationDocuments.Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            var isActive = status.ToLower() == "active";
            query = query.Where(p => p.IsActive == isActive);
        }

        if (!string.IsNullOrWhiteSpace(gender))
        {
            var parsedGender = ParseGender(gender);
            if (parsedGender.HasValue)
            {
                query = query.Where(p => p.Gender == parsedGender.Value);
            }
        }

        var totalCount = await query.CountAsync();
        var rawItems = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.Id,
                p.MRN,
                p.FirstName,
                p.LastName,
                FullName = (p.FirstName + " " + p.LastName).Trim(),
                p.DateOfBirth,
                p.Gender,
                p.Phone,
                p.Email,
                p.BloodGroup,
                p.LastVisitDate,
                p.CreatedAt,
                p.IdentificationDocuments,
                Status = p.IsActive ? "Active" : "Inactive"
            })
            .ToListAsync();

        var items = rawItems.Select(p => new
        {
            p.Id,
            p.MRN,
            p.FirstName,
            p.LastName,
            p.FullName,
            p.DateOfBirth,
            Age = CalculateAge(p.DateOfBirth),
            Gender = FormatGender(p.Gender) ?? "Other",
            p.Phone,
            p.Email,
            p.CreatedAt,
            BloodGroup = FormatBloodGroup(p.BloodGroup) ?? "Unknown",
            NationalId = p.IdentificationDocuments,
            lastVisit = p.LastVisitDate,
            p.Status
        }).ToList();

        return Ok(Result<object>.Success(new
        {
            items,
            totalCount,
            pageNumber,
            pageSize,
            totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            hasPreviousPage = pageNumber > 1,
            hasNextPage = pageNumber * pageSize < totalCount
        }));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsView)]
    public async Task<IActionResult> GetPatient(Guid id)
    {
        var patient = await _context.Patients
            .Where(p => p.Id == id && !p.IsDeleted)
            .FirstOrDefaultAsync();

        if (patient == null)
            return NotFound(Result.Failure("Patient not found"));

        return Ok(Result<object>.Success(new
        {
            patient.Id,
            patient.MRN,
            patient.FirstName,
            patient.LastName,
            FullName = (patient.FirstName + " " + patient.LastName).Trim(),
            patient.DateOfBirth,
            Age = CalculateAge(patient.DateOfBirth),
            Gender = FormatGender(patient.Gender) ?? "",
            BloodGroup = FormatBloodGroup(patient.BloodGroup) ?? "",
            MaritalStatus = FormatMaritalStatus(patient.MaritalStatus) ?? "",
            patient.Nationality,
            patient.Occupation,
            NationalId = patient.IdentificationDocuments,
            IdentificationDocuments = patient.IdentificationDocuments,
            patient.Email,
            patient.Phone,
            patient.AlternatePhone,
            patient.Address,
            patient.City,
            patient.State,
            patient.Country,
            patient.PostalCode,
            patient.EmergencyContactName,
            patient.EmergencyContactRelation,
            patient.EmergencyContactPhone,
            Allergies = DeserializeStringArray(patient.Allergies),
            ChronicConditions = DeserializeStringArray(patient.ChronicConditions),
            patient.InsurancePolicyNumber,
            InsuranceProvider = "",
            Status = patient.IsActive ? "Active" : "Inactive"
        }));
    }

    [HttpGet("search")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsView)]
    public async Task<IActionResult> SearchPatients([FromQuery] string? term, [FromQuery] int limit = 10)
    {
        var query = _context.Patients.Where(p => !p.IsDeleted);

        if (!string.IsNullOrWhiteSpace(term))
        {
            var t = term.ToLower();
            query = query.Where(p =>
                p.FirstName.ToLower().Contains(t) ||
                p.LastName.ToLower().Contains(t) ||
                (p.MRN != null && p.MRN.ToLower().Contains(t)));
        }

        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Take(limit)
            .Select(p => new
            {
                p.Id,
                p.MRN,
                FullName = p.FirstName + " " + p.LastName,
                p.Phone,
                p.Email
            })
            .ToListAsync();

        return Ok(Result<object[]>.Success(items.ToArray()));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsCreate)]
    public async Task<IActionResult> CreatePatient([FromBody] CreatePatientRequest request)
    {
        if (!TryResolveNames(request, out var firstName, out var lastName))
            return BadRequest(Result.Failure("Full name is required."));

        // The tenant MUST come from the signed-in context. Falling back to the
        // first tenant in the database would mis-assign records to the wrong
        // organization, which is exactly how data leaked across orgs before.
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        // Safely generate unique MRN and PatientNumber
        var count = await _context.Patients.IgnoreQueryFilters().CountAsync();
        var mrn = $"MRN{(count + 1):D4}";
        while (await _context.Patients.IgnoreQueryFilters().AnyAsync(p => p.TenantId == tenantId && p.MRN == mrn))
        {
            count++;
            mrn = $"MRN{(count + 1):D4}";
        }

        var patNumber = $"PAT{(count + 1):D4}";
        while (await _context.Patients.IgnoreQueryFilters().AnyAsync(p => p.TenantId == tenantId && p.PatientNumber == patNumber))
        {
            count++;
            patNumber = $"PAT{(count + 1):D4}";
        }

        var patient = new Patient
        {
            MRN = mrn,
            PatientNumber = patNumber,
            FirstName = firstName,
            LastName = lastName,
            DateOfBirth = ResolveDateOfBirth(request.DateOfBirth, request.Age),
            Gender = ParseGender(request.Gender),
            BloodGroup = ParseBloodGroup(request.BloodGroup),
            MaritalStatus = ParseMaritalStatus(request.MaritalStatus),
            Nationality = request.Nationality?.Trim(),
            Occupation = request.Occupation?.Trim(),
            IdentificationDocuments = request.NationalId?.Trim(),
            Email = request.Email?.Trim(),
            Phone = request.Phone?.Trim(),
            AlternatePhone = request.AlternatePhone?.Trim(),
            Address = request.Address?.Trim(),
            City = request.City?.Trim(),
            State = request.State?.Trim(),
            Country = request.Country?.Trim(),
            PostalCode = request.PostalCode?.Trim(),
            EmergencyContactName = request.EmergencyContactName?.Trim(),
            EmergencyContactRelation = request.EmergencyContactRelation?.Trim(),
            EmergencyContactPhone = request.EmergencyContactPhone?.Trim(),
            Allergies = request.Allergies != null && request.Allergies.Length > 0 ? JsonSerializer.Serialize(request.Allergies) : null,
            ChronicConditions = request.ChronicConditions != null && request.ChronicConditions.Length > 0 ? JsonSerializer.Serialize(request.ChronicConditions) : null,
            InsurancePolicyNumber = request.InsurancePolicyNumber?.Trim(),
            IsActive = true,
            TenantId = tenantId
        };

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { id = patient.Id, mrn = patient.MRN, patientNumber = patient.PatientNumber }));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsEdit)]
    public async Task<IActionResult> UpdatePatient(Guid id, [FromBody] CreatePatientRequest request)
    {
        if (!TryResolveNames(request, out var firstName, out var lastName))
            return BadRequest(Result.Failure("Full name is required."));

        var patient = await _context.Patients.FindAsync(id);
        if (patient == null || patient.IsDeleted)
            return NotFound(Result.Failure("Patient not found"));

        patient.FirstName = firstName;
        patient.LastName = lastName;
        patient.DateOfBirth = ResolveDateOfBirth(request.DateOfBirth, request.Age);
        patient.Gender = ParseGender(request.Gender);
        patient.BloodGroup = ParseBloodGroup(request.BloodGroup);
        patient.MaritalStatus = ParseMaritalStatus(request.MaritalStatus);
        patient.Nationality = request.Nationality?.Trim();
        patient.Occupation = request.Occupation?.Trim();
        patient.IdentificationDocuments = request.NationalId?.Trim();
        patient.Email = request.Email?.Trim();
        patient.Phone = request.Phone?.Trim();
        patient.AlternatePhone = request.AlternatePhone?.Trim();
        patient.Address = request.Address?.Trim();
        patient.City = request.City?.Trim();
        patient.State = request.State?.Trim();
        patient.Country = request.Country?.Trim();
        patient.PostalCode = request.PostalCode?.Trim();
        patient.EmergencyContactName = request.EmergencyContactName?.Trim();
        patient.EmergencyContactRelation = request.EmergencyContactRelation?.Trim();
        patient.EmergencyContactPhone = request.EmergencyContactPhone?.Trim();
        patient.Allergies = request.Allergies != null && request.Allergies.Length > 0 ? JsonSerializer.Serialize(request.Allergies) : null;
        patient.ChronicConditions = request.ChronicConditions != null && request.ChronicConditions.Length > 0 ? JsonSerializer.Serialize(request.ChronicConditions) : null;
        patient.InsurancePolicyNumber = request.InsurancePolicyNumber?.Trim();
        patient.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Patient updated successfully"));
    }

    [HttpPatch("{id:guid}/phone")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsEdit)]
    public async Task<IActionResult> UpdatePatientPhone(Guid id, [FromBody] UpdatePatientPhoneRequest request)
    {
        var phone = request.Phone?.Trim();
        if (string.IsNullOrWhiteSpace(phone))
            return BadRequest(Result.Failure("Phone is required."));

        var patient = await _context.Patients.FindAsync(id);
        if (patient == null || patient.IsDeleted)
            return NotFound(Result.Failure("Patient not found"));

        patient.Phone = phone;
        patient.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { id = patient.Id, phone = patient.Phone }, "Phone updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsDelete)]
    public async Task<IActionResult> DeletePatient(Guid id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null || patient.IsDeleted)
            return NotFound(Result.Failure("Patient not found"));

        patient.IsDeleted = true;
        patient.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Patient deleted successfully"));
    }

    [HttpGet("{id:guid}/visits")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsView)]
    public async Task<IActionResult> GetPatientVisits(Guid id)
    {
        var visits = await _context.Visits
            .Where(v => v.PatientId == id && !v.IsDeleted)
            .OrderByDescending(v => v.CreatedAt)
            .Select(v => new
            {
                v.Id,
                v.CreatedAt,
                v.VisitDate,
                Type = v.VisitType.ToString(),
                Status = v.IsCompleted ? "Completed" : "Active",
                DoctorName = _context.Users.Where(u => u.Id == v.DoctorId).Select(u => (u.FirstName + " " + u.LastName).Trim()).FirstOrDefault() ?? "Unknown",
                v.ChiefComplaint,
                Diagnosis = v.Diagnoses,
                Department = _context.Departments.Where(d => d.Id == v.DepartmentId).Select(d => d.Name).FirstOrDefault() ?? "General"
            })
            .ToListAsync();

        return Ok(Result<object[]>.Success(visits.ToArray()));
    }

    [HttpGet("{id:guid}/medical-history")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PatientsView)]
    public async Task<IActionResult> GetMedicalHistory(Guid id)
    {
        var visits = await _context.Visits
            .Where(v => v.PatientId == id && !v.IsDeleted)
            .OrderByDescending(v => v.CreatedAt)
            .Select(v => new
            {
                Type = "Visit",
                Date = v.CreatedAt,
                Diagnosis = v.Diagnoses,
                DoctorName = _context.Users.Where(u => u.Id == v.DoctorId).Select(u => (u.FirstName + " " + u.LastName).Trim()).FirstOrDefault() ?? "Unknown",
                ChiefComplaint = v.ChiefComplaint,
                Treatment = v.Plan,
                Notes = v.ClinicalNotes
            })
            .ToListAsync();

        var prescriptions = await _context.Prescriptions
            .Where(p => p.PatientId == id && !p.IsDeleted)
            .OrderByDescending(p => p.PrescriptionDate)
            .Select(p => new
            {
                Type = "Prescription",
                Date = p.PrescriptionDate,
                Diagnosis = p.Diagnosis,
                DoctorName = _context.Users.Where(u => u.Id == p.DoctorId).Select(u => (u.FirstName + " " + u.LastName).Trim()).FirstOrDefault() ?? "Unknown",
                ChiefComplaint = (string?)null,
                Treatment = (string?)null,
                Medicines = p.Items.Select(i => new
                {
                    i.MedicineName,
                    i.Dosage,
                    Frequency = i.Frequency.ToString(),
                    i.DurationDays,
                    i.Quantity,
                    i.Instructions,
                    Timing = new { i.Morning, i.Afternoon, i.Evening, i.Night }
                }).ToList(),
                Notes = p.GeneralInstructions
            })
            .ToListAsync();

        var combined = visits.Cast<object>().Concat(prescriptions.Cast<object>()).ToList();

        return Ok(Result<object[]>.Success(combined.ToArray()));
    }

    private static DateTime? ResolveDateOfBirth(DateTime? dateOfBirth, int? age)
    {
        if (dateOfBirth.HasValue)
            return dateOfBirth.Value.Date;

        if (age.HasValue && age.Value >= 0)
            return DateTime.Today.AddYears(-age.Value);

        return null;
    }

    private static int? CalculateAge(DateTime? dateOfBirth)
    {
        if (!dateOfBirth.HasValue)
            return null;

        var today = DateTime.Today;
        var dob = dateOfBirth.Value.Date;
        var years = today.Year - dob.Year;
        if (dob > today.AddYears(-years))
            years--;

        return years < 0 ? 0 : years;
    }

    private static string? FormatBloodGroup(BloodGroup? bg)
    {
        if (!bg.HasValue) return null;
        return bg.Value switch
        {
            BloodGroup.APositive => "A+",
            BloodGroup.ANegative => "A-",
            BloodGroup.BPositive => "B+",
            BloodGroup.BNegative => "B-",
            BloodGroup.ABPositive => "AB+",
            BloodGroup.ABNegative => "AB-",
            BloodGroup.OPositive => "O+",
            BloodGroup.ONegative => "O-",
            _ => null
        };
    }

    private static BloodGroup? ParseBloodGroup(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        return value.Trim().ToUpperInvariant() switch
        {
            "A+" or "APOSITIVE" or "1" => BloodGroup.APositive,
            "A-" or "ANEGATIVE" or "2" => BloodGroup.ANegative,
            "B+" or "BPOSITIVE" or "3" => BloodGroup.BPositive,
            "B-" or "BNEGATIVE" or "4" => BloodGroup.BNegative,
            "AB+" or "ABPOSITIVE" or "5" => BloodGroup.ABPositive,
            "AB-" or "ABNEGATIVE" or "6" => BloodGroup.ABNegative,
            "O+" or "OPOSITIVE" or "7" => BloodGroup.OPositive,
            "O-" or "ONEGATIVE" or "8" => BloodGroup.ONegative,
            _ => null
        };
    }

    private static string? FormatGender(Gender? g)
    {
        if (!g.HasValue) return null;
        return g.Value switch
        {
            Gender.Male => "Male",
            Gender.Female => "Female",
            Gender.Other => "Other",
            Gender.PreferNotToSay => "PreferNotToSay",
            _ => null
        };
    }

    private static Gender? ParseGender(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        return value.Trim().ToLowerInvariant() switch
        {
            "male" or "1" => Gender.Male,
            "female" or "2" => Gender.Female,
            "other" or "3" => Gender.Other,
            "prefernottosay" or "prefer_not_to_say" or "4" => Gender.PreferNotToSay,
            _ => null
        };
    }

    private static string? FormatMaritalStatus(MaritalStatus? ms)
    {
        if (!ms.HasValue) return null;
        return ms.Value switch
        {
            MaritalStatus.Single => "Single",
            MaritalStatus.Married => "Married",
            MaritalStatus.Divorced => "Divorced",
            MaritalStatus.Widowed => "Widowed",
            _ => ms.ToString()
        };
    }

    private static MaritalStatus? ParseMaritalStatus(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        if (Enum.TryParse<MaritalStatus>(value, true, out var res)) return res;
        return value.Trim().ToLowerInvariant() switch
        {
            "single" or "1" => MaritalStatus.Single,
            "married" or "2" => MaritalStatus.Married,
            "divorced" or "3" => MaritalStatus.Divorced,
            "widowed" or "4" => MaritalStatus.Widowed,
            _ => null
        };
    }

    private static string[] DeserializeStringArray(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return Array.Empty<string>();
        try
        {
            return JsonSerializer.Deserialize<string[]>(json) ?? Array.Empty<string>();
        }
        catch
        {
            return json.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        }
    }

    private static bool TryResolveNames(CreatePatientRequest request, out string firstName, out string lastName)
    {
        firstName = string.Empty;
        lastName = string.Empty;

        var fullName = !string.IsNullOrWhiteSpace(request.FullName)
            ? request.FullName.Trim()
            : $"{request.FirstName} {request.LastName}".Trim();

        if (string.IsNullOrWhiteSpace(fullName))
            return false;

        var parts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        firstName = parts[0];
        lastName = parts.Length > 1 ? string.Join(' ', parts.Skip(1)) : string.Empty;
        return true;
    }
}

public record CreatePatientRequest(
    string? FirstName,
    string? LastName,
    string? FullName,
    DateTime? DateOfBirth,
    int? Age,
    string? Gender,
    string? BloodGroup,
    string? MaritalStatus,
    string? Nationality,
    string? Occupation,
    string? Email,
    string? Phone,
    string? AlternatePhone,
    string? Address,
    string? City,
    string? State,
    string? Country,
    string? PostalCode,
    string? EmergencyContactName,
    string? EmergencyContactRelation,
    string? EmergencyContactPhone,
    string[]? Allergies,
    string[]? ChronicConditions,
    string? InsuranceProvider,
    string? InsurancePolicyNumber,
    string? NationalId
);

public record UpdatePatientPhoneRequest(string? Phone);
