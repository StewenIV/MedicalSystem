using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;

namespace MedicalSystem.Data.Storages
{
    public class DocumentStorage : BaseStorage<PatientDocument>, IDocumentStorage
    {
        public DocumentStorage(MedicalSystemDbContext context) : base(context)
        {
        }
    }
}
