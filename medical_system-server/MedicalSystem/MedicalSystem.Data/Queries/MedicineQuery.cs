using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Services;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Data.Queries
{
    public class MedicineQuery : IMedicineQuery
    {
        private readonly MedicalSystemDbContext _context;

        public MedicineQuery(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task<MedicineDashboardDto> GetDashboardAsync(CancellationToken token)
        {
            var meds = await _context.Medicines
                .Where(m => !m.IsArchived)
                .Select(m => new MedicineDto
                {
                    Name = m.Name,
                    CurrentBalance = m.CurrentBalance,
                    Status = MedicineEnumMapper.ToFrontend(m.Status)
                })
                .ToListAsync(token);

            return new MedicineDashboardDto { Medicines = meds };
        }

        public async Task<IEnumerable<MedicineDetailsDto>> GetAllMedicinesAsync(CancellationToken token)
        {
            var meds = await _context.Medicines
                .AsNoTracking()
                .Include(m => m.LastChangedBy)
                .Include(m => m.MedicineOperationLogs).ThenInclude(l => l.PerformedBy)
                .Include(m => m.MedicineOperationLogs).ThenInclude(l => l.Patient)
                .ToListAsync(token);

            return meds.Select(m => new MedicineDetailsDto
            {
                Id = m.Id.ToString(),
                Name = m.Name,
                Description = m.Description ?? "",
                Category = MedicineEnumMapper.ToFrontend(m.Category),
                Unit = MedicineEnumMapper.ToFrontend(m.Unit),
                CurrentBalance = m.CurrentBalance,
                MinBalance = m.MinBalance,
                TotalReceived = m.TotalReceived,
                TotalWrittenOff = m.TotalWrittenOff,
                LastReceiptDate = m.LastReceiptDate?.ToString("yyyy-MM-dd"),
                LastWriteOffDate = m.LastWriteOffDate?.ToString("yyyy-MM-dd"),
                LastReceiptFrom = m.LastReceiptFrom,
                LastOperation = m.MedicineOperationLogs.Any()
                    ? MedicineEnumMapper.ToFrontend(m.MedicineOperationLogs.OrderByDescending(l => l.PerformedAt).First().Type)
                    : (m.LastOperation.HasValue ? MedicineEnumMapper.ToFrontend(m.LastOperation.Value) : null),
                LastChangedBy = m.LastChangedBy?.Name,
                LastUpdated = m.LastUpdated?.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                Status = MedicineEnumMapper.ToFrontend(m.Status),
                IsArchived = m.IsArchived,
                OperationLog = m.MedicineOperationLogs
                    .OrderByDescending(l => l.PerformedAt)
                    .Select(l => new MedicineOperationLogDto
                    {
                        Id = l.Id.ToString(),
                        Date = l.PerformedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                        Type = MedicineEnumMapper.ToFrontend(l.Type),
                        Quantity = l.Quantity,
                        BalanceAfter = l.BalanceAfter,
                        PerformedBy = l.PerformedBy?.Name ?? "Система",
                        PerformedById = l.PerformedById.ToString(),
                        Comment = l.Comment ?? "",
                        PatientId = l.PatientId?.ToString(),
                        PatientName = l.Patient != null ? $"{l.Patient.LastName} {l.Patient.FirstName} {l.Patient.MiddleName}" : null,
                        PrescriptionId = l.PrescriptionId?.ToString(),
                        Supplier = l.Supplier,
                        Reason = MedicineEnumMapper.ToFrontend(l.Reason)
                    })
                    .ToList()
            }).ToList();
        }
    }
}
