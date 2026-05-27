using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class MedicalStaffConfiguration : IEntityTypeConfiguration<MedicalStaff>
    {
        public void Configure(EntityTypeBuilder<MedicalStaff> builder)
        {
            builder.ToTable("MedicalStaff");

            builder.HasKey(ms => ms.Id);

            builder.Property(ms => ms.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.HasOne(ms => ms.Position)
                .WithMany(p => p.MedicalStaff)
                .HasForeignKey(ms => ms.PositionId);

            builder.HasOne(ms => ms.Department)
                .WithMany(d => d.MedicalStaff)
                .HasForeignKey(ms => ms.DepartmentId);
        }
    }
}
