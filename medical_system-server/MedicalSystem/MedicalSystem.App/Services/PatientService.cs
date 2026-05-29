using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;

namespace MedicalSystem.App.Services
{
    public class PatientService
    {
        private readonly IPatientQuery _patientQuery;

        public PatientService(IPatientQuery patientQuery)
        {
            _patientQuery = patientQuery;
        }

        public async Task<PatientCardDto?> GetPatientCardAsync(Guid patientId, CancellationToken token)
        {
            // В будущем здесь может быть дополнительная логика:
            // - Проверка прав доступа
            // - Логирование
            // - Координация нескольких репозиториев
            return await _patientQuery.GetCardByIdAsync(patientId, token);
        }
    }
}
