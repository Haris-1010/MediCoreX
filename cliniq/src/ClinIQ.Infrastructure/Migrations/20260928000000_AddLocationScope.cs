//using ClinIQ.Infrastructure.Data;
//using Microsoft.EntityFrameworkCore.Infrastructure;
//using Microsoft.EntityFrameworkCore.Migrations;

//#nullable disable

//namespace ClinIQ.Infrastructure.Migrations
//{
//    /// <summary>
//    /// Location-level multi-tenancy under each organization (Branch = Location).
//    /// - Patients.BranchId (registration location)
//    /// - TenantUsers.HasAllLocations (All Locations read scope)
//    /// - Backfill: default Main Branch per tenant, BranchUser links, assign existing data
//    /// Idempotent so it is safe to re-run on databases that already have partial columns.
//    /// </summary>
//    [DbContext(typeof(ApplicationDbContext))]
//    [Migration("20260928000000_AddLocationScope")]
//    public partial class AddLocationScope : Migration
//    {
//        /// <inheritdoc />
//        protected override void Up(MigrationBuilder migrationBuilder)
//        {
//            migrationBuilder.Sql(@"
//-- ---------------------------------------------------------------------------
//-- 1) Patients.BranchId
//-- ---------------------------------------------------------------------------
//IF COL_LENGTH('dbo.Patients', 'BranchId') IS NULL
//    ALTER TABLE dbo.Patients ADD [BranchId] uniqueidentifier NULL;
//", timeout: TimeSpan.FromMinutes(1));

//            migrationBuilder.Sql(@"
//IF NOT EXISTS (
//    SELECT 1 FROM sys.indexes
//    WHERE name = 'IX_Patients_TenantId_BranchId'
//      AND object_id = OBJECT_ID('dbo.Patients'))
//    CREATE NONCLUSTERED INDEX [IX_Patients_TenantId_BranchId]
//        ON dbo.Patients ([TenantId], [BranchId]);
//", timeout: TimeSpan.FromMinutes(1));

//            migrationBuilder.Sql(@"
//-- ---------------------------------------------------------------------------
//-- 2) TenantUsers.HasAllLocations
//-- ---------------------------------------------------------------------------
//IF COL_LENGTH('dbo.TenantUsers', 'HasAllLocations') IS NULL
//    ALTER TABLE dbo.TenantUsers ADD [HasAllLocations] bit NOT NULL CONSTRAINT DF_TenantUsers_HasAllLocations DEFAULT(0);
//", timeout: TimeSpan.FromMinutes(1));

//            migrationBuilder.Sql(@"
//-- Organization owners get All Locations by default.
//UPDATE dbo.TenantUsers SET [HasAllLocations] = 1
//WHERE [IsOwner] = 1 AND [HasAllLocations] = 0;

//-- ---------------------------------------------------------------------------
//-- 3) Ensure every tenant has at least one active branch (Main Branch)
//-- ---------------------------------------------------------------------------
//;WITH MissingMain AS (
//    SELECT t.[Id] AS TenantId
//    FROM dbo.Tenants t
//    WHERE t.[IsDeleted] = 0
//      AND NOT EXISTS (
//          SELECT 1 FROM dbo.Branches b
//          WHERE b.[TenantId] = t.[Id] AND b.[IsDeleted] = 0))
//INSERT INTO dbo.Branches (
//    [Id], [Name], [Code], [Description], [Address], [City], [State], [Country],
//    [PostalCode], [Phone], [Email], [Timezone], [IsMainBranch], [IsActive],
//    [OperatingHours], [Settings], [TenantId],
//    [CreatedAt], [CreatedBy], [UpdatedAt], [UpdatedBy],
//    [IsDeleted], [DeletedAt], [DeletedBy], [RowVersion])
//SELECT
//    NEWID(), N'Main Branch', N'MAIN', NULL, NULL, NULL, NULL, NULL,
//    NULL, NULL, NULL, NULL, 1, 1,
//    NULL, NULL, m.TenantId,
//    SYSUTCDATETIME(), NULL, NULL, NULL,
//    0, NULL, NULL,
//    CAST(0x01 AS varbinary(max))
//FROM MissingMain m;

//-- Promote earliest active branch to Main when none flagged for that tenant
//UPDATE b SET b.[IsMainBranch] = 1
//FROM dbo.Branches b
//WHERE b.[IsDeleted] = 0
//  AND b.[IsMainBranch] = 0
//  AND b.[TenantId] IS NOT NULL
//  AND NOT EXISTS (
//      SELECT 1 FROM dbo.Branches m
//      WHERE m.[TenantId] = b.[TenantId]
//        AND m.[IsMainBranch] = 1
//        AND m.[IsDeleted] = 0)
//  AND NOT EXISTS (
//      SELECT 1 FROM dbo.Branches earlier
//      WHERE earlier.[TenantId] = b.[TenantId]
//        AND earlier.[IsDeleted] = 0
//        AND earlier.[IsMainBranch] = 0
//        AND (earlier.[CreatedAt] < b.[CreatedAt]
//             OR (earlier.[CreatedAt] = b.[CreatedAt] AND earlier.[Id] < b.[Id])));

//-- ---------------------------------------------------------------------------
//-- 4) Link every TenantUser to their tenant's Main Branch (primary) if unlinked
//-- ---------------------------------------------------------------------------
//;WITH MainB AS (
//    SELECT b.[TenantId], b.[Id] AS BranchId
//    FROM dbo.Branches b
//    WHERE b.[IsDeleted] = 0 AND b.[IsMainBranch] = 1 AND b.[TenantId] IS NOT NULL),
//NeedLink AS (
//    SELECT tu.[Id] AS TenantUserId, tu.[TenantId], tu.[UserId], m.[BranchId]
//    FROM dbo.TenantUsers tu
//    INNER JOIN MainB m ON m.[TenantId] = tu.[TenantId]
//    WHERE NOT EXISTS (
//        SELECT 1 FROM dbo.BranchUsers bu
//        WHERE bu.[TenantId] = tu.[TenantId]
//          AND bu.[UserId] = tu.[UserId]
//          AND bu.[BranchId] = m.[BranchId]))
//INSERT INTO dbo.BranchUsers (
//    [Id], [BranchId], [UserId], [TenantId], [IsPrimary], [IsActive],
//    [CreatedAt], [CreatedBy], [UpdatedAt], [UpdatedBy], [RowVersion])
//SELECT
//    NEWID(), n.[BranchId], n.[UserId], n.[TenantId],
//    CASE WHEN EXISTS (
//        SELECT 1 FROM dbo.BranchUsers b2
//        WHERE b2.[TenantId] = n.[TenantId] AND b2.[UserId] = n.[UserId]) THEN 0 ELSE 1 END,
//    1,
//    SYSUTCDATETIME(), NULL, NULL, NULL,
//    CAST(0x01 AS varbinary(max))
//FROM NeedLink n;

//-- ---------------------------------------------------------------------------
//-- 5) Assign existing patients (and other tenant-scoped rows with BranchId) to Main Branch
//-- ---------------------------------------------------------------------------
//IF COL_LENGTH('dbo.Patients', 'BranchId') IS NOT NULL
//BEGIN
//    EXEC sp_executesql N'
//    UPDATE p
//    SET p.[BranchId] = m.[BranchId]
//    FROM dbo.Patients p
//    INNER JOIN (
//        SELECT b.[TenantId], b.[Id] AS BranchId,
//               ROW_NUMBER() OVER (PARTITION BY b.[TenantId] ORDER BY b.[IsMainBranch] DESC, b.[CreatedAt], b.[Id]) AS rn
//        FROM dbo.Branches b
//        WHERE b.[IsDeleted] = 0 AND b.[TenantId] IS NOT NULL
//    ) m ON m.[TenantId] = p.[TenantId] AND m.rn = 1
//    WHERE p.[BranchId] IS NULL;';
//END

//-- Backfill any operational table that has TenantId + BranchId (skip BranchUsers)
//DECLARE @tbl sysname, @sql nvarchar(max);
//DECLARE tbl_cursor CURSOR LOCAL FAST_FORWARD FOR
//    SELECT t.name
//    FROM sys.tables t
//    WHERE t.is_ms_shipped = 0
//      AND t.name <> 'BranchUsers'
//      AND EXISTS (SELECT 1 FROM sys.columns c WHERE c.object_id = t.object_id AND c.name = 'BranchId')
//      AND EXISTS (SELECT 1 FROM sys.columns c WHERE c.object_id = t.object_id AND c.name = 'TenantId');

//OPEN tbl_cursor;
//FETCH NEXT FROM tbl_cursor INTO @tbl;
//WHILE @@FETCH_STATUS = 0
//BEGIN
//    SET @sql = N'
//UPDATE x
//SET x.[BranchId] = m.[BranchId]
//FROM ' + QUOTENAME(@tbl) + N' x
//INNER JOIN (
//    SELECT b.[TenantId], b.[Id] AS BranchId,
//           ROW_NUMBER() OVER (PARTITION BY b.[TenantId] ORDER BY b.[IsMainBranch] DESC, b.[CreatedAt], b.[Id]) AS rn
//    FROM dbo.Branches b
//    WHERE b.[IsDeleted] = 0 AND b.[TenantId] IS NOT NULL
//) m ON m.[TenantId] = x.[TenantId] AND m.rn = 1
//WHERE x.[BranchId] IS NULL AND x.[TenantId] IS NOT NULL;';
//    BEGIN TRY
//        EXEC sp_executesql @sql;
//    END TRY
//    BEGIN CATCH
//        -- Skip tables that cannot be updated (e.g. computed/unsupported)
//    END CATCH
//    FETCH NEXT FROM tbl_cursor INTO @tbl;
//END
//CLOSE tbl_cursor;
//DEALLOCATE tbl_cursor;
//", timeout: TimeSpan.FromMinutes(10));
//        }

//        /// <inheritdoc />
//        protected override void Down(MigrationBuilder migrationBuilder)
//        {
//            migrationBuilder.Sql(@"
//IF COL_LENGTH('dbo.Patients', 'BranchId') IS NOT NULL
//BEGIN
//    IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Patients_TenantId_BranchId' AND object_id = OBJECT_ID('dbo.Patients'))
//        DROP INDEX [IX_Patients_TenantId_BranchId] ON dbo.Patients;
//    ALTER TABLE dbo.Patients DROP COLUMN [BranchId];
//END;

//IF COL_LENGTH('dbo.TenantUsers', 'HasAllLocations') IS NOT NULL
//BEGIN
//    IF EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = 'DF_TenantUsers_HasAllLocations')
//        ALTER TABLE dbo.TenantUsers DROP CONSTRAINT [DF_TenantUsers_HasAllLocations];
//    ALTER TABLE dbo.TenantUsers DROP COLUMN [HasAllLocations];
//END;
//");
//        }
//    }
//}
