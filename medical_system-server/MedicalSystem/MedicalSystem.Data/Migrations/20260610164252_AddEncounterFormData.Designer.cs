
using System;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MedicalSystem.Data.Migrations
{
    [DbContext(typeof(MedicalSystemDbContext))]
    [Migration("20260610164252_AddEncounterFormData")]
    partial class AddEncounterFormData
    {
        
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "10.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("MedicalSystem.Domain.Models.Allergy", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Comment")
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<DateTime?>("Date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<string>("Reaction")
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.HasKey("Id");

                    b.HasIndex("PatientId");

                    b.ToTable("Allergies", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Appointment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid?>("DoctorId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<string>("Reason")
                        .HasColumnType("text");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<DateTime>("Time")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id");

                    b.HasIndex("DoctorId");

                    b.HasIndex("PatientId");

                    b.ToTable("Appointments", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.BedActionLog", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Action")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.Property<string>("Amount")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("PerformedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid?>("PerformedById")
                        .HasColumnType("uuid");

                    b.Property<string>("PerformedByName")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("PatientId");

                    b.HasIndex("PerformedById");

                    b.ToTable("BedActionLogs", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.BedOccupancyHistory", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("AdmittedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid>("BedId")
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("DischargedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("BedId");

                    b.HasIndex("PatientId");

                    b.ToTable("BedOccupancyHistories");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.BedPrescription", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime?>("DoneAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("DoneBy")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Dose")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<bool>("IsDone")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("PatientMedicationId")
                        .HasColumnType("uuid");

                    b.Property<TimeSpan?>("ScheduledTime")
                        .HasColumnType("interval");

                    b.HasKey("Id");

                    b.HasIndex("PatientId");

                    b.HasIndex("PatientMedicationId");

                    b.ToTable("BedPrescriptions", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Department", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.HasKey("Id");

                    b.ToTable("Departments", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Encounter", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Complaints")
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<string>("Conclusion")
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<DateTime>("DateTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid?>("DoctorId")
                        .HasColumnType("uuid");

                    b.Property<string>("FormData")
                        .HasColumnType("text");

                    b.Property<string>("Objective")
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<string>("Recommendations")
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<string>("Type")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.HasKey("Id");

                    b.HasIndex("DoctorId");

                    b.HasIndex("PatientId");

                    b.ToTable("Encounters", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.HospitalBed", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("AdmissionDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("BedNote")
                        .HasColumnType("text");

                    b.Property<int>("BedNumber")
                        .HasColumnType("integer");

                    b.Property<Guid?>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("RoomId")
                        .HasColumnType("uuid");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id");

                    b.HasIndex("PatientId")
                        .IsUnique();

                    b.HasIndex("RoomId", "BedNumber")
                        .IsUnique();

                    b.ToTable("HospitalBeds", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Institution", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.HasKey("Id");

                    b.ToTable("Institutions", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.LabResult", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("Date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid?>("DoctorId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<string>("Reason")
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.Property<string>("StatusText")
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.HasKey("Id");

                    b.HasIndex("DoctorId");

                    b.HasIndex("PatientId");

                    b.ToTable("LabResults", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.MedicalProblem", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Complications")
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<string>("Description")
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<DateTime?>("DiagnosisDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("DiseaseStatus")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<string>("Severity")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id");

                    b.HasIndex("PatientId", "IsActive");

                    b.ToTable("MedicalProblems", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.MedicalStaff", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("DepartmentId")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<Guid>("PositionId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("DepartmentId");

                    b.HasIndex("PositionId");

                    b.ToTable("MedicalStaff", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Medicine", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Category")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<decimal>("CurrentBalance")
                        .HasColumnType("decimal(10,3)");

                    b.Property<string>("Description")
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<bool>("IsArchived")
                        .HasColumnType("boolean");

                    b.Property<Guid?>("LastChangedById")
                        .HasColumnType("uuid");

                    b.Property<string>("LastOperation")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<DateTime?>("LastReceiptDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("LastReceiptFrom")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<DateTime?>("LastUpdated")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime?>("LastWriteOffDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<decimal>("MinBalance")
                        .HasColumnType("decimal(10,3)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<decimal>("TotalReceived")
                        .HasColumnType("decimal(10,3)");

                    b.Property<decimal>("TotalWrittenOff")
                        .HasColumnType("decimal(10,3)");

                    b.Property<string>("Unit")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id");

                    b.HasIndex("LastChangedById");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Medicines", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.MedicineOperationLog", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<decimal>("BalanceAfter")
                        .HasColumnType("decimal(10,3)");

                    b.Property<string>("Comment")
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<Guid>("MedicineId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("PerformedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid>("PerformedById")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("PrescriptionId")
                        .HasColumnType("uuid");

                    b.Property<decimal>("Quantity")
                        .HasColumnType("decimal(10,3)");

                    b.Property<string>("Reason")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("Supplier")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id");

                    b.HasIndex("MedicineId");

                    b.HasIndex("PatientId");

                    b.HasIndex("PerformedById");

                    b.HasIndex("PrescriptionId");

                    b.ToTable("MedicineOperationLogs", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Notification", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Details")
                        .HasColumnType("text");

                    b.Property<bool>("IsRead")
                        .HasColumnType("boolean");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<Guid?>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("RecipientId")
                        .HasColumnType("uuid");

                    b.Property<string>("Severity")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id");

                    b.HasIndex("PatientId");

                    b.HasIndex("RecipientId");

                    b.ToTable("Notifications", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Operation", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Complications")
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<DateTime?>("Date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<string>("Diagnosis")
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.Property<string>("Implants")
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<string>("Result")
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.HasKey("Id");

                    b.HasIndex("PatientId");

                    b.ToTable("Operations", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Patient", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid?>("DepartmentId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("DoctorId")
                        .HasColumnType("uuid");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Gender")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("HistoryNum")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<Guid?>("InstitutionId")
                        .HasColumnType("uuid");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<DateTime>("LastUpdated")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("MaritalStatus")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("MedcardNum")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("MiddleName")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id");

                    b.HasIndex("DepartmentId");

                    b.HasIndex("DoctorId");

                    b.HasIndex("HistoryNum")
                        .IsUnique()
                        .HasFilter("\"HistoryNum\" IS NOT NULL");

                    b.HasIndex("InstitutionId");

                    b.HasIndex("MedcardNum")
                        .IsUnique();

                    b.ToTable("Patients", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.PatientDocument", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("Date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("FilePath")
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("PatientId");

                    b.ToTable("PatientDocuments", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.PatientMedication", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Comment")
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<DateTime?>("DateEnd")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime?>("DateStart")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid?>("DoctorId")
                        .HasColumnType("uuid");

                    b.Property<string>("Dose")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("Form")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<Guid?>("MedicineId")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<string>("Regimen")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("Route")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id");

                    b.HasIndex("DoctorId");

                    b.HasIndex("MedicineId");

                    b.HasIndex("PatientId");

                    b.ToTable("PatientMedications", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.PatientRelative", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<string>("Phone")
                        .HasMaxLength(20)
                        .HasColumnType("character varying(20)");

                    b.Property<string>("Relation")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.HasKey("Id");

                    b.HasIndex("PatientId");

                    b.ToTable("PatientRelatives", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Position", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.HasKey("Id");

                    b.ToTable("Positions", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Prescription", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Comment")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<DateTime?>("DateEnd")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime?>("DateStart")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid?>("DoctorId")
                        .HasColumnType("uuid");

                    b.Property<string>("Dose")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Drug")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("Form")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<string>("Regimen")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("Route")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.HasKey("Id");

                    b.HasIndex("DoctorId");

                    b.HasIndex("PatientId");

                    b.ToTable("Prescription");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Room", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid?>("DepartmentId")
                        .HasColumnType("uuid");

                    b.Property<int>("Floor")
                        .HasColumnType("integer");

                    b.Property<string>("Gender")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("Priority")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("RoomNumber")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("character varying(10)");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("DepartmentId");

                    b.HasIndex("RoomNumber")
                        .IsUnique();

                    b.ToTable("Rooms", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Shift", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<short>("Hours")
                        .HasColumnType("smallint");

                    b.Property<Guid>("StaffId")
                        .HasColumnType("uuid");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id");

                    b.HasIndex("StaffId", "Date")
                        .IsUnique();

                    b.ToTable("Shifts", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("DisplayName")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<Guid?>("MedicalStaffId")
                        .HasColumnType("uuid");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id");

                    b.HasIndex("MedicalStaffId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Vaccine", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("Date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Disease")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("Manufacturer")
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<string>("Series")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Validity")
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.HasKey("Id");

                    b.HasIndex("PatientId");

                    b.ToTable("Vaccines", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.VitalSign", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<short?>("BloodPressureDiastolic")
                        .HasColumnType("smallint");

                    b.Property<short?>("BloodPressureSystolic")
                        .HasColumnType("smallint");

                    b.Property<Guid>("PatientId")
                        .HasColumnType("uuid");

                    b.Property<short?>("Pulse")
                        .HasColumnType("smallint");

                    b.Property<DateTime>("RecordedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<short?>("RespiratoryRate")
                        .HasColumnType("smallint");

                    b.Property<short?>("SpO2")
                        .HasColumnType("smallint");

                    b.Property<decimal?>("Temperature")
                        .HasColumnType("decimal(4,1)");

                    b.HasKey("Id");

                    b.HasIndex("PatientId");

                    b.ToTable("VitalSigns", (string)null);
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Allergy", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("Allergies")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Appointment", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.MedicalStaff", "Doctor")
                        .WithMany("Appointments")
                        .HasForeignKey("DoctorId");

                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("Appointments")
                        .HasForeignKey("PatientId");

                    b.Navigation("Doctor");

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.BedActionLog", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("BedActionLogs")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MedicalSystem.Domain.Models.MedicalStaff", "PerformedBy")
                        .WithMany("BedActionLogs")
                        .HasForeignKey("PerformedById");

                    b.Navigation("Patient");

                    b.Navigation("PerformedBy");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.BedOccupancyHistory", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.HospitalBed", "Bed")
                        .WithMany()
                        .HasForeignKey("BedId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany()
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Bed");

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.BedPrescription", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("BedPrescriptions")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MedicalSystem.Domain.Models.PatientMedication", "PatientMedication")
                        .WithMany("BedPrescriptions")
                        .HasForeignKey("PatientMedicationId");

                    b.Navigation("Patient");

                    b.Navigation("PatientMedication");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Encounter", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.MedicalStaff", "Doctor")
                        .WithMany("Encounters")
                        .HasForeignKey("DoctorId");

                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("Encounters")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Doctor");

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.HospitalBed", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithOne()
                        .HasForeignKey("MedicalSystem.Domain.Models.HospitalBed", "PatientId");

                    b.HasOne("MedicalSystem.Domain.Models.Room", "Room")
                        .WithMany("HospitalBeds")
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Patient");

                    b.Navigation("Room");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.LabResult", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.MedicalStaff", "Doctor")
                        .WithMany("LabResults")
                        .HasForeignKey("DoctorId");

                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("LabResults")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Doctor");

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.MedicalProblem", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("MedicalProblems")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.MedicalStaff", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Department", "Department")
                        .WithMany("MedicalStaff")
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MedicalSystem.Domain.Models.Position", "Position")
                        .WithMany("MedicalStaff")
                        .HasForeignKey("PositionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");

                    b.Navigation("Position");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Medicine", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.MedicalStaff", "LastChangedBy")
                        .WithMany("Medicines")
                        .HasForeignKey("LastChangedById");

                    b.Navigation("LastChangedBy");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.MedicineOperationLog", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Medicine", "Medicine")
                        .WithMany("MedicineOperationLogs")
                        .HasForeignKey("MedicineId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("MedicineOperationLogs")
                        .HasForeignKey("PatientId");

                    b.HasOne("MedicalSystem.Domain.Models.MedicalStaff", "PerformedBy")
                        .WithMany("MedicineOperationLogs")
                        .HasForeignKey("PerformedById")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MedicalSystem.Domain.Models.PatientMedication", "Prescription")
                        .WithMany("MedicineOperationLogs")
                        .HasForeignKey("PrescriptionId");

                    b.Navigation("Medicine");

                    b.Navigation("Patient");

                    b.Navigation("PerformedBy");

                    b.Navigation("Prescription");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Notification", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("Notifications")
                        .HasForeignKey("PatientId");

                    b.HasOne("MedicalSystem.Domain.Models.MedicalStaff", "Recipient")
                        .WithMany("Notifications")
                        .HasForeignKey("RecipientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Patient");

                    b.Navigation("Recipient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Operation", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("Operations")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Patient", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Department", "Department")
                        .WithMany("Patients")
                        .HasForeignKey("DepartmentId");

                    b.HasOne("MedicalSystem.Domain.Models.MedicalStaff", "Doctor")
                        .WithMany("Patients")
                        .HasForeignKey("DoctorId");

                    b.HasOne("MedicalSystem.Domain.Models.Institution", "Institution")
                        .WithMany("Patients")
                        .HasForeignKey("InstitutionId");

                    b.OwnsOne("MedicalSystem.Domain.Models.Owned.PatientContacts", "Contacts", b1 =>
                        {
                            b1.Property<Guid>("PatientId")
                                .HasColumnType("uuid");

                            b1.Property<string>("Address")
                                .HasMaxLength(300)
                                .HasColumnType("character varying(300)");

                            b1.Property<string>("City")
                                .HasMaxLength(100)
                                .HasColumnType("character varying(100)");

                            b1.Property<string>("Country")
                                .HasMaxLength(100)
                                .HasColumnType("character varying(100)");

                            b1.Property<string>("Email")
                                .HasMaxLength(150)
                                .HasColumnType("character varying(150)");

                            b1.Property<string>("PhoneHome")
                                .HasMaxLength(20)
                                .HasColumnType("character varying(20)");

                            b1.Property<string>("PhoneMobile")
                                .HasMaxLength(20)
                                .HasColumnType("character varying(20)");

                            b1.Property<string>("Region")
                                .HasMaxLength(100)
                                .HasColumnType("character varying(100)");

                            b1.Property<string>("Zip")
                                .HasMaxLength(10)
                                .HasColumnType("character varying(10)");

                            b1.HasKey("PatientId");

                            b1.ToTable("Patients");

                            b1.WithOwner()
                                .HasForeignKey("PatientId");
                        });

                    b.OwnsOne("MedicalSystem.Domain.Models.Owned.PatientOther", "Other", b1 =>
                        {
                            b1.Property<Guid>("PatientId")
                                .HasColumnType("uuid");

                            b1.Property<string>("CauseOfDeath")
                                .HasMaxLength(500)
                                .HasColumnType("character varying(500)");

                            b1.Property<DateTime?>("DateOfDeath")
                                .HasColumnType("timestamp without time zone");

                            b1.Property<string>("Language")
                                .HasMaxLength(50)
                                .HasColumnType("character varying(50)");

                            b1.Property<string>("Nationality")
                                .HasMaxLength(100)
                                .HasColumnType("character varying(100)");

                            b1.HasKey("PatientId");

                            b1.ToTable("Patients");

                            b1.WithOwner()
                                .HasForeignKey("PatientId");
                        });

                    b.OwnsOne("MedicalSystem.Domain.Models.Owned.PatientPassport", "Passport", b1 =>
                        {
                            b1.Property<Guid>("PatientId")
                                .HasColumnType("uuid");

                            b1.Property<DateTime?>("DateIssued")
                                .HasColumnType("timestamp without time zone");

                            b1.Property<string>("IssuedBy")
                                .HasMaxLength(300)
                                .HasColumnType("character varying(300)");

                            b1.Property<string>("SeriesNumber")
                                .HasMaxLength(20)
                                .HasColumnType("character varying(20)");

                            b1.HasKey("PatientId");

                            b1.ToTable("Patients");

                            b1.WithOwner()
                                .HasForeignKey("PatientId");
                        });

                    b.OwnsOne("MedicalSystem.Domain.Models.Owned.PatientWork", "Work", b1 =>
                        {
                            b1.Property<Guid>("PatientId")
                                .HasColumnType("uuid");

                            b1.Property<string>("Address")
                                .HasMaxLength(300)
                                .HasColumnType("character varying(300)");

                            b1.Property<string>("Organization")
                                .HasMaxLength(200)
                                .HasColumnType("character varying(200)");

                            b1.Property<string>("Profession")
                                .HasMaxLength(150)
                                .HasColumnType("character varying(150)");

                            b1.HasKey("PatientId");

                            b1.ToTable("Patients");

                            b1.WithOwner()
                                .HasForeignKey("PatientId");
                        });

                    b.Navigation("Contacts")
                        .IsRequired();

                    b.Navigation("Department");

                    b.Navigation("Doctor");

                    b.Navigation("Institution");

                    b.Navigation("Other")
                        .IsRequired();

                    b.Navigation("Passport")
                        .IsRequired();

                    b.Navigation("Work")
                        .IsRequired();
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.PatientDocument", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("PatientDocuments")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.PatientMedication", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.MedicalStaff", "Doctor")
                        .WithMany("PatientMedications")
                        .HasForeignKey("DoctorId");

                    b.HasOne("MedicalSystem.Domain.Models.Medicine", "Medicine")
                        .WithMany("PatientMedications")
                        .HasForeignKey("MedicineId");

                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("PatientMedications")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Doctor");

                    b.Navigation("Medicine");

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.PatientRelative", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("PatientRelatives")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Prescription", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.MedicalStaff", "Doctor")
                        .WithMany()
                        .HasForeignKey("DoctorId");

                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("Prescriptions")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Doctor");

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Room", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Department", "Department")
                        .WithMany("Rooms")
                        .HasForeignKey("DepartmentId");

                    b.Navigation("Department");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Shift", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.MedicalStaff", "Staff")
                        .WithMany("Shifts")
                        .HasForeignKey("StaffId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Staff");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.User", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.MedicalStaff", "MedicalStaff")
                        .WithMany()
                        .HasForeignKey("MedicalStaffId");

                    b.Navigation("MedicalStaff");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Vaccine", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("Vaccines")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.VitalSign", b =>
                {
                    b.HasOne("MedicalSystem.Domain.Models.Patient", "Patient")
                        .WithMany("VitalSigns")
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Patient");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Department", b =>
                {
                    b.Navigation("MedicalStaff");

                    b.Navigation("Patients");

                    b.Navigation("Rooms");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Institution", b =>
                {
                    b.Navigation("Patients");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.MedicalStaff", b =>
                {
                    b.Navigation("Appointments");

                    b.Navigation("BedActionLogs");

                    b.Navigation("Encounters");

                    b.Navigation("LabResults");

                    b.Navigation("MedicineOperationLogs");

                    b.Navigation("Medicines");

                    b.Navigation("Notifications");

                    b.Navigation("PatientMedications");

                    b.Navigation("Patients");

                    b.Navigation("Shifts");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Medicine", b =>
                {
                    b.Navigation("MedicineOperationLogs");

                    b.Navigation("PatientMedications");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Patient", b =>
                {
                    b.Navigation("Allergies");

                    b.Navigation("Appointments");

                    b.Navigation("BedActionLogs");

                    b.Navigation("BedPrescriptions");

                    b.Navigation("Encounters");

                    b.Navigation("LabResults");

                    b.Navigation("MedicalProblems");

                    b.Navigation("MedicineOperationLogs");

                    b.Navigation("Notifications");

                    b.Navigation("Operations");

                    b.Navigation("PatientDocuments");

                    b.Navigation("PatientMedications");

                    b.Navigation("PatientRelatives");

                    b.Navigation("Prescriptions");

                    b.Navigation("Vaccines");

                    b.Navigation("VitalSigns");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.PatientMedication", b =>
                {
                    b.Navigation("BedPrescriptions");

                    b.Navigation("MedicineOperationLogs");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Position", b =>
                {
                    b.Navigation("MedicalStaff");
                });

            modelBuilder.Entity("MedicalSystem.Domain.Models.Room", b =>
                {
                    b.Navigation("HospitalBeds");
                });
#pragma warning restore 612, 618
        }
    }
}
