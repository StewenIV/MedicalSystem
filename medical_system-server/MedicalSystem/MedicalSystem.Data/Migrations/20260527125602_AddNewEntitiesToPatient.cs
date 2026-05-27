using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedicalSystem.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNewEntitiesToPatient : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MedicalProblems_PatientId",
                table: "MedicalProblems");

            migrationBuilder.AddColumn<string>(
                name: "Contacts_Address",
                table: "Patients",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Contacts_City",
                table: "Patients",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Contacts_Country",
                table: "Patients",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Contacts_Email",
                table: "Patients",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Contacts_PhoneHome",
                table: "Patients",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Contacts_PhoneMobile",
                table: "Patients",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Contacts_Region",
                table: "Patients",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Contacts_Zip",
                table: "Patients",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Other_CauseOfDeath",
                table: "Patients",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Other_DateOfDeath",
                table: "Patients",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Other_Language",
                table: "Patients",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Other_Nationality",
                table: "Patients",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Passport_DateIssued",
                table: "Patients",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Passport_IssuedBy",
                table: "Patients",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Passport_SeriesNumber",
                table: "Patients",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Work_Address",
                table: "Patients",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Work_Organization",
                table: "Patients",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Work_Profession",
                table: "Patients",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicalProblems_PatientId_IsActive",
                table: "MedicalProblems",
                columns: new[] { "PatientId", "IsActive" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MedicalProblems_PatientId_IsActive",
                table: "MedicalProblems");

            migrationBuilder.DropColumn(
                name: "Contacts_Address",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Contacts_City",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Contacts_Country",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Contacts_Email",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Contacts_PhoneHome",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Contacts_PhoneMobile",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Contacts_Region",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Contacts_Zip",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Other_CauseOfDeath",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Other_DateOfDeath",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Other_Language",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Other_Nationality",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Passport_DateIssued",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Passport_IssuedBy",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Passport_SeriesNumber",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Work_Address",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Work_Organization",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Work_Profession",
                table: "Patients");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalProblems_PatientId",
                table: "MedicalProblems",
                column: "PatientId");
        }
    }
}
