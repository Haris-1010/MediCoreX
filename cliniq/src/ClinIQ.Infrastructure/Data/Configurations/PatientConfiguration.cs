using ClinIQ.Domain.Entities.Clinical;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.ToTable("Patients");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.PatientNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(p => new { p.TenantId, p.PatientNumber })
            .IsUnique();

        builder.Property(p => p.MRN)
            .HasMaxLength(50);

        builder.HasIndex(p => new { p.TenantId, p.MRN })
            .IsUnique()
            .HasFilter("[MRN] IS NOT NULL");

        builder.Property(p => p.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.MiddleName)
            .HasMaxLength(100);

        builder.Property(p => p.Title)
            .HasMaxLength(20);

        builder.Ignore(p => p.Age);

        builder.Property(p => p.Email)
            .HasMaxLength(256);

        builder.Property(p => p.Phone)
            .HasMaxLength(50);

        builder.Property(p => p.AlternatePhone)
            .HasMaxLength(50);

        builder.Property(p => p.Address)
            .HasMaxLength(500);

        builder.Property(p => p.City)
            .HasMaxLength(100);

        builder.Property(p => p.State)
            .HasMaxLength(100);

        builder.Property(p => p.Country)
            .HasMaxLength(100);

        builder.Property(p => p.PostalCode)
            .HasMaxLength(20);

        builder.Property(p => p.Nationality)
            .HasMaxLength(100);

        builder.Property(p => p.Religion)
            .HasMaxLength(50);

        builder.Property(p => p.Occupation)
            .HasMaxLength(100);

        builder.Property(p => p.EmergencyContactName)
            .HasMaxLength(200);

        builder.Property(p => p.EmergencyContactRelation)
            .HasMaxLength(50);

        builder.Property(p => p.EmergencyContactPhone)
            .HasMaxLength(50);

        builder.Property(p => p.RowVersion)
            .IsRowVersion();

        // Indexes for common queries
        builder.HasIndex(p => new { p.TenantId, p.FirstName, p.LastName });
        builder.HasIndex(p => new { p.TenantId, p.Phone });
        builder.HasIndex(p => new { p.TenantId, p.Email });
        builder.HasIndex(p => new { p.TenantId, p.IsActive });
        builder.HasIndex(p => new { p.TenantId, p.LastVisitDate });
    }
}
