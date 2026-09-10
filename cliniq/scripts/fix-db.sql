-- Create DoctorSchedules table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DoctorSchedules')
BEGIN
    CREATE TABLE [DoctorSchedules] (
        [Id] uniqueidentifier NOT NULL,
        [DoctorId] uniqueidentifier NOT NULL,
        [DayOfWeek] int NOT NULL,
        [StartTime] time NOT NULL,
        [EndTime] time NOT NULL,
        [SlotDuration] int NOT NULL,
        [ConsultationFee] decimal(18,2) NULL,
        [TenantId] uniqueidentifier NULL,
        [BranchId] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NULL,
        CONSTRAINT [PK_DoctorSchedules] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_DoctorSchedules_Users_DoctorId] FOREIGN KEY ([DoctorId]) REFERENCES [Users] ([Id])
    );
    CREATE INDEX [IX_DoctorSchedules_DoctorId] ON [DoctorSchedules] ([DoctorId]);
    PRINT 'DoctorSchedules table created.';
END
ELSE
BEGIN
    PRINT 'DoctorSchedules table already exists.';
END
GO

-- Add DepartmentId column to Users if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'DepartmentId')
BEGIN
    ALTER TABLE [Users] ADD [DepartmentId] uniqueidentifier NULL;
    PRINT 'DepartmentId column added to Users.';
END
ELSE
BEGIN
    PRINT 'DepartmentId column already exists in Users.';
END
GO
