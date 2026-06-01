using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;

namespace MedicalSystem.Data.Storages
{
    public class BedOccupancyHistoryStorage : BaseStorage<BedOccupancyHistory>, IBedOccupancyHistoryStorage
    {
        public BedOccupancyHistoryStorage(MedicalSystemDbContext context) : base(context)
        {
        }
    }
}
