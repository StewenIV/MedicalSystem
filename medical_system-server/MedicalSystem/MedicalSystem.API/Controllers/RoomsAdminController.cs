using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Dtos;
using MedicalSystem.App.Services;
using Microsoft.AspNetCore.Mvc;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/rooms-admin")]
    public class RoomsAdminController : ControllerBase
    {
        private readonly RoomService _roomService;

        public RoomsAdminController(RoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRooms(
            [FromQuery] int? floorFilter,
            [FromQuery] string? typeFilter,
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken token = default)
        {
            try
            {
                var rooms = await _roomService.GetRoomsAsync(floorFilter, typeFilter, search, page, pageSize, token);
                return Ok(rooms);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoomById(Guid id, CancellationToken token)
        {
            try
            {
                var room = await _roomService.GetRoomByIdAsync(id, token);
                if (room == null) return NotFound();
                return Ok(room);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateRoom([FromBody] CreateRoomDto dto, CancellationToken token)
        {
            try
            {
                var room = await _roomService.CreateRoomAsync(dto, token);
                return Ok(room);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(Guid id, [FromBody] UpdateRoomDto dto, CancellationToken token)
        {
            try
            {
                if (id != dto.RoomId) return BadRequest();
                var room = await _roomService.UpdateRoomAsync(dto, token);
                if (room == null) return NotFound();
                return Ok(room);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/priority")]
        public async Task<IActionResult> UpdateRoomPriority(Guid id, [FromBody] int priority, CancellationToken token)
        {
            try
            {
                await _roomService.UpdateRoomPriorityAsync(id, (MedicalSystem.Domain.Enums.RoomPriority)priority, token);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(Guid id, CancellationToken token)
        {
            try
            {
                await _roomService.DeleteRoomAsync(id, token);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("available-floors")]
        public async Task<IActionResult> GetAvailableFloors(CancellationToken token)
        {
            try
            {
                var floors = await _roomService.GetAvailableFloorsAsync(token);
                return Ok(floors);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("by-floor/{floor}")]
        public async Task<IActionResult> GetRoomsByFloor(int floor, CancellationToken token)
        {
            try
            {
                var rooms = await _roomService.GetRoomsByFloorAsync(floor, token);
                return Ok(rooms);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}