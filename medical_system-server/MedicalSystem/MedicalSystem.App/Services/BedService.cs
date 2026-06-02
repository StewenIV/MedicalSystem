using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Enums;
using MedicalSystem.Domain.Models;

namespace MedicalSystem.App.Services
{
    public class BedService
    {
        private readonly IBedQuery _bedQuery;
        private readonly IHospitalBedStorage _bedStorage;
        private readonly IPrescriptionStorage _prescriptionStorage;
        private readonly IPatientStorage _patientStorage;
        private readonly IMedicalProblemStorage _medicalProblemStorage;
        private readonly IBedOccupancyHistoryStorage _occupancyHistoryStorage;

        public BedService(IBedQuery bedQuery, IHospitalBedStorage bedStorage, IPrescriptionStorage prescriptionStorage, IPatientStorage patientStorage, IMedicalProblemStorage medicalProblemStorage, IBedOccupancyHistoryStorage occupancyHistoryStorage)
        {
            _bedQuery = bedQuery;
            _bedStorage = bedStorage;
            _prescriptionStorage = prescriptionStorage;
            _patientStorage = patientStorage;
            _medicalProblemStorage = medicalProblemStorage;
            _occupancyHistoryStorage = occupancyHistoryStorage;
        }

        public Task<BedsSummaryDto> GetBedsSummaryAsync(int? floor, string? status, CancellationToken token) => _bedQuery.GetBedsSummaryAsync(floor, status, token);
        public Task<RoomsWithBedsDto> GetRoomsWithBedsAsync(int? floor, CancellationToken token) => _bedQuery.GetRoomsWithBedsAsync(floor, token);
        public Task<RoomConfigDto> GetRoomConfigAsync(CancellationToken token) => _bedQuery.GetRoomConfigAsync(token);
        public Task<FloorsDto> GetFloorsAsync(CancellationToken token) => _bedQuery.GetFloorsAsync(token);
        public Task<AlertsDto> GetAlertsAsync(CancellationToken token) => _bedQuery.GetAlertsAsync(token);
        public Task<BedDto> GetBedByIdAsync(Guid bedId, CancellationToken token) => _bedQuery.GetBedByIdAsync(bedId, token);
        public Task<PatientDetailsDto> GetPatientDetailsAsync(Guid patientId, CancellationToken token) => _bedQuery.GetPatientDetailsAsync(patientId, token);

        public async Task UpdatePrescriptionStatusAsync(Guid patientId, Guid prescriptionId, bool isDone, CancellationToken token)
        {
            var prescription = await _prescriptionStorage.GetAsync(prescriptionId, token);
            
            if (prescription != null && prescription.PatientId == patientId)
            {
                // Only change if the status is actually changing
                if (prescription.IsDone != isDone)
                {
                    prescription.IsDone = isDone;
                    if (isDone)
                    {
                        prescription.DoneAt = DateTime.UtcNow;
                        prescription.DoneBy = "Текущий пользователь"; // Заглушка, пока нет авторизации
                        await _prescriptionStorage.UpdateBalanceAsync(prescriptionId, deduct: true, token);
                    }
                    else
                    {
                        prescription.DoneAt = null;
                        prescription.DoneBy = null;
                        await _prescriptionStorage.UpdateBalanceAsync(prescriptionId, deduct: false, token);
                    }
                    await _prescriptionStorage.UpdateAsync(prescription, token);
                }
            }
        }

        public async Task UpdateBedStatusAsync(Guid bedId, UpdateBedStatusRequest request, CancellationToken token)
        {
            var bed = await _bedStorage.GetAsync(bedId, token);
            if (bed != null && Enum.TryParse<BedStatus>(request.Status, true, out var newStatus))
            {
                bed.Status = newStatus;
                if (newStatus == BedStatus.Attention || newStatus == BedStatus.Urgent)
                {
                    bed.BedNote = request.AttentionNote;
                }
                await _bedStorage.UpdateAsync(bed, token);
            }
        }

        public async Task AdmitPatientAsync(Guid bedId, AdmitPatientRequest request, CancellationToken token)
        {
            var bed = await _bedStorage.GetAsync(bedId, token);
            if (bed != null && bed.PatientId == null)
            {
                // 1. Занимаем койку
                bed.PatientId = request.PatientId;
                bed.AdmissionDate = request.AdmissionDate;
                bed.Status = BedStatus.Stable;
                await _bedStorage.UpdateAsync(bed, token);

                // 2. Обновляем статус пациента и назначаем врача
                var patient = await _patientStorage.GetAsync(request.PatientId, token);
                if (patient != null)
                {
                    patient.DoctorId = request.DoctorId;
                    patient.Status = PatientStatus.Hospitalized;
                    await _patientStorage.UpdateAsync(patient, token);
                }

                // 3. Создаем новую запись о диагнозе в MedicalProblems
                if (!string.IsNullOrWhiteSpace(request.Diagnosis))
                {
                    var newProblem = new MedicalProblem
                    {
                        Id = Guid.NewGuid(),
                        PatientId = request.PatientId,
                        Name = request.Diagnosis,
                        IsActive = true,
                        DiseaseStatus = "Острое", // Или другой статус по умолчанию
                        DiagnosisDate = request.AdmissionDate
                    };
                    await _medicalProblemStorage.AddAsync(newProblem, token);
                }

                // 4. Добавляем запись в историю
                var history = new BedOccupancyHistory
                {
                    Id = Guid.NewGuid(),
                    BedId = bed.Id,
                    PatientId = request.PatientId,
                    AdmittedAt = request.AdmissionDate
                };
                await _occupancyHistoryStorage.AddAsync(history, token);
            }
        }

        public async Task DischargePatientAsync(Guid bedId, CancellationToken token)
        {
            var bed = await _bedStorage.GetAsync(bedId, token);
            if (bed != null && bed.PatientId.HasValue)
            {
                var patientId = bed.PatientId.Value;

                bed.PatientId = null;
                bed.AdmissionDate = null;
                bed.Status = BedStatus.Free;
                bed.BedNote = null;
                await _bedStorage.UpdateAsync(bed, token);

                var patient = await _patientStorage.GetAsync(patientId, token);
                if (patient != null)
                {
                    patient.Status = PatientStatus.Discharged;
                    await _patientStorage.UpdateAsync(patient, token);
                }

                var histories = await _occupancyHistoryStorage.GetAllAsync(token);
                var activeHistory = histories.FirstOrDefault(h => h.BedId == bedId && h.PatientId == patientId && h.DischargedAt == null);
                if (activeHistory != null)
                {
                    activeHistory.DischargedAt = DateTime.UtcNow;
                    await _occupancyHistoryStorage.UpdateAsync(activeHistory, token);
                }
            }
        }
        public Task<List<BedDto>> GetBedsByRoomAsync(Guid roomId, bool onlyFree = false, CancellationToken token = default)
        {
            return _bedQuery.GetBedsByRoomAsync(roomId, onlyFree, token);
        }

        public async Task<HospitalBed> AddBedAsync(Guid roomId, int bedNumber, BedStatus status = BedStatus.Free, CancellationToken token = default)
        {
            var bed = new HospitalBed
            {
                Id = Guid.NewGuid(),
                RoomId = roomId,
                BedNumber = bedNumber,
                Status = status
            };
            await _bedStorage.AddAsync(bed, token);
            return bed;
        }

        public async Task DeleteBedAsync(Guid bedId, CancellationToken token = default)
        {
            await _bedStorage.RemoveAsync(bedId, token);
        }

        public async Task FreeBedAsync(Guid bedId, FreeBedRequestDto request, CancellationToken token = default)
        {
            var bed = await _bedStorage.GetAsync(bedId, token);
            if (bed != null && bed.PatientId.HasValue)
            {
                var patientId = bed.PatientId.Value;
                bed.PatientId = null;
                bed.AdmissionDate = null;
                bed.Status = BedStatus.Free;
                bed.BedNote = request.Notes;
                await _bedStorage.UpdateAsync(bed, token);

                var patient = await _patientStorage.GetAsync(patientId, token);
                if (patient != null)
                {
                    patient.Status = PatientStatus.Discharged;
                    await _patientStorage.UpdateAsync(patient, token);
                }

                var histories = await _occupancyHistoryStorage.GetAllAsync(token);
                var activeHistory = histories.FirstOrDefault(h => h.BedId == bedId && h.PatientId == patientId && h.DischargedAt == null);
                if (activeHistory != null)
                {
                    activeHistory.DischargedAt = request.Date;
                    await _occupancyHistoryStorage.UpdateAsync(activeHistory, token);
                }
            }
        }

        public async Task UpdateBedNoteAsync(Guid bedId, string note, CancellationToken token = default)
        {
            var bed = await _bedStorage.GetAsync(bedId, token);
            if (bed != null)
            {
                bed.BedNote = note;
                await _bedStorage.UpdateAsync(bed, token);
            }
        }

        public async Task AssignPatientToBedAsync(AssignPatientRequestDto request, CancellationToken token = default)
        {
            var bed = await _bedStorage.GetAsync(request.BedId, token);
            if (bed != null && bed.PatientId == null)
            {
                bed.PatientId = request.PatientId;
                bed.AdmissionDate = request.AdmissionDateTime;
                bed.Status = BedStatus.Stable;
                bed.BedNote = request.Notes;
                await _bedStorage.UpdateAsync(bed, token);

                var patient = await _patientStorage.GetAsync(request.PatientId, token);
                if (patient != null)
                {
                    patient.DoctorId = request.DoctorId;
                    patient.Status = PatientStatus.Hospitalized;
                    await _patientStorage.UpdateAsync(patient, token);
                }

                var history = new BedOccupancyHistory
                {
                    Id = Guid.NewGuid(),
                    BedId = request.BedId,
                    PatientId = request.PatientId,
                    AdmittedAt = request.AdmissionDateTime
                };
                await _occupancyHistoryStorage.AddAsync(history, token);
            }
        }

        public async Task TransferPatientAsync(TransferBedRequestDto request, CancellationToken token = default)
        {
            var fromBed = await _bedStorage.GetAsync(request.FromBedId, token);
            var toBed = await _bedStorage.GetAsync(request.ToBedId, token);

            if (fromBed != null && toBed != null && fromBed.PatientId == request.PatientId && toBed.PatientId == null)
            {
                fromBed.PatientId = null;
                fromBed.AdmissionDate = null;
                fromBed.Status = BedStatus.Free;
                await _bedStorage.UpdateAsync(fromBed, token);

                toBed.PatientId = request.PatientId;
                toBed.AdmissionDate = request.TransferDateTime;
                toBed.Status = BedStatus.Stable;
                toBed.BedNote = request.Notes;
                await _bedStorage.UpdateAsync(toBed, token);

                var histories = await _occupancyHistoryStorage.GetAllAsync(token);
                var activeHistory = histories.FirstOrDefault(h => h.BedId == request.FromBedId && h.PatientId == request.PatientId && h.DischargedAt == null);
                if (activeHistory != null)
                {
                    activeHistory.DischargedAt = request.TransferDateTime;
                    await _occupancyHistoryStorage.UpdateAsync(activeHistory, token);
                }

                var newHistory = new BedOccupancyHistory
                {
                    Id = Guid.NewGuid(),
                    BedId = request.ToBedId,
                    PatientId = request.PatientId,
                    AdmittedAt = request.TransferDateTime
                };
                await _occupancyHistoryStorage.AddAsync(newHistory, token);
            }
        }
    }
}
