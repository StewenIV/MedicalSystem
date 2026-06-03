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
    }
}