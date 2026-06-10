using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IPrescriptionStorage : IStorage<BedPrescription>
    {
        System.Threading.Tasks.Task<(System.Guid? performedStaffId, string? doneByText)> UpdateBalanceAsync(System.Guid prescriptionId, bool deduct, System.Guid? performedByUserId, System.Threading.CancellationToken token);
    }
}
