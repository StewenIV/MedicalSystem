using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.Data.EntityConfigurations
{
    public class OperationConfiguration : IEntityTypeConfiguration<Operation>
    {
        public void Configure(EntityTypeBuilder<Operation> builder)
        {
            builder.ToTable("Operations");
            builder.HasKey(o => o.Id);
            builder.Property(o => o.Name).IsRequired().HasMaxLength(200);
            builder.Property(o => o.Diagnosis).HasMaxLength(300);
            builder.Property(o => o.Description).HasMaxLength(1000);
            builder.Property(o => o.Complications).HasMaxLength(500);
            builder.Property(o => o.Implants).HasMaxLength(300);
            builder.Property(o => o.Result).HasMaxLength(300);

            builder.HasOne(o => o.Patient)
                .WithMany(p => p.Operations)
                .HasForeignKey(o => o.PatientId);
        }
    }
}
