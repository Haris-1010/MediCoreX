using ClinIQ.Domain.Entities;
using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Entities.Inventory;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.Infrastructure.Data.Configurations;

/// <summary>
/// Indexes backing the audit trail and the reporting module. Every audit and
/// report query filters by tenant + a date range (and often location), so each
/// index leads with TenantId and ends with the date column the query ranges on.
/// Only tables a report or the audit screen actually ranges over are listed.
/// </summary>
internal static class ReportingIndexes
{
    public static void Apply(ModelBuilder modelBuilder)
    {
        // Audit trail: list/sort by time, filter by location, user, record.
        modelBuilder.Entity<AuditLog>(b =>
        {
            b.HasIndex(a => new { a.TenantId, a.Timestamp }).HasDatabaseName("IX_AuditLogs_Tenant_Timestamp");
            b.HasIndex(a => new { a.TenantId, a.BranchId, a.Timestamp }).HasDatabaseName("IX_AuditLogs_Tenant_Branch_Timestamp");
            b.HasIndex(a => new { a.TenantId, a.UserId, a.Timestamp }).HasDatabaseName("IX_AuditLogs_Tenant_User_Timestamp");
            b.HasIndex(a => new { a.TenantId, a.EntityType, a.EntityId }).HasDatabaseName("IX_AuditLogs_Tenant_Entity");
        });

        // Report date ranges.
        modelBuilder.Entity<Patient>().HasIndex(p => new { p.TenantId, p.CreatedAt }).HasDatabaseName("IX_Patients_Tenant_CreatedAt");
        modelBuilder.Entity<Appointment>().HasIndex(a => new { a.TenantId, a.AppointmentDate }).HasDatabaseName("IX_Appointments_Tenant_Date");
        modelBuilder.Entity<Visit>().HasIndex(v => new { v.TenantId, v.VisitDate }).HasDatabaseName("IX_Visits_Tenant_Date");
        modelBuilder.Entity<Admission>().HasIndex(a => new { a.TenantId, a.AdmissionDate }).HasDatabaseName("IX_Admissions_Tenant_Date");
        modelBuilder.Entity<Invoice>().HasIndex(i => new { i.TenantId, i.InvoiceDate }).HasDatabaseName("IX_Invoices_Tenant_Date");
        modelBuilder.Entity<Payment>().HasIndex(p => new { p.TenantId, p.PaymentDate }).HasDatabaseName("IX_Payments_Tenant_Date");
        modelBuilder.Entity<StockMovement>().HasIndex(m => new { m.TenantId, m.MovementDate }).HasDatabaseName("IX_StockMovements_Tenant_Date");
        modelBuilder.Entity<PurchaseOrder>().HasIndex(p => new { p.TenantId, p.OrderDate }).HasDatabaseName("IX_PurchaseOrders_Tenant_Date");
        modelBuilder.Entity<StockBatch>().HasIndex(b => new { b.TenantId, b.ExpiryDate }).HasDatabaseName("IX_StockBatches_Tenant_Expiry");
    }
}
