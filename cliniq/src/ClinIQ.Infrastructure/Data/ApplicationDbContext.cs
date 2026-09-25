using System.Text.Json;
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
    public bool CurrentHasAllLocationAccess => _tenantService.HasAllLocationAccess();

    /// <summary>
    /// Combines tenant isolation, soft delete, and location (branch) scope into
    /// a single expression. CRITICAL: EF Core only applies the LAST HasQueryFilter
    /// per entity. If we call HasQueryFilter multiple times, the last overwrites
    /// the previous. This method combines all conditions with AND so they are
    /// always active.
    ///
    /// Branch scope (IBranchEntity only):
    ///   HasAllLocationAccess OR (CurrentBranchId != null AND BranchId == CurrentBranchId)
    /// Fail closed when neither All Locations nor a specific branch is resolved.
    /// </summary>
    private void ApplyCombinedQueryFilters(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var clrType = entityType.ClrType;
            var isTenantEntity = typeof(ITenantEntity).IsAssignableFrom(clrType);
            var isBranchEntity = typeof(IBranchEntity).IsAssignableFrom(clrType);
            var isSoftDeletable = typeof(BaseAuditableEntity).IsAssignableFrom(clrType);

            if (!isTenantEntity && !isSoftDeletable && !isBranchEntity)
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

            // Location scope for branch-scoped operational entities.
            if (isBranchEntity)
            {
                var ctxConst = System.Linq.Expressions.Expression.Constant(this);

                var allLocationsProperty = System.Linq.Expressions.Expression.Property(
                    ctxConst, nameof(CurrentHasAllLocationAccess));
                var currentBranchProperty = System.Linq.Expressions.Expression.Property(
                    ctxConst, nameof(CurrentBranchId));
                var branchProperty = System.Linq.Expressions.Expression.Property(
                    parameter, nameof(IBranchEntity.BranchId));

                // CurrentBranchId != null AND BranchId == CurrentBranchId
                var currentBranchNotNull = System.Linq.Expressions.Expression.NotEqual(
                    currentBranchProperty,
                    System.Linq.Expressions.Expression.Constant(null, typeof(Guid?)));
                var branchMatches = System.Linq.Expressions.Expression.Equal(
                    branchProperty, currentBranchProperty);
                var scopedToBranch = System.Linq.Expressions.Expression.AndAlso(
                    currentBranchNotNull, branchMatches);

                // HasAllLocationAccess OR scopedToBranch
                var branchCondition = System.Linq.Expressions.Expression.OrElse(
                    allLocationsProperty, scopedToBranch);

                combinedCondition = combinedCondition is null
                    ? branchCondition
                    : System.Linq.Expressions.Expression.AndAlso(combinedCondition, branchCondition);
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

        // Business audit capture. Runs after tenant/location stamping so every
        // row carries the final TenantId/BranchId of the entity it describes.
        CaptureAuditEntries();

        return await base.SaveChangesAsync(cancellationToken);
    }

    private static readonly JsonSerializerOptions AuditJsonOptions = new();

    /// <summary>
    /// Turns changes to audited entity types (see <see cref="AuditPolicy"/>)
    /// into AuditLog rows in the SAME SaveChanges transaction.
    ///
    /// Deliberate constraints:
    ///   - no audit when there is no HTTP request and no user (startup seeding),
    ///   - secrets and clinical free text never serialised (AuditPolicy),
    ///   - UPDATE rows are skipped when only bookkeeping columns changed,
    ///   - AuditLog itself is not in the policy map, so this can never recurse.
    /// </summary>
    private void CaptureAuditEntries()
    {
        if (AuditCapture.Suppressed) return;

        var info = AuditContext.Info;
        var currentUserId = _currentUserService.UserId;
        if (info is null && currentUserId is null) return;

        List<AuditLog>? rows = null;
        Dictionary<Guid, string>? branchNames = null;
        var now = _dateTimeService.UtcNow;

        // Entries() runs DetectChanges, so IsModified is populated below.
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State is not (EntityState.Added or EntityState.Modified or EntityState.Deleted))
                continue;

            var entityType = entry.Entity.GetType();
            var policy = AuditPolicy.For(entityType);
            if (policy is null) continue;

            var oldValues = new Dictionary<string, object?>();
            var newValues = new Dictionary<string, object?>();
            var changedFields = new List<string>();
            string action;

            if (entry.State == EntityState.Added)
            {
                action = "CREATE";
                foreach (var prop in entry.Properties)
                {
                    if (!IsCapturable(prop.Metadata.Name, prop.Metadata.ClrType)) continue;
                    var value = NormalizeAuditValue(prop.CurrentValue);
                    if (value is null) continue;
                    newValues[prop.Metadata.Name] = value;
                }
            }
            else if (entry.State == EntityState.Deleted)
            {
                action = "DELETE";
                foreach (var prop in entry.Properties)
                {
                    if (!IsCapturable(prop.Metadata.Name, prop.Metadata.ClrType)) continue;
                    var value = NormalizeAuditValue(prop.OriginalValue);
                    if (value is null) continue;
                    oldValues[prop.Metadata.Name] = value;
                }
            }
            else
            {
                action = "UPDATE";
                var isDeletedProp = entry.Properties.FirstOrDefault(p =>
                    p.Metadata.Name == nameof(BaseAuditableEntity.IsDeleted));

                if (isDeletedProp is { IsModified: true })
                {
                    var nowDeleted = isDeletedProp.CurrentValue is true;
                    var wasDeleted = isDeletedProp.OriginalValue is true;
                    if (nowDeleted && !wasDeleted) action = "SOFT_DELETE";
                    else if (!nowDeleted && wasDeleted) action = "RESTORE";
                }

                foreach (var prop in entry.Properties)
                {
                    if (!IsCapturable(prop.Metadata.Name, prop.Metadata.ClrType)) continue;
                    if (!prop.IsModified && Equals(prop.OriginalValue, prop.CurrentValue)) continue;

                    var before = NormalizeAuditValue(prop.OriginalValue);
                    var after = NormalizeAuditValue(prop.CurrentValue);
                    changedFields.Add(prop.Metadata.Name);
                    oldValues[prop.Metadata.Name] = before;
                    newValues[prop.Metadata.Name] = after;
                }

                // Nothing worth recording (e.g. only UpdatedAt/RowVersion moved).
                if (changedFields.Count == 0) continue;
            }

            // ---- who / where ----
            var tenantId = (entry.Entity as ITenantEntity)?.TenantId
                           ?? _tenantService.GetCurrentTenantId();

            Guid? branchId = policy.Location switch
            {
                AuditLocationScope.Organization => null,
                AuditLocationScope.Ambient => _tenantService.GetCurrentBranchId(),
                _ => entry.Entity is IBranchEntity branchEntity
                    ? branchEntity.BranchId
                    : _tenantService.GetCurrentBranchId(),
            };

            string? locationName = null;
            if (branchId.HasValue)
            {
                branchNames ??= new Dictionary<Guid, string>();
                if (!branchNames.TryGetValue(branchId.Value, out locationName))
                {
                    locationName = Branches.IgnoreQueryFilters()
                        .Where(b => b.Id == branchId.Value)
                        .Select(b => b.Name)
                        .FirstOrDefault();
                    branchNames[branchId.Value] = locationName ?? string.Empty;
                }
                if (locationName == string.Empty) locationName = null;
            }

            var label = AuditPolicy.DescribeEntity(entry.Entity, newValues.Count > 0 ? newValues : oldValues);
            var entityId = entry.Entity is BaseEntity keyed ? keyed.Id.ToString() : null;

            rows ??= new List<AuditLog>();
            rows.Add(new AuditLog
            {
                Id = Guid.NewGuid(),
                CreatedAt = now,
                CreatedBy = currentUserId,
                RowVersion = Array.Empty<byte>(),
                Timestamp = now,
                TenantId = tenantId,
                BranchId = branchId,
                LocationName = locationName,
                UserId = currentUserId,
                UserName = _currentUserService.FullName,
                UserEmail = _currentUserService.Email,
                Action = action,
                Module = policy.Module,
                EntityType = policy.EntityLabel,
                EntityId = entityId,
                EntityName = label ?? policy.EntityLabel,
                Description = BuildAuditDescription(action, policy.EntityLabel, label, changedFields.Count),
                OldValues = oldValues.Count > 0 ? JsonSerializer.Serialize(oldValues, AuditJsonOptions) : null,
                NewValues = newValues.Count > 0 ? JsonSerializer.Serialize(newValues, AuditJsonOptions) : null,
                AffectedColumns = changedFields.Count > 0 ? JsonSerializer.Serialize(changedFields) : null,
                Success = true,
                IpAddress = info?.IpAddress,
                UserAgent = info?.UserAgent,
                RequestPath = info?.RequestPath,
                RequestMethod = info?.RequestMethod,
                CorrelationId = info?.CorrelationId,
            });
        }

        if (rows is { Count: > 0 })
            AuditLogs.AddRange(rows);
    }

    private static bool IsCapturable(string fieldName, Type clrType) =>
        clrType != typeof(byte[]) && AuditPolicy.IsAuditableField(fieldName);

    private static object? NormalizeAuditValue(object? value) => value switch
    {
        null => null,
        bool or byte or sbyte or short or ushort or int or uint or long or ulong
            or float or double or decimal or string => value,
        Guid guid => guid.ToString(),
        DateTime dateTime => dateTime.ToString("yyyy-MM-dd HH:mm:ss"),
        DateTimeOffset dateTimeOffset => dateTimeOffset.ToString("yyyy-MM-dd HH:mm:ss zzz"),
        TimeSpan timeSpan => timeSpan.ToString(),
        Enum enumValue => enumValue.ToString(),
        _ => value.ToString(),
    };

    private static string BuildAuditDescription(string action, string entityLabel, string? label, int changeCount)
    {
        var subject = label ?? entityLabel;
        return action switch
        {
            "CREATE" => $"{entityLabel} created: {subject}",
            "UPDATE" => $"{entityLabel} updated: {subject} ({changeCount} field{(changeCount == 1 ? "" : "s")})",
            "SOFT_DELETE" => $"{entityLabel} deleted: {subject}",
            "RESTORE" => $"{entityLabel} restored: {subject}",
            "DELETE" => $"{entityLabel} permanently deleted: {subject}",
            _ => $"{entityLabel}: {action}",
        };
    }
}
