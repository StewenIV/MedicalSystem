using Moq;
using Xunit;
using MedicalSystem.App.Services;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Dtos;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace MedicalSystem.App.Test
{
    public class WardStatisticsServiceTests
    {
        private readonly Mock<IWardStatisticsQuery> _mockQuery;
        private readonly WardStatisticsService _service;

        public WardStatisticsServiceTests()
        {
            _mockQuery = new Mock<IWardStatisticsQuery>();
            _service = new WardStatisticsService(_mockQuery.Object);
        }

        [Fact]
        public async Task GetWardStatisticsAsync_CallsQueryAndReturnsDto()
        {
            
            var expectedDto = new WardStatisticsDto
            {
                TotalRooms = 10,
                TotalBeds = 100,
                OccupiedBeds = 60,
                FreeBeds = 40,
                RoomsByType = new Dictionary<string, int> { { "General", 8 } },
                RoomsByFloor = new Dictionary<int, int> { { 1, 5 } }
            };

            _mockQuery.Setup(q => q.GetWardStatisticsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedDto);

            
            var result = await _service.GetWardStatisticsAsync(CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Equal(10, result.TotalRooms);
            Assert.Equal(100, result.TotalBeds);
            Assert.Equal(60, result.OccupiedBeds);
            Assert.Equal(40, result.FreeBeds);
            Assert.Equal(8, result.RoomsByType["General"]);
            Assert.Equal(5, result.RoomsByFloor[1]);
            _mockQuery.Verify(q => q.GetWardStatisticsAsync(It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
