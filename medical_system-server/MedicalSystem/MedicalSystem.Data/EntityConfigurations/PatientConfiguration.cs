using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
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
                .HasFilter("\"HistoryNum\" IS NOT NULL");

            builder.Property(p => p.Status)
                .IsRequired();

            // Конфигурация Owned Entities
            builder.OwnsOne(p => p.Contacts, contacts =>
            {
                contacts.Property(c => c.PhoneMobile).HasMaxLength(20);
                contacts.Property(c => c.PhoneHome).HasMaxLength(20);
                contacts.Property(c => c.Email).HasMaxLength(150);
                contacts.Property(c => c.Address).HasMaxLength(300);
                contacts.Property(c => c.Zip).HasMaxLength(10);
                contacts.Property(c => c.Country).HasMaxLength(100);
                contacts.Property(c => c.Region).HasMaxLength(100);
                contacts.Property(c => c.City).HasMaxLength(100);
            });

            builder.OwnsOne(p => p.Passport, passport =>
            {
                passport.Property(pp => pp.SeriesNumber).HasMaxLength(20);
                passport.Property(pp => pp.IssuedBy).HasMaxLength(300);
            });

            builder.OwnsOne(p => p.Work, work =>
            {
                work.Property(w => w.Profession).HasMaxLength(150);
                work.Property(w => w.Organization).HasMaxLength(200);
                work.Property(w => w.Address).HasMaxLength(300);
            });

            builder.OwnsOne(p => p.Other, other =>
            {
                other.Property(o => o.Language).HasMaxLength(50);
                other.Property(o => o.Nationality).HasMaxLength(100);
                other.Property(o => o.CauseOfDeath).HasMaxLength(500);
            });


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
