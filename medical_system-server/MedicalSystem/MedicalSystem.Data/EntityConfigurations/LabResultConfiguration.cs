using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class LabResultConfiguration : IEntityTypeConfiguration<LabResult>
    {
        public void Configure(EntityTypeBuilder<LabResult> builder)
        {
            builder.ToTable("LabResults");
            builder.HasKey(lr => lr.Id);
            builder.Property(lr => lr.Type).IsRequired().HasMaxLength(200);
            builder.Property(lr => lr.StatusText).HasMaxLength(300);
            builder.Property(lr => lr.Reason).HasMaxLength(300);

            builder.HasOne(lr => lr.Patient)
                .WithMany(p => p.LabResults)
                .HasForeignKey(lr => lr.PatientId);

            builder.HasOne(lr => lr.Doctor)
                .WithMany(d => d.LabResults)
                .HasForeignKey(lr => lr.DoctorId);
        }
    }
}
