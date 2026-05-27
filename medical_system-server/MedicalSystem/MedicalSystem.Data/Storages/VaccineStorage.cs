using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;

namespace MedicalSystem.Data.Storages
{
    public class VaccineStorage : BaseStorage<Vaccine>, IVaccineStorage
    {
        public VaccineStorage(MedicalSystemDbContext context) : base(context)
        {
        }
    }
}
