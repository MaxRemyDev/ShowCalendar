using Microsoft.AspNetCore.Mvc;
using ShowCalendar.API.Services.Common;

namespace ShowCalendar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly CalendarServiceFactory _calendarServiceFactory;

        public TestController(CalendarServiceFactory calendarServiceFactory)
        {
            _calendarServiceFactory = calendarServiceFactory;
        }

        [HttpGet("calendar/status")]
        public IActionResult GetCalendarStatus()
        {
            var providers = _calendarServiceFactory.GetEnabledServices().ToList();
            
            var statuses = providers.Select(provider => new
            {
                ProviderName = provider.ProviderName,
                Status = GetProviderStatus(provider.ProviderName)
            }).ToList();

            return Ok(new
            {
                EnabledProviders = providers.Count,
                Providers = statuses
            });
        }

        private object GetProviderStatus(string providerName)
        {
            return providerName switch
            {
                "Google" => new
                {
                    ClientIdConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GCP_CLIENT_ID")),
                    ClientSecretConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GCP_CLIENT_SECRET")),
                    RefreshTokenConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GCP_REFRESH_TOKEN"))
                },
                "Apple" => new
                {
                    ClientIdConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("APPLE_CLIENT_ID")),
                    ClientSecretConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("APPLE_CLIENT_SECRET")),
                    RefreshTokenConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("APPLE_REFRESH_TOKEN"))
                },
                "Microsoft" => new
                {
                    ClientIdConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("MS_CLIENT_ID")),
                    ClientSecretConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("MS_CLIENT_SECRET")),
                    RefreshTokenConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("MS_REFRESH_TOKEN"))
                },
                _ => new
                {
                    Error = "Unknown provider"
                }
            };
        }
    }
}
