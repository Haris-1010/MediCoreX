using ClinIQ.Domain.Entities.Facility;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class BedConfiguration : IEntityTypeConfiguration<Bed>
{
    public void Configure(EntityTypeBuilder<Bed> builder)
    {
        builder.ToTable("Beds");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.BedNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(b => new { b.RoomId, b.BedNumber })
            .IsUnique();

        builder.Property(b => b.Name)
            .HasMaxLength(100);

        builder.Property(b => b.Description)
            .HasMaxLength(500);

        builder.Property(b => b.DailyRate)
            .HasColumnType("decimal(18,2)");

        builder.Property(b => b.RowVersion)
            .IsRowVersion();

        // Indexes
        builder.HasIndex(b => new { b.BranchId, b.Status });
        builder.HasIndex(b => new { b.BranchId, b.BedType, b.Status });

        builder.HasOne(b => b.Room)
            .WithMany(r => r.Beds)
            .HasForeignKey(b => b.RoomId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class BedAllocationConfiguration : IEntityTypeConfiguration<BedAllocation>
{
    public void Configure(EntityTypeBuilder<BedAllocation> builder)
    {
        builder.ToTable("BedAllocations");

        builder.HasKey(ba => ba.Id);

        builder.Property(ba => ba.RowVersion)
            .IsRowVersion();

        // Indexes
        builder.HasIndex(ba => new { ba.BedId, ba.IsActive });
        builder.HasIndex(ba => new { ba.AdmissionId, ba.IsActive });
        builder.HasIndex(ba => new { ba.PatientId, ba.AllocatedAt });

        builder.HasOne(ba => ba.Bed)
            .WithMany(b => b.BedAllocations)
            .HasForeignKey(ba => ba.BedId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ba => ba.Room)
            .WithMany()
            .HasForeignKey(ba => ba.RoomId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ba => ba.Ward)
            .WithMany()
            .HasForeignKey(ba => ba.WardId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
