using Microsoft.AspNetCore.Mvc;
using ShowCalendar.API.Interfaces;
using ShowCalendar.API.Models.Common;
using ShowCalendar.API.Services.Common;
using ShowCalendar.API.Services.Providers.Microsoft;
using Microsoft.Graph;
using Microsoft.Kiota.Abstractions.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ShowCalendar.API.Controllers
{
    [ApiController]
    [Route("api/calendar")]
    public class CalendarController : ControllerBase
    {
        private readonly CalendarServiceFactory _calendarServiceFactory;
        private readonly MicrosoftAuthService _microsoftAuthService;
        private readonly ILogger<CalendarController> _logger;

        public CalendarController(
            CalendarServiceFactory calendarServiceFactory,
            MicrosoftAuthService microsoftAuthService,
            ILogger<CalendarController> logger)
        {
            _calendarServiceFactory = calendarServiceFactory;
            _microsoftAuthService = microsoftAuthService;
            _logger = logger;
        }

        // GET ALL EVENTS FROM ALL PROVIDERS OR SPECIFIC PROVIDER
        [HttpGet("events")]
        public async Task<ActionResult> GetEvents(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string? provider = null)
        {
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

                var allEvents = new List<CalendarEvent>();

                // GET EVENTS FROM EACH SERVICE
                foreach (var service in services)
                {
                    try
                    {
                        var events = await service.GetEventsAsync(effectiveStartDate, effectiveEndDate);
                        allEvents.AddRange(events);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error retrieving events from {service.ProviderName}");
                        // CONTINUE WITH OTHER PROVIDERS IF ONE FAILS
                    }
                }

                return Ok(new
                {
                    EventCount = allEvents.Count,
                    TimeRange = $"From {effectiveStartDate} to {effectiveEndDate}",
                    Provider = services.Select(s => s.ProviderName),
                    ProviderDetails = services.Select(s => new {
                        Name = s.ProviderName,
                        Email = s.GetUserEmail()
                    }),
                    Events = allEvents
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving calendar events");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET STATUS OF ALL PROVIDERS
        [HttpGet("status")]
        public ActionResult<object> GetStatus()
        {
            var services = _calendarServiceFactory.GetEnabledServices();
            
            return Ok(services.Select(s => new
            {
                Provider = s.ProviderName,
                Enabled = s.IsEnabled,
                Email = s.GetUserEmail()
            }));
        }

        // LIST ALL AVAILABLE PROVIDERS
        [HttpGet("providers")]
        public ActionResult<IEnumerable<string>> GetProviders()
        {
            return Ok(_calendarServiceFactory.GetAvailableProviderNames());
        }
    }
}
