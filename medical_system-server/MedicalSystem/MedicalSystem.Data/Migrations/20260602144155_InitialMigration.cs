using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedicalSystem.Data.Migrations
{
    
    public partial class InitialMigration : Migration
    {
        
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateTable(
                name: "Institutions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Institutions", x => x.Id);
                });

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

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RoomNumber = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Floor = table.Column<int>(type: "integer", nullable: false),
                    Gender = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Priority = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DepartmentId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rooms_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MedicalStaff",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    PositionId = table.Column<Guid>(type: "uuid", nullable: false),
                    DepartmentId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalStaff", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalStaff_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicalStaff_Positions_PositionId",
                        column: x => x.PositionId,
                        principalTable: "Positions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Medicines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Unit = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CurrentBalance = table.Column<decimal>(type: "numeric(10,3)", nullable: false),
                    MinBalance = table.Column<decimal>(type: "numeric(10,3)", nullable: false),
                    TotalReceived = table.Column<decimal>(type: "numeric(10,3)", nullable: false),
                    TotalWrittenOff = table.Column<decimal>(type: "numeric(10,3)", nullable: false),
                    LastReceiptDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastWriteOffDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastReceiptFrom = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    LastOperation = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    LastChangedById = table.Column<Guid>(type: "uuid", nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsArchived = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medicines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Medicines_MedicalStaff_LastChangedById",
                        column: x => x.LastChangedById,
                        principalTable: "MedicalStaff",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    MiddleName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Gender = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    MedcardNum = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    HistoryNum = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MaritalStatus = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    DoctorId = table.Column<Guid>(type: "uuid", nullable: true),
                    DepartmentId = table.Column<Guid>(type: "uuid", nullable: true),
                    InstitutionId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Contacts_PhoneMobile = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Contacts_PhoneHome = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Contacts_Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    Contacts_Address = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Contacts_Zip = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    Contacts_Country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Contacts_Region = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Contacts_City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Passport_SeriesNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Passport_IssuedBy = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Passport_DateIssued = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    Work_Profession = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    Work_Organization = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Work_Address = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Other_Language = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Other_Nationality = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Other_DateOfDeath = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    Other_CauseOfDeath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Patients_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Patients_Institutions_InstitutionId",
                        column: x => x.InstitutionId,
                        principalTable: "Institutions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Patients_MedicalStaff_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "MedicalStaff",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Shifts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StaffId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Hours = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shifts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Shifts_MedicalStaff_StaffId",
                        column: x => x.StaffId,
                        principalTable: "MedicalStaff",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Allergies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Reaction = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    Comment = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Allergies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Allergies_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: true),
                    DoctorId = table.Column<Guid>(type: "uuid", nullable: true),
                    Time = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointments_MedicalStaff_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "MedicalStaff",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Appointments_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "BedActionLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    PerformedById = table.Column<Guid>(type: "uuid", nullable: true),
                    Action = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    PerformedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Amount = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BedActionLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BedActionLogs_MedicalStaff_PerformedById",
                        column: x => x.PerformedById,
                        principalTable: "MedicalStaff",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_BedActionLogs_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Encounters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    DoctorId = table.Column<Guid>(type: "uuid", nullable: true),
                    DateTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Conclusion = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Complaints = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Objective = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Recommendations = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Encounters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Encounters_MedicalStaff_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "MedicalStaff",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Encounters_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HospitalBeds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RoomId = table.Column<Guid>(type: "uuid", nullable: false),
                    BedNumber = table.Column<int>(type: "integer", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BedNote = table.Column<string>(type: "text", nullable: true),
                    AdmissionDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HospitalBeds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HospitalBeds_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HospitalBeds_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LabResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    DoctorId = table.Column<Guid>(type: "uuid", nullable: true),
                    Type = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    StatusText = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Reason = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LabResults_MedicalStaff_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "MedicalStaff",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LabResults_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicalProblems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    DiagnosisDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    DiseaseStatus = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Severity = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Complications = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalProblems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalProblems_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RecipientId = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: true),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Severity = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Message = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Details = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_MedicalStaff_RecipientId",
                        column: x => x.RecipientId,
                        principalTable: "MedicalStaff",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Operations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    Diagnosis = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Complications = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Implants = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Result = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Operations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Operations_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientDocuments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    FilePath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientDocuments_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientMedications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    MedicineId = table.Column<Guid>(type: "uuid", nullable: true),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Dose = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Form = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Route = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Regimen = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Comment = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    DoctorId = table.Column<Guid>(type: "uuid", nullable: true),
                    DateStart = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    DateEnd = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientMedications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientMedications_MedicalStaff_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "MedicalStaff",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientMedications_Medicines_MedicineId",
                        column: x => x.MedicineId,
                        principalTable: "Medicines",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientMedications_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientRelatives",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Relation = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientRelatives", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientRelatives_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vaccines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Disease = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    Validity = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Manufacturer = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Series = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vaccines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vaccines_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VitalSigns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    RecordedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    BloodPressureSystolic = table.Column<short>(type: "smallint", nullable: true),
                    BloodPressureDiastolic = table.Column<short>(type: "smallint", nullable: true),
                    Temperature = table.Column<decimal>(type: "numeric(4,1)", nullable: true),
                    Pulse = table.Column<short>(type: "smallint", nullable: true),
                    SpO2 = table.Column<short>(type: "smallint", nullable: true),
                    RespiratoryRate = table.Column<short>(type: "smallint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VitalSigns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VitalSigns_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateTable(
                name: "BedPrescriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientMedicationId = table.Column<Guid>(type: "uuid", nullable: true),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Dose = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ScheduledTime = table.Column<TimeSpan>(type: "interval", nullable: true),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    IsDone = table.Column<bool>(type: "boolean", nullable: false),
                    DoneAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    DoneBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BedPrescriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BedPrescriptions_PatientMedications_PatientMedicationId",
                        column: x => x.PatientMedicationId,
                        principalTable: "PatientMedications",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_BedPrescriptions_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicineOperationLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MedicineId = table.Column<Guid>(type: "uuid", nullable: false),
                    PerformedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Quantity = table.Column<decimal>(type: "numeric(10,3)", nullable: false),
                    BalanceAfter = table.Column<decimal>(type: "numeric(10,3)", nullable: false),
                    PerformedById = table.Column<Guid>(type: "uuid", nullable: false),
                    Comment = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Supplier = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Reason = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    PatientId = table.Column<Guid>(type: "uuid", nullable: true),
                    PrescriptionId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicineOperationLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicineOperationLogs_MedicalStaff_PerformedById",
                        column: x => x.PerformedById,
                        principalTable: "MedicalStaff",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicineOperationLogs_Medicines_MedicineId",
                        column: x => x.MedicineId,
                        principalTable: "Medicines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicineOperationLogs_PatientMedications_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "PatientMedications",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MedicineOperationLogs_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Allergies_PatientId",
                table: "Allergies",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DoctorId",
                table: "Appointments",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_PatientId",
                table: "Appointments",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_BedActionLogs_PatientId",
                table: "BedActionLogs",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_BedActionLogs_PerformedById",
                table: "BedActionLogs",
                column: "PerformedById");

            migrationBuilder.CreateIndex(
                name: "IX_BedOccupancyHistories_BedId",
                table: "BedOccupancyHistories",
                column: "BedId");

            migrationBuilder.CreateIndex(
                name: "IX_BedOccupancyHistories_PatientId",
                table: "BedOccupancyHistories",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_BedPrescriptions_PatientId",
                table: "BedPrescriptions",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_BedPrescriptions_PatientMedicationId",
                table: "BedPrescriptions",
                column: "PatientMedicationId");

            migrationBuilder.CreateIndex(
                name: "IX_Encounters_DoctorId",
                table: "Encounters",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Encounters_PatientId",
                table: "Encounters",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_HospitalBeds_PatientId",
                table: "HospitalBeds",
                column: "PatientId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HospitalBeds_RoomId_BedNumber",
                table: "HospitalBeds",
                columns: new[] { "RoomId", "BedNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LabResults_DoctorId",
                table: "LabResults",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_LabResults_PatientId",
                table: "LabResults",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalProblems_PatientId_IsActive",
                table: "MedicalProblems",
                columns: new[] { "PatientId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_MedicalStaff_DepartmentId",
                table: "MedicalStaff",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalStaff_PositionId",
                table: "MedicalStaff",
                column: "PositionId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicineOperationLogs_MedicineId",
                table: "MedicineOperationLogs",
                column: "MedicineId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicineOperationLogs_PatientId",
                table: "MedicineOperationLogs",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicineOperationLogs_PerformedById",
                table: "MedicineOperationLogs",
                column: "PerformedById");

            migrationBuilder.CreateIndex(
                name: "IX_MedicineOperationLogs_PrescriptionId",
                table: "MedicineOperationLogs",
                column: "PrescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_Medicines_LastChangedById",
                table: "Medicines",
                column: "LastChangedById");

            migrationBuilder.CreateIndex(
                name: "IX_Medicines_Name",
                table: "Medicines",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_PatientId",
                table: "Notifications",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_RecipientId",
                table: "Notifications",
                column: "RecipientId");

            migrationBuilder.CreateIndex(
                name: "IX_Operations_PatientId",
                table: "Operations",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientDocuments_PatientId",
                table: "PatientDocuments",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMedications_DoctorId",
                table: "PatientMedications",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMedications_MedicineId",
                table: "PatientMedications",
                column: "MedicineId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMedications_PatientId",
                table: "PatientMedications",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientRelatives_PatientId",
                table: "PatientRelatives",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_DepartmentId",
                table: "Patients",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_DoctorId",
                table: "Patients",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_HistoryNum",
                table: "Patients",
                column: "HistoryNum",
                unique: true,
                filter: "\"HistoryNum\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_InstitutionId",
                table: "Patients",
                column: "InstitutionId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_MedcardNum",
                table: "Patients",
                column: "MedcardNum",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_DepartmentId",
                table: "Rooms",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_RoomNumber",
                table: "Rooms",
                column: "RoomNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Shifts_StaffId_Date",
                table: "Shifts",
                columns: new[] { "StaffId", "Date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vaccines_PatientId",
                table: "Vaccines",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_VitalSigns_PatientId",
                table: "VitalSigns",
                column: "PatientId");
        }

        
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Allergies");

            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "BedActionLogs");

            migrationBuilder.DropTable(
                name: "BedOccupancyHistories");

            migrationBuilder.DropTable(
                name: "BedPrescriptions");

            migrationBuilder.DropTable(
                name: "Encounters");

            migrationBuilder.DropTable(
                name: "LabResults");

            migrationBuilder.DropTable(
                name: "MedicalProblems");

            migrationBuilder.DropTable(
                name: "MedicineOperationLogs");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "Operations");

            migrationBuilder.DropTable(
                name: "PatientDocuments");

            migrationBuilder.DropTable(
                name: "PatientRelatives");

            migrationBuilder.DropTable(
                name: "Shifts");

            migrationBuilder.DropTable(
                name: "Vaccines");

            migrationBuilder.DropTable(
                name: "VitalSigns");

            migrationBuilder.DropTable(
                name: "HospitalBeds");

            migrationBuilder.DropTable(
                name: "PatientMedications");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Medicines");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Institutions");

            migrationBuilder.DropTable(
                name: "MedicalStaff");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropTable(
                name: "Positions");
        }
    }
}
