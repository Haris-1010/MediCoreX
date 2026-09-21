using ClinIQ.Domain.Entities.Clinical;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class LabResultParameterConfiguration : IEntityTypeConfiguration<LabResultParameter>
{
    public void Configure(EntityTypeBuilder<LabResultParameter> builder)
    {
        builder.ToTable("LabResultParameters");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.RowVersion)
            .IsRowVersion()
            .IsConcurrencyToken();

        builder.Property(r => r.ParameterName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(r => r.ParameterCode)
            .HasMaxLength(50);

        builder.Property(r => r.ResultValue)
            .HasMaxLength(500);

        builder.Property(r => r.Unit)
            .HasMaxLength(50);

        builder.Property(r => r.NormalRange)
            .HasMaxLength(200);

        builder.HasIndex(r => r.LabOrderItemId);
    }
}
