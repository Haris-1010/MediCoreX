using ClinIQ.Domain.Entities.Tenancy;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class TenantEntitlementConfiguration : IEntityTypeConfiguration<TenantEntitlement>
{
    public void Configure(EntityTypeBuilder<TenantEntitlement> builder)
    {
        builder.ToTable("TenantEntitlements");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Feature).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Notes).HasMaxLength(500);
        builder.Property(x => x.RowVersion).IsRowVersion();

        builder.HasIndex(x => new { x.TenantId, x.Feature })
               .IsUnique()
               .HasDatabaseName("UX_TenantEntitlements_Tenant_Feature");

        builder.HasOne(x => x.Tenant)
               .WithMany()
               .HasForeignKey(x => x.TenantId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

public class TenantLimitConfiguration : IEntityTypeConfiguration<TenantLimit>
{
    public void Configure(EntityTypeBuilder<TenantLimit> builder)
    {
        builder.ToTable("TenantLimits");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.LimitType).IsRequired().HasMaxLength(100);
        builder.Property(x => x.RowVersion).IsRowVersion();

        builder.HasIndex(x => new { x.TenantId, x.LimitType })
               .IsUnique()
               .HasDatabaseName("UX_TenantLimits_Tenant_LimitType");

        builder.HasOne(x => x.Tenant)
               .WithMany()
               .HasForeignKey(x => x.TenantId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
