using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Data.DbContext;
using MedicalSystem.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Data.Storages
{
    public class ShiftStorage : BaseStorage<Shift>, IShiftStorage
    {
        public ShiftStorage(MedicalSystemDbContext context) : base(context)
        {
        }

        public async Task<Shift?> GetByStaffAndDateAsync(Guid staffId, DateTime date, CancellationToken token)
        {
            return await _context.Shifts
                .FirstOrDefaultAsync(s => s.StaffId == staffId && s.Date.Date == date.Date, token);
        }
    }
}
