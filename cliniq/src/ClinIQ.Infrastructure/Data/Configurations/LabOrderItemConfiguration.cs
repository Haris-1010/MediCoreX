using ClinIQ.Domain.Entities.Clinical;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class LabOrderItemConfiguration : IEntityTypeConfiguration<LabOrderItem>
{
    public void Configure(EntityTypeBuilder<LabOrderItem> builder)
    {
        builder.ToTable("LabOrderItems");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.RowVersion)
            .IsRowVersion()
            .IsConcurrencyToken();

        builder.Property(i => i.ServiceName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(i => i.ServiceCode)
            .HasMaxLength(50);

        builder.Property(i => i.UnitPrice)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.Discount)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.NetAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.SampleType)
            .HasMaxLength(100);

        builder.Property(i => i.SampleId)
            .HasMaxLength(100);

        builder.Property(i => i.Container)
            .HasMaxLength(100);

        builder.Property(i => i.Notes)
            .HasMaxLength(1000);

        builder.HasIndex(i => new { i.MedicalOrderId });
        builder.HasIndex(i => i.Status);
        builder.HasIndex(i => i.SampleId);
    }
}
