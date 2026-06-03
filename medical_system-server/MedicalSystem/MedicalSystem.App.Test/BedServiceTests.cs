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
            // Arrange
            int? floor = 1;
            string status = "Free";
            var expectedSummary = new BedsSummaryDto
            {
                TotalBeds = 10,
                OccupiedBeds = 5,
                FreeBeds = 5,
                BedsByStatus = new Dictionary<string, int> { { "Free", 5 }, { "Occupied", 5 } }
            };

            _mockBedQuery.Setup(q => q.GetBedsSummaryAsync(floor, status, It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedSummary);

            // Act
            var result = await _bedService.GetBedsSummaryAsync(floor, status, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedSummary.TotalBeds, result.TotalBeds);
            Assert.Equal(expectedSummary.OccupiedBeds, result.OccupiedBeds);
            Assert.Equal(expectedSummary.FreeBeds, result.FreeBeds);
            _mockBedQuery.Verify(q => q.GetBedsSummaryAsync(floor, status, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetRoomsWithBedsAsync_ReturnsRoomsWithBedsDto()
        {
            // Arrange
            int? floor = 1;
            var expectedRoomsWithBeds = new RoomsWithBedsDto
            {
                Rooms = new List<RoomWithBedsDto>
                {
                    new RoomWithBedsDto
                    {
                        Id = Guid.NewGuid(),
                        RoomNumber = "101",
                        Floor = 1,
                        Beds = new List<BedDto>
                        {
                            new BedDto { Id = Guid.NewGuid(), BedNumber = 1, Status = "Free" },
                            new BedDto { Id = Guid.NewGuid(), BedNumber = 2, Status = "Occupied" }
                        }
                    }
                }
            };

            _mockBedQuery.Setup(q => q.GetRoomsWithBedsAsync(floor, It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedRoomsWithBeds);

            // Act
            var result = await _bedService.GetRoomsWithBedsAsync(floor, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Rooms);
            Assert.Equal("101", result.Rooms[0].RoomNumber);
            Assert.Equal(2, result.Rooms[0].Beds.Count);
            _mockBedQuery.Verify(q => q.GetRoomsWithBedsAsync(floor, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetRoomConfigAsync_ReturnsRoomConfigDto()
        {
            // Arrange
            var expectedRoomConfig = new RoomConfigDto
            {
                Rooms = new List<RoomDto>
                {
                    new RoomDto { Id = Guid.NewGuid(), RoomNumber = "201", Floor = 2 },
                    new RoomDto { Id = Guid.NewGuid(), RoomNumber = "202", Floor = 2 }
                }
            };

            _mockBedQuery.Setup(q => q.GetRoomConfigAsync(It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedRoomConfig);

            // Act
            var result = await _bedService.GetRoomConfigAsync(CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Rooms.Count);
            Assert.Equal("201", result.Rooms[0].RoomNumber);
            _mockBedQuery.Verify(q => q.GetRoomConfigAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetFloorsAsync_ReturnsFloorsDto()
        {
            // Arrange
            var expectedFloors = new FloorsDto
            {
                Floors = new List<int> { 1, 2, 3 }
            };

            _mockBedQuery.Setup(q => q.GetFloorsAsync(It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedFloors);

            // Act
            var result = await _bedService.GetFloorsAsync(CancellationToken.None);

            // Assert
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
            // Arrange
            var expectedAlerts = new AlertsDto
            {
                Alerts = new List<AlertDto>
                {
                    new AlertDto { Id = Guid.NewGuid(), Message = "Bed 101 needs cleaning", Type = "Cleaning" },
                    new AlertDto { Id = Guid.NewGuid(), Message = "Patient in Bed 102 needs attention", Type = "PatientCare" }
                }
            };

            _mockBedQuery.Setup(q => q.GetAlertsAsync(It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedAlerts);

            // Act
            var result = await _bedService.GetAlertsAsync(CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Alerts.Count);
            Assert.Equal("Bed 101 needs cleaning", result.Alerts[0].Message);
            Assert.Equal("Patient in Bed 102 needs attention", result.Alerts[1].Message);
            _mockBedQuery.Verify(q => q.GetAlertsAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetBedByIdAsync_ReturnsBedDto_WhenBedExists()
        {
            // Arrange
            var bedId = Guid.NewGuid();
            var expectedBed = new BedDto { Id = bedId, BedNumber = 1, Status = "Occupied", RoomNumber = "301" };
            _mockBedQuery.Setup(q => q.GetBedByIdAsync(bedId, It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedBed);

            // Act
            var result = await _bedService.GetBedByIdAsync(bedId, CancellationToken.None);

            // Assert
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
            // Arrange
            var patientId = Guid.NewGuid();
            var expectedPatientDetails = new PatientDetailsDto
            {
                Id = patientId,
                FirstName = "Test",
                LastName = "Patient",
                BedNumber = 10,
                RoomNumber = "405"
            };
            _mockBedQuery.Setup(q => q.GetPatientDetailsAsync(patientId, It.IsAny<CancellationToken>()))
                         .ReturnsAsync(expectedPatientDetails);

            // Act
            var result = await _bedService.GetPatientDetailsAsync(patientId, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(patientId, result.Id);
            Assert.Equal("Test", result.FirstName);
            Assert.Equal("Patient", result.LastName);
            Assert.Equal(10, result.BedNumber);
            Assert.Equal("405", result.RoomNumber);
            _mockBedQuery.Verify(q => q.GetPatientDetailsAsync(patientId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}