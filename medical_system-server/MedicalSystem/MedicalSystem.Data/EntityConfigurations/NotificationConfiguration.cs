using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Enums;
using System;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.ToTable("Notifications");

            builder.HasKey(n => n.Id);

            builder.Property(n => n.Message).IsRequired().HasMaxLength(500);

            builder.Property(n => n.Type)
                .HasConversion(
                    v => v.ToString(),
                    v => (NotificationType)Enum.Parse(typeof(NotificationType), v))
                .HasMaxLength(50);

            builder.Property(n => n.RecipientType)
                .HasConversion(
                    v => v.ToString(),
                    v => (RecipientType)Enum.Parse(typeof(RecipientType), v))
                .HasMaxLength(50)
                .HasDefaultValue(RecipientType.Staff);

            builder.Property(n => n.Severity)
                .HasConversion(
                    v => v.ToString(),
                    v => (SeverityType)Enum.Parse(typeof(SeverityType), v))
                .HasMaxLength(50);

            builder.HasOne(n => n.Recipient)
                .WithMany(r => r.Notifications)
                .HasForeignKey(n => n.RecipientId);

            builder.HasOne(n => n.Patient)
                .WithMany(p => p.Notifications)
                .HasForeignKey(n => n.PatientId);

            builder.HasOne(n => n.PatientRecipient)
                .WithMany()
                .HasForeignKey(n => n.PatientRecipientId);

        }
    }
}