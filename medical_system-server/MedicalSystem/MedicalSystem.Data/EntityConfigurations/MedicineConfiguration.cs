using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Enums;
using System;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class MedicineConfiguration : IEntityTypeConfiguration<Medicine>
    {
        public void Configure(EntityTypeBuilder<Medicine> builder)
        {
            builder.ToTable("Medicines");

            builder.HasKey(m => m.Id);

            builder.Property(m => m.Name)
                .IsRequired()
                .HasMaxLength(200);
            builder.HasIndex(m => m.Name).IsUnique();

            builder.Property(m => m.CurrentBalance)
                .HasColumnType("decimal(10,3)");

            builder.Property(m => m.MinBalance)
                .HasColumnType("decimal(10,3)");
            
            builder.Property(m => m.TotalReceived)
                .HasColumnType("decimal(10,3)");

            builder.Property(m => m.TotalWrittenOff)
                .HasColumnType("decimal(10,3)");

            builder.Property(m => m.Category)
                .HasConversion(
                    v => v.ToString(),
                    v => (MedicineCategory)Enum.Parse(typeof(MedicineCategory), v))
                .HasMaxLength(50);

            builder.Property(m => m.Unit)
                .HasConversion(
                    v => v.ToString(),
                    v => (MedicineUnit)Enum.Parse(typeof(MedicineUnit), v))
                .HasMaxLength(50);

            builder.Property(m => m.LastOperation)
                .HasConversion(
                    v => v.ToString(),
                    v => (OperationType)Enum.Parse(typeof(OperationType), v))
                .HasMaxLength(50);

            builder.Property(m => m.Status)
                .HasConversion(
                    v => v.ToString(),
                    v => (MedicineStatus)Enum.Parse(typeof(MedicineStatus), v))
                .HasMaxLength(50);
        }
    }
}