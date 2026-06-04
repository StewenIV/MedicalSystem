using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Services;
using MedicalSystem.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/beds-admin")]
    [Authorize(Roles = "ChiefDoctor,HeadNurse")]
    public class BedsAdminController : ControllerBase
    {
        private readonly BedService _bedService;

        public BedsAdminController(BedService bedService)
        {
            _bedService = bedService;
        }

        [HttpGet("by-room/{roomId}")]
        public async Task<IActionResult> GetBedsByRoom(Guid roomId, [FromQuery] bool onlyFree = false, CancellationToken token = default)
        {
            try
            {
                var beds = await _bedService.GetBedsByRoomAsync(roomId, onlyFree, token);
                return Ok(beds);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddBed([FromBody] AddBedRequestDto request, CancellationToken token)
        {
            try
            {
                var bed = await _bedService.AddBedAsync(request.RoomId, request.BedNumber, request.Status, token);
                return Ok(bed);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBed(Guid id, CancellationToken token)
        {
            try
            {
                await _bedService.DeleteBedAsync(id, token);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPost("{id}/free")]
        public async Task<IActionResult> FreeBed(Guid id, [FromBody] FreeBedRequestDto request, CancellationToken token)
        {
            try
            {
                await _bedService.FreeBedAsync(id, request, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPut("{id}/note")]
        public async Task<IActionResult> UpdateBedNote(Guid id, [FromBody] UpdateBedNoteRequestDto request, CancellationToken token)
        {
            try
            {
                await _bedService.UpdateBedNoteAsync(id, request.Note, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignPatient([FromBody] AssignPatientRequestDto request, CancellationToken token)
        {
            try
            {
                await _bedService.AssignPatientToBedAsync(request, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> TransferPatient([FromBody] TransferBedRequestDto request, CancellationToken token)
        {
            try
            {
                await _bedService.TransferPatientAsync(request, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
