using Moq;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.App.Services;
using MedicalSystem.App.Contracts.Dtos;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using System.Collections.Generic;

namespace MedicalSystem.App.Test
{
    public class BedServiceTests
    {
        private readonly Mock<IBedQuery> _mockBedQuery;
        private readonly Mock<IHospitalBedStorage> _mockBedStorage;
        private readonly Mock<IPrescriptionStorage> _mockPrescriptionStorage;
        private readonly Mock<IPatientStorage> _mockPatientStorage;
        private readonly Mock<IMedicalProblemStorage> _mockMedicalProblemStorage;
        private readonly Mock<IBedOccupancyHistoryStorage> _mockOccupancyHistoryStorage;
        private readonly BedService _bedService;

        public BedServiceTests()
        {
            _mockBedQuery = new Mock<IBedQuery>();
            _mockBedStorage = new Mock<IHospitalBedStorage>();
            _mockPrescriptionStorage = new Mock<IPrescriptionStorage>();
            _mockPatientStorage = new Mock<IPatientStorage>();
            _mockMedicalProblemStorage = new Mock<IMedicalProblemStorage>();
            _mockOccupancyHistoryStorage = new Mock<IBedOccupancyHistoryStorage>();

            _bedService = new BedService(
                _mockBedQuery.Object,
                _mockBedStorage.Object,
                _mockPrescriptionStorage.Object,
                _mockPatientStorage.Object,
                _mockMedicalProblemStorage.Object,
                _mockOccupancyHistoryStorage.Object
            );
        }

        [Fact]
        public async Task GetBedsSummaryAsync_ReturnsBedsSummaryDto()
        {
            
            int? floor = 1;
            string status = "Free";
            var expectedSummary = new BedsSummaryDto
            {
                Beds = new List<BedDto>(),
                Stats = new BedStatsDto
                {
                    Total = 10,
                    Occupied = 5,
                    Free = 5
                }
            };

            _mockBedQuery.Setup(q => q.GetBedsSummaryAsync(floor, status, It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedSummary);

            
            var result = await _bedService.GetBedsSummaryAsync(floor, status, CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Equal(expectedSummary.Stats.Total, result.Stats.Total);
            Assert.Equal(expectedSummary.Stats.Occupied, result.Stats.Occupied);
            Assert.Equal(expectedSummary.Stats.Free, result.Stats.Free);
            _mockBedQuery.Verify(q => q.GetBedsSummaryAsync(floor, status, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetRoomsWithBedsAsync_ReturnsRoomsWithBedsDto()
        {
            
            int? floor = 1;
            var expectedRoomsWithBeds = new RoomsWithBedsDto
            {
                Rooms = new List<RoomWithBedsDto>
                {
                    new RoomWithBedsDto
                    {
                        Id = Guid.NewGuid(),
                        Name = "101",
                        Floor = 1,
                        Gender = "Male",
                        Urgency = "Normal",
                        Beds = new List<BedInRoomDto>
                        {
                            new BedInRoomDto { Id = Guid.NewGuid(), BedNumber = 1, Status = "Free" },
                            new BedInRoomDto { Id = Guid.NewGuid(), BedNumber = 2, Status = "Occupied" }
                        }
                    }
                }
            };

            _mockBedQuery.Setup(q => q.GetRoomsWithBedsAsync(floor, It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedRoomsWithBeds);

            
            var result = await _bedService.GetRoomsWithBedsAsync(floor, CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Single(result.Rooms);
            Assert.Equal("101", result.Rooms[0].Name);
            Assert.Equal(2, result.Rooms[0].Beds.Count);
            _mockBedQuery.Verify(q => q.GetRoomsWithBedsAsync(floor, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetRoomConfigAsync_ReturnsRoomConfigDto()
        {
            
            var expectedRoomConfig = new RoomConfigDto
            {
                Rooms = new Dictionary<string, GenderConfig>
                {
                    { "201", new GenderConfig { Gender = "Male" } },
                    { "202", new GenderConfig { Gender = "Female" } }
                }
            };

            _mockBedQuery.Setup(q => q.GetRoomConfigAsync(It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedRoomConfig);

            
            var result = await _bedService.GetRoomConfigAsync(CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Equal(2, result.Rooms.Count);
            Assert.True(result.Rooms.ContainsKey("201"));
            _mockBedQuery.Verify(q => q.GetRoomConfigAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetFloorsAsync_ReturnsFloorsDto()
        {
            
            var expectedFloors = new FloorsDto
            {
                Floors = new List<int> { 1, 2, 3 }
            };

            _mockBedQuery.Setup(q => q.GetFloorsAsync(It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedFloors);

            
            var result = await _bedService.GetFloorsAsync(CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Equal(3, result.Floors.Count);
            Assert.Contains(1, result.Floors);
            Assert.Contains(2, result.Floors);
            Assert.Contains(3, result.Floors);
            _mockBedQuery.Verify(q => q.GetFloorsAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetAlertsAsync_ReturnsAlertsDto()
        {
            
            var expectedAlerts = new AlertsDto
            {
                Urgent = new List<AlertBedDto>
                {
                    new AlertBedDto { Id = Guid.NewGuid(), RoomNumber = "101", PatientId = Guid.NewGuid(), PatientName = "John", PatientLastName = "Doe" }
                },
                Attention = new List<AlertBedDto>
                {
                    new AlertBedDto { Id = Guid.NewGuid(), RoomNumber = "102", PatientId = Guid.NewGuid(), PatientName = "Jane", PatientLastName = "Smith" }
                }
            };

            _mockBedQuery.Setup(q => q.GetAlertsAsync(It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedAlerts);

            
            var result = await _bedService.GetAlertsAsync(CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Single(result.Urgent);
            Assert.Single(result.Attention);
            Assert.Equal("101", result.Urgent[0].RoomNumber);
            Assert.Equal("102", result.Attention[0].RoomNumber);
            _mockBedQuery.Verify(q => q.GetAlertsAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetBedByIdAsync_ReturnsBedDto_WhenBedExists()
        {
            
            var bedId = Guid.NewGuid();
            var expectedBed = new BedDto { Id = bedId, BedNumber = 1, Status = "Occupied", RoomNumber = "301" };
            _mockBedQuery.Setup(q => q.GetBedByIdAsync(bedId, It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedBed);

            
            var result = await _bedService.GetBedByIdAsync(bedId, CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Equal(bedId, result.Id);
            Assert.Equal(1, result.BedNumber);
            Assert.Equal("Occupied", result.Status);
            Assert.Equal("301", result.RoomNumber);
            _mockBedQuery.Verify(q => q.GetBedByIdAsync(bedId, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetPatientDetailsAsync_ReturnsPatientDetailsDto_WhenPatientExists()
        {
            
            var patientId = Guid.NewGuid();
            var expectedPatientDetails = new PatientDetailsDto
            {
                DoctorNote = "Requires rest",
                Prescriptions = new List<BedPrescriptionDto>
                {
                    new BedPrescriptionDto { Id = Guid.NewGuid(), Name = "Aspirin", Dose = "100mg", Time = "Morning", Done = false }
                },
                Meds = new List<MedicationInStockDto>
                {
                    new MedicationInStockDto { Name = "Aspirin", Qty = "10 tablets" }
                },
                Log = new List<ActionLogDto>
                {
                    new ActionLogDto { Who = "Nurse", Action = "Checkup", Time = "08:00", Amount = "1" }
                }
            };
            _mockBedQuery.Setup(q => q.GetPatientDetailsAsync(patientId, It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedPatientDetails);

            
            var result = await _bedService.GetPatientDetailsAsync(patientId, CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Equal("Requires rest", result.DoctorNote);
            Assert.Single(result.Prescriptions);
            Assert.Equal("Aspirin", result.Prescriptions[0].Name);
            Assert.Single(result.Meds);
            Assert.Equal("Aspirin", result.Meds[0].Name);
            Assert.Single(result.Log);
            Assert.Equal("Nurse", result.Log[0].Who);
            _mockBedQuery.Verify(q => q.GetPatientDetailsAsync(patientId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}