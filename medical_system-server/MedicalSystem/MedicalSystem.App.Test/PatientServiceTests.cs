using Moq;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.App.Services;
using MedicalSystem.App.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using MedicalSystem.Domain.Models;
using MedicalSystem.Domain.Enums;
using Assert = Xunit.Assert;
using MedicalSystem.App.Contracts.Services;

namespace MedicalSystem.App.Test
{
    public class PatientServiceTests
    {
        private readonly Mock<IPatientQuery> _mockPatientQuery;
        private readonly Mock<IPatientStorage> _mockPatientStorage;
        private readonly Mock<INotificationService> _mockNotificationService;
        private readonly PatientService _patientService;

        public PatientServiceTests()
        {
            _mockPatientQuery = new Mock<IPatientQuery>();
            _mockPatientStorage = new Mock<IPatientStorage>();
            _mockNotificationService = new Mock<INotificationService>();
            _patientService = new PatientService(_mockPatientQuery.Object, _mockPatientStorage.Object, _mockNotificationService.Object);
        }
        
        [Fact]
        public async Task GetPatientCardAsync_ReturnsPatientCardDto_WhenPatientExists()
        {
            
            var patientId = Guid.NewGuid();
            var expectedPatientCard = new PatientCardDto { Id = patientId, FirstName = "John", LastName = "Doe" };
            _mockPatientQuery.Setup(q => q.GetCardByIdAsync(patientId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedPatientCard);

            
            var result = await _patientService.GetPatientCardAsync(patientId, CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Equal(patientId, result.Id);
            Assert.Equal("John", result.FirstName);
            Assert.Equal("Doe", result.LastName);
            _mockPatientQuery.Verify(q => q.GetCardByIdAsync(patientId, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task AddPatientAsync_AddsPatientAndReturnsPatientListDto()
        {
            
            var patientId = Guid.NewGuid();
            var patientCardDto = new PatientCardDto
            {
                Id = patientId,
                FirstName = "Jane",
                LastName = "Smith",
                MiddleName = "A.",
                DateOfBirth = new DateTime(1994, 1, 1),
                Gender = Gender.Female.ToString(),
                Status = PatientStatus.Outpatient.ToString(),
                MedcardNum = "MC123",
                HistoryNum = "HN456"
            };

            var patientListDto = new PatientListDto
            {
                Id = patientId,
                FirstName = "Jane",
                LastName = "Smith",
                MiddleName = "A.",
                DateOfBirth = new DateTime(1994, 1, 1),
                Age = 30,
                Gender = "Женский",
                Status = "Outpatient",
                StatusText = "Амбулаторный",
                MedcardNum = "MC123",
                HistoryNum = "HN456"
            };

            var patient = new Patient
            {
                Id = patientId,
                FirstName = "Jane",
                LastName = "Smith",
                MiddleName = "A.",
                DateOfBirth = new DateTime(1994, 1, 1),
                Gender = Gender.Female,
                Status = PatientStatus.Outpatient,
                MedcardNum = "MC123",
                HistoryNum = "HN456"
            };
            _mockPatientStorage.Setup(s => s.AddPatientAsync(It.IsAny<PatientCardDto>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(patient);

            
            var result = await _patientService.AddPatientAsync(patientCardDto, CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Equal(patientId, result.Id);
            Assert.Equal("Jane", result.FirstName);
            Assert.Equal("Smith", result.LastName);
            Assert.Equal("A.", result.MiddleName);
            Assert.True(result.Age >= 30); 
            Assert.Equal(patientCardDto.DateOfBirth, result.DateOfBirth);
            Assert.Equal("Женский", result.Gender);
            Assert.Equal("Outpatient", result.Status);
            Assert.Equal("Амбулаторный", result.StatusText);
            Assert.Equal("MC123", result.MedcardNum);
            Assert.Equal("HN456", result.HistoryNum);

            _mockPatientStorage.Verify(
                s => s.AddPatientAsync(It.Is<PatientCardDto>(p => p.Id == patientId), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetHospitalizedPatientsAsync_ReturnsListOfHospitalizedPatients()
        {
            
            var hospitalizedPatients = new List<PatientLookupDto>
            {
                new PatientLookupDto { Id = Guid.NewGuid(), FullName = "Alice Brown" },
                new PatientLookupDto { Id = Guid.NewGuid(), FullName = "Bob Green" }
            };

            _mockPatientQuery.Setup(q =>
                    q.GetPatientsByStatusAsync(PatientStatus.Hospitalized, It.IsAny<CancellationToken>()))
                .ReturnsAsync(hospitalizedPatients);

            
            var result = await _patientService.GetHospitalizedPatientsAsync(CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, p => p.FullName == "Alice Brown");
            Assert.Contains(result, p => p.FullName == "Bob Green");
            _mockPatientQuery.Verify(
                q => q.GetPatientsByStatusAsync(PatientStatus.Hospitalized, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetActivePatientsAsync_ReturnsListOfActivePatients()
        {
            
            var activePatients = new List<PatientLookupDto>
            {
                new PatientLookupDto { Id = Guid.NewGuid(), FullName = "Alice Brown" },
                new PatientLookupDto { Id = Guid.NewGuid(), FullName = "Bob Green" }
            };

            _mockPatientQuery.Setup(q =>
                    q.GetActivePatientsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(activePatients);

            
            var result = await _patientService.GetActivePatientsAsync(CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, p => p.FullName == "Alice Brown");
            Assert.Contains(result, p => p.FullName == "Bob Green");
            _mockPatientQuery.Verify(
                q => q.GetActivePatientsAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetAllPatientsAsync_ReturnsListOfAllPatients()
        {
            
            var allPatients = new List<PatientListDto>
            {
                new PatientListDto { Id = Guid.NewGuid(), FirstName = "Charlie", LastName = "White" },
                new PatientListDto { Id = Guid.NewGuid(), FirstName = "Diana", LastName = "Black" }
            };

            _mockPatientQuery.Setup(q => q.GetAllPatientsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(allPatients);

            
            var result = await _patientService.GetAllPatientsAsync(CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, p => p.FirstName == "Charlie");
            Assert.Contains(result, p => p.FirstName == "Diana");
            _mockPatientQuery.Verify(q => q.GetAllPatientsAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task UpdatePatientCardAsync_CallsStorageUpdatePatientCard()
        {
            
            var patientId = Guid.NewGuid();
            var patientCardDto = new PatientCardDto
            {
                Id = patientId,
                FirstName = "Updated",
                LastName = "Patient"
            };

            _mockPatientStorage.Setup(s =>
                    s.UpdatePatientCardAsync(patientId, It.IsAny<PatientCardDto>(), It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            
            await _patientService.UpdatePatientCardAsync(patientId, patientCardDto, null, CancellationToken.None);

            
            _mockPatientStorage.Verify(
                s => s.UpdatePatientCardAsync(patientId, It.Is<PatientCardDto>(p => p.FirstName == "Updated"), It.IsAny<Guid?>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task DeletePatientAsync_CallsStorageDeletePatient()
        {
            
            var patientId = Guid.NewGuid();

            _mockPatientStorage.Setup(s => s.DeletePatientAsync(patientId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            
            await _patientService.DeletePatientAsync(patientId, CancellationToken.None);

            
            _mockPatientStorage.Verify(s => s.DeletePatientAsync(patientId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}