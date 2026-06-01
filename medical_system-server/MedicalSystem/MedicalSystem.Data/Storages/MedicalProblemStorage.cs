using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;

namespace MedicalSystem.Data.Storages
{
    public class MedicalProblemStorage : BaseStorage<MedicalProblem>, IMedicalProblemStorage
    {
        public MedicalProblemStorage(MedicalSystemDbContext context) : base(context)
        {
        }
    }
}
