using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IPrescriptionStorage : IStorage<BedPrescription>
    {
        System.Threading.Tasks.Task UpdateBalanceAsync(System.Guid prescriptionId, bool deduct, System.Threading.CancellationToken token);
    }
}
