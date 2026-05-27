using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class VitalSignConfiguration : IEntityTypeConfiguration<VitalSign>
    {
        public void Configure(EntityTypeBuilder<VitalSign> builder)
        {
            builder.ToTable("VitalSigns");

            builder.HasKey(vs => vs.Id);

            builder.Property(vs => vs.RecordedAt).IsRequired();

            builder.Property(vs => vs.Temperature)
                .HasColumnType("decimal(4,1)");

            builder.HasOne(vs => vs.Patient)
                .WithMany(p => p.VitalSigns)
                .HasForeignKey(vs => vs.PatientId);
        }
    }
}
