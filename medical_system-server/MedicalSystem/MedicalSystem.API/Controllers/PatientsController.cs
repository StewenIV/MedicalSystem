using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Services;
using MedicalSystem.App.Contracts.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Doctor,Nurse,HeadNurse,ChiefDoctor")]
    public class PatientsController : ControllerBase
    {
        private readonly PatientService _patientService;

        public PatientsController(PatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPatients(CancellationToken token)
        {
            try
            {
                var patients = await _patientService.GetAllPatientsAsync(token);
                return Ok(patients);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("hospitalized")]
        public async Task<IActionResult> GetHospitalizedPatients(CancellationToken token)
        {
            try
            {
                var patients = await _patientService.GetHospitalizedPatientsAsync(token);
                return Ok(patients);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActivePatients(CancellationToken token)
        {
            try
            {
                var patients = await _patientService.GetActivePatientsAsync(token);
                return Ok(patients);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatientCardById(Guid id, CancellationToken token)
        {
            try
            {
                var patientCard = await _patientService.GetPatientCardAsync(id, token);

                if (patientCard == null)
                {
                    return NotFound();
                }

                return Ok(patientCard);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreatePatient([FromBody] PatientCardDto request, CancellationToken token)
        {
            try
            {
                var newPatient = await _patientService.AddPatientAsync(request, token);
                return Ok(newPatient);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(Guid id, [FromBody] PatientCardDto request, CancellationToken token)
        {
            try
            {
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                              ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
                Guid? userId = Guid.TryParse(userIdStr, out var parsedId) ? parsedId : null;

                await _patientService.UpdatePatientCardAsync(id, request, userId, token);
                var updated = await _patientService.GetPatientCardAsync(id, token);
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(Guid id, CancellationToken token)
        {
            try
            {
                await _patientService.DeletePatientAsync(id, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
