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

        public async System.Threading.Tasks.Task<(System.Guid? performedStaffId, string? doneByText)> UpdateBalanceAsync(System.Guid prescriptionId, bool deduct, System.Guid? performedByUserId, System.Threading.CancellationToken token)
        {
            var prescription = await _context.BedPrescriptions
                .Include(p => p.PatientMedication)
                .ThenInclude(pm => pm.Medicine)
                .FirstOrDefaultAsync(p => p.Id == prescriptionId, token);

            System.Guid? performedStaffId = null;
            string? doneByText = null;

            if (performedByUserId.HasValue)
            {
                var user = await _context.Users
                    .Include(u => u.MedicalStaff)
                    .ThenInclude(ms => ms.Position)
                    .FirstOrDefaultAsync(u => u.Id == performedByUserId.Value, token);
                if (user != null)
                {
                    performedStaffId = user.MedicalStaffId;
                    if (user.MedicalStaff != null)
                    {
                        doneByText = $"{user.MedicalStaff.Name} ({user.MedicalStaff.Position.Name})";
                    }
                    else
                    {
                        doneByText = user.DisplayName ?? user.Login;
                    }
                }
            }

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
                    PerformedById = performedStaffId,
                    PerformedByName = doneByText,
                    Action = deduct ? $"Выполнено назначение: {prescription.Name}" : $"Отменено назначение: {prescription.Name}",
                    Amount = deduct ? $"-{amountToDeduct} {medicine.Unit.ToString().ToLower()}" : $"+{amountToDeduct} {medicine.Unit.ToString().ToLower()}",
                    PerformedAt = System.DateTime.UtcNow
                };
                _context.BedActionLogs.Add(log);

                await _context.SaveChangesAsync(token);
            }

            return (performedStaffId, doneByText);
        }
    }
}
