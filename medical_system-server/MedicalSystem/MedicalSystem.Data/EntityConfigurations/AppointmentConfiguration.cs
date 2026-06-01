using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Enums;
using System;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.ToTable("Appointments");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Time).IsRequired();

            builder.Property(a => a.Status)
                .IsRequired()
                .HasConversion(
                    v => v.ToString(),
                    v => (AppointmentStatus)Enum.Parse(typeof(AppointmentStatus), v))
                .HasMaxLength(50);

            builder.Property(a => a.Type)
                .IsRequired()
                .HasConversion(
                    v => v.ToString(),
                    v => (AppointmentType)Enum.Parse(typeof(AppointmentType), v))
                .HasMaxLength(50);

            builder.HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId);

            builder.HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId);
        }
    }
}