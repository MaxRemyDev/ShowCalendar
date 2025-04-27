using ShowCalendar.API.Models.Common;

namespace ShowCalendar.API.Interfaces
{
    public interface ICalendarService
    {
        Task<List<CalendarEvent>> GetEventsAsync(DateTime startDate, DateTime endDate);
        string ProviderName { get; }
        bool IsEnabled { get; }      
        string GetUserEmail();
    }
}
