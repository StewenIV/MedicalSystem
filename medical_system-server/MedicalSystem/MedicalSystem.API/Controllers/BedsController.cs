using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Services;
using Microsoft.AspNetCore.Mvc;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/beds")]
    public class BedsController : ControllerBase
    {
        private readonly BedService _bedService;

        public BedsController(BedService bedService)
        {
            _bedService = bedService;
        }

        [HttpGet]
        public async Task<IActionResult> GetBedsSummary([FromQuery] int? floor, [FromQuery] string? status, CancellationToken token)
        {
            var result = await _bedService.GetBedsSummaryAsync(floor, status, token);
            return Ok(result);
        }

        [HttpGet("rooms")]
        public async Task<IActionResult> GetRoomsWithBeds([FromQuery] int? floor, CancellationToken token)
        {
            var result = await _bedService.GetRoomsWithBedsAsync(floor, token);
            return Ok(result);
        }
    }
}
