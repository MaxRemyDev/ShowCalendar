using Backend.Interfaces;
using Backend.Models;
using Backend.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    // SERVICE CLASS FOR MANAGING NOTIFICATIONS (GET, POST, PUT, DELETE)
    public class NotificationService : INotificationService
    {
        // DATABASE CONTEXT FOR ACCESSING DATABASE VIA ENTITY FRAMEWORK
        private readonly ApplicationDbContext _context;

        // CONSTRUCTOR FOR INITIALIZING DATABASE CONTEXT VIA DEPENDENCY INJECTION
        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET ALL NOTIFICATIONS FROM DATABASE (FOR TESTING PURPOSES)
        public async Task<IEnumerable<Notification>> GetAllNotifications()
        {
            return await _context.Notifications.ToListAsync();
        }

        // GET A SPECIFIC NOTIFICATION BY ID FROM DATABASE
        public async Task<Notification> GetNotificationById(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            return notification ?? throw new KeyNotFoundException("Notifications not found");
        }

        // CREATE A NEW NOTIFICATION AND SAVE TO DATABASE (POST)
        public async Task<Notification> CreateNotification(Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return notification;
        }

        // UPDATE AN EXISTING NOTIFICATION IN DATABASE (PUT)
        public async Task<Notification> UpdateNotification(int id, Notification updatedNotification)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                throw new KeyNotFoundException("Notification not found");
            }

            // UPDATING NOTIFICATION DETAILS WITH UPDATED NOTIFICATION DETAILS
            notification.Type = updatedNotification.Type;
            notification.Message = updatedNotification.Message;
            notification.Date = updatedNotification.Date;
            notification.IsRead = updatedNotification.IsRead;

            _context.Entry(notification).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return notification;
        }

        // DELETE A NOTIFICATION FROM DATABASE BY ID (DELETE)
        public async Task<bool> DeleteNotification(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                throw new KeyNotFoundException("Notification not found");
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
