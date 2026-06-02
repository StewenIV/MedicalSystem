using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Services;
using Microsoft.AspNetCore.Mvc;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/patients/{patientId}/vitals")]
    public class VitalSignsController : ControllerBase
    {
        private readonly VitalSignService _vitalSignService;

        public VitalSignsController(VitalSignService vitalSignService)
        {
            _vitalSignService = vitalSignService;
        }

        [HttpGet]
        public async Task<IActionResult> GetVitals(Guid patientId, CancellationToken token)
        {
            try
            {
                var vitals = await _vitalSignService.GetVitalSignsAsync(patientId, token);
                return Ok(vitals);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddVital(Guid patientId, [FromBody] CreateVitalSignRequest request, CancellationToken token)
        {
            try
            {
                await _vitalSignService.AddVitalSignAsync(patientId, request, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("warnings")]
        public async Task<IActionResult> GetWarnings(Guid patientId, CancellationToken token)
        {
            try
            {
                var warnings = await _vitalSignService.GetWarningsAsync(patientId, token);
                return Ok(warnings);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("trends")]
        public async Task<IActionResult> GetTrends(Guid patientId, CancellationToken token)
        {
            try
            {
                var trends = await _vitalSignService.GetTrendsAsync(patientId, token);
                return Ok(trends);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}