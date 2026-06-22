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
            builder.Property(lr => lr.ResultData).HasColumnType("text");
            builder.Property(lr => lr.Comments).HasMaxLength(2000);
            builder.Property(lr => lr.PdfDocumentPath).HasMaxLength(500);
            builder.Property(lr => lr.DateUpdated);

            builder.HasOne(lr => lr.Patient)
                .WithMany(p => p.LabResults)
                .HasForeignKey(lr => lr.PatientId);

            builder.HasOne(lr => lr.Doctor)
                .WithMany(d => d.LabResults)
                .HasForeignKey(lr => lr.DoctorId);

            builder.HasOne(lr => lr.LaboratoryEmployee)
                .WithMany()
                .HasForeignKey(lr => lr.LaboratoryEmployeeId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
