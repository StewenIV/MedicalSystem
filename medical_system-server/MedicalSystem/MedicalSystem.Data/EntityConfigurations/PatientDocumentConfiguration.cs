using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class PatientDocumentConfiguration : IEntityTypeConfiguration<PatientDocument>
    {
        public void Configure(EntityTypeBuilder<PatientDocument> builder)
        {
            builder.ToTable("PatientDocuments");
            builder.HasKey(d => d.Id);
            builder.Property(d => d.Name).IsRequired().HasMaxLength(300);
            builder.Property(d => d.FilePath).HasMaxLength(500);

            builder.HasOne(d => d.Patient)
                .WithMany(p => p.PatientDocuments)
                .HasForeignKey(d => d.PatientId);
        }
    }
}
