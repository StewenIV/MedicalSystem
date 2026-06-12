using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MedicinesController : ControllerBase
    {
        private readonly IMedicineQuery _medicineQuery;
        private readonly MedicineService _medicineService;

        public MedicinesController(IMedicineQuery medicineQuery, MedicineService medicineService)
        {
            _medicineQuery = medicineQuery;
            _medicineService = medicineService;
        }

        private Guid? GetCurrentUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            return Guid.TryParse(userIdStr, out var parsedId) ? parsedId : null;
        }

        [HttpGet]
        [Authorize(Roles = "Doctor,Nurse,HeadNurse,ChiefDoctor")]
        public async Task<IActionResult> GetAll(CancellationToken token)
        {
            try
            {
                var result = await _medicineQuery.GetAllMedicinesAsync(token);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Doctor,HeadNurse,ChiefDoctor")]
        public async Task<IActionResult> Create([FromBody] CreateMedicineDto dto, CancellationToken token)
        {
            try
            {
                var userId = GetCurrentUserId();
                var med = await _medicineService.AddMedicineAsync(dto, userId, token);
                return Ok(med);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor,HeadNurse,ChiefDoctor")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMedicineDto dto, CancellationToken token)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _medicineService.UpdateMedicineAsync(id, dto, userId, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Doctor,HeadNurse,ChiefDoctor")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken token)
        {
            try
            {
                await _medicineService.DeleteOrArchiveMedicineAsync(id, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/receipt")]
        [Authorize(Roles = "Doctor,Nurse,HeadNurse,ChiefDoctor")]
        public async Task<IActionResult> RecordReceipt(Guid id, [FromBody] RecordReceiptDto dto, CancellationToken token)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _medicineService.RecordReceiptAsync(id, dto, userId, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/writeoff")]
        [Authorize(Roles = "Doctor,Nurse,HeadNurse,ChiefDoctor")]
        public async Task<IActionResult> RecordWriteoff(Guid id, [FromBody] RecordWriteoffDto dto, CancellationToken token)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _medicineService.RecordWriteoffAsync(id, dto, userId, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
