using ClinIQ.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class UserPermissionConfiguration : IEntityTypeConfiguration<UserPermission>
{
    public void Configure(EntityTypeBuilder<UserPermission> builder)
    {
        builder.ToTable("UserPermissions");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Reason).HasMaxLength(500);
        builder.Property(x => x.RowVersion).IsRowVersion();

        // One override row per (tenant, user, permission, branch). The unique
        // index is what stops a double-click from creating a conflicting
        // grant and deny for the same permission.
        builder.HasIndex(x => new { x.TenantId, x.UserId, x.PermissionId, x.BranchId })
               .IsUnique()
               .HasDatabaseName("UX_UserPermissions_Tenant_User_Permission_Branch");

        builder.HasIndex(x => new { x.TenantId, x.UserId })
               .HasDatabaseName("IX_UserPermissions_Tenant_User");

        builder.HasOne(x => x.Permission)
               .WithMany(p => p.UserPermissions)
               .HasForeignKey(x => x.PermissionId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
