using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
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
            try
            {
                return Ok(await _bedService.GetBedsSummaryAsync(floor, status, token));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("rooms")]
        public async Task<IActionResult> GetRoomsWithBeds([FromQuery] int? floor, CancellationToken token)
        {
            try
            {
                return Ok(await _bedService.GetRoomsWithBedsAsync(floor, token));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("rooms/config")]
        public async Task<IActionResult> GetRoomConfig(CancellationToken token)
        {
            try
            {
                return Ok(await _bedService.GetRoomConfigAsync(token));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("floors")]
        public async Task<IActionResult> GetFloors(CancellationToken token)
        {
            try
            {
                return Ok(await _bedService.GetFloorsAsync(token));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("alerts")]
        public async Task<IActionResult> GetAlerts(CancellationToken token)
        {
            try
            {
                return Ok(await _bedService.GetAlertsAsync(token));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("{bedId}")]
        public async Task<IActionResult> GetBedById(Guid bedId, CancellationToken token)
        {
            try
            {
                return Ok(await _bedService.GetBedByIdAsync(bedId, token));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("patient/{patientId}/details")]
        public async Task<IActionResult> GetPatientDetails(Guid patientId, CancellationToken token)
        {
            try
            {
                return Ok(await _bedService.GetPatientDetailsAsync(patientId, token));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPatch("patient/{patientId}/prescriptions/{prescriptionId}")]
        public async Task<IActionResult> UpdatePrescriptionStatus(Guid patientId, Guid prescriptionId, [FromBody] UpdatePrescriptionStatusRequest request, CancellationToken token)
        {
            try
            {
                await _bedService.UpdatePrescriptionStatusAsync(patientId, prescriptionId, request.IsDone, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats(CancellationToken token)
        {
            try
            {
                return Ok((await _bedService.GetBedsSummaryAsync(null, null, token)).Stats);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPatch("{bedId}/status")]
        public async Task<IActionResult> UpdateBedStatus(Guid bedId, [FromBody] UpdateBedStatusRequest request, CancellationToken token)
        {
            try
            {
                await _bedService.UpdateBedStatusAsync(bedId, request, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPost("{bedId}/admit")]
        public async Task<IActionResult> AdmitPatient(Guid bedId, [FromBody] AdmitPatientRequest request, CancellationToken token)
        {
            try
            {
                await _bedService.AdmitPatientAsync(bedId, request, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPost("{bedId}/discharge")]
        public async Task<IActionResult> DischargePatient(Guid bedId, CancellationToken token)
        {
            try
            {
                await _bedService.DischargePatientAsync(bedId, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
    }

    public class UpdatePrescriptionStatusRequest
    {
        public bool IsDone { get; set; }
    }
}
