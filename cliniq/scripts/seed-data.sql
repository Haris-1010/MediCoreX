-- ClinIQ Database Seed Script
-- Run this script after migrations to seed initial data

-- Create default tenant
DECLARE @TenantId UNIQUEIDENTIFIER = NEWID();
DECLARE @BranchId UNIQUEIDENTIFIER = NEWID();
DECLARE @AdminUserId UNIQUEIDENTIFIER = NEWID();

INSERT INTO Tenants (Id, Name, Code, IsActive, CreatedAt)
VALUES (@TenantId, 'Default Hospital', 'DEFAULT', 1, GETUTCDATE());

-- Create default branch
INSERT INTO Branches (Id, TenantId, Name, Code, Address, Phone, Email, IsActive, CreatedAt)
VALUES (@BranchId, @TenantId, 'Main Branch', 'MAIN', '123 Hospital Street', '1234567890', 'main@hospital.com', 1, GETUTCDATE());

-- Create admin role
DECLARE @AdminRoleId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Roles (Id, TenantId, Name, NormalizedName, Description, IsSystemRole, CreatedAt)
VALUES (@AdminRoleId, @TenantId, 'Administrator', 'ADMINISTRATOR', 'Full system access', 1, GETUTCDATE());

-- Create doctor role
DECLARE @DoctorRoleId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Roles (Id, TenantId, Name, NormalizedName, Description, IsSystemRole, CreatedAt)
VALUES (@DoctorRoleId, @TenantId, 'Doctor', 'DOCTOR', 'Doctor access', 1, GETUTCDATE());

-- Create nurse role
DECLARE @NurseRoleId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Roles (Id, TenantId, Name, NormalizedName, Description, IsSystemRole, CreatedAt)
VALUES (@NurseRoleId, @TenantId, 'Nurse', 'NURSE', 'Nurse access', 1, GETUTCDATE());

-- Create receptionist role
DECLARE @ReceptionistRoleId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Roles (Id, TenantId, Name, NormalizedName, Description, IsSystemRole, CreatedAt)
VALUES (@ReceptionistRoleId, @TenantId, 'Receptionist', 'RECEPTIONIST', 'Front desk access', 1, GETUTCDATE());

-- Create billing role
DECLARE @BillingRoleId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Roles (Id, TenantId, Name, NormalizedName, Description, IsSystemRole, CreatedAt)
VALUES (@BillingRoleId, @TenantId, 'Billing', 'BILLING', 'Billing access', 1, GETUTCDATE());

-- Create permissions
INSERT INTO Permissions (Id, Name, NormalizedName, Category, Description, CreatedAt) VALUES
-- Patient permissions
(NEWID(), 'patients.read', 'PATIENTS.READ', 'Patients', 'View patients', GETUTCDATE()),
(NEWID(), 'patients.write', 'PATIENTS.WRITE', 'Patients', 'Create/edit patients', GETUTCDATE()),
(NEWID(), 'patients.delete', 'PATIENTS.DELETE', 'Patients', 'Delete patients', GETUTCDATE()),
-- Appointment permissions
(NEWID(), 'appointments.read', 'APPOINTMENTS.READ', 'Appointments', 'View appointments', GETUTCDATE()),
(NEWID(), 'appointments.write', 'APPOINTMENTS.WRITE', 'Appointments', 'Create/edit appointments', GETUTCDATE()),
(NEWID(), 'appointments.delete', 'APPOINTMENTS.DELETE', 'Appointments', 'Delete appointments', GETUTCDATE()),
-- OPD permissions
(NEWID(), 'opd.read', 'OPD.READ', 'OPD', 'View OPD', GETUTCDATE()),
(NEWID(), 'opd.write', 'OPD.WRITE', 'OPD', 'Manage OPD', GETUTCDATE()),
(NEWID(), 'opd.queue', 'OPD.QUEUE', 'OPD', 'Manage queue', GETUTCDATE()),
-- IPD permissions
(NEWID(), 'ipd.read', 'IPD.READ', 'IPD', 'View IPD', GETUTCDATE()),
(NEWID(), 'ipd.write', 'IPD.WRITE', 'IPD', 'Manage IPD', GETUTCDATE()),
(NEWID(), 'ipd.discharge', 'IPD.DISCHARGE', 'IPD', 'Discharge patients', GETUTCDATE()),
-- Billing permissions
(NEWID(), 'billing.read', 'BILLING.READ', 'Billing', 'View billing', GETUTCDATE()),
(NEWID(), 'billing.write', 'BILLING.WRITE', 'Billing', 'Create/edit invoices', GETUTCDATE()),
(NEWID(), 'billing.payments', 'BILLING.PAYMENTS', 'Billing', 'Record payments', GETUTCDATE()),
(NEWID(), 'billing.void', 'BILLING.VOID', 'Billing', 'Void invoices', GETUTCDATE()),
-- Reports permissions
(NEWID(), 'reports.read', 'REPORTS.READ', 'Reports', 'View reports', GETUTCDATE()),
(NEWID(), 'reports.export', 'REPORTS.EXPORT', 'Reports', 'Export reports', GETUTCDATE()),
-- Settings permissions
(NEWID(), 'settings.read', 'SETTINGS.READ', 'Settings', 'View settings', GETUTCDATE()),
(NEWID(), 'settings.write', 'SETTINGS.WRITE', 'Settings', 'Manage settings', GETUTCDATE()),
-- User management permissions
(NEWID(), 'users.read', 'USERS.READ', 'Users', 'View users', GETUTCDATE()),
(NEWID(), 'users.write', 'USERS.WRITE', 'Users', 'Manage users', GETUTCDATE()),
(NEWID(), 'roles.manage', 'ROLES.MANAGE', 'Roles', 'Manage roles', GETUTCDATE());

-- Assign all permissions to admin role
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT @AdminRoleId, Id FROM Permissions;

-- Create admin user (password: Admin@123)
-- Note: In production, use proper password hashing
INSERT INTO Users (Id, TenantId, Email, NormalizedEmail, PasswordHash, FirstName, LastName, IsActive, EmailConfirmed, CreatedAt)
VALUES (@AdminUserId, @TenantId, 'admin@cliniq.com', 'ADMIN@CLINIQ.COM',
        'AQAAAAIAAYagAAAAELXEp+qkXVNPCqYYd/hOvXl7L7HnMmZpQnlD0wEOXJGqPF+JmVnPDJGn0MkXA2WmWQ==', -- Admin@123
        'System', 'Administrator', 1, 1, GETUTCDATE());

-- Assign admin role to admin user
INSERT INTO UserRoles (UserId, RoleId)
VALUES (@AdminUserId, @AdminRoleId);

-- Create sample building
DECLARE @BuildingId UNIQUEIDENTIFIER = NEWID();
INSERT INTO Buildings (Id, TenantId, BranchId, Name, Code, Floors, IsActive, CreatedAt)
VALUES (@BuildingId, @TenantId, @BranchId, 'Main Building', 'MB', 5, 1, GETUTCDATE());

-- Create sample wards
DECLARE @GeneralWardId UNIQUEIDENTIFIER = NEWID();
DECLARE @ICUWardId UNIQUEIDENTIFIER = NEWID();
DECLARE @MaternityWardId UNIQUEIDENTIFIER = NEWID();

INSERT INTO Wards (Id, TenantId, BuildingId, Name, Code, WardType, Floor, TotalBeds, IsActive, CreatedAt) VALUES
(@GeneralWardId, @TenantId, @BuildingId, 'General Ward A', 'GWA', 0, 1, 20, 1, GETUTCDATE()),
(@ICUWardId, @TenantId, @BuildingId, 'Intensive Care Unit', 'ICU', 1, 2, 10, 1, GETUTCDATE()),
(@MaternityWardId, @TenantId, @BuildingId, 'Maternity Ward', 'MAT', 2, 3, 15, 1, GETUTCDATE());

-- Create sample rooms for General Ward
DECLARE @Room1Id UNIQUEIDENTIFIER = NEWID();
DECLARE @Room2Id UNIQUEIDENTIFIER = NEWID();

INSERT INTO Rooms (Id, TenantId, WardId, RoomNumber, RoomType, TotalBeds, DailyRate, IsActive, CreatedAt) VALUES
(@Room1Id, @TenantId, @GeneralWardId, 'GWA-101', 0, 4, 500, 1, GETUTCDATE()),
(@Room2Id, @TenantId, @GeneralWardId, 'GWA-102', 1, 2, 1000, 1, GETUTCDATE());

-- Create sample beds
INSERT INTO Beds (Id, TenantId, RoomId, BedNumber, Status, BedType, CreatedAt) VALUES
(NEWID(), @TenantId, @Room1Id, 'GWA-101-A', 0, 0, GETUTCDATE()),
(NEWID(), @TenantId, @Room1Id, 'GWA-101-B', 0, 0, GETUTCDATE()),
(NEWID(), @TenantId, @Room1Id, 'GWA-101-C', 0, 0, GETUTCDATE()),
(NEWID(), @TenantId, @Room1Id, 'GWA-101-D', 0, 0, GETUTCDATE()),
(NEWID(), @TenantId, @Room2Id, 'GWA-102-A', 0, 0, GETUTCDATE()),
(NEWID(), @TenantId, @Room2Id, 'GWA-102-B', 0, 0, GETUTCDATE());

-- Create sample departments
INSERT INTO Departments (Id, TenantId, BranchId, Name, Code, Description, IsActive, CreatedAt) VALUES
(NEWID(), @TenantId, @BranchId, 'General Medicine', 'GM', 'General medical care', 1, GETUTCDATE()),
(NEWID(), @TenantId, @BranchId, 'Cardiology', 'CARD', 'Heart and cardiovascular care', 1, GETUTCDATE()),
(NEWID(), @TenantId, @BranchId, 'Orthopedics', 'ORTH', 'Bone and joint care', 1, GETUTCDATE()),
(NEWID(), @TenantId, @BranchId, 'Pediatrics', 'PED', 'Child healthcare', 1, GETUTCDATE()),
(NEWID(), @TenantId, @BranchId, 'Gynecology', 'GYN', 'Women''s health', 1, GETUTCDATE()),
(NEWID(), @TenantId, @BranchId, 'Emergency', 'ER', 'Emergency services', 1, GETUTCDATE());

-- Create sample doctors
DECLARE @Doctor1UserId UNIQUEIDENTIFIER = NEWID();
DECLARE @Doctor1Id UNIQUEIDENTIFIER = NEWID();

INSERT INTO Users (Id, TenantId, Email, NormalizedEmail, PasswordHash, FirstName, LastName, IsActive, EmailConfirmed, CreatedAt)
VALUES (@Doctor1UserId, @TenantId, 'doctor@cliniq.com', 'DOCTOR@CLINIQ.COM',
        'AQAAAAIAAYagAAAAELXEp+qkXVNPCqYYd/hOvXl7L7HnMmZpQnlD0wEOXJGqPF+JmVnPDJGn0MkXA2WmWQ==', -- Admin@123
        'John', 'Smith', 1, 1, GETUTCDATE());

INSERT INTO UserRoles (UserId, RoleId)
VALUES (@Doctor1UserId, @DoctorRoleId);

INSERT INTO Doctors (Id, TenantId, UserId, EmployeeCode, FirstName, LastName, Specialization, Qualification, RegistrationNumber, ConsultationFee, IsActive, CreatedAt)
VALUES (@Doctor1Id, @TenantId, @Doctor1UserId, 'DOC001', 'John', 'Smith', 'General Medicine', 'MBBS, MD', 'REG-12345', 500, 1, GETUTCDATE());

-- Create doctor schedule
INSERT INTO DoctorSchedules (Id, TenantId, DoctorId, DayOfWeek, StartTime, EndTime, SlotDuration, IsActive, CreatedAt) VALUES
(NEWID(), @TenantId, @Doctor1Id, 1, '09:00:00', '17:00:00', 30, 1, GETUTCDATE()), -- Monday
(NEWID(), @TenantId, @Doctor1Id, 2, '09:00:00', '17:00:00', 30, 1, GETUTCDATE()), -- Tuesday
(NEWID(), @TenantId, @Doctor1Id, 3, '09:00:00', '17:00:00', 30, 1, GETUTCDATE()), -- Wednesday
(NEWID(), @TenantId, @Doctor1Id, 4, '09:00:00', '17:00:00', 30, 1, GETUTCDATE()), -- Thursday
(NEWID(), @TenantId, @Doctor1Id, 5, '09:00:00', '13:00:00', 30, 1, GETUTCDATE()); -- Friday

-- Create sample patients
INSERT INTO Patients (Id, TenantId, BranchId, MRN, FirstName, LastName, DateOfBirth, Gender, BloodGroup, Phone, Email, Address, IsActive, CreatedAt) VALUES
(NEWID(), @TenantId, @BranchId, 'MRN-0001', 'Alice', 'Johnson', '1985-03-15', 'Female', 'A+', '1111111111', 'alice@email.com', '456 Oak Street', 1, GETUTCDATE()),
(NEWID(), @TenantId, @BranchId, 'MRN-0002', 'Bob', 'Williams', '1978-07-22', 'Male', 'B+', '2222222222', 'bob@email.com', '789 Pine Avenue', 1, GETUTCDATE()),
(NEWID(), @TenantId, @BranchId, 'MRN-0003', 'Carol', 'Brown', '1992-11-08', 'Female', 'O-', '3333333333', 'carol@email.com', '321 Elm Drive', 1, GETUTCDATE()),
(NEWID(), @TenantId, @BranchId, 'MRN-0004', 'David', 'Davis', '1965-01-30', 'Male', 'AB+', '4444444444', 'david@email.com', '654 Maple Lane', 1, GETUTCDATE()),
(NEWID(), @TenantId, @BranchId, 'MRN-0005', 'Emma', 'Miller', '2010-05-12', 'Female', 'A-', '5555555555', 'emma@email.com', '987 Cedar Court', 1, GETUTCDATE());

-- Create service items for billing
INSERT INTO ServiceItems (Id, TenantId, Code, Name, Description, Category, UnitPrice, IsActive, CreatedAt) VALUES
(NEWID(), @TenantId, 'CONS-GEN', 'General Consultation', 'General physician consultation', 'Consultation', 500, 1, GETUTCDATE()),
(NEWID(), @TenantId, 'CONS-SPEC', 'Specialist Consultation', 'Specialist doctor consultation', 'Consultation', 1000, 1, GETUTCDATE()),
(NEWID(), @TenantId, 'LAB-CBC', 'Complete Blood Count', 'Full blood count test', 'Laboratory', 300, 1, GETUTCDATE()),
(NEWID(), @TenantId, 'LAB-LFT', 'Liver Function Test', 'Liver function panel', 'Laboratory', 500, 1, GETUTCDATE()),
(NEWID(), @TenantId, 'RAD-XRAY', 'X-Ray', 'Standard X-Ray imaging', 'Radiology', 400, 1, GETUTCDATE()),
(NEWID(), @TenantId, 'RAD-CT', 'CT Scan', 'Computed tomography scan', 'Radiology', 3000, 1, GETUTCDATE()),
(NEWID(), @TenantId, 'ROOM-GEN', 'General Ward - Per Day', 'General ward bed charges', 'Room', 500, 1, GETUTCDATE()),
(NEWID(), @TenantId, 'ROOM-PVT', 'Private Room - Per Day', 'Private room charges', 'Room', 2000, 1, GETUTCDATE()),
(NEWID(), @TenantId, 'ROOM-ICU', 'ICU - Per Day', 'ICU bed charges', 'Room', 5000, 1, GETUTCDATE());

-- Print summary
PRINT 'Seed data created successfully!';
PRINT 'Admin login: admin@cliniq.com / Admin@123';
PRINT 'Doctor login: doctor@cliniq.com / Admin@123';
PRINT 'Tenant ID: ' + CAST(@TenantId AS NVARCHAR(50));
PRINT 'Branch ID: ' + CAST(@BranchId AS NVARCHAR(50));
