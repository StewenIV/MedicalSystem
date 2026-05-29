using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Services;
using MedicalSystem.Domain.Models;
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
        public async Task<IActionResult> GetVitals(Guid patientId, [FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken token)
        {
            var vitals = await _vitalSignService.GetVitalSignsAsync(patientId, from, to, token);
            return Ok(vitals);
        }

        [HttpPost]
        public async Task<IActionResult> AddVital(Guid patientId, [FromBody] VitalSign vitalSign, CancellationToken token)
        {
            await _vitalSignService.AddVitalSignAsync(patientId, vitalSign, token);
            return Ok();
        }
    }
}
