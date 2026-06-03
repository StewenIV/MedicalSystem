using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Services;
using Microsoft.AspNetCore.Mvc;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
    }
}
