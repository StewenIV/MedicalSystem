using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class PositionConfiguration : IEntityTypeConfiguration<Position>
    {
        public void Configure(EntityTypeBuilder<Position> builder)
        {
            builder.ToTable("Positions");
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Name).IsRequired().HasMaxLength(100);
        }
    }
}
