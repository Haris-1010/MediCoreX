-- =============================================================================
-- AddLocationScope (20260928000000)
-- Location multi-tenancy: Patients.BranchId + TenantUsers.HasAllLocations + backfill
-- Idempotent — safe to re-run.
-- NOTE: GO batch separators required: SQL Server binds column names at batch compile time.
-- =============================================================================

SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
GO

-- ---------------------------------------------------------------------------
-- 1) Patients.BranchId  (own batch: later batches can reference the column)
-- ---------------------------------------------------------------------------
IF COL_LENGTH('dbo.Patients', 'BranchId') IS NULL
    ALTER TABLE dbo.Patients ADD [BranchId] uniqueidentifier NULL;
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_Patients_TenantId_BranchId'
      AND object_id = OBJECT_ID('dbo.Patients'))
    CREATE NONCLUSTERED INDEX [IX_Patients_TenantId_BranchId]
        ON dbo.Patients ([TenantId], [BranchId]);
GO

-- ---------------------------------------------------------------------------
-- 2) TenantUsers.HasAllLocations  (own batch)
-- ---------------------------------------------------------------------------
IF COL_LENGTH('dbo.TenantUsers', 'HasAllLocations') IS NULL
    ALTER TABLE dbo.TenantUsers ADD [HasAllLocations] bit NOT NULL CONSTRAINT DF_TenantUsers_HasAllLocations DEFAULT(0);
GO

-- Organization owners get All Locations by default.
UPDATE dbo.TenantUsers SET [HasAllLocations] = 1
WHERE [IsOwner] = 1 AND [HasAllLocations] = 0;
GO

-- ---------------------------------------------------------------------------
-- 3) Ensure every tenant has at least one active branch (Main Branch)
-- ---------------------------------------------------------------------------
;WITH MissingMain AS (
    SELECT t.[Id] AS TenantId
    FROM dbo.Tenants t
    WHERE t.[IsDeleted] = 0
      AND NOT EXISTS (
          SELECT 1 FROM dbo.Branches b
          WHERE b.[TenantId] = t.[Id] AND b.[IsDeleted] = 0))
INSERT INTO dbo.Branches (
    [Id], [Name], [Code], [Description], [Address], [City], [State], [Country],
    [PostalCode], [Phone], [Email], [Timezone], [IsMainBranch], [IsActive],
    [OperatingHours], [Settings], [TenantId],
    [CreatedAt], [CreatedBy], [UpdatedAt], [UpdatedBy],
    [IsDeleted], [DeletedAt], [DeletedBy], [RowVersion])
SELECT
    NEWID(), N'Main Branch', N'MAIN', NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, 1, 1,
    NULL, NULL, m.TenantId,
    SYSUTCDATETIME(), NULL, NULL, NULL,
    0, NULL, NULL,
    CAST(0x01 AS varbinary(max))
FROM MissingMain m;
GO

-- Promote earliest active branch to Main when none flagged for that tenant
UPDATE b SET b.[IsMainBranch] = 1
FROM dbo.Branches b
WHERE b.[IsDeleted] = 0
  AND b.[IsMainBranch] = 0
  AND b.[TenantId] IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM dbo.Branches m
      WHERE m.[TenantId] = b.[TenantId]
        AND m.[IsMainBranch] = 1
        AND m.[IsDeleted] = 0)
  AND NOT EXISTS (
      SELECT 1 FROM dbo.Branches earlier
      WHERE earlier.[TenantId] = b.[TenantId]
        AND earlier.[IsDeleted] = 0
        AND earlier.[IsMainBranch] = 0
        AND (earlier.[CreatedAt] < b.[CreatedAt]
             OR (earlier.[CreatedAt] = b.[CreatedAt] AND earlier.[Id] < b.[Id])));
GO

-- ---------------------------------------------------------------------------
-- 4) Link every TenantUser to their tenant's Main Branch (primary) if unlinked
-- ---------------------------------------------------------------------------
;WITH MainB AS (
    SELECT b.[TenantId], b.[Id] AS BranchId
    FROM dbo.Branches b
    WHERE b.[IsDeleted] = 0 AND b.[IsMainBranch] = 1 AND b.[TenantId] IS NOT NULL),
NeedLink AS (
    SELECT tu.[Id] AS TenantUserId, tu.[TenantId], tu.[UserId], m.[BranchId]
    FROM dbo.TenantUsers tu
    INNER JOIN MainB m ON m.[TenantId] = tu.[TenantId]
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.BranchUsers bu
        WHERE bu.[TenantId] = tu.[TenantId]
          AND bu.[UserId] = tu.[UserId]
          AND bu.[BranchId] = m.[BranchId]))
INSERT INTO dbo.BranchUsers (
    [Id], [BranchId], [UserId], [TenantId], [IsPrimary], [IsActive],
    [CreatedAt], [CreatedBy], [UpdatedAt], [UpdatedBy], [RowVersion])
SELECT
    NEWID(), n.[BranchId], n.[UserId], n.[TenantId],
    CASE WHEN EXISTS (
        SELECT 1 FROM dbo.BranchUsers b2
        WHERE b2.[TenantId] = n.[TenantId] AND b2.[UserId] = n.[UserId]) THEN 0 ELSE 1 END,
    1,
    SYSUTCDATETIME(), NULL, NULL, NULL,
    CAST(0x01 AS varbinary(max))
FROM NeedLink n;
GO

-- ---------------------------------------------------------------------------
-- 5) Assign existing patients to Main Branch
--    (dynamic SQL: Patients.BranchId may have been added earlier in this run)
-- ---------------------------------------------------------------------------
IF COL_LENGTH('dbo.Patients', 'BranchId') IS NOT NULL
BEGIN
    EXEC sp_executesql N'
    UPDATE p
    SET p.[BranchId] = m.[BranchId]
    FROM dbo.Patients p
    INNER JOIN (
        SELECT b.[TenantId], b.[Id] AS BranchId,
               ROW_NUMBER() OVER (PARTITION BY b.[TenantId] ORDER BY b.[IsMainBranch] DESC, b.[CreatedAt], b.[Id]) AS rn
        FROM dbo.Branches b
        WHERE b.[IsDeleted] = 0 AND b.[TenantId] IS NOT NULL
    ) m ON m.[TenantId] = p.[TenantId] AND m.rn = 1
    WHERE p.[BranchId] IS NULL;';
END
GO

-- ---------------------------------------------------------------------------
-- 6) Backfill any operational table that has TenantId + BranchId (skip BranchUsers)
-- ---------------------------------------------------------------------------
DECLARE @tbl sysname, @sql nvarchar(max);
DECLARE tbl_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT t.name
    FROM sys.tables t
    WHERE t.is_ms_shipped = 0
      AND t.name <> 'BranchUsers'
      AND EXISTS (SELECT 1 FROM sys.columns c WHERE c.object_id = t.object_id AND c.name = 'BranchId')
      AND EXISTS (SELECT 1 FROM sys.columns c WHERE c.object_id = t.object_id AND c.name = 'TenantId');

OPEN tbl_cursor;
FETCH NEXT FROM tbl_cursor INTO @tbl;
WHILE @@FETCH_STATUS = 0
BEGIN
    SET @sql = N'
UPDATE x
SET x.[BranchId] = m.[BranchId]
FROM ' + QUOTENAME(@tbl) + N' x
INNER JOIN (
    SELECT b.[TenantId], b.[Id] AS BranchId,
           ROW_NUMBER() OVER (PARTITION BY b.[TenantId] ORDER BY b.[IsMainBranch] DESC, b.[CreatedAt], b.[Id]) AS rn
    FROM dbo.Branches b
    WHERE b.[IsDeleted] = 0 AND b.[TenantId] IS NOT NULL
) m ON m.[TenantId] = x.[TenantId] AND m.rn = 1
WHERE x.[BranchId] IS NULL AND x.[TenantId] IS NOT NULL;';
    BEGIN TRY
        EXEC sp_executesql @sql;
    END TRY
    BEGIN CATCH
        PRINT CONCAT('Skip ', @tbl, ': ', ERROR_MESSAGE());
    END CATCH
    FETCH NEXT FROM tbl_cursor INTO @tbl;
END
CLOSE tbl_cursor;
DEALLOCATE tbl_cursor;
GO

-- ---------------------------------------------------------------------------
-- 7) Mark migration as applied in EF history
-- ---------------------------------------------------------------------------
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[__EFMigrationsHistory]
    WHERE [MigrationId] = '20260928000000_AddLocationScope')
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20260928000000_AddLocationScope', '8.0.0');

PRINT 'AddLocationScope applied successfully.';
GO
