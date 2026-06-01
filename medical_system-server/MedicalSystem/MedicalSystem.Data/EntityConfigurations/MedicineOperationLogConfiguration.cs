using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class MedicineOperationLogConfiguration : IEntityTypeConfiguration<MedicineOperationLog>
    {
        public void Configure(EntityTypeBuilder<MedicineOperationLog> builder)
        {
            builder.ToTable("MedicineOperationLogs");
            builder.HasKey(l => l.Id);
            builder.Property(l => l.Quantity).HasColumnType("decimal(10,3)");
            builder.Property(l => l.BalanceAfter).HasColumnType("decimal(10,3)");
            builder.Property(l => l.Comment).HasMaxLength(500);
            builder.Property(l => l.Supplier).HasMaxLength(200);

            builder.HasOne(l => l.Medicine)
                .WithMany(m => m.MedicineOperationLogs)
                .HasForeignKey(l => l.MedicineId);

            builder.HasOne(l => l.PerformedBy)
                .WithMany(s => s.MedicineOperationLogs)
                .HasForeignKey(l => l.PerformedById);

            builder.HasOne(l => l.Patient)
                .WithMany(p => p.MedicineOperationLogs)
                .HasForeignKey(l => l.PatientId);

            builder.HasOne(l => l.Prescription)
                .WithMany(p => p.MedicineOperationLogs)
                .HasForeignKey(l => l.PrescriptionId);
        }
    }
}
