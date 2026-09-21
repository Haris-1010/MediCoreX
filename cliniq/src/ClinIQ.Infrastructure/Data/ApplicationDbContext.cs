using ClinIQ.Domain.Common;
using ClinIQ.Domain.Entities;
using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Entities.Facility;
using ClinIQ.Domain.Entities.Identity;
using ClinIQ.Domain.Entities.Insurance;
using ClinIQ.Domain.Entities.Inventory;
using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    private readonly ITenantService _tenantService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeService _dateTimeService;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        ITenantService tenantService,
        ICurrentUserService currentUserService,
        IDateTimeService dateTimeService) : base(options)
    {
        _tenantService = tenantService;
        _currentUserService = currentUserService;
        _dateTimeService = dateTimeService;
    }

    // Identity
    public DbSet<ApplicationUser> Users => Set<ApplicationUser>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<UserPermission> UserPermissions => Set<UserPermission>();

    // Tenancy
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Branch> Branches => Set<Branch>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<TenantUser> TenantUsers => Set<TenantUser>();
    public DbSet<BranchUser> BranchUsers => Set<BranchUser>();
    public DbSet<TenantEntitlement> TenantEntitlements => Set<TenantEntitlement>();
    public DbSet<TenantLimit> TenantLimits => Set<TenantLimit>();

    // Clinical
    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<PatientCategory> PatientCategories => Set<PatientCategory>();
    public DbSet<PatientDocument> PatientDocuments => Set<PatientDocument>();
    public DbSet<PatientInsurance> PatientInsurances => Set<PatientInsurance>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Visit> Visits => Set<Visit>();
    public DbSet<Vital> Vitals => Set<Vital>();
    public DbSet<Prescription> Prescriptions => Set<Prescription>();
    public DbSet<PrescriptionItem> PrescriptionItems => Set<PrescriptionItem>();
    public DbSet<Admission> Admissions => Set<Admission>();
    public DbSet<MedicalOrder> MedicalOrders => Set<MedicalOrder>();
    public DbSet<NursingNote> NursingNotes => Set<NursingNote>();
    public DbSet<Queue> Queues => Set<Queue>();
    public DbSet<EmergencyVisit> EmergencyVisits => Set<EmergencyVisit>();
    // Doctor schedules / availability
    public DbSet<DoctorSchedule> DoctorSchedules => Set<DoctorSchedule>();

    // Laboratory & Radiology
    public DbSet<LabTestParameter> LabTestParameters => Set<LabTestParameter>();
    public DbSet<LabOrderItem> LabOrderItems => Set<LabOrderItem>();
    public DbSet<LabResultParameter> LabResultParameters => Set<LabResultParameter>();
    public DbSet<RadiologyOrderItem> RadiologyOrderItems => Set<RadiologyOrderItem>();

    // Facility
    public DbSet<Building> Buildings => Set<Building>();
    public DbSet<Floor> Floors => Set<Floor>();
    public DbSet<Ward> Wards => Set<Ward>();    
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Bed> Beds => Set<Bed>();
    public DbSet<BedAllocation> BedAllocations => Set<BedAllocation>();

    // Billing
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceItem> InvoiceItems => Set<InvoiceItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<ServiceCategory> ServiceCategories => Set<ServiceCategory>();
    public DbSet<TaxConfiguration> TaxConfigurations => Set<TaxConfiguration>();
    public DbSet<Discount> Discounts => Set<Discount>();

    // Insurance
    public DbSet<InsuranceCompany> InsuranceCompanies => Set<InsuranceCompany>();
    public DbSet<InsurancePlan> InsurancePlans => Set<InsurancePlan>();
    public DbSet<InsuranceClaim> InsuranceClaims => Set<InsuranceClaim>();
    public DbSet<CorporateClient> CorporateClients => Set<CorporateClient>();

    // Inventory
    public DbSet<Item> Items => Set<Item>();
    public DbSet<ItemCategory> ItemCategories => Set<ItemCategory>();
    public DbSet<Manufacturer> Manufacturers => Set<Manufacturer>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();
    public DbSet<StockBatch> StockBatches => Set<StockBatch>();
    public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();
    public DbSet<PurchaseOrderItem> PurchaseOrderItems => Set<PurchaseOrderItem>();
    public DbSet<GoodsReceipt> GoodsReceipts => Set<GoodsReceipt>();
    public DbSet<GoodsReceiptItem> GoodsReceiptItems => Set<GoodsReceiptItem>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();
    public DbSet<StockTransfer> StockTransfers => Set<StockTransfer>();
    public DbSet<StockTransferItem> StockTransferItems => Set<StockTransferItem>();

    // System
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all configurations from assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // The existing database has a mixed schema: only these tables use a
        // SQL Server timestamp; the other inherited RowVersion columns are
        // required varbinary values and must be inserted normally.
        var timestampTables = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "BedAllocations", "Beds", "DoctorSchedules", "Invoices", "Patients",
            "Payments", "TenantEntitlements", "TenantLimits", "Tenants", "UserPermissions",
            "LabOrderItems", "LabTestParameters", "LabResultParameters", "RadiologyOrderItems"
        };

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var rowVersion = entityType.FindProperty(nameof(BaseEntity.RowVersion));
            if (rowVersion is not null && timestampTables.Contains(entityType.GetTableName() ?? string.Empty))
            {
                modelBuilder.Entity(entityType.ClrType)
                    .Property<byte[]>(nameof(BaseEntity.RowVersion))
                    .IsRowVersion()
                    .IsConcurrencyToken();
            }
        }

        // CRITICAL: EF Core only applies the LAST HasQueryFilter per entity.
        // We must combine tenant isolation and soft delete into a single expression
        // to ensure both filters are applied. Calling HasQueryFilter twice would
        // cause the second filter to overwrite the first, breaking tenant isolation.
        ApplyCombinedQueryFilters(modelBuilder);
    }

    public Guid? CurrentTenantId => _tenantService.GetCurrentTenantId();
    public Guid? CurrentBranchId => _tenantService.GetCurrentBranchId();

    /// <summary>
    /// Combines both tenant isolation and soft delete filters into a single expression.
    /// CRITICAL: EF Core only applies the LAST HasQueryFilter per entity. If we call
    /// HasQueryFilter twice (once for tenant, once for soft delete), the second overwrites
    /// the first. This method combines both conditions with AND so both are always active.
    /// </summary>
    private void ApplyCombinedQueryFilters(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var clrType = entityType.ClrType;
            var isTenantEntity = typeof(ITenantEntity).IsAssignableFrom(clrType);
            var isSoftDeletable = typeof(BaseAuditableEntity).IsAssignableFrom(clrType);

            if (!isTenantEntity && !isSoftDeletable)
                continue;

            var parameter = System.Linq.Expressions.Expression.Parameter(clrType, "e");
            System.Linq.Expressions.Expression? combinedCondition = null;

            // Add tenant filter: TenantId == CurrentTenantId
            if (isTenantEntity)
            {
                var tenantProperty = System.Linq.Expressions.Expression.Property(parameter, nameof(ITenantEntity.TenantId));
                var contextProperty = System.Linq.Expressions.Expression.Property(
                    System.Linq.Expressions.Expression.Constant(this),
                    nameof(CurrentTenantId));

                // FAIL CLOSED: when no tenant context is resolved, tenant-scoped
                // rows must never leak across organizations. A NULL @ctx matches
                // no rows, so this is safe. Super-admin platform views and
                // cross-tenant operations already use IgnoreQueryFilters() explicitly.
                combinedCondition = System.Linq.Expressions.Expression.Equal(tenantProperty, contextProperty);
            }

            // Add soft delete filter: IsDeleted == false
            if (isSoftDeletable)
            {
                var isDeletedProperty = System.Linq.Expressions.Expression.Property(parameter, nameof(BaseAuditableEntity.IsDeleted));
                var notDeletedCondition = System.Linq.Expressions.Expression.Equal(
                    isDeletedProperty,
                    System.Linq.Expressions.Expression.Constant(false));

                combinedCondition = combinedCondition is null
                    ? notDeletedCondition
                    : System.Linq.Expressions.Expression.AndAlso(combinedCondition, notDeletedCondition);
            }

            if (combinedCondition is not null)
            {
                var lambda = System.Linq.Expressions.Expression.Lambda(combinedCondition, parameter);
                modelBuilder.Entity(clrType).HasQueryFilter(lambda);
            }
        }
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.Id = entry.Entity.Id == Guid.Empty ? Guid.NewGuid() : entry.Entity.Id;
                    entry.Entity.CreatedAt = _dateTimeService.UtcNow;
                    entry.Entity.CreatedBy = _currentUserService.UserId;
                    if (entry.Entity.RowVersion is null)
                        entry.Entity.RowVersion = Array.Empty<byte>();
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = _dateTimeService.UtcNow;
                    entry.Entity.UpdatedBy = _currentUserService.UserId;
                    break;
            }
        }

        foreach (var entry in ChangeTracker.Entries<ITenantEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                var tenantId = _tenantService.GetCurrentTenantId();
                if (tenantId.HasValue)
                {
                    entry.Entity.TenantId = tenantId.Value;
                }
            }
        }

        foreach (var entry in ChangeTracker.Entries<IBranchEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                var branchId = _tenantService.GetCurrentBranchId();
                if (branchId.HasValue)
                {
                    entry.Entity.BranchId = branchId.Value;
                }
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
