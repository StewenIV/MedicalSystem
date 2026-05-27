using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;

namespace MedicalSystem.Data.Storages
{
    public class LabResultStorage : BaseStorage<LabResult>, ILabResultStorage
    {
        public LabResultStorage(MedicalSystemDbContext context) : base(context)
        {
        }
    }
}
