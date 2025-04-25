using ShowCalendar.API.Models;

namespace ShowCalendar.API.Interfaces
{
    public interface ICalendarService
    {
        Task<List<CalendarEvent>> GetEventsAsync(DateTime startDate, DateTime endDate);
        string ProviderName { get; }
    }
}
