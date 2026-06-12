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

            builder.Property(ms => ms.Position)
                .IsRequired()
                .HasMaxLength(100);

        }
    }
}
