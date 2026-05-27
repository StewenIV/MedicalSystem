using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;

namespace MedicalSystem.Data.Storages
{
    public class OperationStorage : BaseStorage<Operation>, IOperationStorage
    {
        public OperationStorage(MedicalSystemDbContext context) : base(context)
        {
        }
    }
}
