using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Dtos;
using Backend.Interfaces;
using AutoMapper;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Controllers
{
    // CONTROLLER FOR MANAGING CALENDARS (GET, POST, PUT, DELETE)
    [ApiController]
    [Route("api/[controller]")]
    public class CalendarsController : ControllerBase
    {
        // DEPENDENCY INJECTION FOR CALENDAR SERVICE AND AUTOMAPPER
        private readonly ICalendarService _calendarService;
        private readonly IMapper _mapper;

        // CONSTRUCTOR INITIALIZING DEPENDENCIES
        public CalendarsController(ICalendarService calendarService, IMapper mapper)
        {
            _calendarService = calendarService;
            _mapper = mapper;
        }

        // GET ALL CALENDARS (GET)
        [HttpGet]
        public async Task<IActionResult> GetAllCalendars()
        {
            var calendars = await _calendarService.GetAllCalendars();
            var calendarDtos = _mapper.Map<IEnumerable<CalendarDto>>(calendars);
            return Ok(calendarDtos);
        }

        // GET CALENDAR BY ID (GET)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCalendarById(int id)
        {
            var calendar = await _calendarService.GetCalendarById(id);
            if (calendar == null) return NotFound();

            var calendarDto = _mapper.Map<CalendarDto>(calendar);
            return Ok(calendarDto);
        }

        // CREATE A NEW CALENDAR (POST)
        [HttpPost]
        public async Task<IActionResult> CreateCalendar(CalendarDto calendarDto)
        {
            var calendar = _mapper.Map<Calendar>(calendarDto);
            var newCalendar = await _calendarService.CreateCalendar(calendar);
            if (newCalendar == null) return BadRequest("Calendar creation failed");

            var newCalendarDto = _mapper.Map<CalendarDto>(newCalendar);
            return CreatedAtAction(nameof(GetCalendarById), new { id = newCalendarDto.CalendarId }, newCalendarDto);
        }

        // UPDATE AN EXISTING CALENDAR BY ID (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCalendar(int id, CalendarDto calendarDto)
        {
            var calendarToUpdate = await _calendarService.GetCalendarById(id);
            if (calendarToUpdate == null) return NotFound();

            _mapper.Map(calendarDto, calendarToUpdate);
            var updatedCalendar = await _calendarService.UpdateCalendar(id, calendarToUpdate);
            if (updatedCalendar == null) return BadRequest("Calendar update failed");

            var updatedCalendarDto = _mapper.Map<CalendarDto>(updatedCalendar);
            return Ok(updatedCalendarDto);
        }

        // DELETE A CALENDAR BY ID (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCalendar(int id)
        {
            bool deleted = await _calendarService.DeleteCalendar(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
