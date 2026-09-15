/* ===========================================================================
   ClinIQ — schema additions for the permission / entitlement layer
   ---------------------------------------------------------------------------
   Adds:
     * UserPermissions      per-user permission overrides (grant / deny)
     * TenantEntitlements   which features an organization may use
     * TenantLimits         numeric usage caps per organization
     * Users.MustChangePassword / PasswordChangedAt / Designation
     * Seed data for Permissions and the system Roles

   Idempotent — safe to run more than once.

   PREFERRED PATH: run the EF migration instead, so the model snapshot stays in
   sync with the database:

     dotnet ef migrations add AddPermissionOverridesAndEntitlements \
       -p src/ClinIQ.Infrastructure -s src/ClinIQ.API
     dotnet ef database update -p src/ClinIQ.Infrastructure -s src/ClinIQ.API

   Use this script only for environments where you apply SQL by hand. If you run
   it, generate the migration afterwards with --no-build so EF records the same
   state rather than trying to create these tables a second time.
   =========================================================================== */

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

/* ---------------------------------------------------------------------------
   1. UserPermissions
   --------------------------------------------------------------------------- */
IF OBJECT_ID(N'dbo.UserPermissions', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.UserPermissions
    (
        Id            UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_UserPermissions PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        TenantId      UNIQUEIDENTIFIER NOT NULL,
        UserId        UNIQUEIDENTIFIER NOT NULL,
        PermissionId  UNIQUEIDENTIFIER NOT NULL,
        IsGranted     BIT              NOT NULL CONSTRAINT DF_UserPermissions_IsGranted DEFAULT (1),
        BranchId      UNIQUEIDENTIFIER NULL,
        GrantedBy     UNIQUEIDENTIFIER NULL,
        GrantedAt     DATETIME2(7)     NULL,
        ExpiresAt     DATETIME2(7)     NULL,
        Reason        NVARCHAR(500)    NULL,
        CreatedAt     DATETIME2(7)     NOT NULL CONSTRAINT DF_UserPermissions_CreatedAt DEFAULT (SYSUTCDATETIME()),
        CreatedBy     UNIQUEIDENTIFIER NULL,
        UpdatedAt     DATETIME2(7)     NULL,
        UpdatedBy     UNIQUEIDENTIFIER NULL,
        RowVersion    ROWVERSION       NOT NULL,

        CONSTRAINT FK_UserPermissions_Tenants
            FOREIGN KEY (TenantId) REFERENCES dbo.Tenants (Id),
        CONSTRAINT FK_UserPermissions_Users
            FOREIGN KEY (UserId) REFERENCES dbo.Users (Id) ON DELETE CASCADE,
        CONSTRAINT FK_UserPermissions_Permissions
            FOREIGN KEY (PermissionId) REFERENCES dbo.Permissions (Id) ON DELETE CASCADE
    );

    /* One row per (tenant, user, permission, branch). This is what stops a
       double submit from creating a conflicting grant AND deny for the same
       permission, which would make resolution order-dependent. */
    CREATE UNIQUE INDEX UX_UserPermissions_Tenant_User_Permission_Branch
        ON dbo.UserPermissions (TenantId, UserId, PermissionId, BranchId)
        WHERE BranchId IS NOT NULL;

    CREATE UNIQUE INDEX UX_UserPermissions_Tenant_User_Permission_NoBranch
        ON dbo.UserPermissions (TenantId, UserId, PermissionId)
        WHERE BranchId IS NULL;

    /* Covers the hot path: resolving one user's overrides on every request. */
    CREATE INDEX IX_UserPermissions_Tenant_User
        ON dbo.UserPermissions (TenantId, UserId)
        INCLUDE (PermissionId, IsGranted, BranchId, ExpiresAt);
END
GO

/* ---------------------------------------------------------------------------
   2. TenantEntitlements
   --------------------------------------------------------------------------- */
IF OBJECT_ID(N'dbo.TenantEntitlements', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.TenantEntitlements
    (
        Id         UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_TenantEntitlements PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        TenantId   UNIQUEIDENTIFIER NOT NULL,
        Feature    NVARCHAR(100)    NOT NULL,
        IsEnabled  BIT              NOT NULL CONSTRAINT DF_TenantEntitlements_IsEnabled DEFAULT (1),
        ExpiresAt  DATETIME2(7)     NULL,
        Notes      NVARCHAR(500)    NULL,
        IsDeleted  BIT              NOT NULL CONSTRAINT DF_TenantEntitlements_IsDeleted DEFAULT (0),
        DeletedAt  DATETIME2(7)     NULL,
        DeletedBy  UNIQUEIDENTIFIER NULL,
        CreatedAt  DATETIME2(7)     NOT NULL CONSTRAINT DF_TenantEntitlements_CreatedAt DEFAULT (SYSUTCDATETIME()),
        CreatedBy  UNIQUEIDENTIFIER NULL,
        UpdatedAt  DATETIME2(7)     NULL,
        UpdatedBy  UNIQUEIDENTIFIER NULL,
        RowVersion ROWVERSION       NOT NULL,

        CONSTRAINT FK_TenantEntitlements_Tenants
            FOREIGN KEY (TenantId) REFERENCES dbo.Tenants (Id) ON DELETE CASCADE
    );

    CREATE UNIQUE INDEX UX_TenantEntitlements_Tenant_Feature
        ON dbo.TenantEntitlements (TenantId, Feature);
END
GO

/* ---------------------------------------------------------------------------
   3. TenantLimits
   --------------------------------------------------------------------------- */
IF OBJECT_ID(N'dbo.TenantLimits', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.TenantLimits
    (
        Id         UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_TenantLimits PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        TenantId   UNIQUEIDENTIFIER NOT NULL,
        LimitType  NVARCHAR(100)    NOT NULL,
        MaxValue   INT              NOT NULL CONSTRAINT DF_TenantLimits_MaxValue DEFAULT (-1),
        IsDeleted  BIT              NOT NULL CONSTRAINT DF_TenantLimits_IsDeleted DEFAULT (0),
        DeletedAt  DATETIME2(7)     NULL,
        DeletedBy  UNIQUEIDENTIFIER NULL,
        CreatedAt  DATETIME2(7)     NOT NULL CONSTRAINT DF_TenantLimits_CreatedAt DEFAULT (SYSUTCDATETIME()),
        CreatedBy  UNIQUEIDENTIFIER NULL,
        UpdatedAt  DATETIME2(7)     NULL,
        UpdatedBy  UNIQUEIDENTIFIER NULL,
        RowVersion ROWVERSION       NOT NULL,

        CONSTRAINT FK_TenantLimits_Tenants
            FOREIGN KEY (TenantId) REFERENCES dbo.Tenants (Id) ON DELETE CASCADE,
        /* -1 means unlimited; anything below that is a data-entry mistake. */
        CONSTRAINT CK_TenantLimits_MaxValue CHECK (MaxValue >= -1)
    );

    CREATE UNIQUE INDEX UX_TenantLimits_Tenant_LimitType
        ON dbo.TenantLimits (TenantId, LimitType);
END
GO

/* ---------------------------------------------------------------------------
   4. Password lifecycle columns on Users
   --------------------------------------------------------------------------- */
IF COL_LENGTH(N'dbo.Users', N'MustChangePassword') IS NULL
    ALTER TABLE dbo.Users ADD MustChangePassword BIT NOT NULL CONSTRAINT DF_Users_MustChangePassword DEFAULT (0);
GO

IF COL_LENGTH(N'dbo.Users', N'PasswordChangedAt') IS NULL
    ALTER TABLE dbo.Users ADD PasswordChangedAt DATETIME2(7) NULL;
GO

IF COL_LENGTH(N'dbo.Users', N'Designation') IS NULL
    ALTER TABLE dbo.Users ADD Designation NVARCHAR(200) NULL;
GO

/* ---------------------------------------------------------------------------
   5. Permission seed
   The application seeds this at startup too (PermissionSeeder). Running both is
   harmless — the MERGE below matches on Name, the same key the seeder uses.
   --------------------------------------------------------------------------- */
DECLARE @Permissions TABLE
(
    Name         NVARCHAR(200),
    DisplayName  NVARCHAR(200),
    Module       NVARCHAR(100),
    Category     NVARCHAR(100),
    DisplayOrder INT
);

INSERT INTO @Permissions (Name, DisplayName, Module, Category, DisplayOrder)
VALUES
    (N'patients.view', N'View', N'Patients', N'Clinical', 10),
    (N'patients.create', N'Create', N'Patients', N'Clinical', 20),
    (N'patients.edit', N'Edit', N'Patients', N'Clinical', 30),
    (N'patients.delete', N'Delete', N'Patients', N'Clinical', 40),
    (N'patients.merge', N'Merge', N'Patients', N'Clinical', 50),
    (N'patients.export', N'Export', N'Patients', N'Clinical', 60),
    (N'appointments.view', N'View', N'Appointments', N'Clinical', 10),
    (N'appointments.create', N'Create', N'Appointments', N'Clinical', 20),
    (N'appointments.edit', N'Edit', N'Appointments', N'Clinical', 30),
    (N'appointments.cancel', N'Cancel', N'Appointments', N'Clinical', 40),
    (N'appointments.confirm', N'Confirm', N'Appointments', N'Clinical', 50),
    (N'appointments.checkin', N'Check In', N'Appointments', N'Clinical', 60),
    (N'visits.view', N'View', N'Visits', N'Clinical', 10),
    (N'visits.create', N'Create', N'Visits', N'Clinical', 20),
    (N'visits.edit', N'Edit', N'Visits', N'Clinical', 30),
    (N'visits.delete', N'Delete', N'Visits', N'Clinical', 40),
    (N'emr.view', N'View', N'EMR', N'Clinical', 10),
    (N'emr.edit', N'Edit', N'EMR', N'Clinical', 20),
    (N'emr.view_confidential', N'View Confidential', N'EMR', N'Clinical', 30),
    (N'prescriptions.view', N'View', N'Prescriptions', N'Clinical', 10),
    (N'prescriptions.create', N'Create', N'Prescriptions', N'Clinical', 20),
    (N'prescriptions.edit', N'Edit', N'Prescriptions', N'Clinical', 30),
    (N'prescriptions.dispense', N'Dispense', N'Prescriptions', N'Clinical', 40),
    (N'admissions.view', N'View', N'Admissions', N'IPD', 10),
    (N'admissions.create', N'Admit', N'Admissions', N'IPD', 20),
    (N'admissions.edit', N'Edit', N'Admissions', N'IPD', 30),
    (N'admissions.discharge', N'Discharge', N'Admissions', N'IPD', 40),
    (N'admissions.transfer', N'Transfer', N'Admissions', N'IPD', 50),
    (N'beds.view', N'View', N'Beds', N'IPD', 10),
    (N'beds.manage', N'Manage', N'Beds', N'IPD', 20),
    (N'beds.allocate', N'Allocate', N'Beds', N'IPD', 30),
    (N'beds.transfer', N'Transfer', N'Beds', N'IPD', 40),
    (N'beds.release', N'Release', N'Beds', N'IPD', 50),
    (N'billing.view', N'View', N'Billing', N'Financial', 10),
    (N'billing.create', N'Create Invoice', N'Billing', N'Financial', 20),
    (N'billing.edit', N'Edit Invoice', N'Billing', N'Financial', 30),
    (N'billing.discount', N'Apply Discount', N'Billing', N'Financial', 40),
    (N'billing.manage_discounts', N'Manage Discount Templates', N'Billing', N'Financial', 45),
    (N'billing.refund', N'Refund', N'Billing', N'Financial', 50),
    (N'billing.cancel', N'Cancel Invoice', N'Billing', N'Financial', 60),
    (N'payments.view', N'View', N'Payments', N'Financial', 10),
    (N'payments.create', N'Create', N'Payments', N'Financial', 20),
    (N'payments.refund', N'Refund', N'Payments', N'Financial', 30),
    (N'insurance.view', N'View', N'Insurance', N'Financial', 10),
    (N'insurance.create', N'Create Policy', N'Insurance', N'Financial', 20),
    (N'insurance.edit', N'Edit Policy', N'Insurance', N'Financial', 30),
    (N'insurance.claims', N'Submit Claim', N'Insurance', N'Financial', 40),
    (N'insurance.approve', N'Approve Claim', N'Insurance', N'Financial', 50),
    (N'inventory.view', N'View', N'Inventory', N'Supply', 10),
    (N'inventory.manage', N'Manage', N'Inventory', N'Supply', 20),
    (N'inventory.adjust', N'Adjust', N'Inventory', N'Supply', 30),
    (N'inventory.transfer', N'Transfer', N'Inventory', N'Supply', 40),
    (N'purchase_orders.view', N'View', N'PurchaseOrders', N'Supply', 10),
    (N'purchase_orders.create', N'Create', N'PurchaseOrders', N'Supply', 20),
    (N'purchase_orders.approve', N'Approve', N'PurchaseOrders', N'Supply', 30),
    (N'purchase_orders.receive', N'Receive', N'PurchaseOrders', N'Supply', 40),
    (N'pharmacy.view', N'View', N'Pharmacy', N'Supply', 10),
    (N'pharmacy.sale', N'Sale', N'Pharmacy', N'Supply', 20),
    (N'pharmacy.dispense', N'Dispense', N'Pharmacy', N'Supply', 30),
    (N'reports.view', N'View', N'Reports', N'Analytics', 10),
    (N'reports.export', N'Export', N'Reports', N'Analytics', 20),
    (N'reports.financial', N'Financial', N'Reports', N'Analytics', 30),
    (N'users.view', N'View', N'Users', N'Administration', 10),
    (N'users.create', N'Create', N'Users', N'Administration', 20),
    (N'users.edit', N'Edit', N'Users', N'Administration', 30),
    (N'users.delete', N'Delete', N'Users', N'Administration', 40),
    (N'roles.view', N'View', N'Roles', N'Administration', 10),
    (N'roles.create', N'Create', N'Roles', N'Administration', 20),
    (N'roles.edit', N'Edit', N'Roles', N'Administration', 30),
    (N'roles.delete', N'Delete', N'Roles', N'Administration', 40),
    (N'settings.view', N'View', N'Settings', N'Administration', 10),
    (N'settings.edit', N'Edit', N'Settings', N'Administration', 20),
    (N'audit.view', N'View', N'Audit', N'Administration', 10);

MERGE dbo.Permissions AS target
USING @Permissions AS source
    ON target.Name = source.Name
WHEN MATCHED THEN
    UPDATE SET
        target.DisplayName  = source.DisplayName,
        target.Module       = source.Module,
        target.Category     = source.Category,
        target.DisplayOrder = source.DisplayOrder,
        target.IsActive     = 1,
        target.UpdatedAt    = SYSUTCDATETIME()
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Id, Name, DisplayName, Module, Category, DisplayOrder, IsActive, CreatedAt, IsDeleted)
    VALUES (NEWID(), source.Name, source.DisplayName, source.Module, source.Category,
            source.DisplayOrder, 1, SYSUTCDATETIME(), 0);
GO

/* Permissions dropped from the catalogue are deactivated, never deleted, so
   existing grants are not silently orphaned. */
GO

/* ---------------------------------------------------------------------------
   6. System roles (TenantId NULL = platform template)
   --------------------------------------------------------------------------- */
DECLARE @Roles TABLE (Name NVARCHAR(200), NormalizedName NVARCHAR(200));

INSERT INTO @Roles (Name, NormalizedName)
VALUES
    (N'SuperAdmin', N'SUPERADMIN'),
    (N'OrganizationOwner', N'ORGANIZATIONOWNER'),
    (N'HospitalAdministrator', N'HOSPITALADMINISTRATOR'),
    (N'ClinicManager', N'CLINICMANAGER'),
    (N'Doctor', N'DOCTOR'),
    (N'Nurse', N'NURSE'),
    (N'Receptionist', N'RECEPTIONIST'),
    (N'FrontDesk', N'FRONTDESK'),
    (N'Pharmacist', N'PHARMACIST'),
    (N'Accountant', N'ACCOUNTANT'),
    (N'LabStaff', N'LABSTAFF'),
    (N'RadiologyStaff', N'RADIOLOGYSTAFF'),
    (N'InventoryManager', N'INVENTORYMANAGER'),
    (N'ProcurementOfficer', N'PROCUREMENTOFFICER'),
    (N'HRStaff', N'HRSTAFF'),
    (N'InsuranceOfficer', N'INSURANCEOFFICER'),
    (N'BillingOfficer', N'BILLINGOFFICER');

INSERT INTO dbo.Roles (Id, Name, NormalizedName, TenantId, IsSystemRole, IsActive, DisplayOrder, CreatedAt, IsDeleted)
SELECT NEWID(), r.Name, r.NormalizedName, NULL, 1, 1, 0, SYSUTCDATETIME(), 0
FROM @Roles r
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.Roles x
    WHERE x.Name = r.Name AND x.TenantId IS NULL
);
GO

/* ---------------------------------------------------------------------------
   7. Supporting indexes for the permission hot path
   --------------------------------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_UserRoles_User_Tenant' AND object_id = OBJECT_ID(N'dbo.UserRoles'))
    CREATE INDEX IX_UserRoles_User_Tenant ON dbo.UserRoles (UserId, TenantId) INCLUDE (RoleId, BranchId);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_RolePermissions_Role' AND object_id = OBJECT_ID(N'dbo.RolePermissions'))
    CREATE INDEX IX_RolePermissions_Role ON dbo.RolePermissions (RoleId) INCLUDE (PermissionId);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_TenantUsers_User_Tenant' AND object_id = OBJECT_ID(N'dbo.TenantUsers'))
    CREATE INDEX IX_TenantUsers_User_Tenant ON dbo.TenantUsers (UserId, TenantId) INCLUDE (IsOwner, IsActive);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_BranchUsers_User_Tenant' AND object_id = OBJECT_ID(N'dbo.BranchUsers'))
    CREATE INDEX IX_BranchUsers_User_Tenant ON dbo.BranchUsers (UserId, TenantId) INCLUDE (BranchId, IsPrimary, IsActive);
GO

PRINT 'ClinIQ permission/entitlement schema applied.';
GO
