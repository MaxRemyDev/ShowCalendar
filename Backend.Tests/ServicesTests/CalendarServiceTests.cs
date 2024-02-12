using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace Backend.Tests.ServicesTests
{
    // UNIT TEST - CALENDAR SERVICE
    public class CalendarServiceTests
    {
        // DECLARES PRIVATE READ-ONLY FIELDS FOR "CALENDARSERVICE" AND "APPLICATIONDBCONTEXT"
        private readonly CalendarService _calendarService;
        private readonly ApplicationDbContext _context;

        // CONSTRUCTOR FOR "CALENDARSERVICETESTS" SETS UP IN-MEMORY DATABASE FOR TESTING AND INITIALIZES "CALENDARSERVICE"
        public CalendarServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"InMemoryDbForTesting{Guid.NewGuid()}")
                .Options;
            _context = new ApplicationDbContext(options);

            _calendarService = new CalendarService(_context);

            // POPULATES TEST DATA INTO IN-MEMORY DATABASE
            PopulateTestData(_context);
        }

        // STATIC METHOD TO POPULATE TEST DATA INTO APPLICATIONDBCONTEXT
        private static void PopulateTestData(ApplicationDbContext context)
        {
            var testCalendar1 = new Calendar { Name = "TestCalendar1", Description = "TestCalendar1Description", Color = "#000000" };
            var testCalendar2 = new Calendar { Name = "TestCalendar2", Description = "TestCalendar2Description", Color = "#FFFFFF" };

            context.Calendars.Add(testCalendar1);
            context.Calendars.Add(testCalendar2);
            context.SaveChanges();
        }

        // TEST TO VERIFY THAT "GETALLCALENDARS" METHOD SHOULD RETURN ALL CALENDARS
        [Fact]
        public async Task GetAllCalendars_ShouldReturnAllCalendars()
        {
            var calendars = await _calendarService.GetAllCalendars();
            Assert.Equal(2, calendars.Count());
        }

        // TEST TO VERIFY THAT "GETCALENDARBYID" METHOD SHOULD RETURN SPECIFIC CALENDAR
        [Fact]
        public async Task GetCalendarById_ShouldReturnCalendar()
        {
            var calendar = await _calendarService.GetCalendarById(1);
            Assert.Equal("TestCalendar1", calendar.Name);
        }

        //TODO: ADD A TEST FOR CREATECALENDAR TO VERIFY THAT A NEW CALENDAR IS CORRECTLY ADDED TO DATABASE
        //TODO: ADD A TEST FOR UPDATECALENDAR TO VERIFY THAT DETAILS OF AN EXISTING CALENDAR ARE CORRECTLY UPDATED
        //TODO: ADD A TEST FOR UPDATECALENDAR TO VERIFY THAT AN EXCEPTION IS THROWN IF CALENDAR TO UPDATE DOES NOT EXIST
        //TODO: ADD A TEST FOR DELETECALENDAR TO CONFIRM THAT A CALENDAR IS CORRECTLY DELETED FROM DATABASE
        //TODO: ADD A TEST FOR DELETECALENDAR TO ENSURE THAT AN EXCEPTION IS THROWN IF CALENDAR TO DELETE DOES NOT EXIST
        //TODO: ADD A TEST TO ENSURE THAT GETALLCALENDARS RETURNS AN EMPTY LIST WHEN NO CALENDARS EXIST
        //TODO: ADD A TEST FOR GETCALENDARBYID TO CHECK BEHAVIOR WHEN REQUESTED CALENDAR DOES NOT EXIST (RETURNS KEYNOTFOUNDEXCEPTION)

    }
}
