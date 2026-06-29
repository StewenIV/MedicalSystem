using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedicalSystem.Data.Migrations
{
    
    public partial class RemovePositionTable : Migration
    {
        
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "MedicalStaff",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.Sql("UPDATE \"MedicalStaff\" SET \"Position\" = (SELECT \"Name\" FROM \"Positions\" WHERE \"Positions\".\"Id\" = \"MedicalStaff\".\"PositionId\")");

            migrationBuilder.AlterColumn<string>(
                name: "Position",
                table: "MedicalStaff",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalStaff_Positions_PositionId",
                table: "MedicalStaff");

            migrationBuilder.DropTable(
                name: "Positions");

            migrationBuilder.DropIndex(
                name: "IX_MedicalStaff_PositionId",
                table: "MedicalStaff");

            migrationBuilder.DropColumn(
                name: "PositionId",
                table: "MedicalStaff");
        }

        
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Position",
                table: "MedicalStaff");

            migrationBuilder.AddColumn<Guid>(
                name: "PositionId",
                table: "MedicalStaff",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Positions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Positions", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicalStaff_PositionId",
                table: "MedicalStaff",
                column: "PositionId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalStaff_Positions_PositionId",
                table: "MedicalStaff",
                column: "PositionId",
                principalTable: "Positions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
