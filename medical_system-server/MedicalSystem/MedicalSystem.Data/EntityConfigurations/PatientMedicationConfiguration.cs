using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Enums;
using System;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class PatientMedicationConfiguration : IEntityTypeConfiguration<PatientMedication>
    {
        public void Configure(EntityTypeBuilder<PatientMedication> builder)
        {
            builder.ToTable("PatientMedications");

            builder.HasKey(pm => pm.Id);

            builder.Property(pm => pm.Name).IsRequired().HasMaxLength(200);

            builder.Property(pm => pm.Status)
                .HasConversion(
                    v => v.ToString(),
                    v => (MedicationStatus)Enum.Parse(typeof(MedicationStatus), v))
                .HasMaxLength(50);

            builder.HasOne(pm => pm.Patient)
                .WithMany(p => p.PatientMedications)
                .HasForeignKey(pm => pm.PatientId);

            builder.HasOne(pm => pm.Medicine)
                .WithMany(m => m.PatientMedications)
                .HasForeignKey(pm => pm.MedicineId);

            builder.HasOne(pm => pm.Doctor)
                .WithMany(d => d.PatientMedications)
                .HasForeignKey(pm => pm.DoctorId);
        }
    }
}