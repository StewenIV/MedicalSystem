using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

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
        }
    }
}
