using Moq;
using Xunit;
using MedicalSystem.App.Services;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Services;

namespace MedicalSystem.App.Test
{
    public class VitalSignServiceTests
    {
        private readonly Mock<IVitalSignStorage> _mockStorage;
        private readonly Mock<INotificationService> _mockNotificationService;
        private readonly Mock<IPatientStorage> _mockPatientStorage;
        private readonly VitalSignService _service;

        public VitalSignServiceTests()
        {
            _mockStorage = new Mock<IVitalSignStorage>();
            _mockNotificationService = new Mock<INotificationService>();
            _mockPatientStorage = new Mock<IPatientStorage>();
            _service = new VitalSignService(_mockStorage.Object, _mockNotificationService.Object, _mockPatientStorage.Object);
        }

        [Fact]
        public async Task GetVitalSignsAsync_ReturnsFilteredAndSortedVitalSigns()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var otherPatientId = Guid.NewGuid();
            var now = DateTime.UtcNow;
            
            var vitals = new List<VitalSign>
            {
                new VitalSign { Id = Guid.NewGuid(), PatientId = patientId, RecordedAt = now.AddMinutes(-10), Temperature = 36.6m },
                new VitalSign { Id = Guid.NewGuid(), PatientId = patientId, RecordedAt = now, Temperature = 37.0m },
                new VitalSign { Id = Guid.NewGuid(), PatientId = otherPatientId, RecordedAt = now, Temperature = 38.0m } // Other patient
            };

            _mockStorage.Setup(s => s.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(vitals);

            // Act
            var result = (await _service.GetVitalSignsAsync(patientId, CancellationToken.None)).ToList();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal(37.0m, result[0].Temperature); // Sorted descending by RecordedAt
            Assert.Equal(36.6m, result[1].Temperature);
        }

        [Fact]
        public async Task AddVitalSignAsync_AddsNewVitalSign()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var request = new CreateVitalSignRequest
            {
                Temperature = 36.8m,
                BloodPressureSystolic = 120,
                BloodPressureDiastolic = 80,
                Pulse = 72,
                SpO2 = 98,
                RespiratoryRate = 16
            };

            _mockStorage.Setup(s => s.AddAsync(It.IsAny<VitalSign>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            // Act
            await _service.AddVitalSignAsync(patientId, request, CancellationToken.None);

            // Assert
            _mockStorage.Verify(s => s.AddAsync(It.Is<VitalSign>(vs =>
                vs.PatientId == patientId &&
                vs.Temperature == 36.8m &&
                vs.BloodPressureSystolic == 120 &&
                vs.BloodPressureDiastolic == 80 &&
                vs.Pulse == 72 &&
                vs.SpO2 == 98 &&
                vs.RespiratoryRate == 16
            ), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetWarningsAsync_ReturnsWarnings_WhenVitalsAreOutsideNormalRanges()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var vitals = new List<VitalSign>
            {
                new VitalSign
                {
                    PatientId = patientId,
                    RecordedAt = DateTime.UtcNow,
                    Temperature = 38.5m, // Normal: 36.0m - 37.2m (high)
                    BloodPressureSystolic = 90, // Normal: 100 - 130 (low)
                    BloodPressureDiastolic = 50, // Normal: 60 - 90 (low)
                    Pulse = 110, // Normal: 60 - 100 (high)
                    SpO2 = 92, // Normal: 95 - 100 (low)
                    RespiratoryRate = 22 // Normal: 12 - 20 (high)
                }
            };

            _mockStorage.Setup(s => s.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(vitals);

            // Act
            var warnings = await _service.GetWarningsAsync(patientId, CancellationToken.None);

            // Assert
            Assert.NotNull(warnings);
            Assert.Equal(6, warnings.Count);

            var tempWarning = warnings.First(w => w.FieldName == nameof(VitalSign.Temperature));
            Assert.Equal("high", tempWarning.Direction);
            Assert.Equal(38.5m, decimal.Parse(tempWarning.Value!.Replace('.',',')));

            var bpSystolicWarning = warnings.First(w => w.FieldName == nameof(VitalSign.BloodPressureSystolic));
            Assert.Equal("low", bpSystolicWarning.Direction);
            Assert.Equal(90m, decimal.Parse(bpSystolicWarning.Value!.Replace('.',',')));

            var bpDiastolicWarning = warnings.First(w => w.FieldName == nameof(VitalSign.BloodPressureDiastolic));
            Assert.Equal("low", bpDiastolicWarning.Direction);
            Assert.Equal(50m, decimal.Parse(bpDiastolicWarning.Value!.Replace('.',',')));

            var pulseWarning = warnings.First(w => w.FieldName == nameof(VitalSign.Pulse));
            Assert.Equal("high", pulseWarning.Direction);
            Assert.Equal(110m, decimal.Parse(pulseWarning.Value!.Replace('.',',')));

            var spo2Warning = warnings.First(w => w.FieldName == nameof(VitalSign.SpO2));
            Assert.Equal("low", spo2Warning.Direction);
            Assert.Equal(92m, decimal.Parse(spo2Warning.Value!.Replace('.',',')));

            var respWarning = warnings.First(w => w.FieldName == nameof(VitalSign.RespiratoryRate));
            Assert.Equal("high", respWarning.Direction);
            Assert.Equal(22m, decimal.Parse(respWarning.Value!.Replace('.',',')));
        }

        [Fact]
        public async Task GetWarningsAsync_ReturnsEmpty_WhenVitalsAreWithinNormalRanges()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var vitals = new List<VitalSign>
            {
                new VitalSign
                {
                    PatientId = patientId,
                    RecordedAt = DateTime.UtcNow,
                    Temperature = 36.6m,
                    BloodPressureSystolic = 120,
                    BloodPressureDiastolic = 80,
                    Pulse = 70,
                    SpO2 = 98,
                    RespiratoryRate = 14
                }
            };

            _mockStorage.Setup(s => s.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(vitals);

            // Act
            var warnings = await _service.GetWarningsAsync(patientId, CancellationToken.None);

            // Assert
            Assert.NotNull(warnings);
            Assert.Empty(warnings);
        }

        [Fact]
        public async Task GetTrendsAsync_ReturnsCorrectTrends_BasedOnLastTwoMeasurements()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var now = DateTime.UtcNow;
            var vitals = new List<VitalSign>
            {
                new VitalSign
                {
                    PatientId = patientId,
                    RecordedAt = now, // Latest
                    Temperature = 37.0m, // Up
                    BloodPressureSystolic = 110, // Down
                    BloodPressureDiastolic = 80, // Stable
                    Pulse = 80, // Up
                    SpO2 = 97, // Down
                    RespiratoryRate = 16 // Stable
                },
                new VitalSign
                {
                    PatientId = patientId,
                    RecordedAt = now.AddHours(-1), // Previous
                    Temperature = 36.5m,
                    BloodPressureSystolic = 120,
                    BloodPressureDiastolic = 80,
                    Pulse = 75,
                    SpO2 = 99,
                    RespiratoryRate = 16
                }
            };

            _mockStorage.Setup(s => s.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(vitals);

            // Act
            var trends = await _service.GetTrendsAsync(patientId, CancellationToken.None);

            // Assert
            Assert.NotNull(trends);
            Assert.Equal(6, trends.Count);

            Assert.Equal("up", trends.First(t => t.FieldName == nameof(VitalSign.Temperature)).Direction);
            Assert.Equal("down", trends.First(t => t.FieldName == nameof(VitalSign.BloodPressureSystolic)).Direction);
            Assert.Equal("stable", trends.First(t => t.FieldName == nameof(VitalSign.BloodPressureDiastolic)).Direction);
            Assert.Equal("up", trends.First(t => t.FieldName == nameof(VitalSign.Pulse)).Direction);
            Assert.Equal("down", trends.First(t => t.FieldName == nameof(VitalSign.SpO2)).Direction);
            Assert.Equal("stable", trends.First(t => t.FieldName == nameof(VitalSign.RespiratoryRate)).Direction);
        }
    }
}