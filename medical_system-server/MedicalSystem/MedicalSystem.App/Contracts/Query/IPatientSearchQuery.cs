using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;

namespace MedicalSystem.App.Contracts.Query
{
    public interface IPatientSearchQuery
    {
        Task<PagedResultDto<PatientSearchItemDto>> SearchPatientsAsync(string query, int page, int pageSize, CancellationToken token = default);
        Task<List<DoctorSelectItemDto>> SearchDoctorsAsync(string query, System.Guid? departmentId = null, System.Guid? institutionId = null, CancellationToken token = default);
    }
}
