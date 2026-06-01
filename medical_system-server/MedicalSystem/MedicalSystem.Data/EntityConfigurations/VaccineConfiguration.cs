using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class VaccineConfiguration : IEntityTypeConfiguration<Vaccine>
    {
        public void Configure(EntityTypeBuilder<Vaccine> builder)
        {
            builder.ToTable("Vaccines");
            builder.HasKey(v => v.Id);
            builder.Property(v => v.Name).IsRequired().HasMaxLength(200);
            builder.Property(v => v.Disease).HasMaxLength(200);
            builder.Property(v => v.Validity).HasMaxLength(50);
            builder.Property(v => v.Manufacturer).HasMaxLength(200);
            builder.Property(v => v.Series).HasMaxLength(100);

            builder.HasOne(v => v.Patient)
                .WithMany(p => p.Vaccines)
                .HasForeignKey(v => v.PatientId);
        }
    }
}
