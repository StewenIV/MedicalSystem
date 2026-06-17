using Microsoft.EntityFrameworkCore;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.DbContext
{
    public class MedicalSystemDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public MedicalSystemDbContext(DbContextOptions<MedicalSystemDbContext> options) : base(options) { }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<PatientRelative> PatientRelatives { get; set; }
        public DbSet<Allergy> Allergies { get; set; }
        public DbSet<MedicalProblem> MedicalProblems { get; set; }
        public DbSet<Encounter> Encounters { get; set; }
        public DbSet<PatientMedication> PatientMedications { get; set; }
        public DbSet<LabResult> LabResults { get; set; }
        public DbSet<Operation> Operations { get; set; }
        public DbSet<Vaccine> Vaccines { get; set; }
        public DbSet<PatientDocument> PatientDocuments { get; set; }
        public DbSet<VitalSign> VitalSigns { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<HospitalBed> HospitalBeds { get; set; }
        public DbSet<BedPrescription> BedPrescriptions { get; set; }
        public DbSet<BedActionLog> BedActionLogs { get; set; }
        public DbSet<BedOccupancyHistory> BedOccupancyHistories { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<MedicineOperationLog> MedicineOperationLogs { get; set; }
        public DbSet<MedicalStaff> MedicalStaff { get; set; }
        public DbSet<Shift> Shifts { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Institution> Institutions { get; set; }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(MedicalSystemDbContext).Assembly);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Patient)
                .WithMany()
                .HasForeignKey(u => u.PatientId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
