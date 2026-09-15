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

-- Create service categories
DECLARE @CatConsultation UNIQUEIDENTIFIER = NEWID();
DECLARE @CatLaboratory UNIQUEIDENTIFIER = NEWID();
DECLARE @CatRadiology UNIQUEIDENTIFIER = NEWID();
DECLARE @CatRoom UNIQUEIDENTIFIER = NEWID();
DECLARE @CatSurgery UNIQUEIDENTIFIER = NEWID();
DECLARE @CatDiagnostic UNIQUEIDENTIFIER = NEWID();

INSERT INTO ServiceCategories (Id, TenantId, Name, Code, Description, IsActive, DisplayOrder, CreatedAt) VALUES
(@CatConsultation, @TenantId, 'Consultation', 'CONS', 'Doctor consultations', 1, 10, GETUTCDATE()),
(@CatLaboratory, @TenantId, 'Laboratory', 'LAB', 'Lab tests and investigations', 1, 20, GETUTCDATE()),
(@CatRadiology, @TenantId, 'Radiology', 'RAD', 'Imaging and radiology services', 1, 30, GETUTCDATE()),
(@CatRoom, @TenantId, 'Room & Bed', 'ROOM', 'Room and bed charges', 1, 40, GETUTCDATE()),
(@CatSurgery, @TenantId, 'Surgery', 'SURG', 'Surgical procedures', 1, 50, GETUTCDATE()),
(@CatDiagnostic, @TenantId, 'Diagnostic', 'DX', 'Diagnostic procedures', 1, 60, GETUTCDATE());

-- Create service items for billing
INSERT INTO Services (Id, TenantId, Code, Name, Description, CategoryId, Price, TaxPercent, IsActive, DisplayOrder, CreatedAt) VALUES
-- Consultation services
(NEWID(), @TenantId, 'CONS-GEN', 'General Consultation', 'General physician consultation', @CatConsultation, 500, 0, 1, 10, GETUTCDATE()),
(NEWID(), @TenantId, 'CONS-SPEC', 'Specialist Consultation', 'Specialist doctor consultation', @CatConsultation, 1000, 0, 1, 20, GETUTCDATE()),
(NEWID(), @TenantId, 'CONS-EMER', 'Emergency Consultation', 'Emergency department consultation', @CatConsultation, 1500, 0, 1, 30, GETUTCDATE()),
(NEWID(), @TenantId, 'CONS-FOLL', 'Follow-up Consultation', 'Follow-up visit consultation', @CatConsultation, 300, 0, 1, 40, GETUTCDATE()),
(NEWID(), @TenantId, 'CONS-TELE', 'Telemedicine Consultation', 'Virtual/online consultation', @CatConsultation, 400, 0, 1, 50, GETUTCDATE()),
-- Laboratory services
(NEWID(), @TenantId, 'LAB-CBC', 'Complete Blood Count', 'Full blood count test', @CatLaboratory, 300, 18, 1, 10, GETUTCDATE()),
(NEWID(), @TenantId, 'LAB-LFT', 'Liver Function Test', 'Liver function panel', @CatLaboratory, 500, 18, 1, 20, GETUTCDATE()),
(NEWID(), @TenantId, 'LAB-RFT', 'Renal Function Test', 'Kidney function panel', @CatLaboratory, 500, 18, 1, 30, GETUTCDATE()),
(NEWID(), @TenantId, 'LAB-LIPID', 'Lipid Profile', 'Cholesterol and lipid panel', @CatLaboratory, 400, 18, 1, 40, GETUTCDATE()),
(NEWID(), @TenantId, 'LAB-THY', 'Thyroid Profile', 'T3, T4, TSH test', @CatLaboratory, 600, 18, 1, 50, GETUTCDATE()),
(NEWID(), @TenantId, 'LAB-GLU', 'Blood Glucose', 'Fasting/random blood sugar', @CatLaboratory, 100, 18, 1, 60, GETUTCDATE()),
(NEWID(), @TenantId, 'LAB-HBA1C', 'HbA1c', 'Glycated hemoglobin', @CatLaboratory, 500, 18, 1, 70, GETUTCDATE()),
(NEWID(), @TenantId, 'LAB-UA', 'Urinalysis', 'Complete urine examination', @CatLaboratory, 150, 18, 1, 80, GETUTCDATE()),
(NEWID(), @TenantId, 'LAB-STOOL', 'Stool Examination', 'Routine stool analysis', @CatLaboratory, 100, 18, 1, 90, GETUTCDATE()),
(NEWID(), @TenantId, 'LAB-PT', 'Prothrombin Time', 'Coagulation profile', @CatLaboratory, 350, 18, 1, 100, GETUTCDATE()),
-- Radiology services
(NEWID(), @TenantId, 'RAD-XRAY', 'X-Ray', 'Standard X-Ray imaging', @CatRadiology, 400, 18, 1, 10, GETUTCDATE()),
(NEWID(), @TenantId, 'RAD-CT', 'CT Scan', 'Computed tomography scan', @CatRadiology, 3000, 18, 1, 20, GETUTCDATE()),
(NEWID(), @TenantId, 'RAD-MRI', 'MRI Scan', 'Magnetic resonance imaging', @CatRadiology, 5000, 18, 1, 30, GETUTCDATE()),
(NEWID(), @TenantId, 'RAD-USG', 'Ultrasound', 'Ultrasonography', @CatRadiology, 800, 18, 1, 40, GETUTCDATE()),
(NEWID(), @TenantId, 'RAD-MAMMO', 'Mammography', 'Breast X-Ray screening', @CatRadiology, 1200, 18, 1, 50, GETUTCDATE()),
(NEWID(), @TenantId, 'RAD-DXA', 'DEXA Scan', 'Bone density scan', @CatRadiology, 2000, 18, 1, 60, GETUTCDATE()),
(NEWID(), @TenantId, 'RAD-ECHO', 'Echocardiography', 'Cardiac ultrasound', @CatRadiology, 1500, 18, 1, 70, GETUTCDATE()),
(NEWID(), @TenantId, 'RAD-TMT', 'Treadmill Test', 'Cardiac stress test', @CatRadiology, 1000, 18, 1, 80, GETUTCDATE()),
-- Room & bed charges
(NEWID(), @TenantId, 'ROOM-GEN', 'General Ward - Per Day', 'General ward bed charges', @CatRoom, 500, 0, 1, 10, GETUTCDATE()),
(NEWID(), @TenantId, 'ROOM-PVT', 'Private Room - Per Day', 'Private room charges', @CatRoom, 2000, 0, 1, 20, GETUTCDATE()),
(NEWID(), @TenantId, 'ROOM-ICU', 'ICU - Per Day', 'ICU bed charges', @CatRoom, 5000, 0, 1, 30, GETUTCDATE()),
(NEWID(), @TenantId, 'ROOM-CCU', 'CCU - Per Day', 'Cardiac care unit charges', @CatRoom, 4500, 0, 1, 40, GETUTCDATE()),
(NEWID(), @TenantId, 'ROOM-EMER', 'Emergency Bed - Per Day', 'Emergency observation bed', @CatRoom, 1000, 0, 1, 50, GETUTCDATE()),
-- Surgery services
(NEWID(), @TenantId, 'SURG-APPEND', 'Appendectomy', 'Appendix removal surgery', @CatSurgery, 15000, 18, 1, 10, GETUTCDATE()),
(NEWID(), @TenantId, 'SURG-CHOLE', 'Cholecystectomy', 'Gallbladder removal surgery', @CatSurgery, 20000, 18, 1, 20, GETUTCDATE()),
(NEWID(), @TenantId, 'SURG-HERNIA', 'Hernia Repair', 'Hernia surgery', @CatSurgery, 12000, 18, 1, 30, GETUTCDATE()),
(NEWID(), @TenantId, 'SURG-KNEE', 'Knee Arthroscopy', 'Knee joint surgery', @CatSurgery, 25000, 18, 1, 40, GETUTCDATE()),
(NEWID(), @TenantId, 'SURG-CATARACT', 'Cataract Surgery', 'Cataract removal and lens implant', @CatSurgery, 18000, 18, 1, 50, GETUTCDATE()),
-- Diagnostic services
(NEWID(), @TenantId, 'DX-ECG', 'ECG', 'Electrocardiogram', @CatDiagnostic, 200, 0, 1, 10, GETUTCDATE()),
(NEWID(), @TenantId, 'DX-EEG', 'EEG', 'Electroencephalogram', @CatDiagnostic, 1500, 18, 1, 20, GETUTCDATE()),
(NEWID(), @TenantId, 'DX-PFT', 'Pulmonary Function Test', 'Lung function test', @CatDiagnostic, 800, 18, 1, 30, GETUTCDATE()),
(NEWID(), @TenantId, 'DX-ABI', 'Ankle Brachial Index', 'Peripheral vascular test', @CatDiagnostic, 600, 18, 1, 40, GETUTCDATE());

-- Print summary
PRINT 'Seed data created successfully!';
PRINT 'Admin login: admin@cliniq.com / Admin@123';
PRINT 'Doctor login: doctor@cliniq.com / Admin@123';
PRINT 'Tenant ID: ' + CAST(@TenantId AS NVARCHAR(50));
PRINT 'Branch ID: ' + CAST(@BranchId AS NVARCHAR(50));
