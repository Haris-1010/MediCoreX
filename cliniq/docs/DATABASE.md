# ClinIQ Database Documentation

## Overview

ClinIQ uses SQL Server as its primary database with Entity Framework Core 8 for ORM. This document describes the database schema, relationships, and key design decisions.

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Tenant    │───────│   Branch    │───────│    User     │
└─────────────┘       └─────────────┘       └─────────────┘
                            │                      │
                            │                      │
┌─────────────┐       ┌─────┴─────┐         ┌──────┴──────┐
│   Patient   │───────│Appointment│─────────│   Doctor    │
└─────────────┘       └───────────┘         └─────────────┘
      │                     │                      │
      │                     │                      │
┌─────┴─────┐         ┌─────┴─────┐         ┌──────┴──────┐
│ Admission │─────────│Consultation│────────│   Schedule  │
└───────────┘         └───────────┘         └─────────────┘
      │
      │
┌─────┴─────┐         ┌───────────┐         ┌─────────────┐
│    Bed    │─────────│    Ward   │─────────│   Building  │
└───────────┘         └───────────┘         └─────────────┘
```

## Core Entities

### Tenant
```sql
CREATE TABLE Tenants (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2
);
```

### Branch
```sql
CREATE TABLE Branches (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Tenants(Id),
    Name NVARCHAR(200) NOT NULL,
    Code NVARCHAR(50) NOT NULL,
    Address NVARCHAR(500),
    Phone NVARCHAR(20),
    Email NVARCHAR(200),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL
);
```

### Patient
```sql
CREATE TABLE Patients (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    BranchId UNIQUEIDENTIFIER NOT NULL,
    MRN NVARCHAR(50) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Gender NVARCHAR(20) NOT NULL,
    BloodGroup NVARCHAR(10),
    Phone NVARCHAR(20),
    Email NVARCHAR(200),
    Address NVARCHAR(500),
    EmergencyContactName NVARCHAR(200),
    EmergencyContactPhone NVARCHAR(20),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL,
    CONSTRAINT UQ_Patient_MRN UNIQUE (TenantId, MRN)
);
```

### Doctor
```sql
CREATE TABLE Doctors (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    EmployeeCode NVARCHAR(50) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Specialization NVARCHAR(100),
    Qualification NVARCHAR(200),
    RegistrationNumber NVARCHAR(100),
    ConsultationFee DECIMAL(18,2),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL
);
```

### Appointment
```sql
CREATE TABLE Appointments (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    BranchId UNIQUEIDENTIFIER NOT NULL,
    PatientId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Patients(Id),
    DoctorId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Doctors(Id),
    AppointmentDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    Status INT NOT NULL, -- Scheduled, Confirmed, CheckedIn, InProgress, Completed, Cancelled, NoShow
    AppointmentType INT NOT NULL, -- NewConsultation, FollowUp, Emergency
    Notes NVARCHAR(MAX),
    CancellationReason NVARCHAR(500),
    CreatedAt DATETIME2 NOT NULL
);
```

### Admission
```sql
CREATE TABLE Admissions (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    BranchId UNIQUEIDENTIFIER NOT NULL,
    PatientId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Patients(Id),
    BedId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Beds(Id),
    AdmittingDoctorId UNIQUEIDENTIFIER NOT NULL,
    AttendingDoctorId UNIQUEIDENTIFIER NOT NULL,
    AdmissionDate DATETIME2 NOT NULL,
    DischargeDate DATETIME2,
    Status INT NOT NULL, -- Admitted, Discharged, Transferred, LAMA, Deceased
    AdmissionType INT NOT NULL, -- Emergency, Elective, Maternity
    Diagnosis NVARCHAR(MAX),
    DischargeSummary NVARCHAR(MAX),
    IsEmergency BIT DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL
);
```

### Invoice
```sql
CREATE TABLE Invoices (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    BranchId UNIQUEIDENTIFIER NOT NULL,
    PatientId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Patients(Id),
    InvoiceNumber NVARCHAR(50) NOT NULL,
    InvoiceDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    SubTotal DECIMAL(18,2) NOT NULL,
    DiscountAmount DECIMAL(18,2) DEFAULT 0,
    TaxRate DECIMAL(5,2) DEFAULT 0,
    TaxAmount DECIMAL(18,2) DEFAULT 0,
    TotalAmount DECIMAL(18,2) NOT NULL,
    PaidAmount DECIMAL(18,2) DEFAULT 0,
    Status INT NOT NULL, -- Pending, PartiallyPaid, Paid, Voided, Refunded
    VoidReason NVARCHAR(500),
    CreatedAt DATETIME2 NOT NULL,
    CONSTRAINT UQ_Invoice_Number UNIQUE (TenantId, InvoiceNumber)
);
```

## Facility Entities

### Building
```sql
CREATE TABLE Buildings (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    BranchId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Code NVARCHAR(50) NOT NULL,
    Floors INT NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL
);
```

### Ward
```sql
CREATE TABLE Wards (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    BuildingId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Buildings(Id),
    Name NVARCHAR(200) NOT NULL,
    Code NVARCHAR(50) NOT NULL,
    WardType INT NOT NULL, -- General, ICU, NICU, Maternity, Pediatric, Surgical
    Floor INT NOT NULL,
    TotalBeds INT NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL
);
```

### Room
```sql
CREATE TABLE Rooms (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    WardId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Wards(Id),
    RoomNumber NVARCHAR(50) NOT NULL,
    RoomType INT NOT NULL, -- Single, Double, General, Suite
    TotalBeds INT NOT NULL,
    DailyRate DECIMAL(18,2) NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL
);
```

### Bed
```sql
CREATE TABLE Beds (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    RoomId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Rooms(Id),
    BedNumber NVARCHAR(50) NOT NULL,
    Status INT NOT NULL, -- Available, Occupied, Maintenance, Reserved
    BedType INT NOT NULL, -- Standard, ICU, Pediatric
    CreatedAt DATETIME2 NOT NULL
);
```

## Queue Management

### QueueItem
```sql
CREATE TABLE QueueItems (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NOT NULL,
    BranchId UNIQUEIDENTIFIER NOT NULL,
    PatientId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Patients(Id),
    DoctorId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Doctors(Id),
    AppointmentId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Appointments(Id),
    TokenNumber INT NOT NULL,
    QueueDate DATE NOT NULL,
    Status INT NOT NULL, -- Waiting, Called, InConsultation, Completed, Skipped
    Priority INT NOT NULL, -- Normal, High, Emergency
    CheckInTime DATETIME2 NOT NULL,
    CalledTime DATETIME2,
    CompletedTime DATETIME2,
    CreatedAt DATETIME2 NOT NULL
);
```

## Indexes

```sql
-- Patient indexes
CREATE INDEX IX_Patients_TenantId ON Patients(TenantId);
CREATE INDEX IX_Patients_BranchId ON Patients(BranchId);
CREATE INDEX IX_Patients_MRN ON Patients(TenantId, MRN);
CREATE INDEX IX_Patients_Name ON Patients(LastName, FirstName);

-- Appointment indexes
CREATE INDEX IX_Appointments_TenantId ON Appointments(TenantId);
CREATE INDEX IX_Appointments_PatientId ON Appointments(PatientId);
CREATE INDEX IX_Appointments_DoctorId ON Appointments(DoctorId);
CREATE INDEX IX_Appointments_Date ON Appointments(AppointmentDate);
CREATE INDEX IX_Appointments_Status ON Appointments(Status);

-- Admission indexes
CREATE INDEX IX_Admissions_TenantId ON Admissions(TenantId);
CREATE INDEX IX_Admissions_PatientId ON Admissions(PatientId);
CREATE INDEX IX_Admissions_BedId ON Admissions(BedId);
CREATE INDEX IX_Admissions_Status ON Admissions(Status);

-- Invoice indexes
CREATE INDEX IX_Invoices_TenantId ON Invoices(TenantId);
CREATE INDEX IX_Invoices_PatientId ON Invoices(PatientId);
CREATE INDEX IX_Invoices_Status ON Invoices(Status);
CREATE INDEX IX_Invoices_Date ON Invoices(InvoiceDate);

-- Queue indexes
CREATE INDEX IX_QueueItems_TenantId ON QueueItems(TenantId);
CREATE INDEX IX_QueueItems_DoctorId ON QueueItems(DoctorId);
CREATE INDEX IX_QueueItems_Date ON QueueItems(QueueDate);
CREATE INDEX IX_QueueItems_Status ON QueueItems(Status);
```

## Multi-Tenancy Filter

All tenant-specific entities include a TenantId column. Entity Framework Core global query filters automatically apply tenant filtering:

```csharp
modelBuilder.Entity<Patient>()
    .HasQueryFilter(p => p.TenantId == _tenantService.TenantId);
```

## Soft Delete

Entities support soft delete via the IsActive flag. The global query filter excludes inactive records:

```csharp
modelBuilder.Entity<Patient>()
    .HasQueryFilter(p => p.IsActive);
```

## Audit Columns

All entities inherit from BaseEntity which includes:
- `CreatedAt` - Record creation timestamp
- `CreatedBy` - User who created the record
- `UpdatedAt` - Last update timestamp
- `UpdatedBy` - User who last updated

## Migration Strategy

1. Use EF Core migrations for schema changes
2. Run migrations during deployment
3. Use idempotent migrations for safety

```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```
