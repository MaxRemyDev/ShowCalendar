using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface ICalendarService
    {
        Task<IEnumerable<Calendar>> GetAllCalendars();
        Task<Calendar> GetCalendarById(int id);
        Task<Calendar> CreateCalendar(Calendar calendar);
        Task<Calendar> UpdateCalendar(int id, Calendar calendar);
        Task<bool> DeleteCalendar(int id);
    }
}
