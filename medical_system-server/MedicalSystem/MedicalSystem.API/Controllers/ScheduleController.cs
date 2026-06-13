using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/schedule")]
    [Authorize(Roles = "Doctor,Nurse,HeadNurse,ChiefDoctor")]
    public class ScheduleController : ControllerBase
    {
        private readonly StaffScheduleService _scheduleService;

        public ScheduleController(StaffScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetSchedule([FromQuery] int year, [FromQuery] int month, CancellationToken token)
        {
            try
            {
                var schedule = await _scheduleService.GetMonthScheduleAsync(year, month, token);
                return Ok(schedule);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPost("shift")]
        public async Task<IActionResult> UpdateShift([FromBody] UpdateShiftDto dto, CancellationToken token)
        {
            try
            {
                await _scheduleService.UpdateShiftAsync(dto, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
