using ClinIQ.Domain.Entities.Clinical;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class LabTestParameterConfiguration : IEntityTypeConfiguration<LabTestParameter>
{
    public void Configure(EntityTypeBuilder<LabTestParameter> builder)
    {
        builder.ToTable("LabTestParameters");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.RowVersion)
            .IsRowVersion()
            .IsConcurrencyToken();

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Code)
            .HasMaxLength(50);

        builder.Property(p => p.Unit)
            .HasMaxLength(50);

        builder.Property(p => p.NormalRange)
            .HasMaxLength(200);

        builder.Property(p => p.MaleRange)
            .HasMaxLength(200);

        builder.Property(p => p.FemaleRange)
            .HasMaxLength(200);

        builder.Property(p => p.ChildRange)
            .HasMaxLength(200);

        builder.Property(p => p.Description)
            .HasMaxLength(500);

        builder.Property(p => p.Options)
            .HasMaxLength(2000);

        builder.HasIndex(p => new { p.TenantId, p.ServiceId, p.DisplayOrder });
        builder.HasIndex(p => new { p.TenantId, p.ServiceId, p.Name });
    }
}
