using ClinIQ.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinIQ.Infrastructure.Migrations
{
    /// <summary>
    /// Inventory becomes location-wise: Item now derives from BranchEntity, so it
    /// needs a BranchId column and every existing item must be attached to a
    /// location before the combined query filter (which fails closed when
    /// BranchId is NULL) is switched on.
    ///
    /// Also carries the two safety nets the location scope depends on:
    ///   - organization owners keep "All Locations" (TenantUsers.HasAllLocations)
    ///   - every active org member gets at least one BranchUser link, so a legacy
    ///     account never resolves to an empty location scope.
    ///
    /// Every statement is guarded (COL_LENGTH / IF NOT EXISTS / only rows that are
    /// still NULL), so it is safe to re-run on databases that already ran
    /// scripts/apply-location-scope.sql.
    /// </summary>
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260929000000_AddItemsBranchScope")]
    public partial class AddItemsBranchScope : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.Items', 'BranchId') IS NULL
    ALTER TABLE dbo.Items ADD [BranchId] uniqueidentifier NULL;
");

            migrationBuilder.Sql(@"
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_Items_TenantId_BranchId'
      AND object_id = OBJECT_ID('dbo.Items'))
    CREATE NONCLUSTERED INDEX [IX_Items_TenantId_BranchId]
        ON dbo.Items ([TenantId], [BranchId]);
");

            // Existing stock belongs to whichever location that tenant treats as
            // its main branch — the same rule used for patients in
            // scripts/apply-location-scope.sql.
            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.Items', 'BranchId') IS NOT NULL
BEGIN
    UPDATE x
    SET x.[BranchId] = m.[BranchId]
    FROM dbo.Items x
    INNER JOIN (
        SELECT b.[TenantId], b.[Id] AS BranchId,
               ROW_NUMBER() OVER (PARTITION BY b.[TenantId]
                                  ORDER BY b.[IsMainBranch] DESC, b.[CreatedAt], b.[Id]) AS rn
        FROM dbo.Branches b
        WHERE b.[IsDeleted] = 0 AND b.[TenantId] IS NOT NULL
    ) m ON m.[TenantId] = x.[TenantId] AND m.rn = 1
    WHERE x.[BranchId] IS NULL
      AND x.[TenantId] IS NOT NULL;
END
");

            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.TenantUsers', 'HasAllLocations') IS NOT NULL
BEGIN
    UPDATE dbo.TenantUsers SET [HasAllLocations] = 1
    WHERE [IsOwner] = 1 AND [HasAllLocations] = 0;
END
");

            // A member with no active BranchUser row has no location at all, so
            // every location-scoped query (inventory included) fails closed for
            // them. Attach such members to their organization's main branch.
            migrationBuilder.Sql(@"
;WITH MainB AS (
    SELECT b.[TenantId], b.[Id] AS BranchId,
           ROW_NUMBER() OVER (PARTITION BY b.[TenantId]
                              ORDER BY b.[IsMainBranch] DESC, b.[CreatedAt], b.[Id]) AS rn
    FROM dbo.Branches b
    WHERE b.[IsDeleted] = 0 AND b.[TenantId] IS NOT NULL),
NeedLink AS (
    SELECT tu.[TenantId], tu.[UserId], m.[BranchId]
    FROM dbo.TenantUsers tu
    INNER JOIN MainB m ON m.[TenantId] = tu.[TenantId] AND m.rn = 1
    WHERE tu.[IsActive] = 1
      AND NOT EXISTS (
          SELECT 1 FROM dbo.BranchUsers bu
          WHERE bu.[TenantId] = tu.[TenantId]
            AND bu.[UserId] = tu.[UserId]
            AND bu.[IsActive] = 1))
INSERT INTO dbo.BranchUsers (
    [Id], [BranchId], [UserId], [TenantId], [IsPrimary], [IsActive],
    [CreatedAt], [CreatedBy], [UpdatedAt], [UpdatedBy], [RowVersion])
SELECT
    NEWID(), n.[BranchId], n.[UserId], n.[TenantId], 1, 1,
    SYSUTCDATETIME(), NULL, NULL, NULL, CAST(0x01 AS varbinary(max))
FROM NeedLink n;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_Items_TenantId_BranchId'
      AND object_id = OBJECT_ID('dbo.Items'))
    DROP INDEX [IX_Items_TenantId_BranchId] ON dbo.Items;

IF COL_LENGTH('dbo.Items', 'BranchId') IS NOT NULL
    ALTER TABLE dbo.Items DROP COLUMN [BranchId];
");
        }
    }
}
