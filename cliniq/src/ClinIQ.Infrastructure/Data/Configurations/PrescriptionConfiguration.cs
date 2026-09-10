using ClinIQ.Domain.Entities.Clinical;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class PrescriptionConfiguration : IEntityTypeConfiguration<Prescription>
{
    public void Configure(EntityTypeBuilder<Prescription> builder)
    {
        builder.ToTable("Prescriptions");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.PrescriptionNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(p => new { p.TenantId, p.PrescriptionNumber })
            .IsUnique();

        builder.Property(p => p.Diagnosis)
            .HasMaxLength(500);

        builder.Property(p => p.GeneralInstructions)
            .HasMaxLength(1000);

        builder.Property(p => p.DietaryAdvice)
            .HasMaxLength(1000);

        builder.Property(p => p.LifestyleAdvice)
            .HasMaxLength(1000);

        builder.Property(p => p.RowVersion)
            .IsRowVersion();

        // Indexes for common queries
        builder.HasIndex(p => new { p.TenantId, p.PatientId });
        builder.HasIndex(p => new { p.TenantId, p.DoctorId });
        builder.HasIndex(p => new { p.TenantId, p.PrescriptionDate });
        builder.HasIndex(p => new { p.TenantId, p.IsDispensed });
        builder.HasIndex(p => new { p.TenantId, p.IsDeleted });

        // Relationships
        builder.HasOne(p => p.Patient)
            .WithMany()
            .HasForeignKey(p => p.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Items)
            .WithOne(i => i.Prescription)
            .HasForeignKey(i => i.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class PrescriptionItemConfiguration : IEntityTypeConfiguration<PrescriptionItem>
{
    public void Configure(EntityTypeBuilder<PrescriptionItem> builder)
    {
        builder.ToTable("PrescriptionItems");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.MedicineName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(i => i.GenericName)
            .HasMaxLength(200);

        builder.Property(i => i.Strength)
            .HasMaxLength(50);

        builder.Property(i => i.Form)
            .HasMaxLength(50);

        builder.Property(i => i.Dosage)
            .HasMaxLength(100);

        builder.Property(i => i.FrequencyText)
            .HasMaxLength(100);

        builder.Property(i => i.DurationText)
            .HasMaxLength(100);

        builder.Property(i => i.Instructions)
            .HasMaxLength(500);

        builder.Property(i => i.SpecialInstructions)
            .HasMaxLength(500);

        builder.Property(i => i.Warnings)
            .HasMaxLength(500);

        builder.Property(i => i.RowVersion)
            .IsRowVersion();

        // Indexes
        builder.HasIndex(i => i.PrescriptionId);
    }
}
