using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Domain.Enums;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationStorage _notificationStorage;

        public NotificationsController(INotificationStorage notificationStorage)
        {
            _notificationStorage = notificationStorage;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNotifications(CancellationToken token)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                            ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var role = User.FindFirstValue(ClaimTypes.Role);
            
            if (role == "Patient") 
            {
                var notifs = await _notificationStorage.GetByPatientIdAsync(userId, token);
                return Ok(notifs.OrderByDescending(n => n.CreatedAt));
            }
            else
            {
                var notifs = await _notificationStorage.GetStaffNotificationsAsync(userId, token);
                return Ok(notifs.OrderByDescending(n => n.CreatedAt));
            }
        }
        
        [HttpPost("{id}/mark-read")]
        public async Task<IActionResult> MarkRead(Guid id, CancellationToken token)
        {
            await _notificationStorage.MarkAsReadAsync(id, token);
            return Ok(new { message = "Marked as read" });
        }

        [HttpPost("mark-all-read")]
        public async Task<IActionResult> MarkAllRead(CancellationToken token)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                            ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var role = User.FindFirstValue(ClaimTypes.Role);

            if (role == "Patient")
            {
                await _notificationStorage.MarkAllAsReadByPatientAsync(userId, token);
            }
            else
            {
                await _notificationStorage.MarkAllAsReadByStaffAsync(userId, token);
            }

            return Ok(new { message = "All marked as read" });
        }
    }
}

