using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;

namespace MedicalSystem.Data.Storages
{
    public class PrescriptionStorage : BaseStorage<BedPrescription>, IPrescriptionStorage
    {
        public PrescriptionStorage(MedicalSystemDbContext context) : base(context)
        {
        }
    }
}
