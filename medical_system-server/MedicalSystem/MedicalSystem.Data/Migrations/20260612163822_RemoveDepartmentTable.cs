using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedicalSystem.Data.Migrations
{
    
    public partial class RemoveDepartmentTable : Migration
    {
        
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalStaff_Departments_DepartmentId",
                table: "MedicalStaff");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_Departments_DepartmentId",
                table: "Patients");

            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_Departments_DepartmentId",
                table: "Rooms");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_DepartmentId",
                table: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_Patients_DepartmentId",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_MedicalStaff_DepartmentId",
                table: "MedicalStaff");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "MedicalStaff");
        }

        
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DepartmentId",
                table: "Rooms",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DepartmentId",
                table: "Patients",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DepartmentId",
                table: "MedicalStaff",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_DepartmentId",
                table: "Rooms",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_DepartmentId",
                table: "Patients",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalStaff_DepartmentId",
                table: "MedicalStaff",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalStaff_Departments_DepartmentId",
                table: "MedicalStaff",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_Departments_DepartmentId",
                table: "Patients",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_Departments_DepartmentId",
                table: "Rooms",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id");
        }
    }
}
