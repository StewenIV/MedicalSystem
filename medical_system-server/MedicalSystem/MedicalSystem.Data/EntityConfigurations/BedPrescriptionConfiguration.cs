using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class BedPrescriptionConfiguration : IEntityTypeConfiguration<BedPrescription>
    {
        public void Configure(EntityTypeBuilder<BedPrescription> builder)
        {
            builder.ToTable("BedPrescriptions");
            builder.HasKey(bp => bp.Id);
            builder.Property(bp => bp.Name).IsRequired().HasMaxLength(200);
            builder.Property(bp => bp.Dose).HasMaxLength(50);
            builder.Property(bp => bp.DoneBy).HasMaxLength(100);

            builder.HasOne(bp => bp.Patient)
                .WithMany(p => p.BedPrescriptions)
                .HasForeignKey(bp => bp.PatientId);

            builder.HasOne(bp => bp.PatientMedication)
                .WithMany(pm => pm.BedPrescriptions)
                .HasForeignKey(bp => bp.PatientMedicationId);
        }
    }
}
