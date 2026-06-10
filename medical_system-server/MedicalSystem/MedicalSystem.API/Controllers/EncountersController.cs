using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Authorize(Roles = "Doctor,Nurse,HeadNurse,ChiefDoctor")]
    public class EncountersController : ControllerBase
    {
        private readonly EncounterService _encounterService;

        public EncountersController(EncounterService encounterService)
        {
            _encounterService = encounterService;
        }

        [HttpGet("api/patients/{patientId}/encounters")]
        public async Task<IActionResult> GetPatientEncounters(Guid patientId, CancellationToken token)
        {
            try
            {
                var encounters = await _encounterService.GetPatientEncountersAsync(patientId, token);
                return Ok(encounters);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("api/encounters/today")]
        public async Task<IActionResult> GetTodayEncounters(CancellationToken token)
        {
            try
            {
                var encounters = await _encounterService.GetTodayEncountersAsync(token);
                return Ok(encounters);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
        [HttpPost("api/patients/{patientId}/encounters")]
        public async Task<IActionResult> CreateEncounter(Guid patientId, [FromBody] CreateEncounterRequest request, CancellationToken token)
        {
            try
            {
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                              ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
                Guid? userId = Guid.TryParse(userIdStr, out var parsedId) ? parsedId : null;

                var result = await _encounterService.CreateEncounterAsync(patientId, request, userId, token);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPut("api/patients/{patientId}/encounters/{encounterId}")]
        public async Task<IActionResult> UpdateEncounter(Guid patientId, Guid encounterId, [FromBody] CreateEncounterRequest request, CancellationToken token)
        {
            try
            {
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                              ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
                Guid? userId = Guid.TryParse(userIdStr, out var parsedId) ? parsedId : null;

                var result = await _encounterService.UpdateEncounterAsync(patientId, encounterId, request, userId, token);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
