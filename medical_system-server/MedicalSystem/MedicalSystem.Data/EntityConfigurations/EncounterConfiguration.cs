using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class EncounterConfiguration : IEntityTypeConfiguration<Encounter>
    {
        public void Configure(EntityTypeBuilder<Encounter> builder)
        {
            builder.ToTable("Encounters");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.DateTime).IsRequired();

            builder.HasOne(e => e.Patient)
                .WithMany(p => p.Encounters)
                .HasForeignKey(e => e.PatientId);

            builder.HasOne(e => e.Doctor)
                .WithMany(d => d.Encounters)
                .HasForeignKey(e => e.DoctorId);
        }
    }
}
