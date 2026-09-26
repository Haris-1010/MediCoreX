using ClinIQ.Domain.Entities.Tenancy;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        builder.ToTable("Tenants");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Slug)
            .HasMaxLength(100);

        builder.HasIndex(t => t.Slug)
            .IsUnique()
            .HasFilter("\"Slug\" IS NOT NULL");

        builder.Property(t => t.Email)
            .HasMaxLength(256);

        builder.Property(t => t.Phone)
            .HasMaxLength(50);

        builder.Property(t => t.Website)
            .HasMaxLength(256);

        builder.Property(t => t.Address)
            .HasMaxLength(500);

        builder.Property(t => t.City)
            .HasMaxLength(100);

        builder.Property(t => t.State)
            .HasMaxLength(100);

        builder.Property(t => t.Country)
            .HasMaxLength(100);

        builder.Property(t => t.PostalCode)
            .HasMaxLength(20);

        builder.Property(t => t.TaxNumber)
            .HasMaxLength(50);

        builder.Property(t => t.RegistrationNumber)
            .HasMaxLength(100);

        builder.Property(t => t.Currency)
            .HasMaxLength(10)
            .HasDefaultValue("USD");

        builder.Property(t => t.Timezone)
            .HasMaxLength(100)
            .HasDefaultValue("UTC");

        builder.Property(t => t.Locale)
            .HasMaxLength(20)
            .HasDefaultValue("en-US");

        builder.Property(t => t.Package)
            .HasDefaultValue(0);

        builder.Property(t => t.SubscriptionStatus)
            .HasDefaultValue(0);

        builder.Property(t => t.RowVersion)
            .IsRowVersion();

        builder.HasMany(t => t.Branches)
            .WithOne(b => b.Tenant)
            .HasForeignKey(b => b.TenantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
