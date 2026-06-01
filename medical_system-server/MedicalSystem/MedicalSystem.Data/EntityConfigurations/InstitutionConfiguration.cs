using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class InstitutionConfiguration : IEntityTypeConfiguration<Institution>
    {
        public void Configure(EntityTypeBuilder<Institution> builder)
        {
            builder.ToTable("Institutions");
            builder.HasKey(i => i.Id);
            builder.Property(i => i.Name).IsRequired().HasMaxLength(200);
        }
    }
}
