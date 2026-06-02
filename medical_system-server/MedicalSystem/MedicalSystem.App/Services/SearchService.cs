using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;

namespace MedicalSystem.App.Services
{
    public class SearchService
    {
        private readonly IPatientSearchQuery _query;

        public SearchService(IPatientSearchQuery query)
        {
            _query = query;
        }

        public Task<PagedResultDto<PatientSearchItemDto>> SearchPatientsAsync(string query, int page, int pageSize, CancellationToken token = default)
        {
            return _query.SearchPatientsAsync(query, page, pageSize, token);
        }

        public Task<List<DoctorSelectItemDto>> SearchDoctorsAsync(string query, Guid? departmentId = null, Guid? institutionId = null, CancellationToken token = default)
        {
            return _query.SearchDoctorsAsync(query, departmentId, institutionId, token);
        }
    }
}
