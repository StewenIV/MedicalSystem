using Moq;
using Xunit;
using MedicalSystem.App.Services;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Models;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MedicalSystem.App.Test
{
    public class RoomServiceTests
    {
        private readonly Mock<IRoomQuery> _mockRoomQuery;
        private readonly Mock<IRoomStorage> _mockRoomStorage;
        private readonly Mock<IBedQuery> _mockBedQuery;
        private readonly Mock<IHospitalBedStorage> _mockBedStorage;
        private readonly RoomService _roomService;

        public RoomServiceTests()
        {
            _mockRoomQuery = new Mock<IRoomQuery>();
            _mockRoomStorage = new Mock<IRoomStorage>();
            _mockBedQuery = new Mock<IBedQuery>();
            _mockBedStorage = new Mock<IHospitalBedStorage>();

            _roomService = new RoomService(
                _mockRoomQuery.Object,
                _mockRoomStorage.Object,
                _mockBedQuery.Object,
                _mockBedStorage.Object
            );
        }

        [Fact]
        public async Task GetRoomsAsync_ReturnsPagedRooms()
        {
            // Arrange
            var expectedResult = new PagedResultDto<RoomListItemDto>
            {
                Items = new List<RoomListItemDto> { new RoomListItemDto { Id = Guid.NewGuid(), Number = "101" } },
                TotalCount = 1
            };
            _mockRoomQuery.Setup(q => q.GetRoomsAsync(1, "Ordinary", "101", 1, 10, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedResult);

            // Act
            var result = await _roomService.GetRoomsAsync(1, "Ordinary", "101", 1, 10, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Items);
            Assert.Equal("101", result.Items[0].Number);
        }

        [Fact]
        public async Task GetRoomByIdAsync_ReturnsRoomDetails()
        {
            // Arrange
            var roomId = Guid.NewGuid();
            var expectedRoom = new RoomDetailsDto { Id = roomId, Number = "202" };
            _mockRoomQuery.Setup(q => q.GetRoomByIdAsync(roomId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedRoom);

            // Act
            var result = await _roomService.GetRoomByIdAsync(roomId, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("202", result.Number);
        }

        [Fact]
        public async Task CreateRoomAsync_CreatesRoomAndAddsBeds()
        {
            // Arrange
            var dto = new CreateRoomDto
            {
                Number = "103",
                Floor = 1,
                Type = RoomType.Ordinary,
                Gender = RoomGender.Male,
                Priority = RoomPriority.Normal,
                DepartmentId = Guid.NewGuid(),
                Beds = new List<UpdateRoomBedDto>
                {
                    new UpdateRoomBedDto { IsNew = true },
                    new UpdateRoomBedDto { IsNew = true }
                }
            };

            _mockRoomStorage.Setup(s => s.AddAsync(It.IsAny<Room>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);
            _mockBedStorage.Setup(s => s.AddAsync(It.IsAny<HospitalBed>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _roomService.CreateRoomAsync(dto, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("103", result.RoomNumber);
            Assert.Equal(1, result.Floor);
            Assert.Equal(RoomType.Ordinary, result.Type);

            _mockRoomStorage.Verify(s => s.AddAsync(It.Is<Room>(r => r.RoomNumber == "103"), It.IsAny<CancellationToken>()), Times.Once);
            _mockBedStorage.Verify(s => s.AddAsync(It.Is<HospitalBed>(b => b.RoomId == result.Id), It.IsAny<CancellationToken>()), Times.Exactly(2));
        }

        [Fact]
        public async Task UpdateRoomAsync_UpdatesRoomPropertiesAndBeds()
        {
            // Arrange
            var roomId = Guid.NewGuid();
            var existingRoom = new Room { Id = roomId, RoomNumber = "104", Floor = 1 };
            var dto = new UpdateRoomDto
            {
                RoomId = roomId,
                Number = "104-Updated",
                Floor = 2,
                Type = RoomType.Reanimation,
                Gender = RoomGender.Female,
                Priority = RoomPriority.High,
                Beds = new List<UpdateRoomBedDto>
                {
                    new UpdateRoomBedDto { Id = Guid.NewGuid(), IsNew = false }, // Keep
                    new UpdateRoomBedDto { IsNew = true } // Add new
                }
            };

            var existingBeds = new List<BedDto>
            {
                new BedDto { Id = dto.Beds[0].Id!.Value, BedNumber = 1, PatientId = null },
                new BedDto { Id = Guid.NewGuid(), BedNumber = 2, PatientId = null } // Should be deleted
            };

            _mockRoomStorage.Setup(s => s.GetAsync(roomId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingRoom);
            _mockRoomStorage.Setup(s => s.UpdateAsync(existingRoom, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);
            _mockBedQuery.Setup(q => q.GetBedsByRoomAsync(roomId, false, It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingBeds);
            _mockBedStorage.Setup(s => s.RemoveAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);
            _mockBedStorage.Setup(s => s.AddAsync(It.IsAny<HospitalBed>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _roomService.UpdateRoomAsync(dto, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("104-Updated", result.RoomNumber);
            Assert.Equal(2, result.Floor);

            _mockRoomStorage.Verify(s => s.UpdateAsync(existingRoom, It.IsAny<CancellationToken>()), Times.Once);
            _mockBedStorage.Verify(s => s.RemoveAsync(existingBeds[1].Id, It.IsAny<CancellationToken>()), Times.Once);
            _mockBedStorage.Verify(s => s.AddAsync(It.Is<HospitalBed>(b => b.RoomId == roomId && b.BedNumber == 3), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task UpdateRoomAsync_Throws_WhenDeletingOccupiedBed()
        {
            // Arrange
            var roomId = Guid.NewGuid();
            var existingRoom = new Room { Id = roomId, RoomNumber = "105" };
            var dto = new UpdateRoomDto
            {
                RoomId = roomId,
                Number = "105",
                Beds = new List<UpdateRoomBedDto>() // Deleting all beds
            };

            var existingBeds = new List<BedDto>
            {
                new BedDto { Id = Guid.NewGuid(), BedNumber = 1, PatientId = Guid.NewGuid() } // Occupied
            };

            _mockRoomStorage.Setup(s => s.GetAsync(roomId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingRoom);
            _mockBedQuery.Setup(q => q.GetBedsByRoomAsync(roomId, false, It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingBeds);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _roomService.UpdateRoomAsync(dto, CancellationToken.None));
        }

        [Fact]
        public async Task UpdateRoomPriorityAsync_UpdatesPriority()
        {
            // Arrange
            var roomId = Guid.NewGuid();
            var existingRoom = new Room { Id = roomId, Priority = RoomPriority.Normal };
            _mockRoomStorage.Setup(s => s.GetAsync(roomId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingRoom);
            _mockRoomStorage.Setup(s => s.UpdateAsync(existingRoom, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            // Act
            await _roomService.UpdateRoomPriorityAsync(roomId, RoomPriority.High, CancellationToken.None);

            // Assert
            Assert.Equal(RoomPriority.High, existingRoom.Priority);
            _mockRoomStorage.Verify(s => s.UpdateAsync(existingRoom, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task DeleteRoomAsync_DeletesBedsAndRoom_WhenNoBedsAreOccupied()
        {
            // Arrange
            var roomId = Guid.NewGuid();
            var existingBeds = new List<BedDto>
            {
                new BedDto { Id = Guid.NewGuid(), BedNumber = 1, PatientId = null },
                new BedDto { Id = Guid.NewGuid(), BedNumber = 2, PatientId = null }
            };

            _mockBedQuery.Setup(q => q.GetBedsByRoomAsync(roomId, false, It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingBeds);
            _mockBedStorage.Setup(s => s.RemoveAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);
            _mockRoomStorage.Setup(s => s.RemoveAsync(roomId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            // Act
            await _roomService.DeleteRoomAsync(roomId, CancellationToken.None);

            // Assert
            _mockBedStorage.Verify(s => s.RemoveAsync(existingBeds[0].Id, It.IsAny<CancellationToken>()), Times.Once);
            _mockBedStorage.Verify(s => s.RemoveAsync(existingBeds[1].Id, It.IsAny<CancellationToken>()), Times.Once);
            _mockRoomStorage.Verify(s => s.RemoveAsync(roomId, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task DeleteRoomAsync_Throws_WhenAnyBedIsOccupied()
        {
            // Arrange
            var roomId = Guid.NewGuid();
            var existingBeds = new List<BedDto>
            {
                new BedDto { Id = Guid.NewGuid(), BedNumber = 1, PatientId = Guid.NewGuid() } // Occupied
            };

            _mockBedQuery.Setup(q => q.GetBedsByRoomAsync(roomId, false, It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingBeds);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _roomService.DeleteRoomAsync(roomId, CancellationToken.None));
        }

        [Fact]
        public async Task GetAvailableFloorsAsync_ReturnsAvailableFloors()
        {
            // Arrange
            var expectedFloors = new List<int> { 1, 2, 3 };
            _mockRoomQuery.Setup(q => q.GetAvailableFloorsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedFloors);

            // Act
            var result = await _roomService.GetAvailableFloorsAsync(CancellationToken.None);

            // Assert
            Assert.Equal(expectedFloors, result);
        }

        [Fact]
        public async Task GetRoomsByFloorAsync_ReturnsRoomsOnFloor()
        {
            // Arrange
            var expectedRooms = new List<RoomListItemDto>
            {
                new RoomListItemDto { Id = Guid.NewGuid(), Number = "301" }
            };
            _mockRoomQuery.Setup(q => q.GetRoomsByFloorAsync(3, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedRooms);

            // Act
            var result = await _roomService.GetRoomsByFloorAsync(3, CancellationToken.None);

            // Assert
            Assert.Equal(expectedRooms, result);
        }
    }
}
