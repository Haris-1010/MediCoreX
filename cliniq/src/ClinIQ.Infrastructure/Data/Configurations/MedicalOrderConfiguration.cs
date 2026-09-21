using ClinIQ.Domain.Entities.Clinical;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class MedicalOrderConfiguration : IEntityTypeConfiguration<MedicalOrder>
{
    public void Configure(EntityTypeBuilder<MedicalOrder> builder)
    {
        builder.ToTable("MedicalOrders");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(o => o.ClinicalIndication)
            .HasMaxLength(2000);

        builder.Property(o => o.SpecialInstructions)
            .HasMaxLength(2000);

        builder.Property(o => o.Notes)
            .HasMaxLength(2000);

        builder.Property(o => o.Results)
            .HasMaxLength(4000);

        builder.Property(o => o.ResultNotes)
            .HasMaxLength(2000);

        builder.Property(o => o.AbnormalFlags)
            .HasMaxLength(1000);

        builder.Property(o => o.OrderItems)
            .HasMaxLength(4000);

        builder.HasIndex(o => o.OrderNumber);
        builder.HasIndex(o => new { o.TenantId, o.OrderType, o.OrderDate });
        builder.HasIndex(o => new { o.TenantId, o.OrderType, o.Status });
        builder.HasIndex(o => new { o.TenantId, o.PatientId });
        builder.HasIndex(o => o.PatientId);
        builder.HasIndex(o => o.OrderedById);

        builder.HasOne(o => o.Patient)
            .WithMany()
            .HasForeignKey(o => o.PatientId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
