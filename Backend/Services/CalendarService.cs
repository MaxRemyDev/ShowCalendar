using Backend.Models;
using Backend.Data;
using Backend.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    // SERVICE CLASS FOR MANAGING CALENDARS (GET, POST, PUT, DELETE)
    public class CalendarService : ICalendarService
    {
        // DATABASE CONTEXT FOR ACCESSING DATABASE VIA ENTITY FRAMEWORK
        private readonly ApplicationDbContext _context;

        // CONSTRUCTOR FOR INITIALIZING DATABASE CONTEXT VIA DEPENDENCY INJECTION
        public CalendarService(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET ALL CALENDARS FROM DATABASE (FOR TESTING PURPOSES)
        public async Task<IEnumerable<Calendar>> GetAllCalendars()
        {
            return await _context.Calendars.ToListAsync();
        }

        // GET A SPECIFIC CALENDAR BY ID FROM DATABASE
        public async Task<Calendar> GetCalendarById(int id)
        {
            var calendar = await _context.Calendars.FindAsync(id);
            return calendar ?? throw new KeyNotFoundException("Calendar not found");
        }

        // CREATE A NEW CALENDAR AND SAVE TO DATABASE (POST)
        public async Task<Calendar> CreateCalendar(Calendar calendar)
        {
            _context.Calendars.Add(calendar);
            await _context.SaveChangesAsync();
            return calendar;
        }

        // UPDATE AN EXISTING CALENDAR IN DATABASE (PUT)
        public async Task<Calendar> UpdateCalendar(int id, Calendar calendar)
        {
            var existingCalendar = await _context.Calendars.FindAsync(id);
            if (existingCalendar == null)
            {
                throw new KeyNotFoundException("Calendar not found");
            }

            // UPDATING CALENDAR DETAILS WITH UPDATED CALENDAR DETAILS
            existingCalendar.Name = calendar.Name;
            existingCalendar.Description = calendar.Description;
            existingCalendar.Color = calendar.Color;

            _context.Entry(existingCalendar).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return existingCalendar;
        }

        // DELETE A CALENDAR FROM DATABASE BY ID (DELETE)
        public async Task<bool> DeleteCalendar(int id)
        {
            var calendar = await _context.Calendars.FindAsync(id);
            if (calendar == null)
            {
                return false;
            }

            _context.Calendars.Remove(calendar);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
