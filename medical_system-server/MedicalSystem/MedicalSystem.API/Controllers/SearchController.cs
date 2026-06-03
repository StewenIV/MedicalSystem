using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Services;
using Microsoft.AspNetCore.Mvc;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/search")]
    public class SearchController : ControllerBase
    {
        private readonly SearchService _searchService;

        public SearchController(SearchService searchService)
        {
            _searchService = searchService;
        }

        [HttpGet("patients")]
        public async Task<IActionResult> SearchPatients(
            [FromQuery] string query,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken token = default)
        {
            try
            {
                var patients = await _searchService.SearchPatientsAsync(query, page, pageSize, token);
                return Ok(patients);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("doctors")]
        public async Task<IActionResult> SearchDoctors(
            [FromQuery] string query,
            [FromQuery] Guid? departmentId = null,
            [FromQuery] Guid? institutionId = null,
            CancellationToken token = default)
        {
            try
            {
                var doctors = await _searchService.SearchDoctorsAsync(query, departmentId, institutionId, token);
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
