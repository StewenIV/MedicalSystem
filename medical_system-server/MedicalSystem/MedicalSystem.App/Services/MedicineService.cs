using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Enums;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Services
{
    public class MedicineService
    {
        private readonly IMedicineStorage _medicineStorage;

        public MedicineService(IMedicineStorage medicineStorage)
        {
            _medicineStorage = medicineStorage;
        }

        private MedicineStatus ComputeStatus(decimal balance, decimal minBalance)
        {
            if (balance == 0) return MedicineStatus.Empty;
            if (balance <= minBalance) return MedicineStatus.Low;
            return MedicineStatus.Norm;
        }

        private async Task<Guid?> GetStaffIdFromUserId(Guid? userId, CancellationToken token)
        {
            if (!userId.HasValue) return null;
            return await _medicineStorage.GetMedicalStaffIdByUserIdAsync(userId.Value, token);
        }

        public async Task<Medicine> AddMedicineAsync(CreateMedicineDto dto, Guid? userId, CancellationToken token)
        {
            var staffId = await GetStaffIdFromUserId(userId, token);
            var now = DateTime.UtcNow;

            var exists = await _medicineStorage.ExistsByNameAsync(dto.Name, token);
            if (exists)
            {
                throw new InvalidOperationException("Препарат с таким названием уже существует в системе.");
            }
            
            var initialBalance = Math.Round(dto.InitialBalance, 0);
            var minBalance = Math.Round(dto.MinBalance, 0);

            var med = new Medicine
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                Category = MedicineEnumMapper.ToBackendCategory(dto.Category),
                Unit = MedicineEnumMapper.ToBackendUnit(dto.Unit),
                CurrentBalance = initialBalance,
                MinBalance = minBalance,
                TotalReceived = initialBalance,
                TotalWrittenOff = 0,
                LastReceiptDate = initialBalance > 0 ? now : null,
                LastWriteOffDate = null,
                LastReceiptFrom = null,
                LastOperation = initialBalance > 0 ? OperationType.Receipt : null,
                LastChangedById = staffId,
                LastUpdated = now,
                Status = ComputeStatus(initialBalance, minBalance),
                IsArchived = false
            };

            await _medicineStorage.AddAsync(med, token);

            if (initialBalance > 0 && staffId.HasValue)
            {
                var log = new MedicineOperationLog
                {
                    Id = Guid.NewGuid(),
                    MedicineId = med.Id,
                    PerformedAt = now,
                    Type = OperationType.Receipt,
                    Quantity = initialBalance,
                    BalanceAfter = initialBalance,
                    PerformedById = staffId.Value,
                    Comment = "Первичный ввод препарата"
                };
                await _medicineStorage.AddOperationLogAsync(log, token);
            }

            return med;
        }

        public async Task UpdateMedicineAsync(Guid id, UpdateMedicineDto dto, Guid? userId, CancellationToken token)
        {
            var staffId = await GetStaffIdFromUserId(userId, token);
            var med = await _medicineStorage.GetAsync(id, token);
            if (med == null) throw new KeyNotFoundException("Препарат не найден");

            var exists = await _medicineStorage.ExistsByNameAsync(id, dto.Name, token);
            if (exists)
            {
                throw new InvalidOperationException("Препарат с таким названием уже существует в системе.");
            }

            var oldBalance = med.CurrentBalance;
            var newBalance = Math.Round(dto.CurrentBalance, 0);
            var minBalance = Math.Round(dto.MinBalance, 0);
            var balanceChanged = oldBalance != newBalance;
            var now = DateTime.UtcNow;

            med.Name = dto.Name;
            med.Description = dto.Description;
            med.Category = MedicineEnumMapper.ToBackendCategory(dto.Category);
            med.Unit = MedicineEnumMapper.ToBackendUnit(dto.Unit);
            med.CurrentBalance = newBalance;
            med.MinBalance = minBalance;
            med.Status = ComputeStatus(newBalance, minBalance);
            med.LastChangedById = staffId;
            med.LastUpdated = now;

            if (balanceChanged)
            {
                med.LastOperation = OperationType.Adjustment;
            }

            await _medicineStorage.UpdateAsync(med, token);

            if (balanceChanged && staffId.HasValue)
            {
                var log = new MedicineOperationLog
                {
                    Id = Guid.NewGuid(),
                    MedicineId = med.Id,
                    PerformedAt = now,
                    Type = OperationType.Adjustment,
                    Quantity = Math.Abs(newBalance - oldBalance),
                    BalanceAfter = newBalance,
                    PerformedById = staffId.Value,
                    Comment = $"Корректировка остатка с {oldBalance} до {newBalance}"
                };
                await _medicineStorage.AddOperationLogAsync(log, token);
            }
        }

        public async Task DeleteOrArchiveMedicineAsync(Guid id, CancellationToken token)
        {
            var hasLogs = await _medicineStorage.HasOperationLogsAsync(id, token);
            if (hasLogs)
            {
                var med = await _medicineStorage.GetAsync(id, token);
                if (med != null)
                {
                    med.IsArchived = true;
                    await _medicineStorage.UpdateAsync(med, token);
                }
            }
            else
            {
                await _medicineStorage.RemoveAsync(id, token);
            }
        }

        public async Task RecordReceiptAsync(Guid id, RecordReceiptDto dto, Guid? userId, CancellationToken token)
        {
            var staffId = await GetStaffIdFromUserId(userId, token);
            if (!staffId.HasValue) throw new InvalidOperationException("Пользователь не авторизован");

            var med = await _medicineStorage.GetAsync(id, token);
            if (med == null) throw new KeyNotFoundException("Препарат не найден");

            var parsedDate = DateTime.TryParse(dto.Date, out var d) ? d : DateTime.UtcNow;
            parsedDate = parsedDate.Add(DateTime.Now.TimeOfDay);

            var quantity = Math.Round(dto.Quantity, 0);

            med.CurrentBalance += quantity;
            med.TotalReceived += quantity;
            med.LastReceiptDate = parsedDate;
            med.LastReceiptFrom = dto.Supplier;
            med.LastOperation = OperationType.Receipt;
            med.LastChangedById = staffId;
            med.LastUpdated = DateTime.UtcNow;
            med.Status = ComputeStatus(med.CurrentBalance, med.MinBalance);

            await _medicineStorage.UpdateAsync(med, token);

            var log = new MedicineOperationLog
            {
                Id = Guid.NewGuid(),
                MedicineId = med.Id,
                PerformedAt = parsedDate,
                Type = OperationType.Receipt,
                Quantity = quantity,
                BalanceAfter = med.CurrentBalance,
                PerformedById = staffId.Value,
                Comment = dto.Comment,
                Supplier = dto.Supplier
            };
            await _medicineStorage.AddOperationLogAsync(log, token);
        }

        public async Task RecordWriteoffAsync(Guid id, RecordWriteoffDto dto, Guid? userId, CancellationToken token)
        {
            var staffId = await GetStaffIdFromUserId(userId, token);
            if (!staffId.HasValue) throw new InvalidOperationException("Пользователь не авторизован");

            var med = await _medicineStorage.GetAsync(id, token);
            if (med == null) throw new KeyNotFoundException("Препарат не найден");

            var quantity = Math.Round(dto.Quantity, 0);

            if (med.CurrentBalance < quantity)
                throw new InvalidOperationException("Недостаточно препарата на складе");

            var parsedDate = DateTime.TryParse(dto.Date, out var d) ? d : DateTime.UtcNow;
            parsedDate = parsedDate.Add(DateTime.Now.TimeOfDay);

            med.CurrentBalance -= quantity;
            med.TotalWrittenOff += quantity;
            med.LastWriteOffDate = parsedDate;
            med.LastOperation = OperationType.Writeoff;
            med.LastChangedById = staffId;
            med.LastUpdated = DateTime.UtcNow;
            med.Status = ComputeStatus(med.CurrentBalance, med.MinBalance);

            await _medicineStorage.UpdateAsync(med, token);

            var log = new MedicineOperationLog
            {
                Id = Guid.NewGuid(),
                MedicineId = med.Id,
                PerformedAt = parsedDate,
                Type = OperationType.Writeoff,
                Quantity = quantity,
                BalanceAfter = med.CurrentBalance,
                PerformedById = staffId.Value,
                Comment = dto.Comment,
                Reason = MedicineEnumMapper.ToBackendReason(dto.Reason),
                PatientId = dto.PatientId
            };
            await _medicineStorage.AddOperationLogAsync(log, token);
        }
    }
}
