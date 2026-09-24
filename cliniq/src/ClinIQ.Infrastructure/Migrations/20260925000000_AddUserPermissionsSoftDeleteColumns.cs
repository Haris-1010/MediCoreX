using ClinIQ.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinIQ.Infrastructure.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260925000000_AddUserPermissionsSoftDeleteColumns")]
    public partial class AddUserPermissionsSoftDeleteColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Idempotent: add soft-delete columns only when missing.
            // Entity (BaseAuditableEntity) always maps these columns.
            migrationBuilder.Sql(@"
IF OBJECT_ID('dbo.UserPermissions', 'U') IS NOT NULL
BEGIN
    IF COL_LENGTH('dbo.UserPermissions', 'IsDeleted') IS NULL
        ALTER TABLE dbo.UserPermissions ADD [IsDeleted] bit NOT NULL CONSTRAINT DF_UserPermissions_IsDeleted DEFAULT(0);

    IF COL_LENGTH('dbo.UserPermissions', 'DeletedAt') IS NULL
        ALTER TABLE dbo.UserPermissions ADD [DeletedAt] datetime2 NULL;

    IF COL_LENGTH('dbo.UserPermissions', 'DeletedBy') IS NULL
        ALTER TABLE dbo.UserPermissions ADD [DeletedBy] uniqueidentifier NULL;
END
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF OBJECT_ID('dbo.UserPermissions', 'U') IS NOT NULL
BEGIN
    IF COL_LENGTH('dbo.UserPermissions', 'DeletedBy') IS NOT NULL
        ALTER TABLE dbo.UserPermissions DROP COLUMN [DeletedBy];

    IF COL_LENGTH('dbo.UserPermissions', 'DeletedAt') IS NOT NULL
        ALTER TABLE dbo.UserPermissions DROP COLUMN [DeletedAt];

    IF COL_LENGTH('dbo.UserPermissions', 'IsDeleted') IS NOT NULL
        ALTER TABLE dbo.UserPermissions DROP COLUMN [IsDeleted];
END
");
        }
    }
}
