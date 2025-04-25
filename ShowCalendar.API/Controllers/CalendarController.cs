using Microsoft.AspNetCore.Mvc;
using ShowCalendar.API.Models.Common;
using ShowCalendar.API.Services.Common;

namespace ShowCalendar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CalendarController : ControllerBase
    {
        private readonly CalendarServiceFactory _calendarServiceFactory;

        public CalendarController(CalendarServiceFactory calendarServiceFactory)
        {
            _calendarServiceFactory = calendarServiceFactory;
        }

        // GET EVENTS ENDPOINT WITH OPTIONAL DATE RANGE AND PROVIDER FILTERS
        [HttpGet("events")]
        public async Task<ActionResult> GetEvent(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string? provider = null
        )
        {
            // TRY TO GET EVENTS
            try
            {
                // DEFAULT VALUE: 30 DAYS IN THE PAST TO 30 DAYS IN THE FUTURE
                var effectiveStartDate = startDate ?? DateTime.Now.AddDays(-30);
                var effectiveEndDate = endDate ?? DateTime.Now.AddDays(30);

                // GET SERVICES
                var services = string.IsNullOrEmpty(provider)
                    ? _calendarServiceFactory.GetEnabledServices()
                    : _calendarServiceFactory.GetServicesByProvider(provider);

                // CHECK IF ANY SERVICES ARE FOUND
                if (!services.Any())
                    return NotFound($"No Calendar provider found with name: {provider}");

                var allEvent = new List<CalendarEvent>(); // GET ALL EVENTS

                // GET EVENTS FROM EACH SERVICE
                foreach (var service in services)
                {
                    var events = await service.GetEventsAsync(effectiveStartDate, effectiveEndDate);
                    allEvent.AddRange(events);
                }

                return Ok(new
                {
                    EventCount = allEvent.Count, // COUNT OF EVENTS
                    TimeRange = $"From {effectiveStartDate} to {effectiveEndDate}", // SELECTED TIME RANGE
                    Provider = services.Select(s => s.ProviderName), // SHOW LIST OF PROVIDER SELECTED
                    Events = allEvent // SHOW ALL EVENTS FROM PROVIDER
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET PROVIDER ENDPOINT IN LISTS AVAILABLE CALENDAR PROVIDERS
        [HttpGet("providers")]
        public ActionResult<IEnumerable<string>> GetProvider()
        {
            return Ok(_calendarServiceFactory.GetAvailableProviderNames());
        }
    }
}
