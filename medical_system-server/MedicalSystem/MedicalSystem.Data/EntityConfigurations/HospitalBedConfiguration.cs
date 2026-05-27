using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class HospitalBedConfiguration : IEntityTypeConfiguration<HospitalBed>
    {
        public void Configure(EntityTypeBuilder<HospitalBed> builder)
        {
            builder.ToTable("HospitalBeds");

            builder.HasKey(hb => hb.Id);

            builder.HasIndex(hb => new { hb.RoomId, hb.BedNumber }).IsUnique();

            builder.HasOne(hb => hb.Room)
                .WithMany(r => r.HospitalBeds)
                .HasForeignKey(hb => hb.RoomId);

            builder.HasOne(hb => hb.Patient)
                .WithOne() // Assuming one patient can only be in one bed
                .HasForeignKey<HospitalBed>(hb => hb.PatientId);
        }
    }
}
