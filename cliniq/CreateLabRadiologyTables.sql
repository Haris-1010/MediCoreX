-- ============================================================
-- Create Lab/Radiology tables that are missing from the database
-- Run this in SSMS or Azure Data Studio against your database
-- ============================================================

-- 1. LabOrderItems
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LabOrderItems')
BEGIN
    CREATE TABLE [LabOrderItems] (
        [Id] uniqueidentifier NOT NULL,
        [MedicalOrderId] uniqueidentifier NOT NULL,
        [ServiceId] uniqueidentifier NOT NULL,
        [ServiceName] nvarchar(200) NOT NULL,
        [ServiceCode] nvarchar(50) NULL,
        [UnitPrice] decimal(18,2) NOT NULL,
        [Quantity] int NOT NULL DEFAULT 1,
        [Discount] decimal(18,2) NOT NULL,
        [NetAmount] decimal(18,2) NOT NULL,
        [SampleType] nvarchar(100) NULL,
        [Status] int NOT NULL DEFAULT 1,
        [SampleId] nvarchar(100) NULL,
        [Container] nvarchar(100) NULL,
        [SampleCollectedAt] datetime2 NULL,
        [SampleCollectedById] uniqueidentifier NULL,
        [ResultEnteredAt] datetime2 NULL,
        [ResultEnteredById] uniqueidentifier NULL,
        [VerifiedAt] datetime2 NULL,
        [VerifiedById] uniqueidentifier NULL,
        [Notes] nvarchar(1000) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NULL,
        CONSTRAINT [PK_LabOrderItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_LabOrderItems_MedicalOrders_MedicalOrderId] FOREIGN KEY ([MedicalOrderId]) REFERENCES [MedicalOrders]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_LabOrderItems_Services_ServiceId] FOREIGN KEY ([ServiceId]) REFERENCES [Services]([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_LabOrderItems_MedicalOrderId] ON [LabOrderItems] ([MedicalOrderId]);
    CREATE INDEX [IX_LabOrderItems_SampleId] ON [LabOrderItems] ([SampleId]);
    CREATE INDEX [IX_LabOrderItems_Status] ON [LabOrderItems] ([Status]);
    PRINT 'Created LabOrderItems';
END
ELSE
    PRINT 'LabOrderItems already exists';

-- 2. LabTestParameters
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LabTestParameters')
BEGIN
    CREATE TABLE [LabTestParameters] (
        [Id] uniqueidentifier NOT NULL,
        [TenantId] uniqueidentifier NULL,
        [ServiceId] uniqueidentifier NOT NULL,
        [Name] nvarchar(200) NOT NULL,
        [Code] nvarchar(50) NULL,
        [DisplayOrder] int NOT NULL,
        [Unit] nvarchar(50) NULL,
        [DataType] int NOT NULL DEFAULT 1,
        [NormalRange] nvarchar(200) NULL,
        [MinValue] decimal(18,2) NULL,
        [MaxValue] decimal(18,2) NULL,
        [MaleRange] nvarchar(200) NULL,
        [FemaleRange] nvarchar(200) NULL,
        [ChildRange] nvarchar(200) NULL,
        [CriticalLow] decimal(18,2) NULL,
        [CriticalHigh] decimal(18,2) NULL,
        [Description] nvarchar(500) NULL,
        [Options] nvarchar(2000) NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NULL,
        CONSTRAINT [PK_LabTestParameters] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_LabTestParameters_Services_ServiceId] FOREIGN KEY ([ServiceId]) REFERENCES [Services]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_LabTestParameters_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants]([Id]) ON DELETE RESTRICT
    );
    CREATE INDEX [IX_LabTestParameters_ServiceId] ON [LabTestParameters] ([ServiceId]);
    CREATE INDEX [IX_LabTestParameters_TenantId_ServiceId_DisplayOrder] ON [LabTestParameters] ([TenantId], [ServiceId], [DisplayOrder]);
    CREATE INDEX [IX_LabTestParameters_TenantId_ServiceId_Name] ON [LabTestParameters] ([TenantId], [ServiceId], [Name]);
    PRINT 'Created LabTestParameters';
END
ELSE
    PRINT 'LabTestParameters already exists';

-- 3. LabResultParameters
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LabResultParameters')
BEGIN
    CREATE TABLE [LabResultParameters] (
        [Id] uniqueidentifier NOT NULL,
        [LabOrderItemId] uniqueidentifier NOT NULL,
        [ParameterId] uniqueidentifier NULL,
        [ParameterName] nvarchar(200) NOT NULL,
        [ParameterCode] nvarchar(50) NULL,
        [ResultValue] nvarchar(500) NULL,
        [Unit] nvarchar(50) NULL,
        [NormalRange] nvarchar(200) NULL,
        [Flag] int NOT NULL DEFAULT 0,
        [DataType] int NOT NULL DEFAULT 1,
        [IsAbnormal] bit NOT NULL DEFAULT 0,
        [DisplayOrder] int NOT NULL,
        [EnteredById] uniqueidentifier NULL,
        [EnteredAt] datetime2 NULL,
        [VerifiedById] uniqueidentifier NULL,
        [VerifiedAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NULL,
        CONSTRAINT [PK_LabResultParameters] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_LabResultParameters_LabOrderItems_LabOrderItemId] FOREIGN KEY ([LabOrderItemId]) REFERENCES [LabOrderItems]([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_LabResultParameters_LabOrderItemId] ON [LabResultParameters] ([LabOrderItemId]);
    PRINT 'Created LabResultParameters';
END
ELSE
    PRINT 'LabResultParameters already exists';

-- 4. RadiologyOrderItems
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RadiologyOrderItems')
BEGIN
    CREATE TABLE [RadiologyOrderItems] (
        [Id] uniqueidentifier NOT NULL,
        [MedicalOrderId] uniqueidentifier NOT NULL,
        [ServiceId] uniqueidentifier NOT NULL,
        [ServiceName] nvarchar(200) NOT NULL,
        [ServiceCode] nvarchar(50) NULL,
        [UnitPrice] decimal(18,2) NOT NULL,
        [Quantity] int NOT NULL DEFAULT 1,
        [Discount] decimal(18,2) NOT NULL,
        [NetAmount] decimal(18,2) NOT NULL,
        [Modality] nvarchar(100) NULL,
        [BodyPart] nvarchar(200) NULL,
        [Status] int NOT NULL DEFAULT 1,
        [ScheduledAt] datetime2 NULL,
        [PatientArrivedAt] datetime2 NULL,
        [ProcedureStartedAt] datetime2 NULL,
        [ProcedureEndedAt] datetime2 NULL,
        [PerformedById] uniqueidentifier NULL,
        [Technique] nvarchar(2000) NULL,
        [Findings] nvarchar(4000) NULL,
        [Impression] nvarchar(4000) NULL,
        [Recommendations] nvarchar(2000) NULL,
        [IsAbnormal] bit NOT NULL DEFAULT 0,
        [ReportedAt] datetime2 NULL,
        [ReportedById] uniqueidentifier NULL,
        [VerifiedAt] datetime2 NULL,
        [VerifiedById] uniqueidentifier NULL,
        [Notes] nvarchar(1000) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NULL,
        CONSTRAINT [PK_RadiologyOrderItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_RadiologyOrderItems_MedicalOrders_MedicalOrderId] FOREIGN KEY ([MedicalOrderId]) REFERENCES [MedicalOrders]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_RadiologyOrderItems_Services_ServiceId] FOREIGN KEY ([ServiceId]) REFERENCES [Services]([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_RadiologyOrderItems_MedicalOrderId] ON [RadiologyOrderItems] ([MedicalOrderId]);
    CREATE INDEX [IX_RadiologyOrderItems_ScheduledAt] ON [RadiologyOrderItems] ([ScheduledAt]);
    CREATE INDEX [IX_RadiologyOrderItems_Status] ON [RadiologyOrderItems] ([Status]);
    PRINT 'Created RadiologyOrderItems';
END
ELSE
    PRINT 'RadiologyOrderItems already exists';

PRINT 'All Lab/Radiology tables created successfully!';
GO
