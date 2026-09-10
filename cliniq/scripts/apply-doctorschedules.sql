IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [AuditLogs] (
        [Id] uniqueidentifier NOT NULL,
        [TenantId] uniqueidentifier NULL,
        [BranchId] uniqueidentifier NULL,
        [UserId] uniqueidentifier NULL,
        [UserEmail] nvarchar(max) NULL,
        [UserName] nvarchar(max) NULL,
        [Action] nvarchar(max) NOT NULL,
        [EntityType] nvarchar(max) NOT NULL,
        [EntityId] nvarchar(max) NULL,
        [EntityName] nvarchar(max) NULL,
        [OldValues] nvarchar(max) NULL,
        [NewValues] nvarchar(max) NULL,
        [AffectedColumns] nvarchar(max) NULL,
        [IpAddress] nvarchar(max) NULL,
        [UserAgent] nvarchar(max) NULL,
        [RequestPath] nvarchar(max) NULL,
        [RequestMethod] nvarchar(max) NULL,
        [CorrelationId] nvarchar(max) NULL,
        [Timestamp] datetime2 NOT NULL,
        [Notes] nvarchar(max) NULL,
        [AdditionalData] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Buildings] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [Address] nvarchar(max) NULL,
        [NumberOfFloors] int NULL,
        [IsActive] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Buildings] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [CorporateClients] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [Industry] nvarchar(max) NULL,
        [LogoUrl] nvarchar(max) NULL,
        [Email] nvarchar(max) NULL,
        [Phone] nvarchar(max) NULL,
        [Website] nvarchar(max) NULL,
        [Address] nvarchar(max) NULL,
        [City] nvarchar(max) NULL,
        [State] nvarchar(max) NULL,
        [Country] nvarchar(max) NULL,
        [PostalCode] nvarchar(max) NULL,
        [TaxNumber] nvarchar(max) NULL,
        [ContactPersonName] nvarchar(max) NULL,
        [ContactPersonPhone] nvarchar(max) NULL,
        [ContactPersonEmail] nvarchar(max) NULL,
        [ContactPersonDesignation] nvarchar(max) NULL,
        [ContractStartDate] datetime2 NULL,
        [ContractEndDate] datetime2 NULL,
        [CreditLimit] decimal(18,2) NULL,
        [PaymentTermsDays] int NULL,
        [DiscountPercent] decimal(18,2) NULL,
        [BillingCycle] nvarchar(max) NULL,
        [BillingEmail] nvarchar(max) NULL,
        [BillingAddress] nvarchar(max) NULL,
        [OutstandingAmount] decimal(18,2) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_CorporateClients] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [InsuranceClaims] (
        [Id] uniqueidentifier NOT NULL,
        [ClaimNumber] nvarchar(max) NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [PatientInsuranceId] uniqueidentifier NOT NULL,
        [InsuranceCompanyId] uniqueidentifier NOT NULL,
        [InvoiceId] uniqueidentifier NOT NULL,
        [AdmissionId] uniqueidentifier NULL,
        [VisitId] uniqueidentifier NULL,
        [ClaimDate] datetime2 NOT NULL,
        [Status] int NOT NULL,
        [BilledAmount] decimal(18,2) NOT NULL,
        [ClaimedAmount] decimal(18,2) NOT NULL,
        [ApprovedAmount] decimal(18,2) NOT NULL,
        [RejectedAmount] decimal(18,2) NOT NULL,
        [PatientResponsibility] decimal(18,2) NOT NULL,
        [SettledAmount] decimal(18,2) NOT NULL,
        [SubmittedAt] datetime2 NULL,
        [SubmittedById] uniqueidentifier NULL,
        [SubmissionReference] nvarchar(max) NULL,
        [ProcessedAt] datetime2 NULL,
        [ProcessingNotes] nvarchar(max) NULL,
        [RejectionReason] nvarchar(max) NULL,
        [SettledAt] datetime2 NULL,
        [SettlementReference] nvarchar(max) NULL,
        [Documents] nvarchar(max) NULL,
        [Notes] nvarchar(max) NULL,
        [InternalNotes] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_InsuranceClaims] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [InsuranceCompanies] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [LogoUrl] nvarchar(max) NULL,
        [Email] nvarchar(max) NULL,
        [Phone] nvarchar(max) NULL,
        [Fax] nvarchar(max) NULL,
        [Website] nvarchar(max) NULL,
        [Address] nvarchar(max) NULL,
        [City] nvarchar(max) NULL,
        [State] nvarchar(max) NULL,
        [Country] nvarchar(max) NULL,
        [PostalCode] nvarchar(max) NULL,
        [ContactPersonName] nvarchar(max) NULL,
        [ContactPersonPhone] nvarchar(max) NULL,
        [ContactPersonEmail] nvarchar(max) NULL,
        [ClaimsEmail] nvarchar(max) NULL,
        [ClaimsPhone] nvarchar(max) NULL,
        [ClaimsPortalUrl] nvarchar(max) NULL,
        [ContractStartDate] datetime2 NULL,
        [ContractEndDate] datetime2 NULL,
        [DiscountPercent] decimal(18,2) NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_InsuranceCompanies] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Invoices] (
        [Id] uniqueidentifier NOT NULL,
        [InvoiceNumber] nvarchar(50) NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [VisitId] uniqueidentifier NULL,
        [AdmissionId] uniqueidentifier NULL,
        [AppointmentId] uniqueidentifier NULL,
        [InvoiceDate] datetime2 NOT NULL,
        [DueDate] datetime2 NULL,
        [Status] int NOT NULL,
        [SubTotal] decimal(18,2) NOT NULL,
        [DiscountAmount] decimal(18,2) NOT NULL,
        [DiscountPercent] decimal(5,2) NOT NULL,
        [TaxAmount] decimal(18,2) NOT NULL,
        [TaxPercent] decimal(5,2) NOT NULL,
        [TotalAmount] decimal(18,2) NOT NULL,
        [PaidAmount] decimal(18,2) NOT NULL,
        [OutstandingAmount] decimal(18,2) NOT NULL,
        [RefundedAmount] decimal(18,2) NOT NULL,
        [InsuranceId] uniqueidentifier NULL,
        [InsuranceAmount] decimal(18,2) NOT NULL,
        [PatientResponsibility] decimal(18,2) NOT NULL,
        [CorporateClientId] uniqueidentifier NULL,
        [CorporateAmount] decimal(18,2) NOT NULL,
        [PackageId] uniqueidentifier NULL,
        [DiscountReason] nvarchar(500) NULL,
        [DiscountApprovedById] uniqueidentifier NULL,
        [Notes] nvarchar(1000) NULL,
        [InternalNotes] nvarchar(max) NULL,
        [FinalizedAt] datetime2 NULL,
        [FinalizedById] uniqueidentifier NULL,
        [CancelledAt] datetime2 NULL,
        [CancelledById] uniqueidentifier NULL,
        [CancellationReason] nvarchar(500) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Invoices] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [ItemCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [ParentCategoryId] uniqueidentifier NULL,
        [IsMedicineCategory] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ItemCategories] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ItemCategories_ItemCategories_ParentCategoryId] FOREIGN KEY ([ParentCategoryId]) REFERENCES [ItemCategories] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Manufacturers] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [Email] nvarchar(max) NULL,
        [Phone] nvarchar(max) NULL,
        [Website] nvarchar(max) NULL,
        [Address] nvarchar(max) NULL,
        [Country] nvarchar(max) NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Manufacturers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Notifications] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Type] int NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Message] nvarchar(max) NULL,
        [Data] nvarchar(max) NULL,
        [EntityType] nvarchar(max) NULL,
        [EntityId] uniqueidentifier NULL,
        [IsRead] bit NOT NULL,
        [ReadAt] datetime2 NULL,
        [SentByEmail] bit NOT NULL,
        [SentBySms] bit NOT NULL,
        [SentByWhatsApp] bit NOT NULL,
        [SentInApp] bit NOT NULL,
        [ScheduledFor] datetime2 NULL,
        [SentAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Notifications] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [PatientCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [Color] nvarchar(max) NULL,
        [DefaultDiscountPercent] decimal(18,2) NULL,
        [IsActive] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PatientCategories] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Patients] (
        [Id] uniqueidentifier NOT NULL,
        [PatientNumber] nvarchar(50) NOT NULL,
        [MRN] nvarchar(50) NULL,
        [ExternalId] nvarchar(max) NULL,
        [FirstName] nvarchar(100) NOT NULL,
        [LastName] nvarchar(100) NOT NULL,
        [MiddleName] nvarchar(100) NULL,
        [Title] nvarchar(20) NULL,
        [DateOfBirth] datetime2 NULL,
        [Gender] int NULL,
        [BloodGroup] int NULL,
        [MaritalStatus] int NULL,
        [Nationality] nvarchar(100) NULL,
        [Religion] nvarchar(50) NULL,
        [Occupation] nvarchar(100) NULL,
        [PhotoUrl] nvarchar(max) NULL,
        [Email] nvarchar(256) NULL,
        [Phone] nvarchar(50) NULL,
        [AlternatePhone] nvarchar(50) NULL,
        [Address] nvarchar(500) NULL,
        [City] nvarchar(100) NULL,
        [State] nvarchar(100) NULL,
        [Country] nvarchar(100) NULL,
        [PostalCode] nvarchar(20) NULL,
        [IdentificationDocuments] nvarchar(max) NULL,
        [EmergencyContactName] nvarchar(200) NULL,
        [EmergencyContactRelation] nvarchar(50) NULL,
        [EmergencyContactPhone] nvarchar(50) NULL,
        [Allergies] nvarchar(max) NULL,
        [ChronicConditions] nvarchar(max) NULL,
        [CurrentMedications] nvarchar(max) NULL,
        [FamilyHistory] nvarchar(max) NULL,
        [SurgicalHistory] nvarchar(max) NULL,
        [SocialHistory] nvarchar(max) NULL,
        [Notes] nvarchar(max) NULL,
        [PrimaryInsuranceId] uniqueidentifier NULL,
        [InsuranceMemberNumber] nvarchar(max) NULL,
        [InsurancePolicyNumber] nvarchar(max) NULL,
        [CorporateClientId] uniqueidentifier NULL,
        [CorporateEmployeeId] nvarchar(max) NULL,
        [PatientCategoryId] uniqueidentifier NULL,
        [Tags] nvarchar(max) NULL,
        [IsActive] bit NOT NULL,
        [IsVerified] bit NOT NULL,
        [LastVisitDate] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Patients] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Permissions] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [DisplayName] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [Module] nvarchar(max) NULL,
        [Category] nvarchar(max) NULL,
        [DisplayOrder] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_Permissions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Roles] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [NormalizedName] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [TenantId] uniqueidentifier NULL,
        [IsSystemRole] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        CONSTRAINT [PK_Roles] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [ServiceCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [ParentCategoryId] uniqueidentifier NULL,
        [IsActive] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ServiceCategories] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ServiceCategories_ServiceCategories_ParentCategoryId] FOREIGN KEY ([ParentCategoryId]) REFERENCES [ServiceCategories] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Suppliers] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [Email] nvarchar(max) NULL,
        [Phone] nvarchar(max) NULL,
        [Fax] nvarchar(max) NULL,
        [Website] nvarchar(max) NULL,
        [Address] nvarchar(max) NULL,
        [City] nvarchar(max) NULL,
        [State] nvarchar(max) NULL,
        [Country] nvarchar(max) NULL,
        [PostalCode] nvarchar(max) NULL,
        [TaxNumber] nvarchar(max) NULL,
        [PanNumber] nvarchar(max) NULL,
        [ContactPersonName] nvarchar(max) NULL,
        [ContactPersonPhone] nvarchar(max) NULL,
        [ContactPersonEmail] nvarchar(max) NULL,
        [PaymentTermsDays] int NULL,
        [CreditLimit] decimal(18,2) NULL,
        [PaymentMethod] nvarchar(max) NULL,
        [BankName] nvarchar(max) NULL,
        [BankAccountNumber] nvarchar(max) NULL,
        [BankBranch] nvarchar(max) NULL,
        [IFSC] nvarchar(max) NULL,
        [OutstandingPayable] decimal(18,2) NOT NULL,
        [Rating] decimal(18,2) NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Suppliers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [SystemSettings] (
        [Id] uniqueidentifier NOT NULL,
        [TenantId] uniqueidentifier NULL,
        [BranchId] uniqueidentifier NULL,
        [Key] nvarchar(max) NOT NULL,
        [Value] nvarchar(max) NULL,
        [DataType] nvarchar(max) NULL,
        [Category] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [IsEncrypted] bit NOT NULL,
        [IsReadOnly] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_SystemSettings] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [TaxConfigurations] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [Percentage] decimal(18,2) NOT NULL,
        [FixedAmount] decimal(18,2) NULL,
        [IsInclusive] bit NOT NULL,
        [IsDefault] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [ApplicableCategories] nvarchar(max) NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_TaxConfigurations] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Tenants] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(200) NOT NULL,
        [Slug] nvarchar(100) NULL,
        [Description] nvarchar(max) NULL,
        [LogoUrl] nvarchar(max) NULL,
        [Website] nvarchar(256) NULL,
        [Email] nvarchar(256) NULL,
        [Phone] nvarchar(50) NULL,
        [Address] nvarchar(500) NULL,
        [City] nvarchar(100) NULL,
        [State] nvarchar(100) NULL,
        [Country] nvarchar(100) NULL,
        [PostalCode] nvarchar(20) NULL,
        [TaxNumber] nvarchar(50) NULL,
        [RegistrationNumber] nvarchar(100) NULL,
        [Currency] nvarchar(10) NULL DEFAULT N'USD',
        [Timezone] nvarchar(100) NULL DEFAULT N'UTC',
        [Locale] nvarchar(20) NULL DEFAULT N'en-US',
        [IsActive] bit NOT NULL,
        [Package] int NOT NULL,
        [SubscriptionStatus] int NOT NULL,
        [TrialEndsAt] datetime2 NULL,
        [SubscriptionStartDate] datetime2 NULL,
        [SubscriptionEndDate] datetime2 NULL,
        [Settings] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        CONSTRAINT [PK_Tenants] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Users] (
        [Id] uniqueidentifier NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [NormalizedEmail] nvarchar(max) NULL,
        [EmailConfirmed] bit NOT NULL,
        [PasswordHash] nvarchar(max) NOT NULL,
        [SecurityStamp] nvarchar(max) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [PhoneNumber] nvarchar(max) NULL,
        [PhoneNumberConfirmed] bit NOT NULL,
        [TwoFactorEnabled] bit NOT NULL,
        [LockoutEnd] datetimeoffset NULL,
        [LockoutEnabled] bit NOT NULL,
        [AccessFailedCount] int NOT NULL,
        [FirstName] nvarchar(max) NOT NULL,
        [LastName] nvarchar(max) NOT NULL,
        [MiddleName] nvarchar(max) NULL,
        [Title] nvarchar(max) NULL,
        [ProfilePictureUrl] nvarchar(max) NULL,
        [Gender] int NULL,
        [DateOfBirth] datetime2 NULL,
        [Address] nvarchar(max) NULL,
        [City] nvarchar(max) NULL,
        [State] nvarchar(max) NULL,
        [Country] nvarchar(max) NULL,
        [PostalCode] nvarchar(max) NULL,
        [Timezone] nvarchar(max) NULL,
        [Locale] nvarchar(max) NULL,
        [EmployeeId] nvarchar(max) NULL,
        [LicenseNumber] nvarchar(max) NULL,
        [Specialization] nvarchar(max) NULL,
        [Qualification] nvarchar(max) NULL,
        [Signature] nvarchar(max) NULL,
        [Bio] nvarchar(max) NULL,
        [IsActive] bit NOT NULL,
        [IsSuperAdmin] bit NOT NULL,
        [LastLoginAt] datetime2 NULL,
        [LastLoginIp] nvarchar(max) NULL,
        [Settings] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Warehouses] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [Address] nvarchar(max) NULL,
        [WarehouseType] nvarchar(max) NULL,
        [ManagerId] uniqueidentifier NULL,
        [IsDefault] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Warehouses] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Floors] (
        [Id] uniqueidentifier NOT NULL,
        [BuildingId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NULL,
        [FloorNumber] int NOT NULL,
        [Description] nvarchar(max) NULL,
        [IsActive] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Floors] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Floors_Buildings_BuildingId] FOREIGN KEY ([BuildingId]) REFERENCES [Buildings] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [InsurancePlans] (
        [Id] uniqueidentifier NOT NULL,
        [InsuranceCompanyId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [PlanType] nvarchar(max) NULL,
        [CoverageLimit] decimal(18,2) NULL,
        [DeductibleAmount] decimal(18,2) NULL,
        [CoPayPercent] decimal(18,2) NULL,
        [CoPayAmount] decimal(18,2) NULL,
        [CoveredServices] nvarchar(max) NULL,
        [Exclusions] nvarchar(max) NULL,
        [RequiresPreAuthorization] bit NOT NULL,
        [PreAuthorizationServices] nvarchar(max) NULL,
        [ReimbursementPercent] decimal(18,2) NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_InsurancePlans] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_InsurancePlans_InsuranceCompanies_InsuranceCompanyId] FOREIGN KEY ([InsuranceCompanyId]) REFERENCES [InsuranceCompanies] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [InvoiceItems] (
        [Id] uniqueidentifier NOT NULL,
        [InvoiceId] uniqueidentifier NOT NULL,
        [ServiceId] uniqueidentifier NULL,
        [MedicineId] uniqueidentifier NULL,
        [ProcedureId] uniqueidentifier NULL,
        [ItemType] nvarchar(max) NOT NULL,
        [ItemName] nvarchar(max) NOT NULL,
        [ItemCode] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [Quantity] decimal(18,2) NOT NULL,
        [Unit] nvarchar(max) NULL,
        [UnitPrice] decimal(18,2) NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [DiscountPercent] decimal(18,2) NOT NULL,
        [DiscountAmount] decimal(18,2) NOT NULL,
        [TaxPercent] decimal(18,2) NOT NULL,
        [TaxAmount] decimal(18,2) NOT NULL,
        [TotalAmount] decimal(18,2) NOT NULL,
        [IsCoveredByInsurance] bit NOT NULL,
        [InsuranceCoveragePercent] decimal(18,2) NOT NULL,
        [InsuranceAmount] decimal(18,2) NOT NULL,
        [PatientAmount] decimal(18,2) NOT NULL,
        [ReferenceId] uniqueidentifier NULL,
        [ReferenceType] nvarchar(max) NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_InvoiceItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_InvoiceItems_Invoices_InvoiceId] FOREIGN KEY ([InvoiceId]) REFERENCES [Invoices] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Payments] (
        [Id] uniqueidentifier NOT NULL,
        [PaymentNumber] nvarchar(50) NOT NULL,
        [InvoiceId] uniqueidentifier NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [PaymentDate] datetime2 NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [PaymentMethod] int NOT NULL,
        [Status] int NOT NULL,
        [ReferenceNumber] nvarchar(100) NULL,
        [CardLastFour] nvarchar(4) NULL,
        [CardType] nvarchar(20) NULL,
        [BankName] nvarchar(100) NULL,
        [BankAccountNumber] nvarchar(50) NULL,
        [IsAdvancePayment] bit NOT NULL,
        [AdmissionId] uniqueidentifier NULL,
        [IsRefund] bit NOT NULL,
        [OriginalPaymentId] uniqueidentifier NULL,
        [RefundReason] nvarchar(500) NULL,
        [Notes] nvarchar(500) NULL,
        [ReceivedById] uniqueidentifier NOT NULL,
        [IsReversed] bit NOT NULL,
        [ReversedAt] datetime2 NULL,
        [ReversedById] uniqueidentifier NULL,
        [ReversalReason] nvarchar(500) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Payments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Payments_Invoices_InvoiceId] FOREIGN KEY ([InvoiceId]) REFERENCES [Invoices] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Items] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NOT NULL,
        [Barcode] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [CategoryId] uniqueidentifier NULL,
        [SubCategoryId] uniqueidentifier NULL,
        [IsMedicine] bit NOT NULL,
        [GenericName] nvarchar(max) NULL,
        [BrandName] nvarchar(max) NULL,
        [ManufacturerId] uniqueidentifier NULL,
        [Strength] nvarchar(max) NULL,
        [Form] nvarchar(max) NULL,
        [PackSize] nvarchar(max) NULL,
        [RequiresPrescription] bit NOT NULL,
        [IsControlledSubstance] bit NOT NULL,
        [StorageInstructions] nvarchar(max) NULL,
        [PurchaseUnit] nvarchar(max) NULL,
        [SaleUnit] nvarchar(max) NULL,
        [ConversionFactor] decimal(18,2) NOT NULL,
        [PurchasePrice] decimal(18,2) NOT NULL,
        [SellingPrice] decimal(18,2) NOT NULL,
        [MRP] decimal(18,2) NULL,
        [CostPrice] decimal(18,2) NULL,
        [TaxPercent] decimal(18,2) NOT NULL,
        [IsTaxInclusive] bit NOT NULL,
        [CurrentStock] decimal(18,2) NOT NULL,
        [MinimumStock] decimal(18,2) NOT NULL,
        [MaximumStock] decimal(18,2) NOT NULL,
        [ReorderLevel] decimal(18,2) NOT NULL,
        [ReorderQuantity] decimal(18,2) NOT NULL,
        [TracksExpiry] bit NOT NULL,
        [TracksBatches] bit NOT NULL,
        [ExpiryWarningDays] int NULL,
        [DefaultLocation] nvarchar(max) NULL,
        [DefaultWarehouseId] uniqueidentifier NULL,
        [IsActive] bit NOT NULL,
        [IsDiscontinued] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Items] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Items_ItemCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [ItemCategories] ([Id]),
        CONSTRAINT [FK_Items_Manufacturers_ManufacturerId] FOREIGN KEY ([ManufacturerId]) REFERENCES [Manufacturers] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Admissions] (
        [Id] uniqueidentifier NOT NULL,
        [AdmissionNumber] nvarchar(max) NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [AttendingDoctorId] uniqueidentifier NOT NULL,
        [ReferringDoctorId] uniqueidentifier NULL,
        [DepartmentId] uniqueidentifier NULL,
        [AdmissionType] int NOT NULL,
        [Status] int NOT NULL,
        [AdmissionDate] datetime2 NOT NULL,
        [ExpectedDischargeDate] datetime2 NULL,
        [AdmissionSource] nvarchar(max) NULL,
        [AdmissionReason] nvarchar(max) NULL,
        [ProvisionalDiagnosis] nvarchar(max) NULL,
        [Diagnoses] nvarchar(max) NULL,
        [CurrentBedId] uniqueidentifier NULL,
        [CurrentRoomId] uniqueidentifier NULL,
        [CurrentWardId] uniqueidentifier NULL,
        [InsuranceId] uniqueidentifier NULL,
        [InsuranceAuthorizationNumber] nvarchar(max) NULL,
        [CorporateClientId] uniqueidentifier NULL,
        [DepositAmount] decimal(18,2) NULL,
        [EstimatedCost] decimal(18,2) NULL,
        [DischargeDate] datetime2 NULL,
        [DischargeType] int NULL,
        [DischargedById] uniqueidentifier NULL,
        [DischargeSummary] nvarchar(max) NULL,
        [FinalDiagnosis] nvarchar(max) NULL,
        [DischargeInstructions] nvarchar(max) NULL,
        [DischargeCondition] nvarchar(max) NULL,
        [FollowUpDate] datetime2 NULL,
        [FollowUpInstructions] nvarchar(max) NULL,
        [Notes] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Admissions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Admissions_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Appointments] (
        [Id] uniqueidentifier NOT NULL,
        [AppointmentNumber] nvarchar(max) NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [DoctorId] uniqueidentifier NOT NULL,
        [DepartmentId] uniqueidentifier NULL,
        [RoomId] uniqueidentifier NULL,
        [AppointmentDate] datetime2 NOT NULL,
        [StartTime] time NOT NULL,
        [EndTime] time NULL,
        [DurationMinutes] int NOT NULL,
        [Type] int NOT NULL,
        [Status] int NOT NULL,
        [Priority] int NULL,
        [ChiefComplaint] nvarchar(max) NULL,
        [Notes] nvarchar(max) NULL,
        [CancellationReason] nvarchar(max) NULL,
        [CheckedInAt] datetime2 NULL,
        [CheckedOutAt] datetime2 NULL,
        [CheckedInBy] uniqueidentifier NULL,
        [TokenNumber] int NULL,
        [QueueId] uniqueidentifier NULL,
        [ConsultationFee] decimal(18,2) NULL,
        [IsBilled] bit NOT NULL,
        [InvoiceId] uniqueidentifier NULL,
        [FollowUpFromId] uniqueidentifier NULL,
        [FollowUpDate] datetime2 NULL,
        [RescheduledFromId] uniqueidentifier NULL,
        [RescheduledAt] datetime2 NULL,
        [ReschedulingReason] nvarchar(max) NULL,
        [IsTelemedicine] bit NOT NULL,
        [TelemedicineLink] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Appointments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Appointments_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [PatientDocuments] (
        [Id] uniqueidentifier NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [FileName] nvarchar(max) NOT NULL,
        [OriginalFileName] nvarchar(max) NOT NULL,
        [FileExtension] nvarchar(max) NULL,
        [MimeType] nvarchar(max) NULL,
        [FileSizeBytes] bigint NOT NULL,
        [StoragePath] nvarchar(max) NOT NULL,
        [DocumentType] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [IsConfidential] bit NOT NULL,
        [DocumentDate] datetime2 NULL,
        [VisitId] uniqueidentifier NULL,
        [AdmissionId] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PatientDocuments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PatientDocuments_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [PatientInsurances] (
        [Id] uniqueidentifier NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [InsuranceCompanyId] uniqueidentifier NOT NULL,
        [InsurancePlanId] uniqueidentifier NULL,
        [PolicyNumber] nvarchar(max) NOT NULL,
        [MemberNumber] nvarchar(max) NULL,
        [GroupNumber] nvarchar(max) NULL,
        [EffectiveDate] datetime2 NULL,
        [ExpiryDate] datetime2 NULL,
        [CoverageLimit] decimal(18,2) NULL,
        [UsedAmount] decimal(18,2) NULL,
        [RemainingAmount] decimal(18,2) NULL,
        [DeductibleAmount] decimal(18,2) NULL,
        [CoPayPercent] decimal(18,2) NULL,
        [CoPayAmount] decimal(18,2) NULL,
        [SubscriberName] nvarchar(max) NULL,
        [SubscriberRelation] nvarchar(max) NULL,
        [SubscriberDOB] nvarchar(max) NULL,
        [IsVerified] bit NOT NULL,
        [VerifiedAt] datetime2 NULL,
        [VerifiedById] uniqueidentifier NULL,
        [VerificationNotes] nvarchar(max) NULL,
        [IsPrimary] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [CardFrontUrl] nvarchar(max) NULL,
        [CardBackUrl] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PatientInsurances] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PatientInsurances_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [RolePermissions] (
        [Id] uniqueidentifier NOT NULL,
        [RoleId] uniqueidentifier NOT NULL,
        [PermissionId] uniqueidentifier NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_RolePermissions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_RolePermissions_Permissions_PermissionId] FOREIGN KEY ([PermissionId]) REFERENCES [Permissions] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_RolePermissions_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [Roles] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Services] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [CategoryId] uniqueidentifier NULL,
        [DepartmentId] uniqueidentifier NULL,
        [Price] decimal(18,2) NOT NULL,
        [Cost] decimal(18,2) NULL,
        [MinPrice] decimal(18,2) NULL,
        [MaxPrice] decimal(18,2) NULL,
        [IsTaxable] bit NOT NULL,
        [TaxPercent] decimal(18,2) NOT NULL,
        [IsCoveredByInsurance] bit NOT NULL,
        [InsuranceCode] nvarchar(max) NULL,
        [DurationMinutes] int NULL,
        [IsActive] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Services] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Services_ServiceCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [ServiceCategories] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Branches] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [Address] nvarchar(max) NULL,
        [City] nvarchar(max) NULL,
        [State] nvarchar(max) NULL,
        [Country] nvarchar(max) NULL,
        [PostalCode] nvarchar(max) NULL,
        [Phone] nvarchar(max) NULL,
        [Email] nvarchar(max) NULL,
        [Timezone] nvarchar(max) NULL,
        [IsMainBranch] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [OperatingHours] nvarchar(max) NULL,
        [Settings] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Branches] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Branches_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [TenantUsers] (
        [Id] uniqueidentifier NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [IsOwner] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [JoinedAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_TenantUsers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_TenantUsers_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [RefreshTokens] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Token] nvarchar(max) NOT NULL,
        [ExpiresAt] datetime2 NOT NULL,
        [RevokedAt] datetime2 NULL,
        [ReplacedByToken] nvarchar(max) NULL,
        [ReasonRevoked] nvarchar(max) NULL,
        [CreatedByIp] nvarchar(max) NULL,
        [RevokedByIp] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_RefreshTokens] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_RefreshTokens_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [UserRoles] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [RoleId] uniqueidentifier NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_UserRoles] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_UserRoles_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [Roles] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_UserRoles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [PurchaseOrders] (
        [Id] uniqueidentifier NOT NULL,
        [PONumber] nvarchar(max) NOT NULL,
        [SupplierId] uniqueidentifier NOT NULL,
        [WarehouseId] uniqueidentifier NOT NULL,
        [OrderDate] datetime2 NOT NULL,
        [ExpectedDeliveryDate] datetime2 NULL,
        [ReceivedDate] datetime2 NULL,
        [Status] int NOT NULL,
        [SubTotal] decimal(18,2) NOT NULL,
        [DiscountAmount] decimal(18,2) NOT NULL,
        [DiscountPercent] decimal(18,2) NOT NULL,
        [TaxAmount] decimal(18,2) NOT NULL,
        [TotalAmount] decimal(18,2) NOT NULL,
        [ShippingCost] decimal(18,2) NOT NULL,
        [ShippingMethod] nvarchar(max) NULL,
        [TrackingNumber] nvarchar(max) NULL,
        [PaymentTerms] nvarchar(max) NULL,
        [IsPaid] bit NOT NULL,
        [PaidAmount] decimal(18,2) NOT NULL,
        [Notes] nvarchar(max) NULL,
        [InternalNotes] nvarchar(max) NULL,
        [ApprovedById] uniqueidentifier NULL,
        [ApprovedAt] datetime2 NULL,
        [ApprovalNotes] nvarchar(max) NULL,
        [RejectionReason] nvarchar(max) NULL,
        [CancelledAt] datetime2 NULL,
        [CancelledById] uniqueidentifier NULL,
        [CancellationReason] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PurchaseOrders] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PurchaseOrders_Suppliers_SupplierId] FOREIGN KEY ([SupplierId]) REFERENCES [Suppliers] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_PurchaseOrders_Warehouses_WarehouseId] FOREIGN KEY ([WarehouseId]) REFERENCES [Warehouses] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [StockTransfers] (
        [Id] uniqueidentifier NOT NULL,
        [TransferNumber] nvarchar(max) NOT NULL,
        [FromWarehouseId] uniqueidentifier NOT NULL,
        [ToWarehouseId] uniqueidentifier NOT NULL,
        [TransferDate] datetime2 NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [RequestedById] uniqueidentifier NOT NULL,
        [RequestedAt] datetime2 NULL,
        [RequestNotes] nvarchar(max) NULL,
        [ApprovedById] uniqueidentifier NULL,
        [ApprovedAt] datetime2 NULL,
        [DispatchedById] uniqueidentifier NULL,
        [DispatchedAt] datetime2 NULL,
        [ReceivedById] uniqueidentifier NULL,
        [ReceivedAt] datetime2 NULL,
        [ReceiptNotes] nvarchar(max) NULL,
        [Notes] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StockTransfers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_StockTransfers_Warehouses_FromWarehouseId] FOREIGN KEY ([FromWarehouseId]) REFERENCES [Warehouses] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_StockTransfers_Warehouses_ToWarehouseId] FOREIGN KEY ([ToWarehouseId]) REFERENCES [Warehouses] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Wards] (
        [Id] uniqueidentifier NOT NULL,
        [FloorId] uniqueidentifier NULL,
        [DepartmentId] uniqueidentifier NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [WardType] int NOT NULL,
        [TotalBeds] int NOT NULL,
        [GenderRestriction] int NULL,
        [NurseInChargeId] uniqueidentifier NULL,
        [DailyRate] decimal(18,2) NULL,
        [IsActive] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Wards] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Wards_Floors_FloorId] FOREIGN KEY ([FloorId]) REFERENCES [Floors] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [StockBatches] (
        [Id] uniqueidentifier NOT NULL,
        [ItemId] uniqueidentifier NOT NULL,
        [WarehouseId] uniqueidentifier NOT NULL,
        [BatchNumber] nvarchar(max) NULL,
        [ManufactureDate] datetime2 NULL,
        [ExpiryDate] datetime2 NULL,
        [ReceivedQuantity] decimal(18,2) NOT NULL,
        [AvailableQuantity] decimal(18,2) NOT NULL,
        [SoldQuantity] decimal(18,2) NOT NULL,
        [AdjustedQuantity] decimal(18,2) NOT NULL,
        [DamagedQuantity] decimal(18,2) NOT NULL,
        [ExpiredQuantity] decimal(18,2) NOT NULL,
        [PurchasePrice] decimal(18,2) NOT NULL,
        [SellingPrice] decimal(18,2) NOT NULL,
        [MRP] decimal(18,2) NULL,
        [PurchaseOrderId] uniqueidentifier NULL,
        [GoodsReceiptId] uniqueidentifier NULL,
        [IsExpired] bit NOT NULL,
        [IsQuarantined] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [RackNumber] nvarchar(max) NULL,
        [ShelfNumber] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StockBatches] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_StockBatches_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_StockBatches_Warehouses_WarehouseId] FOREIGN KEY ([WarehouseId]) REFERENCES [Warehouses] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [EmergencyVisits] (
        [Id] uniqueidentifier NOT NULL,
        [EmergencyNumber] nvarchar(max) NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [DoctorId] uniqueidentifier NULL,
        [ArrivalTime] datetime2 NOT NULL,
        [ArrivalMode] nvarchar(max) NULL,
        [ChiefComplaint] nvarchar(max) NULL,
        [TriageLevel] int NULL,
        [TriageTime] datetime2 NULL,
        [TriagedById] uniqueidentifier NULL,
        [TriageNotes] nvarchar(max) NULL,
        [PresentingSymptoms] nvarchar(max) NULL,
        [InitialAssessment] nvarchar(max) NULL,
        [TreatmentNotes] nvarchar(max) NULL,
        [Procedures] nvarchar(max) NULL,
        [Disposition] nvarchar(max) NULL,
        [DispositionTime] datetime2 NULL,
        [AdmissionId] uniqueidentifier NULL,
        [IsActive] bit NOT NULL,
        [DischargeTime] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_EmergencyVisits] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_EmergencyVisits_Admissions_AdmissionId] FOREIGN KEY ([AdmissionId]) REFERENCES [Admissions] ([Id]),
        CONSTRAINT [FK_EmergencyVisits_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [NursingNotes] (
        [Id] uniqueidentifier NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [AdmissionId] uniqueidentifier NOT NULL,
        [NurseId] uniqueidentifier NOT NULL,
        [NoteDate] datetime2 NOT NULL,
        [Shift] nvarchar(max) NULL,
        [Assessment] nvarchar(max) NULL,
        [Interventions] nvarchar(max) NULL,
        [PatientResponse] nvarchar(max) NULL,
        [CarePlan] nvarchar(max) NULL,
        [Notes] nvarchar(max) NULL,
        [PainScore] nvarchar(max) NULL,
        [FallRisk] nvarchar(max) NULL,
        [Mobility] nvarchar(max) NULL,
        [Diet] nvarchar(max) NULL,
        [IntakeOutput] nvarchar(max) NULL,
        [MedicationAdministration] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_NursingNotes] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_NursingNotes_Admissions_AdmissionId] FOREIGN KEY ([AdmissionId]) REFERENCES [Admissions] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_NursingNotes_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Queues] (
        [Id] uniqueidentifier NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [AppointmentId] uniqueidentifier NULL,
        [DoctorId] uniqueidentifier NULL,
        [DepartmentId] uniqueidentifier NULL,
        [RoomId] uniqueidentifier NULL,
        [QueueDate] datetime2 NOT NULL,
        [TokenNumber] int NOT NULL,
        [Status] int NOT NULL,
        [Priority] int NULL,
        [JoinedAt] datetime2 NULL,
        [CalledAt] datetime2 NULL,
        [StartedAt] datetime2 NULL,
        [CompletedAt] datetime2 NULL,
        [WaitTimeMinutes] int NULL,
        [Notes] nvarchar(max) NULL,
        [AppointmentId1] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Queues] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Queues_Appointments_AppointmentId1] FOREIGN KEY ([AppointmentId1]) REFERENCES [Appointments] ([Id]),
        CONSTRAINT [FK_Queues_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Visits] (
        [Id] uniqueidentifier NOT NULL,
        [VisitNumber] nvarchar(max) NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [DoctorId] uniqueidentifier NOT NULL,
        [DepartmentId] uniqueidentifier NULL,
        [AppointmentId] uniqueidentifier NULL,
        [AdmissionId] uniqueidentifier NULL,
        [VisitType] int NOT NULL,
        [VisitDate] datetime2 NOT NULL,
        [StartTime] datetime2 NULL,
        [EndTime] datetime2 NULL,
        [ChiefComplaint] nvarchar(max) NULL,
        [HistoryOfPresentIllness] nvarchar(max) NULL,
        [PastMedicalHistory] nvarchar(max) NULL,
        [FamilyHistory] nvarchar(max) NULL,
        [SocialHistory] nvarchar(max) NULL,
        [ReviewOfSystems] nvarchar(max) NULL,
        [PhysicalExamination] nvarchar(max) NULL,
        [Assessment] nvarchar(max) NULL,
        [Plan] nvarchar(max) NULL,
        [ClinicalNotes] nvarchar(max) NULL,
        [PrivateNotes] nvarchar(max) NULL,
        [Diagnoses] nvarchar(max) NULL,
        [FollowUpDate] datetime2 NULL,
        [FollowUpInstructions] nvarchar(max) NULL,
        [IsCompleted] bit NOT NULL,
        [CompletedAt] datetime2 NULL,
        [IsBilled] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Visits] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Visits_Admissions_AdmissionId] FOREIGN KEY ([AdmissionId]) REFERENCES [Admissions] ([Id]),
        CONSTRAINT [FK_Visits_Appointments_AppointmentId] FOREIGN KEY ([AppointmentId]) REFERENCES [Appointments] ([Id]),
        CONSTRAINT [FK_Visits_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [BranchUsers] (
        [Id] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [IsPrimary] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_BranchUsers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_BranchUsers_Branches_BranchId] FOREIGN KEY ([BranchId]) REFERENCES [Branches] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Departments] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [HeadOfDepartmentId] uniqueidentifier NULL,
        [IsActive] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Departments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Departments_Branches_BranchId] FOREIGN KEY ([BranchId]) REFERENCES [Branches] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [GoodsReceipts] (
        [Id] uniqueidentifier NOT NULL,
        [GRNNumber] nvarchar(max) NOT NULL,
        [PurchaseOrderId] uniqueidentifier NOT NULL,
        [SupplierId] uniqueidentifier NOT NULL,
        [WarehouseId] uniqueidentifier NOT NULL,
        [ReceiptDate] datetime2 NOT NULL,
        [SupplierInvoiceNumber] nvarchar(max) NULL,
        [SupplierInvoiceDate] datetime2 NULL,
        [DeliveryNoteNumber] nvarchar(max) NULL,
        [TotalAmount] decimal(18,2) NOT NULL,
        [QualityChecked] bit NOT NULL,
        [QualityCheckedById] uniqueidentifier NULL,
        [QualityCheckedAt] datetime2 NULL,
        [QualityNotes] nvarchar(max) NULL,
        [ReceivedById] uniqueidentifier NOT NULL,
        [Notes] nvarchar(max) NULL,
        [IsFinalized] bit NOT NULL,
        [FinalizedAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_GoodsReceipts] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_GoodsReceipts_PurchaseOrders_PurchaseOrderId] FOREIGN KEY ([PurchaseOrderId]) REFERENCES [PurchaseOrders] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_GoodsReceipts_Suppliers_SupplierId] FOREIGN KEY ([SupplierId]) REFERENCES [Suppliers] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_GoodsReceipts_Warehouses_WarehouseId] FOREIGN KEY ([WarehouseId]) REFERENCES [Warehouses] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [PurchaseOrderItems] (
        [Id] uniqueidentifier NOT NULL,
        [PurchaseOrderId] uniqueidentifier NOT NULL,
        [ItemId] uniqueidentifier NOT NULL,
        [OrderedQuantity] decimal(18,2) NOT NULL,
        [ReceivedQuantity] decimal(18,2) NOT NULL,
        [PendingQuantity] decimal(18,2) NOT NULL,
        [RejectedQuantity] decimal(18,2) NOT NULL,
        [Unit] nvarchar(max) NULL,
        [UnitPrice] decimal(18,2) NOT NULL,
        [DiscountPercent] decimal(18,2) NOT NULL,
        [DiscountAmount] decimal(18,2) NOT NULL,
        [TaxPercent] decimal(18,2) NOT NULL,
        [TaxAmount] decimal(18,2) NOT NULL,
        [TotalAmount] decimal(18,2) NOT NULL,
        [Notes] nvarchar(max) NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_PurchaseOrderItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PurchaseOrderItems_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_PurchaseOrderItems_PurchaseOrders_PurchaseOrderId] FOREIGN KEY ([PurchaseOrderId]) REFERENCES [PurchaseOrders] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [StockTransferItems] (
        [Id] uniqueidentifier NOT NULL,
        [StockTransferId] uniqueidentifier NOT NULL,
        [ItemId] uniqueidentifier NOT NULL,
        [StockBatchId] uniqueidentifier NULL,
        [RequestedQuantity] decimal(18,2) NOT NULL,
        [DispatchedQuantity] decimal(18,2) NOT NULL,
        [ReceivedQuantity] decimal(18,2) NOT NULL,
        [DamagedQuantity] decimal(18,2) NOT NULL,
        [Unit] nvarchar(max) NULL,
        [BatchNumber] nvarchar(max) NULL,
        [ExpiryDate] datetime2 NULL,
        [Notes] nvarchar(max) NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_StockTransferItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_StockTransferItems_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_StockTransferItems_StockTransfers_StockTransferId] FOREIGN KEY ([StockTransferId]) REFERENCES [StockTransfers] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Rooms] (
        [Id] uniqueidentifier NOT NULL,
        [WardId] uniqueidentifier NOT NULL,
        [RoomNumber] nvarchar(max) NOT NULL,
        [Name] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [RoomType] int NOT NULL,
        [Capacity] int NOT NULL,
        [GenderRestriction] int NULL,
        [HasBathroom] bit NOT NULL,
        [HasTV] bit NOT NULL,
        [HasAC] bit NOT NULL,
        [IsIsolation] bit NOT NULL,
        [Amenities] nvarchar(max) NULL,
        [DailyRate] decimal(18,2) NULL,
        [IsActive] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Rooms] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Rooms_Wards_WardId] FOREIGN KEY ([WardId]) REFERENCES [Wards] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [StockMovements] (
        [Id] uniqueidentifier NOT NULL,
        [MovementNumber] nvarchar(max) NOT NULL,
        [ItemId] uniqueidentifier NOT NULL,
        [WarehouseId] uniqueidentifier NOT NULL,
        [StockBatchId] uniqueidentifier NULL,
        [MovementType] int NOT NULL,
        [MovementDate] datetime2 NOT NULL,
        [Quantity] decimal(18,2) NOT NULL,
        [QuantityBefore] decimal(18,2) NOT NULL,
        [QuantityAfter] decimal(18,2) NOT NULL,
        [UnitPrice] decimal(18,2) NOT NULL,
        [TotalAmount] decimal(18,2) NOT NULL,
        [ReferenceType] nvarchar(max) NULL,
        [ReferenceId] uniqueidentifier NULL,
        [ReferenceNumber] nvarchar(max) NULL,
        [FromWarehouseId] uniqueidentifier NULL,
        [ToWarehouseId] uniqueidentifier NULL,
        [Reason] nvarchar(max) NULL,
        [Notes] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StockMovements] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_StockMovements_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_StockMovements_StockBatches_StockBatchId] FOREIGN KEY ([StockBatchId]) REFERENCES [StockBatches] ([Id]),
        CONSTRAINT [FK_StockMovements_Warehouses_WarehouseId] FOREIGN KEY ([WarehouseId]) REFERENCES [Warehouses] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [MedicalOrders] (
        [Id] uniqueidentifier NOT NULL,
        [OrderNumber] nvarchar(max) NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [OrderedById] uniqueidentifier NOT NULL,
        [VisitId] uniqueidentifier NULL,
        [AdmissionId] uniqueidentifier NULL,
        [OrderType] int NOT NULL,
        [Status] int NOT NULL,
        [OrderDate] datetime2 NOT NULL,
        [Priority] int NULL,
        [IsUrgent] bit NOT NULL,
        [OrderItems] nvarchar(max) NULL,
        [ClinicalIndication] nvarchar(max) NULL,
        [SpecialInstructions] nvarchar(max) NULL,
        [Notes] nvarchar(max) NULL,
        [AssignedToId] uniqueidentifier NULL,
        [AcceptedAt] datetime2 NULL,
        [StartedAt] datetime2 NULL,
        [CompletedAt] datetime2 NULL,
        [CompletedById] uniqueidentifier NULL,
        [Results] nvarchar(max) NULL,
        [ResultNotes] nvarchar(max) NULL,
        [AbnormalFlags] nvarchar(max) NULL,
        [IsBilled] bit NOT NULL,
        [InvoiceId] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_MedicalOrders] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_MedicalOrders_Admissions_AdmissionId] FOREIGN KEY ([AdmissionId]) REFERENCES [Admissions] ([Id]),
        CONSTRAINT [FK_MedicalOrders_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_MedicalOrders_Visits_VisitId] FOREIGN KEY ([VisitId]) REFERENCES [Visits] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Prescriptions] (
        [Id] uniqueidentifier NOT NULL,
        [PrescriptionNumber] nvarchar(max) NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [DoctorId] uniqueidentifier NOT NULL,
        [VisitId] uniqueidentifier NULL,
        [AdmissionId] uniqueidentifier NULL,
        [PrescriptionDate] datetime2 NOT NULL,
        [ValidUntil] datetime2 NULL,
        [GeneralInstructions] nvarchar(max) NULL,
        [DietaryAdvice] nvarchar(max) NULL,
        [LifestyleAdvice] nvarchar(max) NULL,
        [Diagnosis] nvarchar(max) NULL,
        [IsDispensed] bit NOT NULL,
        [DispensedAt] datetime2 NULL,
        [DispensedById] uniqueidentifier NULL,
        [TemplateId] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Prescriptions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Prescriptions_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Prescriptions_Visits_VisitId] FOREIGN KEY ([VisitId]) REFERENCES [Visits] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Vitals] (
        [Id] uniqueidentifier NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [VisitId] uniqueidentifier NULL,
        [AdmissionId] uniqueidentifier NULL,
        [RecordedAt] datetime2 NOT NULL,
        [RecordedById] uniqueidentifier NOT NULL,
        [SystolicBP] int NULL,
        [DiastolicBP] int NULL,
        [Pulse] int NULL,
        [Temperature] decimal(18,2) NULL,
        [TemperatureUnit] nvarchar(max) NULL,
        [RespiratoryRate] int NULL,
        [SpO2] int NULL,
        [Weight] decimal(18,2) NULL,
        [WeightUnit] nvarchar(max) NULL,
        [Height] decimal(18,2) NULL,
        [HeightUnit] nvarchar(max) NULL,
        [BMI] decimal(18,2) NULL,
        [BloodSugar] decimal(18,2) NULL,
        [BloodSugarType] nvarchar(max) NULL,
        [AdditionalVitals] nvarchar(max) NULL,
        [Notes] nvarchar(max) NULL,
        [EmergencyVisitId] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Vitals] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Vitals_Admissions_AdmissionId] FOREIGN KEY ([AdmissionId]) REFERENCES [Admissions] ([Id]),
        CONSTRAINT [FK_Vitals_EmergencyVisits_EmergencyVisitId] FOREIGN KEY ([EmergencyVisitId]) REFERENCES [EmergencyVisits] ([Id]),
        CONSTRAINT [FK_Vitals_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Vitals_Visits_VisitId] FOREIGN KEY ([VisitId]) REFERENCES [Visits] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [GoodsReceiptItems] (
        [Id] uniqueidentifier NOT NULL,
        [GoodsReceiptId] uniqueidentifier NOT NULL,
        [PurchaseOrderItemId] uniqueidentifier NOT NULL,
        [ItemId] uniqueidentifier NOT NULL,
        [ReceivedQuantity] decimal(18,2) NOT NULL,
        [AcceptedQuantity] decimal(18,2) NOT NULL,
        [RejectedQuantity] decimal(18,2) NOT NULL,
        [DamagedQuantity] decimal(18,2) NOT NULL,
        [Unit] nvarchar(max) NULL,
        [BatchNumber] nvarchar(max) NULL,
        [ManufactureDate] datetime2 NULL,
        [ExpiryDate] datetime2 NULL,
        [UnitPrice] decimal(18,2) NOT NULL,
        [TotalAmount] decimal(18,2) NOT NULL,
        [QualityPassed] bit NOT NULL,
        [QualityNotes] nvarchar(max) NULL,
        [RejectionReason] nvarchar(max) NULL,
        [Notes] nvarchar(max) NULL,
        [StockBatchId] uniqueidentifier NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_GoodsReceiptItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_GoodsReceiptItems_GoodsReceipts_GoodsReceiptId] FOREIGN KEY ([GoodsReceiptId]) REFERENCES [GoodsReceipts] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_GoodsReceiptItems_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [Beds] (
        [Id] uniqueidentifier NOT NULL,
        [RoomId] uniqueidentifier NOT NULL,
        [BedNumber] nvarchar(50) NOT NULL,
        [Name] nvarchar(100) NULL,
        [Description] nvarchar(500) NULL,
        [BedType] int NOT NULL,
        [Status] int NOT NULL,
        [CurrentPatientId] uniqueidentifier NULL,
        [CurrentAdmissionId] uniqueidentifier NULL,
        [HasCallBell] bit NOT NULL,
        [HasOxygen] bit NOT NULL,
        [HasSuction] bit NOT NULL,
        [IsElectric] bit NOT NULL,
        [Features] nvarchar(max) NULL,
        [DailyRate] decimal(18,2) NULL,
        [LastCleanedAt] datetime2 NULL,
        [LastMaintenanceAt] datetime2 NULL,
        [MaintenanceNotes] nvarchar(max) NULL,
        [IsActive] bit NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Beds] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Beds_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [PrescriptionItems] (
        [Id] uniqueidentifier NOT NULL,
        [PrescriptionId] uniqueidentifier NOT NULL,
        [MedicineId] uniqueidentifier NULL,
        [MedicineName] nvarchar(max) NOT NULL,
        [GenericName] nvarchar(max) NULL,
        [Strength] nvarchar(max) NULL,
        [Form] nvarchar(max) NULL,
        [Dosage] nvarchar(max) NULL,
        [Frequency] int NOT NULL,
        [FrequencyText] nvarchar(max) NULL,
        [Route] int NOT NULL,
        [DurationDays] int NULL,
        [DurationText] nvarchar(max) NULL,
        [Quantity] decimal(18,2) NULL,
        [Instructions] nvarchar(max) NULL,
        [SpecialInstructions] nvarchar(max) NULL,
        [Warnings] nvarchar(max) NULL,
        [Morning] bit NOT NULL,
        [Afternoon] bit NOT NULL,
        [Evening] bit NOT NULL,
        [Night] bit NOT NULL,
        [AllowSubstitution] bit NOT NULL,
        [IsDispensed] bit NOT NULL,
        [DispensedQuantity] decimal(18,2) NULL,
        [DispensedBatchId] uniqueidentifier NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] varbinary(max) NOT NULL,
        CONSTRAINT [PK_PrescriptionItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PrescriptionItems_Prescriptions_PrescriptionId] FOREIGN KEY ([PrescriptionId]) REFERENCES [Prescriptions] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE TABLE [BedAllocations] (
        [Id] uniqueidentifier NOT NULL,
        [BedId] uniqueidentifier NOT NULL,
        [RoomId] uniqueidentifier NOT NULL,
        [WardId] uniqueidentifier NOT NULL,
        [PatientId] uniqueidentifier NOT NULL,
        [AdmissionId] uniqueidentifier NOT NULL,
        [AllocatedAt] datetime2 NOT NULL,
        [AllocatedById] uniqueidentifier NOT NULL,
        [ReleasedAt] datetime2 NULL,
        [ReleasedById] uniqueidentifier NULL,
        [ReleaseReason] nvarchar(max) NULL,
        [TransferredFromBedId] uniqueidentifier NULL,
        [TransferredToBedId] uniqueidentifier NULL,
        [TransferReason] nvarchar(max) NULL,
        [IsActive] bit NOT NULL,
        [Notes] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [BranchId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_BedAllocations] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_BedAllocations_Admissions_AdmissionId] FOREIGN KEY ([AdmissionId]) REFERENCES [Admissions] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_BedAllocations_Beds_BedId] FOREIGN KEY ([BedId]) REFERENCES [Beds] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_BedAllocations_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_BedAllocations_Wards_WardId] FOREIGN KEY ([WardId]) REFERENCES [Wards] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Admissions_PatientId] ON [Admissions] ([PatientId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Appointments_PatientId] ON [Appointments] ([PatientId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_BedAllocations_AdmissionId_IsActive] ON [BedAllocations] ([AdmissionId], [IsActive]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_BedAllocations_BedId_IsActive] ON [BedAllocations] ([BedId], [IsActive]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_BedAllocations_PatientId_AllocatedAt] ON [BedAllocations] ([PatientId], [AllocatedAt]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_BedAllocations_RoomId] ON [BedAllocations] ([RoomId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_BedAllocations_WardId] ON [BedAllocations] ([WardId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Beds_BranchId_BedType_Status] ON [Beds] ([BranchId], [BedType], [Status]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Beds_BranchId_Status] ON [Beds] ([BranchId], [Status]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Beds_RoomId_BedNumber] ON [Beds] ([RoomId], [BedNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Branches_TenantId] ON [Branches] ([TenantId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_BranchUsers_BranchId] ON [BranchUsers] ([BranchId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Departments_BranchId] ON [Departments] ([BranchId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_EmergencyVisits_AdmissionId] ON [EmergencyVisits] ([AdmissionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_EmergencyVisits_PatientId] ON [EmergencyVisits] ([PatientId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Floors_BuildingId] ON [Floors] ([BuildingId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_GoodsReceiptItems_GoodsReceiptId] ON [GoodsReceiptItems] ([GoodsReceiptId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_GoodsReceiptItems_ItemId] ON [GoodsReceiptItems] ([ItemId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_GoodsReceipts_PurchaseOrderId] ON [GoodsReceipts] ([PurchaseOrderId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_GoodsReceipts_SupplierId] ON [GoodsReceipts] ([SupplierId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_GoodsReceipts_WarehouseId] ON [GoodsReceipts] ([WarehouseId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_InsurancePlans_InsuranceCompanyId] ON [InsurancePlans] ([InsuranceCompanyId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_InvoiceItems_InvoiceId] ON [InvoiceItems] ([InvoiceId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Invoices_BranchId_InvoiceDate] ON [Invoices] ([BranchId], [InvoiceDate]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Invoices_BranchId_Status] ON [Invoices] ([BranchId], [Status]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Invoices_PatientId_InvoiceDate] ON [Invoices] ([PatientId], [InvoiceDate]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Invoices_TenantId_InvoiceNumber] ON [Invoices] ([TenantId], [InvoiceNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_ItemCategories_ParentCategoryId] ON [ItemCategories] ([ParentCategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Items_CategoryId] ON [Items] ([CategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Items_ManufacturerId] ON [Items] ([ManufacturerId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MedicalOrders_AdmissionId] ON [MedicalOrders] ([AdmissionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MedicalOrders_PatientId] ON [MedicalOrders] ([PatientId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MedicalOrders_VisitId] ON [MedicalOrders] ([VisitId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_NursingNotes_AdmissionId] ON [NursingNotes] ([AdmissionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_NursingNotes_PatientId] ON [NursingNotes] ([PatientId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PatientDocuments_PatientId] ON [PatientDocuments] ([PatientId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PatientInsurances_PatientId] ON [PatientInsurances] ([PatientId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Patients_TenantId_Email] ON [Patients] ([TenantId], [Email]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Patients_TenantId_FirstName_LastName] ON [Patients] ([TenantId], [FirstName], [LastName]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Patients_TenantId_IsActive] ON [Patients] ([TenantId], [IsActive]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Patients_TenantId_LastVisitDate] ON [Patients] ([TenantId], [LastVisitDate]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Patients_TenantId_MRN] ON [Patients] ([TenantId], [MRN]) WHERE [MRN] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Patients_TenantId_PatientNumber] ON [Patients] ([TenantId], [PatientNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Patients_TenantId_Phone] ON [Patients] ([TenantId], [Phone]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Payments_BranchId_PaymentDate] ON [Payments] ([BranchId], [PaymentDate]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Payments_InvoiceId_Status] ON [Payments] ([InvoiceId], [Status]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Payments_PatientId_PaymentDate] ON [Payments] ([PatientId], [PaymentDate]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Payments_TenantId_PaymentNumber] ON [Payments] ([TenantId], [PaymentNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PrescriptionItems_PrescriptionId] ON [PrescriptionItems] ([PrescriptionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Prescriptions_PatientId] ON [Prescriptions] ([PatientId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Prescriptions_VisitId] ON [Prescriptions] ([VisitId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PurchaseOrderItems_ItemId] ON [PurchaseOrderItems] ([ItemId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PurchaseOrderItems_PurchaseOrderId] ON [PurchaseOrderItems] ([PurchaseOrderId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PurchaseOrders_SupplierId] ON [PurchaseOrders] ([SupplierId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PurchaseOrders_WarehouseId] ON [PurchaseOrders] ([WarehouseId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Queues_AppointmentId1] ON [Queues] ([AppointmentId1]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Queues_PatientId] ON [Queues] ([PatientId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_RefreshTokens_UserId] ON [RefreshTokens] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_RolePermissions_PermissionId] ON [RolePermissions] ([PermissionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_RolePermissions_RoleId] ON [RolePermissions] ([RoleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Rooms_WardId] ON [Rooms] ([WardId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_ServiceCategories_ParentCategoryId] ON [ServiceCategories] ([ParentCategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Services_CategoryId] ON [Services] ([CategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_StockBatches_ItemId] ON [StockBatches] ([ItemId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_StockBatches_WarehouseId] ON [StockBatches] ([WarehouseId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_StockMovements_ItemId] ON [StockMovements] ([ItemId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_StockMovements_StockBatchId] ON [StockMovements] ([StockBatchId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_StockMovements_WarehouseId] ON [StockMovements] ([WarehouseId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_StockTransferItems_ItemId] ON [StockTransferItems] ([ItemId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_StockTransferItems_StockTransferId] ON [StockTransferItems] ([StockTransferId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_StockTransfers_FromWarehouseId] ON [StockTransfers] ([FromWarehouseId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_StockTransfers_ToWarehouseId] ON [StockTransfers] ([ToWarehouseId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Tenants_Slug] ON [Tenants] ([Slug]) WHERE [Slug] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_TenantUsers_TenantId] ON [TenantUsers] ([TenantId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_UserRoles_RoleId] ON [UserRoles] ([RoleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_UserRoles_UserId] ON [UserRoles] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Visits_AdmissionId] ON [Visits] ([AdmissionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Visits_AppointmentId] ON [Visits] ([AppointmentId]) WHERE [AppointmentId] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Visits_PatientId] ON [Visits] ([PatientId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Vitals_AdmissionId] ON [Vitals] ([AdmissionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Vitals_EmergencyVisitId] ON [Vitals] ([EmergencyVisitId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Vitals_PatientId] ON [Vitals] ([PatientId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Vitals_VisitId] ON [Vitals] ([VisitId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Wards_FloorId] ON [Wards] ([FloorId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906025738_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260906025738_InitialCreate', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Admissions] DROP CONSTRAINT [FK_Admissions_Patients_PatientId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Appointments] DROP CONSTRAINT [FK_Appointments_Patients_PatientId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [BedAllocations] DROP CONSTRAINT [FK_BedAllocations_Admissions_AdmissionId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Branches] DROP CONSTRAINT [FK_Branches_Tenants_TenantId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [BranchUsers] DROP CONSTRAINT [FK_BranchUsers_Branches_BranchId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Departments] DROP CONSTRAINT [FK_Departments_Branches_BranchId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [EmergencyVisits] DROP CONSTRAINT [FK_EmergencyVisits_Patients_PatientId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Floors] DROP CONSTRAINT [FK_Floors_Buildings_BuildingId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [GoodsReceiptItems] DROP CONSTRAINT [FK_GoodsReceiptItems_GoodsReceipts_GoodsReceiptId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [GoodsReceiptItems] DROP CONSTRAINT [FK_GoodsReceiptItems_Items_ItemId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [GoodsReceipts] DROP CONSTRAINT [FK_GoodsReceipts_PurchaseOrders_PurchaseOrderId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [GoodsReceipts] DROP CONSTRAINT [FK_GoodsReceipts_Suppliers_SupplierId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [GoodsReceipts] DROP CONSTRAINT [FK_GoodsReceipts_Warehouses_WarehouseId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [InsurancePlans] DROP CONSTRAINT [FK_InsurancePlans_InsuranceCompanies_InsuranceCompanyId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [InvoiceItems] DROP CONSTRAINT [FK_InvoiceItems_Invoices_InvoiceId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [MedicalOrders] DROP CONSTRAINT [FK_MedicalOrders_Patients_PatientId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [NursingNotes] DROP CONSTRAINT [FK_NursingNotes_Admissions_AdmissionId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [NursingNotes] DROP CONSTRAINT [FK_NursingNotes_Patients_PatientId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PatientDocuments] DROP CONSTRAINT [FK_PatientDocuments_Patients_PatientId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PatientInsurances] DROP CONSTRAINT [FK_PatientInsurances_Patients_PatientId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PrescriptionItems] DROP CONSTRAINT [FK_PrescriptionItems_Prescriptions_PrescriptionId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Prescriptions] DROP CONSTRAINT [FK_Prescriptions_Patients_PatientId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PurchaseOrderItems] DROP CONSTRAINT [FK_PurchaseOrderItems_Items_ItemId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PurchaseOrderItems] DROP CONSTRAINT [FK_PurchaseOrderItems_PurchaseOrders_PurchaseOrderId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PurchaseOrders] DROP CONSTRAINT [FK_PurchaseOrders_Suppliers_SupplierId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PurchaseOrders] DROP CONSTRAINT [FK_PurchaseOrders_Warehouses_WarehouseId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Queues] DROP CONSTRAINT [FK_Queues_Patients_PatientId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [RefreshTokens] DROP CONSTRAINT [FK_RefreshTokens_Users_UserId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [RolePermissions] DROP CONSTRAINT [FK_RolePermissions_Permissions_PermissionId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [RolePermissions] DROP CONSTRAINT [FK_RolePermissions_Roles_RoleId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Rooms] DROP CONSTRAINT [FK_Rooms_Wards_WardId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockBatches] DROP CONSTRAINT [FK_StockBatches_Items_ItemId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockBatches] DROP CONSTRAINT [FK_StockBatches_Warehouses_WarehouseId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockMovements] DROP CONSTRAINT [FK_StockMovements_Items_ItemId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockMovements] DROP CONSTRAINT [FK_StockMovements_Warehouses_WarehouseId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockTransferItems] DROP CONSTRAINT [FK_StockTransferItems_Items_ItemId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockTransferItems] DROP CONSTRAINT [FK_StockTransferItems_StockTransfers_StockTransferId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockTransfers] DROP CONSTRAINT [FK_StockTransfers_Warehouses_FromWarehouseId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockTransfers] DROP CONSTRAINT [FK_StockTransfers_Warehouses_ToWarehouseId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [TenantUsers] DROP CONSTRAINT [FK_TenantUsers_Tenants_TenantId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [UserRoles] DROP CONSTRAINT [FK_UserRoles_Roles_RoleId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [UserRoles] DROP CONSTRAINT [FK_UserRoles_Users_UserId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Visits] DROP CONSTRAINT [FK_Visits_Patients_PatientId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Vitals] DROP CONSTRAINT [FK_Vitals_Patients_PatientId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DROP INDEX [IX_Payments_TenantId_PaymentNumber] ON [Payments];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DROP INDEX [IX_Patients_TenantId_PatientNumber] ON [Patients];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DROP INDEX [IX_Invoices_TenantId_InvoiceNumber] ON [Invoices];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var0 sysname;
    SELECT @var0 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Warehouses]') AND [c].[name] = N'TenantId');
    IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Warehouses] DROP CONSTRAINT [' + @var0 + '];');
    ALTER TABLE [Warehouses] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Warehouses]') AND [c].[name] = N'BranchId');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Warehouses] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [Warehouses] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var2 sysname;
    SELECT @var2 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Wards]') AND [c].[name] = N'TenantId');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Wards] DROP CONSTRAINT [' + @var2 + '];');
    ALTER TABLE [Wards] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var3 sysname;
    SELECT @var3 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Wards]') AND [c].[name] = N'BranchId');
    IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Wards] DROP CONSTRAINT [' + @var3 + '];');
    ALTER TABLE [Wards] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var4 sysname;
    SELECT @var4 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Vitals]') AND [c].[name] = N'TenantId');
    IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [Vitals] DROP CONSTRAINT [' + @var4 + '];');
    ALTER TABLE [Vitals] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var5 sysname;
    SELECT @var5 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Vitals]') AND [c].[name] = N'BranchId');
    IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [Vitals] DROP CONSTRAINT [' + @var5 + '];');
    ALTER TABLE [Vitals] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var6 sysname;
    SELECT @var6 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Visits]') AND [c].[name] = N'TenantId');
    IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [Visits] DROP CONSTRAINT [' + @var6 + '];');
    ALTER TABLE [Visits] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var7 sysname;
    SELECT @var7 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Visits]') AND [c].[name] = N'BranchId');
    IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [Visits] DROP CONSTRAINT [' + @var7 + '];');
    ALTER TABLE [Visits] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var8 sysname;
    SELECT @var8 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TaxConfigurations]') AND [c].[name] = N'TenantId');
    IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [TaxConfigurations] DROP CONSTRAINT [' + @var8 + '];');
    ALTER TABLE [TaxConfigurations] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var9 sysname;
    SELECT @var9 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Suppliers]') AND [c].[name] = N'TenantId');
    IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [Suppliers] DROP CONSTRAINT [' + @var9 + '];');
    ALTER TABLE [Suppliers] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var10 sysname;
    SELECT @var10 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockTransfers]') AND [c].[name] = N'TenantId');
    IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [StockTransfers] DROP CONSTRAINT [' + @var10 + '];');
    ALTER TABLE [StockTransfers] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var11 sysname;
    SELECT @var11 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockTransfers]') AND [c].[name] = N'BranchId');
    IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [StockTransfers] DROP CONSTRAINT [' + @var11 + '];');
    ALTER TABLE [StockTransfers] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var12 sysname;
    SELECT @var12 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockMovements]') AND [c].[name] = N'TenantId');
    IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [StockMovements] DROP CONSTRAINT [' + @var12 + '];');
    ALTER TABLE [StockMovements] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var13 sysname;
    SELECT @var13 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockMovements]') AND [c].[name] = N'BranchId');
    IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [StockMovements] DROP CONSTRAINT [' + @var13 + '];');
    ALTER TABLE [StockMovements] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var14 sysname;
    SELECT @var14 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockBatches]') AND [c].[name] = N'TenantId');
    IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [StockBatches] DROP CONSTRAINT [' + @var14 + '];');
    ALTER TABLE [StockBatches] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var15 sysname;
    SELECT @var15 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StockBatches]') AND [c].[name] = N'BranchId');
    IF @var15 IS NOT NULL EXEC(N'ALTER TABLE [StockBatches] DROP CONSTRAINT [' + @var15 + '];');
    ALTER TABLE [StockBatches] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var16 sysname;
    SELECT @var16 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Services]') AND [c].[name] = N'TenantId');
    IF @var16 IS NOT NULL EXEC(N'ALTER TABLE [Services] DROP CONSTRAINT [' + @var16 + '];');
    ALTER TABLE [Services] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var17 sysname;
    SELECT @var17 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceCategories]') AND [c].[name] = N'TenantId');
    IF @var17 IS NOT NULL EXEC(N'ALTER TABLE [ServiceCategories] DROP CONSTRAINT [' + @var17 + '];');
    ALTER TABLE [ServiceCategories] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var18 sysname;
    SELECT @var18 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Rooms]') AND [c].[name] = N'TenantId');
    IF @var18 IS NOT NULL EXEC(N'ALTER TABLE [Rooms] DROP CONSTRAINT [' + @var18 + '];');
    ALTER TABLE [Rooms] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var19 sysname;
    SELECT @var19 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Rooms]') AND [c].[name] = N'BranchId');
    IF @var19 IS NOT NULL EXEC(N'ALTER TABLE [Rooms] DROP CONSTRAINT [' + @var19 + '];');
    ALTER TABLE [Rooms] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var20 sysname;
    SELECT @var20 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Queues]') AND [c].[name] = N'TenantId');
    IF @var20 IS NOT NULL EXEC(N'ALTER TABLE [Queues] DROP CONSTRAINT [' + @var20 + '];');
    ALTER TABLE [Queues] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var21 sysname;
    SELECT @var21 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Queues]') AND [c].[name] = N'BranchId');
    IF @var21 IS NOT NULL EXEC(N'ALTER TABLE [Queues] DROP CONSTRAINT [' + @var21 + '];');
    ALTER TABLE [Queues] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var22 sysname;
    SELECT @var22 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseOrders]') AND [c].[name] = N'TenantId');
    IF @var22 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseOrders] DROP CONSTRAINT [' + @var22 + '];');
    ALTER TABLE [PurchaseOrders] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var23 sysname;
    SELECT @var23 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PurchaseOrders]') AND [c].[name] = N'BranchId');
    IF @var23 IS NOT NULL EXEC(N'ALTER TABLE [PurchaseOrders] DROP CONSTRAINT [' + @var23 + '];');
    ALTER TABLE [PurchaseOrders] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var24 sysname;
    SELECT @var24 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Prescriptions]') AND [c].[name] = N'TenantId');
    IF @var24 IS NOT NULL EXEC(N'ALTER TABLE [Prescriptions] DROP CONSTRAINT [' + @var24 + '];');
    ALTER TABLE [Prescriptions] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var25 sysname;
    SELECT @var25 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Prescriptions]') AND [c].[name] = N'BranchId');
    IF @var25 IS NOT NULL EXEC(N'ALTER TABLE [Prescriptions] DROP CONSTRAINT [' + @var25 + '];');
    ALTER TABLE [Prescriptions] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var26 sysname;
    SELECT @var26 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'TenantId');
    IF @var26 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var26 + '];');
    ALTER TABLE [Payments] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var27 sysname;
    SELECT @var27 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'BranchId');
    IF @var27 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT [' + @var27 + '];');
    ALTER TABLE [Payments] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var28 sysname;
    SELECT @var28 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Patients]') AND [c].[name] = N'TenantId');
    IF @var28 IS NOT NULL EXEC(N'ALTER TABLE [Patients] DROP CONSTRAINT [' + @var28 + '];');
    ALTER TABLE [Patients] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var29 sysname;
    SELECT @var29 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PatientInsurances]') AND [c].[name] = N'TenantId');
    IF @var29 IS NOT NULL EXEC(N'ALTER TABLE [PatientInsurances] DROP CONSTRAINT [' + @var29 + '];');
    ALTER TABLE [PatientInsurances] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var30 sysname;
    SELECT @var30 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PatientDocuments]') AND [c].[name] = N'TenantId');
    IF @var30 IS NOT NULL EXEC(N'ALTER TABLE [PatientDocuments] DROP CONSTRAINT [' + @var30 + '];');
    ALTER TABLE [PatientDocuments] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var31 sysname;
    SELECT @var31 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PatientCategories]') AND [c].[name] = N'TenantId');
    IF @var31 IS NOT NULL EXEC(N'ALTER TABLE [PatientCategories] DROP CONSTRAINT [' + @var31 + '];');
    ALTER TABLE [PatientCategories] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var32 sysname;
    SELECT @var32 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[NursingNotes]') AND [c].[name] = N'TenantId');
    IF @var32 IS NOT NULL EXEC(N'ALTER TABLE [NursingNotes] DROP CONSTRAINT [' + @var32 + '];');
    ALTER TABLE [NursingNotes] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var33 sysname;
    SELECT @var33 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[NursingNotes]') AND [c].[name] = N'BranchId');
    IF @var33 IS NOT NULL EXEC(N'ALTER TABLE [NursingNotes] DROP CONSTRAINT [' + @var33 + '];');
    ALTER TABLE [NursingNotes] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var34 sysname;
    SELECT @var34 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Notifications]') AND [c].[name] = N'TenantId');
    IF @var34 IS NOT NULL EXEC(N'ALTER TABLE [Notifications] DROP CONSTRAINT [' + @var34 + '];');
    ALTER TABLE [Notifications] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var35 sysname;
    SELECT @var35 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MedicalOrders]') AND [c].[name] = N'TenantId');
    IF @var35 IS NOT NULL EXEC(N'ALTER TABLE [MedicalOrders] DROP CONSTRAINT [' + @var35 + '];');
    ALTER TABLE [MedicalOrders] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var36 sysname;
    SELECT @var36 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MedicalOrders]') AND [c].[name] = N'BranchId');
    IF @var36 IS NOT NULL EXEC(N'ALTER TABLE [MedicalOrders] DROP CONSTRAINT [' + @var36 + '];');
    ALTER TABLE [MedicalOrders] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var37 sysname;
    SELECT @var37 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Manufacturers]') AND [c].[name] = N'TenantId');
    IF @var37 IS NOT NULL EXEC(N'ALTER TABLE [Manufacturers] DROP CONSTRAINT [' + @var37 + '];');
    ALTER TABLE [Manufacturers] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var38 sysname;
    SELECT @var38 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Items]') AND [c].[name] = N'TenantId');
    IF @var38 IS NOT NULL EXEC(N'ALTER TABLE [Items] DROP CONSTRAINT [' + @var38 + '];');
    ALTER TABLE [Items] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var39 sysname;
    SELECT @var39 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ItemCategories]') AND [c].[name] = N'TenantId');
    IF @var39 IS NOT NULL EXEC(N'ALTER TABLE [ItemCategories] DROP CONSTRAINT [' + @var39 + '];');
    ALTER TABLE [ItemCategories] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var40 sysname;
    SELECT @var40 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Invoices]') AND [c].[name] = N'TenantId');
    IF @var40 IS NOT NULL EXEC(N'ALTER TABLE [Invoices] DROP CONSTRAINT [' + @var40 + '];');
    ALTER TABLE [Invoices] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var41 sysname;
    SELECT @var41 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Invoices]') AND [c].[name] = N'BranchId');
    IF @var41 IS NOT NULL EXEC(N'ALTER TABLE [Invoices] DROP CONSTRAINT [' + @var41 + '];');
    ALTER TABLE [Invoices] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var42 sysname;
    SELECT @var42 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InsurancePlans]') AND [c].[name] = N'TenantId');
    IF @var42 IS NOT NULL EXEC(N'ALTER TABLE [InsurancePlans] DROP CONSTRAINT [' + @var42 + '];');
    ALTER TABLE [InsurancePlans] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var43 sysname;
    SELECT @var43 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InsuranceCompanies]') AND [c].[name] = N'TenantId');
    IF @var43 IS NOT NULL EXEC(N'ALTER TABLE [InsuranceCompanies] DROP CONSTRAINT [' + @var43 + '];');
    ALTER TABLE [InsuranceCompanies] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var44 sysname;
    SELECT @var44 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InsuranceClaims]') AND [c].[name] = N'TenantId');
    IF @var44 IS NOT NULL EXEC(N'ALTER TABLE [InsuranceClaims] DROP CONSTRAINT [' + @var44 + '];');
    ALTER TABLE [InsuranceClaims] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var45 sysname;
    SELECT @var45 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[InsuranceClaims]') AND [c].[name] = N'BranchId');
    IF @var45 IS NOT NULL EXEC(N'ALTER TABLE [InsuranceClaims] DROP CONSTRAINT [' + @var45 + '];');
    ALTER TABLE [InsuranceClaims] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var46 sysname;
    SELECT @var46 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GoodsReceipts]') AND [c].[name] = N'TenantId');
    IF @var46 IS NOT NULL EXEC(N'ALTER TABLE [GoodsReceipts] DROP CONSTRAINT [' + @var46 + '];');
    ALTER TABLE [GoodsReceipts] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var47 sysname;
    SELECT @var47 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[GoodsReceipts]') AND [c].[name] = N'BranchId');
    IF @var47 IS NOT NULL EXEC(N'ALTER TABLE [GoodsReceipts] DROP CONSTRAINT [' + @var47 + '];');
    ALTER TABLE [GoodsReceipts] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var48 sysname;
    SELECT @var48 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Floors]') AND [c].[name] = N'TenantId');
    IF @var48 IS NOT NULL EXEC(N'ALTER TABLE [Floors] DROP CONSTRAINT [' + @var48 + '];');
    ALTER TABLE [Floors] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var49 sysname;
    SELECT @var49 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Floors]') AND [c].[name] = N'BranchId');
    IF @var49 IS NOT NULL EXEC(N'ALTER TABLE [Floors] DROP CONSTRAINT [' + @var49 + '];');
    ALTER TABLE [Floors] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var50 sysname;
    SELECT @var50 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmergencyVisits]') AND [c].[name] = N'TenantId');
    IF @var50 IS NOT NULL EXEC(N'ALTER TABLE [EmergencyVisits] DROP CONSTRAINT [' + @var50 + '];');
    ALTER TABLE [EmergencyVisits] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var51 sysname;
    SELECT @var51 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmergencyVisits]') AND [c].[name] = N'BranchId');
    IF @var51 IS NOT NULL EXEC(N'ALTER TABLE [EmergencyVisits] DROP CONSTRAINT [' + @var51 + '];');
    ALTER TABLE [EmergencyVisits] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var52 sysname;
    SELECT @var52 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Departments]') AND [c].[name] = N'TenantId');
    IF @var52 IS NOT NULL EXEC(N'ALTER TABLE [Departments] DROP CONSTRAINT [' + @var52 + '];');
    ALTER TABLE [Departments] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var53 sysname;
    SELECT @var53 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Departments]') AND [c].[name] = N'BranchId');
    IF @var53 IS NOT NULL EXEC(N'ALTER TABLE [Departments] DROP CONSTRAINT [' + @var53 + '];');
    ALTER TABLE [Departments] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var54 sysname;
    SELECT @var54 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CorporateClients]') AND [c].[name] = N'TenantId');
    IF @var54 IS NOT NULL EXEC(N'ALTER TABLE [CorporateClients] DROP CONSTRAINT [' + @var54 + '];');
    ALTER TABLE [CorporateClients] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var55 sysname;
    SELECT @var55 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Buildings]') AND [c].[name] = N'TenantId');
    IF @var55 IS NOT NULL EXEC(N'ALTER TABLE [Buildings] DROP CONSTRAINT [' + @var55 + '];');
    ALTER TABLE [Buildings] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var56 sysname;
    SELECT @var56 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Buildings]') AND [c].[name] = N'BranchId');
    IF @var56 IS NOT NULL EXEC(N'ALTER TABLE [Buildings] DROP CONSTRAINT [' + @var56 + '];');
    ALTER TABLE [Buildings] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var57 sysname;
    SELECT @var57 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Branches]') AND [c].[name] = N'TenantId');
    IF @var57 IS NOT NULL EXEC(N'ALTER TABLE [Branches] DROP CONSTRAINT [' + @var57 + '];');
    ALTER TABLE [Branches] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var58 sysname;
    SELECT @var58 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Beds]') AND [c].[name] = N'TenantId');
    IF @var58 IS NOT NULL EXEC(N'ALTER TABLE [Beds] DROP CONSTRAINT [' + @var58 + '];');
    ALTER TABLE [Beds] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var59 sysname;
    SELECT @var59 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Beds]') AND [c].[name] = N'BranchId');
    IF @var59 IS NOT NULL EXEC(N'ALTER TABLE [Beds] DROP CONSTRAINT [' + @var59 + '];');
    ALTER TABLE [Beds] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var60 sysname;
    SELECT @var60 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BedAllocations]') AND [c].[name] = N'TenantId');
    IF @var60 IS NOT NULL EXEC(N'ALTER TABLE [BedAllocations] DROP CONSTRAINT [' + @var60 + '];');
    ALTER TABLE [BedAllocations] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var61 sysname;
    SELECT @var61 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BedAllocations]') AND [c].[name] = N'BranchId');
    IF @var61 IS NOT NULL EXEC(N'ALTER TABLE [BedAllocations] DROP CONSTRAINT [' + @var61 + '];');
    ALTER TABLE [BedAllocations] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var62 sysname;
    SELECT @var62 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Appointments]') AND [c].[name] = N'TenantId');
    IF @var62 IS NOT NULL EXEC(N'ALTER TABLE [Appointments] DROP CONSTRAINT [' + @var62 + '];');
    ALTER TABLE [Appointments] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var63 sysname;
    SELECT @var63 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Appointments]') AND [c].[name] = N'BranchId');
    IF @var63 IS NOT NULL EXEC(N'ALTER TABLE [Appointments] DROP CONSTRAINT [' + @var63 + '];');
    ALTER TABLE [Appointments] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var64 sysname;
    SELECT @var64 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Admissions]') AND [c].[name] = N'TenantId');
    IF @var64 IS NOT NULL EXEC(N'ALTER TABLE [Admissions] DROP CONSTRAINT [' + @var64 + '];');
    ALTER TABLE [Admissions] ALTER COLUMN [TenantId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    DECLARE @var65 sysname;
    SELECT @var65 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Admissions]') AND [c].[name] = N'BranchId');
    IF @var65 IS NOT NULL EXEC(N'ALTER TABLE [Admissions] DROP CONSTRAINT [' + @var65 + '];');
    ALTER TABLE [Admissions] ALTER COLUMN [BranchId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Payments_TenantId_PaymentNumber] ON [Payments] ([TenantId], [PaymentNumber]) WHERE [TenantId] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Patients_TenantId_PatientNumber] ON [Patients] ([TenantId], [PatientNumber]) WHERE [TenantId] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Invoices_TenantId_InvoiceNumber] ON [Invoices] ([TenantId], [InvoiceNumber]) WHERE [TenantId] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Admissions] ADD CONSTRAINT [FK_Admissions_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Appointments] ADD CONSTRAINT [FK_Appointments_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [BedAllocations] ADD CONSTRAINT [FK_BedAllocations_Admissions_AdmissionId] FOREIGN KEY ([AdmissionId]) REFERENCES [Admissions] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Branches] ADD CONSTRAINT [FK_Branches_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [BranchUsers] ADD CONSTRAINT [FK_BranchUsers_Branches_BranchId] FOREIGN KEY ([BranchId]) REFERENCES [Branches] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Departments] ADD CONSTRAINT [FK_Departments_Branches_BranchId] FOREIGN KEY ([BranchId]) REFERENCES [Branches] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [EmergencyVisits] ADD CONSTRAINT [FK_EmergencyVisits_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Floors] ADD CONSTRAINT [FK_Floors_Buildings_BuildingId] FOREIGN KEY ([BuildingId]) REFERENCES [Buildings] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [GoodsReceiptItems] ADD CONSTRAINT [FK_GoodsReceiptItems_GoodsReceipts_GoodsReceiptId] FOREIGN KEY ([GoodsReceiptId]) REFERENCES [GoodsReceipts] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [GoodsReceiptItems] ADD CONSTRAINT [FK_GoodsReceiptItems_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [GoodsReceipts] ADD CONSTRAINT [FK_GoodsReceipts_PurchaseOrders_PurchaseOrderId] FOREIGN KEY ([PurchaseOrderId]) REFERENCES [PurchaseOrders] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [GoodsReceipts] ADD CONSTRAINT [FK_GoodsReceipts_Suppliers_SupplierId] FOREIGN KEY ([SupplierId]) REFERENCES [Suppliers] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [GoodsReceipts] ADD CONSTRAINT [FK_GoodsReceipts_Warehouses_WarehouseId] FOREIGN KEY ([WarehouseId]) REFERENCES [Warehouses] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [InsurancePlans] ADD CONSTRAINT [FK_InsurancePlans_InsuranceCompanies_InsuranceCompanyId] FOREIGN KEY ([InsuranceCompanyId]) REFERENCES [InsuranceCompanies] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [InvoiceItems] ADD CONSTRAINT [FK_InvoiceItems_Invoices_InvoiceId] FOREIGN KEY ([InvoiceId]) REFERENCES [Invoices] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [MedicalOrders] ADD CONSTRAINT [FK_MedicalOrders_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [NursingNotes] ADD CONSTRAINT [FK_NursingNotes_Admissions_AdmissionId] FOREIGN KEY ([AdmissionId]) REFERENCES [Admissions] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [NursingNotes] ADD CONSTRAINT [FK_NursingNotes_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PatientDocuments] ADD CONSTRAINT [FK_PatientDocuments_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PatientInsurances] ADD CONSTRAINT [FK_PatientInsurances_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PrescriptionItems] ADD CONSTRAINT [FK_PrescriptionItems_Prescriptions_PrescriptionId] FOREIGN KEY ([PrescriptionId]) REFERENCES [Prescriptions] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Prescriptions] ADD CONSTRAINT [FK_Prescriptions_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PurchaseOrderItems] ADD CONSTRAINT [FK_PurchaseOrderItems_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PurchaseOrderItems] ADD CONSTRAINT [FK_PurchaseOrderItems_PurchaseOrders_PurchaseOrderId] FOREIGN KEY ([PurchaseOrderId]) REFERENCES [PurchaseOrders] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PurchaseOrders] ADD CONSTRAINT [FK_PurchaseOrders_Suppliers_SupplierId] FOREIGN KEY ([SupplierId]) REFERENCES [Suppliers] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [PurchaseOrders] ADD CONSTRAINT [FK_PurchaseOrders_Warehouses_WarehouseId] FOREIGN KEY ([WarehouseId]) REFERENCES [Warehouses] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Queues] ADD CONSTRAINT [FK_Queues_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [RefreshTokens] ADD CONSTRAINT [FK_RefreshTokens_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [RolePermissions] ADD CONSTRAINT [FK_RolePermissions_Permissions_PermissionId] FOREIGN KEY ([PermissionId]) REFERENCES [Permissions] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [RolePermissions] ADD CONSTRAINT [FK_RolePermissions_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [Roles] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Rooms] ADD CONSTRAINT [FK_Rooms_Wards_WardId] FOREIGN KEY ([WardId]) REFERENCES [Wards] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockBatches] ADD CONSTRAINT [FK_StockBatches_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockBatches] ADD CONSTRAINT [FK_StockBatches_Warehouses_WarehouseId] FOREIGN KEY ([WarehouseId]) REFERENCES [Warehouses] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockMovements] ADD CONSTRAINT [FK_StockMovements_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockMovements] ADD CONSTRAINT [FK_StockMovements_Warehouses_WarehouseId] FOREIGN KEY ([WarehouseId]) REFERENCES [Warehouses] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockTransferItems] ADD CONSTRAINT [FK_StockTransferItems_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockTransferItems] ADD CONSTRAINT [FK_StockTransferItems_StockTransfers_StockTransferId] FOREIGN KEY ([StockTransferId]) REFERENCES [StockTransfers] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockTransfers] ADD CONSTRAINT [FK_StockTransfers_Warehouses_FromWarehouseId] FOREIGN KEY ([FromWarehouseId]) REFERENCES [Warehouses] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [StockTransfers] ADD CONSTRAINT [FK_StockTransfers_Warehouses_ToWarehouseId] FOREIGN KEY ([ToWarehouseId]) REFERENCES [Warehouses] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [TenantUsers] ADD CONSTRAINT [FK_TenantUsers_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [UserRoles] ADD CONSTRAINT [FK_UserRoles_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [Roles] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [UserRoles] ADD CONSTRAINT [FK_UserRoles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Visits] ADD CONSTRAINT [FK_Visits_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    ALTER TABLE [Vitals] ADD CONSTRAINT [FK_Vitals_Patients_PatientId] FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260906073353_MakeTenantBranchNullable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260906073353_MakeTenantBranchNullable', N'8.0.0');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    ALTER TABLE [Users] ADD [DepartmentId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    ALTER TABLE [Users] ADD [Designation] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    ALTER TABLE [Users] ADD [MustChangePassword] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    ALTER TABLE [Users] ADD [PasswordChangedAt] datetime2 NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    CREATE TABLE [DoctorSchedules] (
        [Id] uniqueidentifier NOT NULL,
        [DoctorId] uniqueidentifier NOT NULL,
        [DayOfWeek] int NOT NULL,
        [StartTime] time NOT NULL,
        [EndTime] time NOT NULL,
        [SlotDuration] int NOT NULL,
        [ConsultationFee] decimal(18,2) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NULL,
        [BranchId] uniqueidentifier NULL,
        CONSTRAINT [PK_DoctorSchedules] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    CREATE TABLE [TenantEntitlements] (
        [Id] uniqueidentifier NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [Feature] nvarchar(100) NOT NULL,
        [IsEnabled] bit NOT NULL,
        [ExpiresAt] datetime2 NULL,
        [Notes] nvarchar(500) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        CONSTRAINT [PK_TenantEntitlements] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_TenantEntitlements_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    CREATE TABLE [TenantLimits] (
        [Id] uniqueidentifier NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [LimitType] nvarchar(100) NOT NULL,
        [MaxValue] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        CONSTRAINT [PK_TenantLimits] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_TenantLimits_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    CREATE TABLE [UserPermissions] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [PermissionId] uniqueidentifier NOT NULL,
        [IsGranted] bit NOT NULL,
        [BranchId] uniqueidentifier NULL,
        [GrantedBy] uniqueidentifier NULL,
        [GrantedAt] datetime2 NULL,
        [ExpiresAt] datetime2 NULL,
        [Reason] nvarchar(500) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedBy] uniqueidentifier NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [RowVersion] rowversion NOT NULL,
        [IsDeleted] bit NOT NULL,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        [TenantId] uniqueidentifier NULL,
        CONSTRAINT [PK_UserPermissions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_UserPermissions_Permissions_PermissionId] FOREIGN KEY ([PermissionId]) REFERENCES [Permissions] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    CREATE UNIQUE INDEX [UX_TenantEntitlements_Tenant_Feature] ON [TenantEntitlements] ([TenantId], [Feature]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    CREATE UNIQUE INDEX [UX_TenantLimits_Tenant_LimitType] ON [TenantLimits] ([TenantId], [LimitType]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    CREATE INDEX [IX_UserPermissions_PermissionId] ON [UserPermissions] ([PermissionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    CREATE INDEX [IX_UserPermissions_Tenant_User] ON [UserPermissions] ([TenantId], [UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [UX_UserPermissions_Tenant_User_Permission_Branch] ON [UserPermissions] ([TenantId], [UserId], [PermissionId], [BranchId]) WHERE [TenantId] IS NOT NULL AND [BranchId] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260907110547_AddDoctorSchedules'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260907110547_AddDoctorSchedules', N'8.0.0');
END;
GO

COMMIT;
GO

