using ClinIQ.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinIQ.Infrastructure.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260927000000_AddIsMasterToUsers")]
    public partial class AddIsMasterToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.Users', 'IsMaster') IS NULL
BEGIN
    ALTER TABLE dbo.Users ADD [IsMaster] bit NOT NULL CONSTRAINT DF_Users_IsMaster DEFAULT(0);

    -- First super admin becomes the master owner.
    UPDATE TOP (1) dbo.Users SET IsMaster = 1
    WHERE IsSuperAdmin = 1 AND IsDeleted = 0
    ORDER BY CreatedAt;
END
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.Users', 'IsMaster') IS NOT NULL
    ALTER TABLE dbo.Users DROP COLUMN [IsMaster];
");
        }
    }
}
