using Moq;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.App.Services;
using MedicalSystem.App.Contracts.Dtos;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace MedicalSystem.App.Test
{
    public class PatientServiceTests
    {
        private readonly Mock<IPatientQuery> _mockPatientQuery;
        private readonly Mock<IPatientStorage> _mockPatientStorage;
        private readonly PatientService _patientService;

        public PatientServiceTests()
        {
            _mockPatientQuery = new Mock<IPatientQuery>();
            _mockPatientStorage = new Mock<IPatientStorage>();
            _patientService = new PatientService(_mockPatientQuery.Object, _mockPatientStorage.Object);
        }

        [Fact]
        public async Task GetPatientCardAsync_ReturnsPatientCardDto_WhenPatientExists()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var expectedPatientCard = new PatientCardDto { Id = patientId, FirstName = "John", LastName = "Doe" };
            _mockPatientQuery.Setup(q => q.GetCardByIdAsync(patientId, It.IsAny<CancellationToken>()))
                             .ReturnsAsync(expectedPatientCard);

            // Act
            var result = await _patientService.GetPatientCardAsync(patientId, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(patientId, result.Id);
            Assert.Equal("John", result.FirstName);
            Assert.Equal("Doe", result.LastName);
            _mockPatientQuery.Verify(q => q.GetCardByIdAsync(patientId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}