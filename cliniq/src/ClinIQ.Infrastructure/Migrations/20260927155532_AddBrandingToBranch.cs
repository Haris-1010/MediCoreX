using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinIQ.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBrandingToBranch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "Branches",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "Branches",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "Branches");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "Branches");
        }
    }
}
