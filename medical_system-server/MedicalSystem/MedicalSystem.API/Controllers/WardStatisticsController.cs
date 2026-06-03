using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Services;
using Microsoft.AspNetCore.Mvc;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/ward-statistics")]
    public class WardStatisticsController : ControllerBase
    {
        private readonly WardStatisticsService _wardStatisticsService;

        public WardStatisticsController(WardStatisticsService wardStatisticsService)
        {
            _wardStatisticsService = wardStatisticsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetWardStatistics(CancellationToken token)
        {
            try
            {
                var stats = await _wardStatisticsService.GetWardStatisticsAsync(token);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
