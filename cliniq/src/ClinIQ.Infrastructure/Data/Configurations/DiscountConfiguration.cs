using ClinIQ.Domain.Entities.Billing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class DiscountConfiguration : IEntityTypeConfiguration<Discount>
{
    public void Configure(EntityTypeBuilder<Discount> builder)
    {
        builder.ToTable("Discounts");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(d => d.Description)
            .HasMaxLength(500);

        builder.Property(d => d.Type)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(d => d.Value)
            .HasColumnType("decimal(18,2)");

        builder.Property(d => d.RowVersion)
            .IsRowVersion()
            .IsConcurrencyToken();
    }
}
