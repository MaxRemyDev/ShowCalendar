using Microsoft.AspNetCore.Mvc;
using ShowCalendar.API.Interfaces;

namespace ShowCalendar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ICalendarService _googleCalendarService;

        public TestController(ICalendarService googleCalendarService)
        {
            _googleCalendarService = googleCalendarService;
        }

        [HttpGet("calendar/status")]
        public IActionResult GetCalendarStatus()
        {
            var config = new
            {
                ClientIdConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GCP_CLIENT_ID")),
                ClientSecretConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GCP_CLIENT_SECRET")),
                RefreshTokenConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GCP_REFRESH_TOKEN")),
                ProviderName = _googleCalendarService.ProviderName
            };

            return Ok(config);
        }
    }
}
