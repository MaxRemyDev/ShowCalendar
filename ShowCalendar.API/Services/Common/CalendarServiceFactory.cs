using ShowCalendar.API.Interfaces;

namespace ShowCalendar.API.Services.Common
{
    public class CalendarServiceFactory
    {
        private readonly IEnumerable<ICalendarService> _calendarServices;

        public CalendarServiceFactory(IEnumerable<ICalendarService> calendarServices)
        {
            _calendarServices = calendarServices;
        }

        public IEnumerable<ICalendarService> GetEnabledServices()
        {
            return _calendarServices.Where(s => s.IsEnabled);
        }

        public IEnumerable<ICalendarService> GetServicesByProvider(string providerName)
        {
            return _calendarServices.Where(s => 
                s.IsEnabled && 
                s.ProviderName.Equals(providerName, StringComparison.OrdinalIgnoreCase));
        }

        public IEnumerable<string> GetAvailableProviderNames()
        {
            return _calendarServices.Where(s => s.IsEnabled).Select(s => s.ProviderName);
        }
    }
} 
