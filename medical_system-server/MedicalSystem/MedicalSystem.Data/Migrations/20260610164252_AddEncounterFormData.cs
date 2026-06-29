using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedicalSystem.Data.Migrations
{
    
    public partial class AddEncounterFormData : Migration
    {
        
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FormData",
                table: "Encounters",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PerformedByName",
                table: "BedActionLogs",
                type: "text",
                nullable: true);
        }

        
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FormData",
                table: "Encounters");

            migrationBuilder.DropColumn(
                name: "PerformedByName",
                table: "BedActionLogs");
        }
    }
}
