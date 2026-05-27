using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Infrastructure.EntityConfigurations
{
    public class PatientConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.ToTable("Patients");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.FirstName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(p => p.LastName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(p => p.MiddleName)
                .HasMaxLength(100);

            builder.Property(p => p.Gender)
                .IsRequired();

            builder.Property(p => p.DateOfBirth)
                .IsRequired();

            builder.Property(p => p.MedcardNum)
                .IsRequired()
                .HasMaxLength(50);
            builder.HasIndex(p => p.MedcardNum).IsUnique();

            builder.Property(p => p.HistoryNum)
                .HasMaxLength(50);
            builder.HasIndex(p => p.HistoryNum)
                .IsUnique()
                .HasFilter("[HistoryNum] IS NOT NULL");

            builder.Property(p => p.Status)
                .IsRequired();

            builder.HasOne(p => p.Doctor)
                .WithMany(d => d.Patients)
                .HasForeignKey(p => p.DoctorId);

            builder.HasOne(p => p.Department)
                .WithMany(d => d.Patients)
                .HasForeignKey(p => p.DepartmentId);

            builder.HasOne(p => p.Institution)
                .WithMany(i => i.Patients)
                .HasForeignKey(p => p.InstitutionId);
        }
    }
}
