using ShowCalendar.API.Models.Common;
using ShowCalendar.API.Models.Providers.Apple;
using ShowCalendar.API.Services.Common;
using Microsoft.Extensions.Options;

namespace ShowCalendar.API.Services.Providers.Apple
{
    public class AppleCalendarService : CalendarServiceBase
    {
        private readonly AppleCalendarConfig _config;

        public override string ProviderName => "Apple";
        public override bool IsEnabled => _config.Enabled;

        public AppleCalendarService(IOptions<AppleCalendarConfig> config)
        {
            _config = config.Value;
        }

        public override Task<List<CalendarEvent>> GetEventsAsync(DateTime startDate, DateTime endDate)
        {
            if (!IsEnabled)
            {
                return Task.FromResult(EmptyEventList());
            }

            // PLACEHOLDER IMPLEMENTATION - TO BE IMPLEMENTED
            Console.WriteLine("Apple Calendar implementation not yet available");
            return Task.FromResult(EmptyEventList());
        }

        public override string GetUserEmail()
        {
            return _config.UserEmail ?? "unknown email";
        }
    }
} 
