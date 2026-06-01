using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Data.Storages
{
    public class PrescriptionStorage : BaseStorage<BedPrescription>, IPrescriptionStorage
    {
        public PrescriptionStorage(MedicalSystemDbContext context) : base(context)
        {
        }

        public async System.Threading.Tasks.Task UpdateBalanceAsync(System.Guid prescriptionId, bool deduct, System.Threading.CancellationToken token)
        {
            var prescription = await _context.BedPrescriptions
                .Include(p => p.PatientMedication)
                .ThenInclude(pm => pm.Medicine)
                .FirstOrDefaultAsync(p => p.Id == prescriptionId, token);

            if (prescription?.PatientMedication?.Medicine != null)
            {
                var medicine = prescription.PatientMedication.Medicine;
                decimal amountToDeduct = 1m;
                if (!string.IsNullOrEmpty(prescription.Dose))
                {
                    var doseStr = new string(prescription.Dose.TakeWhile(c => char.IsDigit(c) || c == '.' || c == ',').ToArray());
                    if (decimal.TryParse(doseStr.Replace(",", "."), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var parsedDose))
                    {
                        amountToDeduct = parsedDose;
                    }
                }

                if (deduct)
                {
                    medicine.CurrentBalance -= amountToDeduct;
                }
                else
                {
                    medicine.CurrentBalance += amountToDeduct;
                }

                var log = new BedActionLog
                {
                    Id = System.Guid.NewGuid(),
                    PatientId = prescription.PatientId,
                    Action = deduct ? $"Выполнено назначение: {prescription.Name}" : $"Отменено назначение: {prescription.Name}",
                    Amount = deduct ? $"-{amountToDeduct} {medicine.Unit.ToString().ToLower()}" : $"+{amountToDeduct} {medicine.Unit.ToString().ToLower()}",
                    PerformedAt = System.DateTime.UtcNow
                };
                _context.BedActionLogs.Add(log);

                await _context.SaveChangesAsync(token);
            }
        }
    }
}
