using ClinIQ.Domain.Common;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Entities.Identity;

/// <summary>
/// Application user entity - extends Identity with additional properties
/// </summary>
public class ApplicationUser : BaseAuditableEntity
{
    public string Email { get; set; } = string.Empty;
    public string? NormalizedEmail { get; set; }
    public bool EmailConfirmed { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public string? SecurityStamp { get; set; }
    public string? ConcurrencyStamp { get; set; }
    public string? PhoneNumber { get; set; }
    public bool PhoneNumberConfirmed { get; set; }
    public bool TwoFactorEnabled { get; set; }
    public DateTimeOffset? LockoutEnd { get; set; }
    public bool LockoutEnabled { get; set; }
    public int AccessFailedCount { get; set; }

    // Profile
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? MiddleName { get; set; }
    public string? Title { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public Gender? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public string? Timezone { get; set; }
    public string? Locale { get; set; }

    // Professional info (for doctors, nurses, etc.)
    public string? EmployeeId { get; set; }
    public string? LicenseNumber { get; set; }
    public string? Specialization { get; set; }
    public string? Qualification { get; set; }
    public string? Signature { get; set; }
    public string? Bio { get; set; }
    public Guid? DepartmentId { get; set; }

    public bool IsActive { get; set; } = true;
    public bool IsSuperAdmin { get; set; }

    /// <summary>
    /// Master owner of the entire platform. Only this account can access
    /// the master portal and pause/resume the whole system.
    /// </summary>
    public bool IsMaster { get; set; }

    public DateTime? LastLoginAt { get; set; }
    public string? LastLoginIp { get; set; }

    // Password lifecycle. Set when a Master User issues a temporary password so
    // the user is forced to replace it at first login. Plaintext is never stored.
    public bool MustChangePassword { get; set; }
    public DateTime? PasswordChangedAt { get; set; }

    /// <summary>
    /// Reversible copy of the current password for platform admin display only.
    /// Cleared when the user changes their own password.
    /// </summary>
    public string? PlainPassword { get; set; }

    /// <summary>Designation shown in staff lists, e.g. "Senior Consultant".</summary>
    public string? Designation { get; set; }

    /// <summary>Staff category chosen at creation: Doctor, PharmacyManager, LabManager, Receptionist or Nurse.</summary>
    public string? UserType { get; set; }

    // Settings (JSON)
    public string? Settings { get; set; }

    // Computed
    public string FullName => $"{FirstName} {LastName}".Trim();

    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
