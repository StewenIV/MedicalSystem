using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Data.Storages
{
    public class MedicineStorage : IMedicineStorage
    {
        private readonly MedicalSystemDbContext _context;

        public MedicineStorage(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Medicine entity, CancellationToken token)
        {
            await _context.Medicines.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
        }

        public async Task<Medicine?> GetAsync(Guid id, CancellationToken token)
        {
            return await _context.Medicines.FindAsync(new object[] { id }, token);
        }

        public async Task<IReadOnlyCollection<Medicine>> GetAllAsync(CancellationToken token)
        {
            return await _context.Medicines.ToListAsync(token);
        }

        public async Task RemoveAsync(Guid id, CancellationToken token)
        {
            var medicine = await GetAsync(id, token);
            if (medicine != null)
            {
                _context.Medicines.Remove(medicine);
                await _context.SaveChangesAsync(token);
            }
        }

        public async Task UpdateAsync(Medicine entity, CancellationToken token)
        {
            _context.Medicines.Update(entity);
            await _context.SaveChangesAsync(token);
        }

        public async Task ReceiptAsync(Guid medicineId, decimal quantity, CancellationToken token)
        {
            var medicine = await GetAsync(medicineId, token);
            if (medicine != null)
            {
                medicine.CurrentBalance += quantity;
                await UpdateAsync(medicine, token);
            }
        }

        public async Task WriteOffAsync(Guid medicineId, decimal quantity, CancellationToken token)
        {
            var medicine = await GetAsync(medicineId, token);
            if (medicine != null)
            {
                medicine.CurrentBalance -= quantity;
                await UpdateAsync(medicine, token);
            }
        }

        public async Task ArchiveAsync(Guid medicineId, CancellationToken token)
        {
            var medicine = await GetAsync(medicineId, token);
            if (medicine != null)
            {
                medicine.IsArchived = true;
                await UpdateAsync(medicine, token);
            }
        }

        public async Task AddOperationLogAsync(MedicineOperationLog log, CancellationToken token)
        {
            await _context.MedicineOperationLogs.AddAsync(log, token);
            await _context.SaveChangesAsync(token);
        }

        public async Task<Guid?> GetMedicalStaffIdByUserIdAsync(Guid userId, CancellationToken token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId, token);
            return user?.MedicalStaffId;
        }

        public async Task<bool> HasOperationLogsAsync(Guid medicineId, CancellationToken token)
        {
            return await _context.MedicineOperationLogs.AnyAsync(l => l.MedicineId == medicineId, token);
        }

        public void Add(Medicine entity) => throw new NotImplementedException();
        public Medicine? Get(Guid id) => throw new NotImplementedException();
        public IReadOnlyCollection<Medicine> GetAll() => throw new NotImplementedException();
        public void Remove(Guid id) => throw new NotImplementedException();
        public void Update(Medicine entity) => throw new NotImplementedException();
        public void Receipt(Guid medicineId, decimal quantity) => throw new NotImplementedException();
        public void WriteOff(Guid medicineId, decimal quantity) => throw new NotImplementedException();
        public void Archive(Guid medicineId) => throw new NotImplementedException();

        public async Task<bool> ExistsAsync(Guid id, CancellationToken token)
        {
            return await _context.Medicines.AnyAsync(m => m.Id == id, token);
        }

        public async Task<bool> ExistsByNameAsync(string name, CancellationToken token)
        {
            return await _context.Medicines.AnyAsync(m => m.Name.ToLower() == name.ToLower(), token);
        }

        public async Task<bool> ExistsByNameAsync(Guid excludeId, string name, CancellationToken token)
        {
            return await _context.Medicines.AnyAsync(m => m.Id != excludeId && m.Name.ToLower() == name.ToLower(), token);
        }

        public bool Exists(Guid id) => throw new NotImplementedException();
    }
}
