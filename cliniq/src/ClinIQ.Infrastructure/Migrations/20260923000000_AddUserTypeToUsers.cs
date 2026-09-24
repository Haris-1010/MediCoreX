using ClinIQ.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinIQ.Infrastructure.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260923000000_AddUserTypeToUsers")]
    public partial class AddUserTypeToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Idempotent: column may already exist if it was added manually.
            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.Users', 'UserType') IS NULL
    ALTER TABLE dbo.Users ADD [UserType] nvarchar(max) NULL;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.Users', 'UserType') IS NOT NULL
    ALTER TABLE dbo.Users DROP COLUMN [UserType];
");
        }
    }
}
