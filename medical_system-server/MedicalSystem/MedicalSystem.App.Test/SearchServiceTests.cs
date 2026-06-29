using Moq;
using Xunit;
using MedicalSystem.App.Services;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MedicalSystem.App.Test
{
    public class SearchServiceTests
    {
        private readonly Mock<IPatientSearchQuery> _mockSearchQuery;
        private readonly SearchService _searchService;

        public SearchServiceTests()
        {
            _mockSearchQuery = new Mock<IPatientSearchQuery>();
            _searchService = new SearchService(_mockSearchQuery.Object);
        }

        [Fact]
        public async Task SearchPatientsAsync_CallsQueryAndReturnsPagedResult()
        {
            
            var queryText = "John";
            var page = 1;
            var pageSize = 10;
            var expectedResult = new PagedResultDto<PatientSearchItemDto>
            {
                Items = new List<PatientSearchItemDto> { new PatientSearchItemDto { Id = Guid.NewGuid(), FirstName = "John", LastName = "Doe" } },
                TotalCount = 1
            };

            _mockSearchQuery.Setup(q => q.SearchPatientsAsync(queryText, page, pageSize, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedResult);

            
            var result = await _searchService.SearchPatientsAsync(queryText, page, pageSize, CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Single(result.Items);
            Assert.Equal("John", result.Items[0].FirstName);
            Assert.Equal("Doe", result.Items[0].LastName);
            _mockSearchQuery.Verify(q => q.SearchPatientsAsync(queryText, page, pageSize, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task SearchDoctorsAsync_CallsQueryAndReturnsDoctorsList()
        {
            
            var queryText = "House";
            var departmentId = Guid.NewGuid();
            var institutionId = Guid.NewGuid();
            var expectedResult = new List<DoctorSelectItemDto>
            {
                new DoctorSelectItemDto { Id = Guid.NewGuid(), FullName = "Gregory House" }
            };

            _mockSearchQuery.Setup(q => q.SearchDoctorsAsync(queryText, departmentId, institutionId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedResult);

            
            var result = await _searchService.SearchDoctorsAsync(queryText, departmentId, institutionId, CancellationToken.None);

            
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Gregory House", result[0].FullName);
            _mockSearchQuery.Verify(q => q.SearchDoctorsAsync(queryText, departmentId, institutionId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
