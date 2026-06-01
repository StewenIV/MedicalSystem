using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedicalSystem.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBedOccupancyHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BedOccupancyHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BedId = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    AdmittedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    DischargedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BedOccupancyHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BedOccupancyHistories_HospitalBeds_BedId",
                        column: x => x.BedId,
                        principalTable: "HospitalBeds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BedOccupancyHistories_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BedOccupancyHistories_BedId",
                table: "BedOccupancyHistories",
                column: "BedId");

            migrationBuilder.CreateIndex(
                name: "IX_BedOccupancyHistories_PatientId",
                table: "BedOccupancyHistories",
                column: "PatientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BedOccupancyHistories");
        }
    }
}
