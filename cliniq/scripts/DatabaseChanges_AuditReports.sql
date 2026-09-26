-- =====================================================================
-- DatabaseChanges_AuditReports.sql  (PostgreSQL)
--
-- Audit logging + hospital reporting: database changes.
--
-- WHAT THIS DOES
--   Adds 13 indexes (no tables, no columns, no data changes):
--     AuditLogs      (TenantId, Timestamp)
--                    (TenantId, BranchId, Timestamp)
--                    (TenantId, UserId, Timestamp)
--                    (TenantId, EntityType, EntityId)
--     Patients       (TenantId, CreatedAt)
--     Appointments   (TenantId, AppointmentDate)
--     Visits         (TenantId, VisitDate)
--     Admissions     (TenantId, AdmissionDate)
--     Invoices       (TenantId, InvoiceDate)
--     Payments       (TenantId, PaymentDate)
--     StockMovements (TenantId, MovementDate)
--     PurchaseOrders (TenantId, OrderDate)
--     StockBatches   (TenantId, ExpiryDate)
--
-- NOT NEEDED HERE
--   * AuditLogs table: already exists with every required column.
--   * Permissions: none added. The feature uses the existing
--     reports.view / reports.export / reports.financial / audit.view /
--     audit.export plus each module's own *.view permission. They are
--     seeded at API startup by PermissionSeeder.
--   * Navigation: defined in Angular (navigation.service.ts), not the DB.
--
-- HOW TO APPLY (pick ONE)
--   a) Do nothing: the API applies pending EF migrations on startup.
--   b) dotnet ef database update -p src/ClinIQ.Infrastructure -s src/ClinIQ.API
--   c) psql "host=localhost dbname=medicorex user=medicorex" -f scripts/DatabaseChanges_AuditReports.sql
--
-- This script is idempotent and records the EF migration
-- 20260926075541_AddAuditReportingIndexes, so a/b/c never double-apply.
-- =====================================================================

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_Visits_Tenant_Date" ON "Visits" ("TenantId", "VisitDate");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_StockMovements_Tenant_Date" ON "StockMovements" ("TenantId", "MovementDate");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_StockBatches_Tenant_Expiry" ON "StockBatches" ("TenantId", "ExpiryDate");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_PurchaseOrders_Tenant_Date" ON "PurchaseOrders" ("TenantId", "OrderDate");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_Payments_Tenant_Date" ON "Payments" ("TenantId", "PaymentDate");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_Patients_Tenant_CreatedAt" ON "Patients" ("TenantId", "CreatedAt");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_Invoices_Tenant_Date" ON "Invoices" ("TenantId", "InvoiceDate");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_AuditLogs_Tenant_Branch_Timestamp" ON "AuditLogs" ("TenantId", "BranchId", "Timestamp");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_AuditLogs_Tenant_Entity" ON "AuditLogs" ("TenantId", "EntityType", "EntityId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_AuditLogs_Tenant_Timestamp" ON "AuditLogs" ("TenantId", "Timestamp");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_AuditLogs_Tenant_User_Timestamp" ON "AuditLogs" ("TenantId", "UserId", "Timestamp");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_Appointments_Tenant_Date" ON "Appointments" ("TenantId", "AppointmentDate");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    CREATE INDEX "IX_Admissions_Tenant_Date" ON "Admissions" ("TenantId", "AdmissionDate");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260926075541_AddAuditReportingIndexes') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260926075541_AddAuditReportingIndexes', '8.0.0');
    END IF;
END $EF$;
COMMIT;

