SET NOCOUNT ON;

-- 1. Create Discounts table if it doesn't exist
IF OBJECT_ID(N'dbo.Discounts', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Discounts (
        Id            UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Discounts PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        Name          NVARCHAR(200)    NOT NULL,
        Description   NVARCHAR(500)    NULL,
        Type          NVARCHAR(50)     NOT NULL DEFAULT 'Flat',
        Value         DECIMAL(18,2)    NOT NULL DEFAULT 0,
        IsActive      BIT              NOT NULL DEFAULT 1,
        TenantId      UNIQUEIDENTIFIER NULL,
        IsDeleted     BIT              NOT NULL DEFAULT 0,
        DeletedAt     DATETIME2(7)     NULL,
        DeletedBy     UNIQUEIDENTIFIER NULL,
        CreatedAt     DATETIME2(7)     NOT NULL DEFAULT SYSUTCDATETIME(),
        CreatedBy     UNIQUEIDENTIFIER NULL,
        UpdatedAt     DATETIME2(7)     NULL,
        UpdatedBy     UNIQUEIDENTIFIER NULL,
        RowVersion    ROWVERSION       NOT NULL
    );
    PRINT 'Discounts table created.';
END
ELSE
    PRINT 'Discounts table already exists.';
GO

-- 2. Add DiscountId column to Invoices if it doesn't exist
IF COL_LENGTH(N'dbo.Invoices', N'DiscountId') IS NULL
BEGIN
    ALTER TABLE dbo.Invoices ADD DiscountId UNIQUEIDENTIFIER NULL;
    PRINT 'DiscountId column added to Invoices.';
END
ELSE
    PRINT 'DiscountId column already exists in Invoices.';
GO

PRINT 'Done.';
GO
