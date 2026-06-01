using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class ShiftConfiguration : IEntityTypeConfiguration<Shift>
    {
        public void Configure(EntityTypeBuilder<Shift> builder)
        {
            builder.ToTable("Shifts");
            builder.HasKey(s => s.Id);
            builder.Property(s => s.Date).IsRequired();
            builder.Property(s => s.Hours).IsRequired();

            builder.HasIndex(s => new { s.StaffId, s.Date }).IsUnique();

            builder.HasOne(s => s.Staff)
                .WithMany(st => st.Shifts)
                .HasForeignKey(s => s.StaffId);
        }
    }
}
