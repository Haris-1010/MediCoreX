using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinIQ.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditReportingIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Visits_Tenant_Date",
                table: "Visits",
                columns: new[] { "TenantId", "VisitDate" });

            migrationBuilder.CreateIndex(
                name: "IX_StockMovements_Tenant_Date",
                table: "StockMovements",
                columns: new[] { "TenantId", "MovementDate" });

            migrationBuilder.CreateIndex(
                name: "IX_StockBatches_Tenant_Expiry",
                table: "StockBatches",
                columns: new[] { "TenantId", "ExpiryDate" });

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrders_Tenant_Date",
                table: "PurchaseOrders",
                columns: new[] { "TenantId", "OrderDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_Tenant_Date",
                table: "Payments",
                columns: new[] { "TenantId", "PaymentDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Patients_Tenant_CreatedAt",
                table: "Patients",
                columns: new[] { "TenantId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_Tenant_Date",
                table: "Invoices",
                columns: new[] { "TenantId", "InvoiceDate" });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Tenant_Branch_Timestamp",
                table: "AuditLogs",
                columns: new[] { "TenantId", "BranchId", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Tenant_Entity",
                table: "AuditLogs",
                columns: new[] { "TenantId", "EntityType", "EntityId" });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Tenant_Timestamp",
                table: "AuditLogs",
                columns: new[] { "TenantId", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Tenant_User_Timestamp",
                table: "AuditLogs",
                columns: new[] { "TenantId", "UserId", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_Tenant_Date",
                table: "Appointments",
                columns: new[] { "TenantId", "AppointmentDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Admissions_Tenant_Date",
                table: "Admissions",
                columns: new[] { "TenantId", "AdmissionDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Visits_Tenant_Date",
                table: "Visits");

            migrationBuilder.DropIndex(
                name: "IX_StockMovements_Tenant_Date",
                table: "StockMovements");

            migrationBuilder.DropIndex(
                name: "IX_StockBatches_Tenant_Expiry",
                table: "StockBatches");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseOrders_Tenant_Date",
                table: "PurchaseOrders");

            migrationBuilder.DropIndex(
                name: "IX_Payments_Tenant_Date",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Patients_Tenant_CreatedAt",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Invoices_Tenant_Date",
                table: "Invoices");

            migrationBuilder.DropIndex(
                name: "IX_AuditLogs_Tenant_Branch_Timestamp",
                table: "AuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AuditLogs_Tenant_Entity",
                table: "AuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AuditLogs_Tenant_Timestamp",
                table: "AuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AuditLogs_Tenant_User_Timestamp",
                table: "AuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_Tenant_Date",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Admissions_Tenant_Date",
                table: "Admissions");
        }
    }
}
