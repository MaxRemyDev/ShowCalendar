using ShowCalendar.API.Models.Common;
using ShowCalendar.API.Models.Providers.Microsoft;
using ShowCalendar.API.Services.Common;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Microsoft.Kiota.Abstractions;

namespace ShowCalendar.API.Services.Providers.Microsoft
{
    public class MicrosoftCalendarService : CalendarServiceBase
    {
        private readonly MicrosoftCalendarConfig _config;
        private readonly ILogger<MicrosoftCalendarService> _logger;
        private readonly MicrosoftAuthService _authService;

        public override string ProviderName => "Microsoft";
        public override bool IsEnabled => _config.Enabled;

        public MicrosoftCalendarService(
            IOptions<MicrosoftCalendarConfig> config,
            ILogger<MicrosoftCalendarService> logger,
            MicrosoftAuthService authService)
        {
            _config = config.Value;
            _logger = logger;
            _authService = authService;
        }

        // GETS ALL CALENDAR EVENTS FOR A GIVEN DATE RANGE
        public override async Task<List<CalendarEvent>> GetEventsAsync(DateTime startDate, DateTime endDate)
        {
            if (!IsEnabled)
            {
                return EmptyEventList();
            }

            // TRY TO GET EVENTS
            try
            {
                Console.WriteLine($"Initializing Microsoft Calendar service with ClientID: {_config.ClientId.Substring(0, 5)}... and RefreshToken: {_config.RefreshToken.Substring(0, 5)}...");

                var graphClient = await GetGraphClientAsync(); // GET GRAPH CLIENT
                var calendarEvents = new List<CalendarEvent>(); // CREATE EVENTS LIST

                // CONVERT DATES TO UTC
                var startDateString = startDate.ToUniversalTime().ToString("o");
                var endDateString = endDate.ToUniversalTime().ToString("o");

                try 
                {
                    // GET EVENTS
                    var eventsResponse = await graphClient.Me.CalendarView
                        .GetAsync(requestConfiguration => 
                        {
                            // SPECIFY DATE RANGE
                            requestConfiguration.QueryParameters.StartDateTime = startDateString;
                            requestConfiguration.QueryParameters.EndDateTime = endDateString;
                            
                            // LIMIT FIELDS TO WHAT WE NEED
                            requestConfiguration.QueryParameters.Select = new[] { 
                                "id", "subject", "bodyPreview", "start", "end", "location" 
                            };
                            
                            requestConfiguration.Headers.Add("Prefer", "outlook.timezone=\"UTC\""); // SET HEADERS
                            requestConfiguration.QueryParameters.Top = 100; // LIMIT NUMBER OF RESULTS PER PAGE
                        });
                    
                    // CHECK IF RESPONSE HAS VALUES
                    if (eventsResponse?.Value != null)
                    {               
                        // ITERATE THROUGH EVENTS
                        foreach (var msEvent in eventsResponse.Value)
                        {
                            var calEvent = ConvertToCalendarEvent(msEvent);
                            if (calEvent != null)
                            {
                                calendarEvents.Add(calEvent);
                            }
                        }

                        // HANDLE PAGINATION IF THERE ARE MORE EVENTS
                        string? nextPageLink = eventsResponse.OdataNextLink;
                        while (!string.IsNullOrEmpty(nextPageLink))
                        {
                            var nextUri = new Uri(nextPageLink); // CREATE URI FOR NEXT PAGE
                            
                            // USE ODATA NEXTLINK TO GET ADDITIONAL PAGES
                            var nextRequest = new RequestInformation
                            {
                                HttpMethod = Method.GET,
                                URI = nextUri
                            };

                            nextRequest.Headers.Add("Prefer", "outlook.timezone=\"UTC\""); // ADD HEADERS

                            // GET NEXT PAGE
                            var nextResponse = await graphClient.RequestAdapter.SendAsync<EventCollectionResponse>(
                                nextRequest, 
                                EventCollectionResponse.CreateFromDiscriminatorValue);

                            // CHECK IF RESPONSE HAS VALUES
                            if (nextResponse?.Value != null)
                            {
                                // ITERATE THROUGH EVENTS
                                foreach (var msEvent in nextResponse.Value)
                                {
                                    var calEvent = ConvertToCalendarEvent(msEvent);
                                    if (calEvent != null)
                                    {
                                        calendarEvents.Add(calEvent);
                                    }
                                }

                                nextPageLink = nextResponse.OdataNextLink; // UPDATE NEXT PAGE LINK
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                    else
                    {
                        _logger.LogWarning("No events returned from Microsoft Graph API");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during Microsoft calendar view request");
                    _logger.LogWarning("Returning empty event list due to calendar view request error");
                    return EmptyEventList();
                }

                return calendarEvents;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initializing Microsoft Graph client");
                return EmptyEventList();
            }
        }

        // CONVERTS MICROSOFT EVENT TO CALENDAR EVENT
        private CalendarEvent? ConvertToCalendarEvent(Event msEvent)
        {
            // CHECK IF EVENT HAS ALL REQUIRED FIELDS
            if (msEvent?.Id == null || msEvent.Subject == null || 
                msEvent.Start?.DateTime == null || msEvent.End?.DateTime == null)
            {
                return null;
            }

            // PARSE START AND END DATES
            DateTime startDateTime, endDateTime;
            if (!DateTime.TryParse(msEvent.Start.DateTime, out startDateTime) ||
                !DateTime.TryParse(msEvent.End.DateTime, out endDateTime))
            {
                return null;
            }

            // IF TIMEZONE INFORMATION IS AVAILABLE
            if (!string.IsNullOrEmpty(msEvent.Start.TimeZone))
            {
                try
                {
                    var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(msEvent.Start.TimeZone);
                    if (msEvent.Start.TimeZone != "UTC")
                    {
                        startDateTime = TimeZoneInfo.ConvertTimeToUtc(startDateTime, timeZoneInfo);
                    }
                }
                catch
                {
                    // FALLBACK TO ASSUMING UTC
                    _logger.LogWarning("Error converting timezone for Microsoft event: {EventId}", msEvent.Id);
                    startDateTime = TimeZoneInfo.ConvertTimeToUtc(startDateTime, TimeZoneInfo.Utc);
                }
            }
            
            // IF TIMEZONE INFORMATION IS AVAILABLE
            if (!string.IsNullOrEmpty(msEvent.End.TimeZone))
            {
                try
                {
                    var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(msEvent.End.TimeZone);
                    if (msEvent.End.TimeZone != "UTC")
                    {
                        endDateTime = TimeZoneInfo.ConvertTimeToUtc(endDateTime, timeZoneInfo);
                    }
                }
                catch
                {
                    // FALLBACK TO ASSUMING UTC
                    _logger.LogWarning("Error converting timezone for Microsoft event: {EventId}", msEvent.Id);
                    endDateTime = TimeZoneInfo.ConvertTimeToUtc(endDateTime, TimeZoneInfo.Utc);
                }
            }

            string description = msEvent.BodyPreview ?? string.Empty;
            
            // ADD LOCATION INFORMATION IF AVAILABLE
            if (msEvent.Location?.DisplayName != null && !string.IsNullOrEmpty(msEvent.Location.DisplayName))
            {
                description += $"\nLocation: {msEvent.Location.DisplayName}";
            }

            return CreateCalendarEvent(
                msEvent.Id,
                msEvent.Subject,
                description,
                startDateTime,
                endDateTime
            );
        }

        // GETS GRAPH CLIENT
        private async Task<GraphServiceClient> GetGraphClientAsync()
        {
            if (string.IsNullOrEmpty(_config.RefreshToken))
            {
                throw new InvalidOperationException("No refresh token available for Microsoft Graph API. User authentication required.");
            }
            
            return await _authService.GetGraphClientAsync(_config.RefreshToken);
        }

        // ADD A METHOD TO EXPOSE CONFIG FOR DIAGNOSTICS
        public MicrosoftCalendarConfig GetCalendarConfig()
        {
            return _config;
        }
        
        // GETS USER EMAIL FROM MICROSOFT GRAPH API
        public override string GetUserEmail()
        {
            try
            {
                // RETRIEVE USER PROFILE INFORMATION SYNCHRONOUSLY
                var task = GetUserEmailAsync();
                task.Wait();
                return task.Result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unable to retrieve email from Microsoft account");
                return $"{ProviderName.ToLower()} - unknown email";
            }
        }
        
        // GETS USER EMAIL FROM MICROSOFT GRAPH API
        private async Task<string> GetUserEmailAsync()
        {
            try
            {
                var graphClient = await GetGraphClientAsync();
                var user = await graphClient.Me.GetAsync();
                return user?.Mail ?? user?.UserPrincipalName ?? "unknown email";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unable to retrieve email from Microsoft account");
                return "unknown email";
            }
        }
    }
} 
