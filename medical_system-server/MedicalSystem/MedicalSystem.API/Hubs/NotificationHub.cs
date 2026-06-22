using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using MedicalSystem.Data.DbContext;

namespace MedicalSystem.API.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        private readonly MedicalSystemDbContext _context;

        public NotificationHub(MedicalSystemDbContext context)
        {
            _context = context;
        }

        public override async Task OnConnectedAsync()
        {
            var userIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userIdStr))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userIdStr);
                
                if (Guid.TryParse(userIdStr, out var userId))
                {
                    var user = await _context.Users.FindAsync(userId);
                    if (user != null && user.MedicalStaffId.HasValue)
                    {
                        await Groups.AddToGroupAsync(Context.ConnectionId, user.MedicalStaffId.Value.ToString());
                    }
                }
            }

            var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
            if (!string.IsNullOrEmpty(role))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, role);
                
                if (role == "Doctor" || role == "Nurse" || role == "ChiefDoctor")
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "MedicalStaff");
                }
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userIdStr))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userIdStr);
                
                if (Guid.TryParse(userIdStr, out var userId))
                {
                    var user = await _context.Users.FindAsync(userId);
                    if (user != null && user.MedicalStaffId.HasValue)
                    {
                        await Groups.RemoveFromGroupAsync(Context.ConnectionId, user.MedicalStaffId.Value.ToString());
                    }
                }
            }

            var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
            if (!string.IsNullOrEmpty(role))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, role);
                
                if (role == "Doctor" || role == "Nurse" || role == "ChiefDoctor")
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, "MedicalStaff");
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
