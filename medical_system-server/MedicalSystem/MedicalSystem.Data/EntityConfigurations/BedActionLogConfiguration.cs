using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class BedActionLogConfiguration : IEntityTypeConfiguration<BedActionLog>
    {
        public void Configure(EntityTypeBuilder<BedActionLog> builder)
        {
            builder.ToTable("BedActionLogs");
            builder.HasKey(l => l.Id);
            builder.Property(l => l.Action).IsRequired().HasMaxLength(300);
            builder.Property(l => l.Amount).HasMaxLength(50);

            builder.HasOne(l => l.Patient)
                .WithMany(p => p.BedActionLogs)
                .HasForeignKey(l => l.PatientId);

            builder.HasOne(l => l.PerformedBy)
                .WithMany(s => s.BedActionLogs)
                .HasForeignKey(l => l.PerformedById);
        }
    }
}
