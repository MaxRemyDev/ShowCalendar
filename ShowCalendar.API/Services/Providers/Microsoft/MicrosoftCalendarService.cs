using ShowCalendar.API.Models.Common;
using ShowCalendar.API.Models.Providers.Microsoft;
using ShowCalendar.API.Services.Common;
using Microsoft.Extensions.Options;

namespace ShowCalendar.API.Services.Providers.Microsoft
{
    public class MicrosoftCalendarService : CalendarServiceBase
    {
        private readonly MicrosoftCalendarConfig _config;

        public override string ProviderName => "Microsoft";
        public override bool IsEnabled => _config.Enabled;

        public MicrosoftCalendarService(IOptions<MicrosoftCalendarConfig> config)
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
            Console.WriteLine("Microsoft Calendar implementation not yet available");
            return Task.FromResult(EmptyEventList());
        }
    }
} 
