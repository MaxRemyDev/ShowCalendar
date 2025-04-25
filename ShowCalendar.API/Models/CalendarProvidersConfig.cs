using ShowCalendar.API.Models.Providers.Google;
using ShowCalendar.API.Models.Providers.Apple;
using ShowCalendar.API.Models.Providers.Microsoft;

namespace ShowCalendar.API.Models
{
    public class CalendarProvidersConfig
    {
        public GoogleCalendarConfig Google { get; set; } = new GoogleCalendarConfig();
        public AppleCalendarConfig Apple { get; set; } = new AppleCalendarConfig();
        public MicrosoftCalendarConfig Microsoft { get; set; } = new MicrosoftCalendarConfig();
    }
} 
