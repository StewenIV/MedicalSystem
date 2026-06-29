using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Enums;
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
                    .FirstOrDefaultAsync(u => u.Id == performedByUserId.Value, token);
                if (user != null)
                {
                    performedStaffId = user.MedicalStaffId;
                    if (user.MedicalStaff != null)
                    {
                        doneByText = $"{user.MedicalStaff.Name} ({user.MedicalStaff.Position})";
                    }
                    else
                    {
                        doneByText = user.DisplayName ?? user.Login;
                    }
                }
            }

            if (!performedStaffId.HasValue)
            {
                var fallbackStaff = await _context.MedicalStaff.FirstOrDefaultAsync(token);
                if (fallbackStaff != null)
                {
                    performedStaffId = fallbackStaff.Id;
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
                    if (medicine.CurrentBalance < 0m) medicine.CurrentBalance = 0m;
                }
                else
                {
                    medicine.CurrentBalance += amountToDeduct;
                }

                
                medicine.Status = medicine.CurrentBalance <= 0m
                    ? MedicineStatus.Empty
                    : (medicine.CurrentBalance < medicine.MinBalance ? MedicineStatus.Low : MedicineStatus.Norm);

                
                medicine.LastChangedById = performedStaffId;
                medicine.LastUpdated = System.DateTime.UtcNow;
                medicine.LastOperation = deduct ? OperationType.Writeoff : OperationType.Adjustment;

                var log = new BedActionLog
                {
                    Id = System.Guid.NewGuid(),
                    PatientId = prescription.PatientId,
                    PerformedById = performedStaffId,
                    PerformedByName = doneByText,
                    Action = deduct ? $"Выполнено назначение: {prescription.Name}" : $"Отменено назначение: {prescription.Name}",
                    Amount = deduct ? $"-{amountToDeduct} {MedicalSystem.App.Services.MedicineEnumMapper.ToFrontend(medicine.Unit)}" : $"+{amountToDeduct} {MedicalSystem.App.Services.MedicineEnumMapper.ToFrontend(medicine.Unit)}",
                    PerformedAt = System.DateTime.UtcNow
                };
                _context.BedActionLogs.Add(log);

                
                var opLog = new MedicineOperationLog
                {
                    Id = System.Guid.NewGuid(),
                    MedicineId = medicine.Id,
                    PerformedAt = System.DateTime.UtcNow,
                    Type = deduct ? OperationType.Writeoff : OperationType.Adjustment,
                    Quantity = amountToDeduct,
                    BalanceAfter = medicine.CurrentBalance,
                    PerformedById = performedStaffId ?? System.Guid.Empty,
                    Comment = deduct
                        ? "Списано автоматически при выполнении назначения в листе обхода."
                        : "Отмена выполнения назначения в листе обхода.",
                    Reason = deduct ? WriteOffReason.Patient : WriteOffReason.Adjustment,
                    PatientId = prescription.PatientId,
                    PrescriptionId = prescription.PatientMedicationId
                };
                _context.MedicineOperationLogs.Add(opLog);

                await _context.SaveChangesAsync(token);
            }

            return (performedStaffId, doneByText);
        }
    }
}
