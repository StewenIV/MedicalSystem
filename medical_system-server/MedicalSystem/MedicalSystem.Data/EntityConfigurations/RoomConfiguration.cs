using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Enums;
using System;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder.ToTable("Rooms");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.RoomNumber)
                .IsRequired()
                .HasMaxLength(10);
            builder.HasIndex(r => r.RoomNumber).IsUnique();

            builder.Property(r => r.Floor)
                .IsRequired();

            builder.Property(r => r.Gender)
                .HasConversion(
                    v => v.ToString(),
                    v => (RoomGender)Enum.Parse(typeof(RoomGender), v))
                .HasMaxLength(50);

            builder.Property(r => r.Status)
                .IsRequired()
                .HasConversion(
                    v => v.ToString(),
                    v => (RoomStatus)Enum.Parse(typeof(RoomStatus), v))
                .HasMaxLength(50);

            builder.HasOne(r => r.Department)
                .WithMany(d => d.Rooms)
                .HasForeignKey(r => r.DepartmentId);
        }
    }
}