-- Cleanup Script: Remove extra seed beds
-- This script marks extra beds as deleted so the IPD dashboard shows correct count
-- Run this script against your database before re-seeding

-- First, check how many beds exist per tenant
SELECT TenantId, COUNT(*) as BedCount
FROM Beds
WHERE IsDeleted = 0
GROUP BY TenantId;

-- Check which wards belong to which tenants
SELECT w.Id, w.Name, w.TenantId, w.TotalBeds,
  (SELECT COUNT(*) FROM Rooms r WHERE r.WardId = w.Id AND r.IsDeleted = 0) as ActualRooms,
  (SELECT COUNT(*) FROM Beds b
   INNER JOIN Rooms rm ON b.RoomId = rm.Id
   WHERE rm.WardId = w.Id AND b.IsDeleted = 0) as ActualBeds
FROM Wards w
WHERE w.IsDeleted = 0;

-- Option 1: Soft-delete ALL beds for your tenant, then re-create only 10
-- Uncomment and set your TenantId below:
-- UPDATE Beds SET IsDeleted = 1, DeletedAt = GETUTCDATE() WHERE TenantId = 'YOUR-TENANT-ID' AND IsDeleted = 0;
-- UPDATE Rooms SET IsDeleted = 1, DeletedAt = GETUTCDATE() WHERE WardId IN (SELECT Id FROM Wards WHERE TenantId = 'YOUR-TENANT-ID' AND IsDeleted = 0) AND IsDeleted = 0;
-- UPDATE Wards SET IsDeleted = 1, DeletedAt = GETUTCDATE() WHERE TenantId = 'YOUR-TENANT-ID' AND IsDeleted = 0;

-- Option 2: Keep only 1 ward with 1 room and 10 beds (recommended)
-- Uncomment and set your TenantId and WardId below:
/*
DECLARE @TenantId UNIQUEIDENTIFIER = 'YOUR-TENANT-ID';
DECLARE @KeepWardId UNIQUEIDENTIFIER = 'YOUR-WARD-TO-KEEP';

-- Soft-delete all beds except those in the ward you want to keep
UPDATE Beds SET IsDeleted = 1, DeletedAt = GETUTCDATE()
WHERE TenantId = @TenantId AND IsDeleted = 0
AND RoomId NOT IN (
  SELECT r.Id FROM Rooms r WHERE r.WardId = @KeepWardId AND r.IsDeleted = 0
);

-- Soft-delete all rooms except those in the ward you want to keep
UPDATE Rooms SET IsDeleted = 1, DeletedAt = GETUTCDATE()
WHERE WardId IN (SELECT Id FROM Wards WHERE TenantId = @TenantId AND IsDeleted = 0)
AND Id NOT IN (
  SELECT r.Id FROM Rooms r WHERE r.WardId = @KeepWardId AND r.IsDeleted = 0
);

-- Soft-delete all wards except the one you want to keep
UPDATE Wards SET IsDeleted = 1, DeletedAt = GETUTCDATE()
WHERE TenantId = @TenantId AND IsDeleted = 0 AND Id != @KeepWardId;

-- Update the kept ward's TotalBeds to 10
UPDATE Wards SET TotalBeds = 10 WHERE Id = @KeepWardId;
*/
