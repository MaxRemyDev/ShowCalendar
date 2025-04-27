using ShowCalendar.API.Interfaces;
using ShowCalendar.API.Models.Common;

namespace ShowCalendar.API.Services.Common
{
    public abstract class CalendarServiceBase : ICalendarService
    {
        public abstract string ProviderName { get; }
        public abstract bool IsEnabled { get; }
        public abstract Task<List<CalendarEvent>> GetEventsAsync(DateTime startDate, DateTime endDate);
        
        // GETS THE EMAIL ADDRESS ASSOCIATED WITH THIS CALENDAR SERVICE.
        public virtual string GetUserEmail()
        {
            return $"{ProviderName.ToLower()} - unknown email";
        }

        // RETURNS AN EMPTY LIST OF CALENDAR EVENTS
        protected List<CalendarEvent> EmptyEventList()
        {
            return new List<CalendarEvent>();
        }

        // CREATES A NEW CALENDAR EVENT
        protected CalendarEvent CreateCalendarEvent(
            string id,
            string title,
            string description,
            DateTime start,
            DateTime end)
        {
            return new CalendarEvent
            {
                Id = id,
                Title = title,
                Description = description,
                Start = start,
                End = end,
                Provider = ProviderName
            };
        }
    }
} 
