using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class MedicalProblemConfiguration : IEntityTypeConfiguration<MedicalProblem>
    {
        public void Configure(EntityTypeBuilder<MedicalProblem> builder)
        {
            builder.ToTable("MedicalProblems");
            builder.HasKey(mp => mp.Id);
            builder.Property(mp => mp.Name).IsRequired().HasMaxLength(300);
            builder.Property(mp => mp.DiseaseStatus).HasMaxLength(50);
            builder.Property(mp => mp.Severity).HasMaxLength(50);
            builder.Property(mp => mp.Description).HasMaxLength(1000);
            builder.Property(mp => mp.Complications).HasMaxLength(500);

            builder.HasIndex(mp => new { mp.PatientId, mp.IsActive });

            builder.HasOne(mp => mp.Patient)
                .WithMany(p => p.MedicalProblems)
                .HasForeignKey(mp => mp.PatientId);
        }
    }
}
