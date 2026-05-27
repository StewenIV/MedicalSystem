using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class PatientRelativeConfiguration : IEntityTypeConfiguration<PatientRelative>
    {
        public void Configure(EntityTypeBuilder<PatientRelative> builder)
        {
            builder.ToTable("PatientRelatives");
            builder.HasKey(pr => pr.Id);
            builder.Property(pr => pr.Name).IsRequired().HasMaxLength(200);
            builder.Property(pr => pr.Relation).HasMaxLength(100);
            builder.Property(pr => pr.Phone).HasMaxLength(20);

            builder.HasOne(pr => pr.Patient)
                .WithMany(p => p.PatientRelatives)
                .HasForeignKey(pr => pr.PatientId);
        }
    }
}
