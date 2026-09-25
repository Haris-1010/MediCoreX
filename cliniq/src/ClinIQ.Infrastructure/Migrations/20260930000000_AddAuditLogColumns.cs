using ClinIQ.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinIQ.Infrastructure.Migrations
{
    /// <summary>
    /// System-wide audit logging. The AuditLogs table itself ships with
    /// InitialCreate; this migration adds the columns the write pipeline and
    /// the UI need (module, human description, outcome, denormalised location)
    /// plus the indexes the audit list/filter queries lean on.
    ///
    /// Every statement is guarded (COL_LENGTH / IF NOT EXISTS) so it is safe to
    /// re-run on any environment, and the new permission rows are seeded the
    /// same way the PermissionSeeder does at startup (name + display metadata).
    /// </summary>
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260930000000_AddAuditLogColumns")]
    public partial class AddAuditLogColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.AuditLogs', 'Module') IS NULL
    ALTER TABLE dbo.AuditLogs ADD [Module] nvarchar(100) NULL;
");

            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.AuditLogs', 'Description') IS NULL
    ALTER TABLE dbo.AuditLogs ADD [Description] nvarchar(500) NULL;
");

            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.AuditLogs', 'Success') IS NULL
    ALTER TABLE dbo.AuditLogs ADD [Success] bit NULL;
");

            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.AuditLogs', 'FailureReason') IS NULL
    ALTER TABLE dbo.AuditLogs ADD [FailureReason] nvarchar(500) NULL;
");

            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.AuditLogs', 'LocationName') IS NULL
    ALTER TABLE dbo.AuditLogs ADD [LocationName] nvarchar(200) NULL;
");

            // Date-range listing (default sort is Timestamp DESC).
            migrationBuilder.Sql(@"
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_AuditLogs_TenantId_Timestamp'
      AND object_id = OBJECT_ID('dbo.AuditLogs'))
    CREATE NONCLUSTERED INDEX [IX_AuditLogs_TenantId_Timestamp]
        ON dbo.AuditLogs ([TenantId], [Timestamp] DESC);
");

            // "What happened in this location?" / location filter.
            migrationBuilder.Sql(@"
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_AuditLogs_TenantId_BranchId_Timestamp'
      AND object_id = OBJECT_ID('dbo.AuditLogs'))
    CREATE NONCLUSTERED INDEX [IX_AuditLogs_TenantId_BranchId_Timestamp]
        ON dbo.AuditLogs ([TenantId], [BranchId], [Timestamp] DESC);
");

            // "What did this user do?"
            migrationBuilder.Sql(@"
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_AuditLogs_TenantId_UserId_Timestamp'
      AND object_id = OBJECT_ID('dbo.AuditLogs'))
    CREATE NONCLUSTERED INDEX [IX_AuditLogs_TenantId_UserId_Timestamp]
        ON dbo.AuditLogs ([TenantId], [UserId], [Timestamp] DESC);
");

            // Module / action filters over a date window.
            migrationBuilder.Sql(@"
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_AuditLogs_TenantId_Module_Action'
      AND object_id = OBJECT_ID('dbo.AuditLogs'))
    CREATE NONCLUSTERED INDEX [IX_AuditLogs_TenantId_Module_Action]
        ON dbo.AuditLogs ([TenantId], [Module], [Action]);
");

            // Permission rows for the new audit export capability. The
            // PermissionSeeder applies the same upsert at startup; this keeps
            // the script complete for databases applied out-of-band.
            migrationBuilder.Sql(@"
IF NOT EXISTS (SELECT 1 FROM dbo.Permissions WHERE [Name] = 'audit.export')
    INSERT INTO dbo.Permissions (Id, Name, DisplayName, Module, Category, DisplayOrder, IsActive, CreatedAt, CreatedBy, RowVersion)
    SELECT NEWID(), 'audit.export', 'Export', 'Audit', 'Administration', 20, 1, SYSUTCDATETIME(), NULL,
           CAST(0x01 AS varbinary(max));
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_AuditLogs_TenantId_Module_Action' AND object_id = OBJECT_ID('dbo.AuditLogs'))
    DROP INDEX [IX_AuditLogs_TenantId_Module_Action] ON dbo.AuditLogs;
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_AuditLogs_TenantId_UserId_Timestamp' AND object_id = OBJECT_ID('dbo.AuditLogs'))
    DROP INDEX [IX_AuditLogs_TenantId_UserId_Timestamp] ON dbo.AuditLogs;
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_AuditLogs_TenantId_BranchId_Timestamp' AND object_id = OBJECT_ID('dbo.AuditLogs'))
    DROP INDEX [IX_AuditLogs_TenantId_BranchId_Timestamp] ON dbo.AuditLogs;
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_AuditLogs_TenantId_Timestamp' AND object_id = OBJECT_ID('dbo.AuditLogs'))
    DROP INDEX [IX_AuditLogs_TenantId_Timestamp] ON dbo.AuditLogs;

IF COL_LENGTH('dbo.AuditLogs', 'LocationName') IS NOT NULL
    ALTER TABLE dbo.AuditLogs DROP COLUMN [LocationName];
IF COL_LENGTH('dbo.AuditLogs', 'FailureReason') IS NOT NULL
    ALTER TABLE dbo.AuditLogs DROP COLUMN [FailureReason];
IF COL_LENGTH('dbo.AuditLogs', 'Success') IS NOT NULL
    ALTER TABLE dbo.AuditLogs DROP COLUMN [Success];
IF COL_LENGTH('dbo.AuditLogs', 'Description') IS NOT NULL
    ALTER TABLE dbo.AuditLogs DROP COLUMN [Description];
IF COL_LENGTH('dbo.AuditLogs', 'Module') IS NOT NULL
    ALTER TABLE dbo.AuditLogs DROP COLUMN [Module];
");
        }
    }
}
