using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<Notification>> GetAllNotifications();
        Task<Notification> GetNotificationById(int id);
        Task<Notification> CreateNotification(Notification notification);
        Task<Notification> UpdateNotification(int id, Notification notification);
        Task<bool> DeleteNotification(int id);
    }
}
