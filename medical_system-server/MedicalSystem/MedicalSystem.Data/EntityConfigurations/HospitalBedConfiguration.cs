using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Enums;
using System;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class HospitalBedConfiguration : IEntityTypeConfiguration<HospitalBed>
    {
        public void Configure(EntityTypeBuilder<HospitalBed> builder)
        {
            builder.ToTable("HospitalBeds");

            builder.HasKey(hb => hb.Id);

            builder.Property(hb => hb.Status)
                .IsRequired()
                .HasConversion(
                    v => v.ToString(),
                    v => (BedStatus)Enum.Parse(typeof(BedStatus), v))
                .HasMaxLength(50);

            builder.HasIndex(hb => new { hb.RoomId, hb.BedNumber }).IsUnique();

            builder.HasOne(hb => hb.Room)
                .WithMany(r => r.HospitalBeds)
                .HasForeignKey(hb => hb.RoomId);

            builder.HasOne(hb => hb.Patient)
                .WithOne() 
                .HasForeignKey<HospitalBed>(hb => hb.PatientId);
        }
    }
}