using ClinIQ.Domain.Entities.Clinical;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class RadiologyOrderItemConfiguration : IEntityTypeConfiguration<RadiologyOrderItem>
{
    public void Configure(EntityTypeBuilder<RadiologyOrderItem> builder)
    {
        builder.ToTable("RadiologyOrderItems");

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

        builder.Property(i => i.Modality)
            .HasMaxLength(100);

        builder.Property(i => i.BodyPart)
            .HasMaxLength(200);

        builder.Property(i => i.Technique)
            .HasMaxLength(2000);

        builder.Property(i => i.Findings)
            .HasMaxLength(4000);

        builder.Property(i => i.Impression)
            .HasMaxLength(4000);

        builder.Property(i => i.Recommendations)
            .HasMaxLength(2000);

        builder.Property(i => i.Notes)
            .HasMaxLength(1000);

        builder.HasIndex(i => i.MedicalOrderId);
        builder.HasIndex(i => i.Status);
        builder.HasIndex(i => i.ScheduledAt);
    }
}
