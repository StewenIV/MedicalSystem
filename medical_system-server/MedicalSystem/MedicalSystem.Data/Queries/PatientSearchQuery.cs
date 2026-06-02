using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Data.Queries
{
    public class PatientSearchQuery : IPatientSearchQuery
    {
        private readonly MedicalSystemDbContext _context;

        public PatientSearchQuery(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDto<PatientSearchItemDto>> SearchPatientsAsync(string query, int page, int pageSize, CancellationToken token = default)
        {
            var dbQuery = _context.Patients.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                var lowerQuery = query.ToLower();
                dbQuery = dbQuery.Where(p =>
                    (p.FirstName != null && p.FirstName.ToLower().Contains(lowerQuery)) ||
                    (p.LastName != null && p.LastName.ToLower().Contains(lowerQuery)) ||
                    (p.MiddleName != null && p.MiddleName.ToLower().Contains(lowerQuery)) ||
                    (p.HistoryNum != null && p.HistoryNum.ToLower().Contains(lowerQuery)) ||
                    (p.Contacts.PhoneMobile != null && p.Contacts.PhoneMobile.Contains(query)) ||
                    (p.Contacts.PhoneHome != null && p.Contacts.PhoneHome.Contains(query))
                );
            }

            var totalCount = await dbQuery.CountAsync(token);
            var items = await dbQuery
                .OrderBy(p => p.LastName)
                .ThenBy(p => p.FirstName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PatientSearchItemDto
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    MiddleName = p.MiddleName,
                    Gender = p.Gender,
                    Age = (int)((DateTime.UtcNow - p.DateOfBirth).TotalDays / 365.25)
                })
                .ToListAsync(token);

            return new PagedResultDto<PatientSearchItemDto>
            {
                Items = items,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };
        }

        public async Task<List<DoctorSelectItemDto>> SearchDoctorsAsync(string query, Guid? departmentId = null, Guid? institutionId = null, CancellationToken token = default)
        {
            var dbQuery = _context.MedicalStaff.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                var lowerQuery = query.ToLower();
                dbQuery = dbQuery.Where(d => d.Name != null && d.Name.ToLower().Contains(lowerQuery));
            }

            if (departmentId.HasValue)
            {
                dbQuery = dbQuery.Where(d => d.DepartmentId == departmentId.Value);
            }

            return await dbQuery
                .OrderBy(d => d.Name)
                .Select(d => new DoctorSelectItemDto
                {
                    Id = d.Id,
                    FullName = d.Name,
                    Position = d.Position != null ? d.Position.Name : null,
                    Department = d.Department != null ? d.Department.Name : null
                })
                .ToListAsync(token);
        }
    }
}
