using ClinIQ.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinIQ.Infrastructure.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260924000000_DeleteSystemRoles")]
    public partial class DeleteSystemRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Idempotent: safe if roles were already removed.
            // Drop user links to system roles, then the system role templates.
            // Permissions are assigned per-user going forward.
            migrationBuilder.Sql(@"
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'UserRoles')
AND EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Roles')
BEGIN
    DELETE ur
    FROM UserRoles ur
    INNER JOIN Roles r ON r.Id = ur.RoleId
    WHERE r.TenantId IS NULL AND r.IsSystemRole = 1;

    DELETE rp
    FROM RolePermissions rp
    INNER JOIN Roles r ON r.Id = rp.RoleId
    WHERE r.TenantId IS NULL AND r.IsSystemRole = 1;

    DELETE FROM Roles
    WHERE TenantId IS NULL AND IsSystemRole = 1;
END
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Data loss: system roles cannot be restored automatically.
        }
    }
}
