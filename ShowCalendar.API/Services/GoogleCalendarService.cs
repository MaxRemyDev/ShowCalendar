using ShowCalendar.API.Interfaces;
using ShowCalendar.API.Models;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Microsoft.Extensions.Options;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;

namespace ShowCalendar.API.Services
{
    public class GoogleCalendarService : ICalendarService
    {
        private readonly GoogleCalendarConfig _config;
        private CalendarService? _calendarService;

        public string ProviderName => "Google";

        public GoogleCalendarService(IOptions<GoogleCalendarConfig> config)
        {
            _config = config.Value;
        }

        // GET CALENDAR SERVICE ASYNC
        private Task<CalendarService> GetCalendarServiceAsync()
        {

            // CHECK IF CALENDAR SERVICE IS ALREADY INITIALIZED
            if (_calendarService != null)
            {
                return Task.FromResult(_calendarService);
            }

            // TRY TO INITIALIZE CALENDAR SERVICE
            try
            {
                Console.WriteLine($"Initializing Google Calendar service with ClientID: {_config.ClientId.Substring(0, 5)}... and RefreshToken: {_config.RefreshToken.Substring(0, 5)}...");

                // CHECK IF REFRESH TOKEN IS AVAILABLE
                if (string.IsNullOrEmpty(_config.RefreshToken))
                {
                    Console.WriteLine("No RefreshToken available, need to generate one.");
                    throw new InvalidOperationException("RefreshToken is missing. Configure it in environment variable");
                }

                // CREATE AUTHENTICATION FLOW
                var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = new ClientSecrets
                    {
                        ClientId = _config.ClientId,
                        ClientSecret = _config.ClientSecret
                    },
                    Scopes = _config.Scopes
                });

                // CREATE CREDENTIAL WITH REFRESH TOKEN
                var token = new TokenResponse { RefreshToken = _config.RefreshToken };
                var credential = new UserCredential(flow, "user", token);

                // CREATE CALENDAR SERVICE
                _calendarService = new CalendarService(new BaseClientService.Initializer
                {
                    HttpClientInitializer = credential,
                    ApplicationName = _config.ApplicationName
                });

                return Task.FromResult(_calendarService);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error initializing Google Calendar Service: {ex.Message}");
                throw;
            }
        }

        // GET EVENS ASYNC
        public async Task<List<CalendarEvent>> GetEventsAsync(DateTime startDate, DateTime endDate)
        {
            var events = new List<CalendarEvent>(); // CREATE EVENTS LIST

            // TRY TO GET EVENTS
            try
            {
                var service = await GetCalendarServiceAsync(); // GET CALENDAR SERVICE

                // GET LIST OF CALENDARS
                var calendarListRequest = service.CalendarList.List();
                var calendarList = await calendarListRequest.ExecuteAsync();

                // ITERATE THROUGH CALENDARS
                foreach (var calendar in calendarList.Items ?? new List<CalendarListEntry>())
                {
                    var eventsRequest = service.Events.List(calendar.Id);
                    eventsRequest.TimeMinDateTimeOffset = startDate;
                    eventsRequest.TimeMaxDateTimeOffset = endDate;
                    eventsRequest.SingleEvents = true;
                    eventsRequest.ShowDeleted = false;
                    eventsRequest.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;

                    // GET EVENTS
                    var eventsResult = await eventsRequest.ExecuteAsync();

                    // ADD EVENT TO LIST
                    events.AddRange(GoogleEvents(eventsResult.Items, calendar.Id));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching Google Calendar events: {ex.Message}");
            }

            return events;
        }

        private IEnumerable<CalendarEvent> GoogleEvents(IList<Event> googleEvents, string calendarId)
        {
            if (googleEvents == null) return Enumerable.Empty<CalendarEvent>();

            return googleEvents.Select(e => new CalendarEvent
            {
                Id = e.Id ?? string.Empty,
                Title = e.Summary ?? string.Empty,
                Description = e.Description,
                Start = e.Start?.DateTimeDateTimeOffset?.DateTime ?? DateTime.Parse(e.Start?.Date ?? DateTime.Now.ToString("yyyy-MM-dd")),
                End = e.End?.DateTimeDateTimeOffset?.DateTime ?? DateTime.Parse(e.End?.Date ?? DateTime.Now.AddDays(1).ToString("yyyy-MM-dd")),
            });
        }
    }
}
