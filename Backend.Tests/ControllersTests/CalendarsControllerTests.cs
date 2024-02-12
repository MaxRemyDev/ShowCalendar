using AutoMapper;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Backend.Tests.ControllersTests
{
    // UNIT TEST - CALENDARS CONTROLLER
    public class CalendarsControllerTests
    {
        // DECLARES PRIVATE READ-ONLY FIELDS FOR "CALENDARSCONTROLLER", MOCK OF "ICALENDARSERVICE", AND MOCK OF "IMAPPER"
        private readonly CalendarsController _controller;
        private readonly Mock<ICalendarService> _mockCalendarService;
        private readonly Mock<IMapper> _mockMapper;

        // CONSTRUCTOR - "CALENDARSCONTROLLERTESTS" INITIALIZES MOCKS FOR "ICALENDARSERVICE" AND "IMAPPER", AND CREATES AN INSTANCE OF "CALENDARSCONTROLLER" WITH THESE MOCKS
        public CalendarsControllerTests()
        {
            _mockCalendarService = new Mock<ICalendarService>();
            _mockMapper = new Mock<IMapper>();
            _controller = new CalendarsController(_mockCalendarService.Object, _mockMapper.Object);
        }

        // TEST TO VERIFY THAT "GETALLCALENDARS" METHOD RETURNS ALL CALENDARS WHEN CALLED
        [Fact]
        public async Task GetAllCalendars_WhenCalled_ReturnsAllCalendars()
        {
            // ARRANGE - PREPARE MOCK "ICALENDARSERVICE" TO RETURN A LIST OF CALENDARS AND "IMAPPER" TO CONVERT TO "CALENDARDTO"s
            var calendars = new List<Calendar>
            {
                new Calendar { CalendarId = 1, Name = "Calendar1" },
                new Calendar { CalendarId = 2, Name = "Calendar2" }
            };
            var calendarDtos = new List<CalendarDto>
            {
                new CalendarDto { CalendarId = 1, Name = "Calendar1" },
                new CalendarDto { CalendarId = 2, Name = "Calendar2" }
            };

            _mockCalendarService.Setup(service => service.GetAllCalendars()).ReturnsAsync(calendars);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<CalendarDto>>(calendars)).Returns(calendarDtos);

            // ACT - CALL "GETALLCALENDARS" METHOD
            var result = await _controller.GetAllCalendars();

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OKOBJECTRESULT" WITH ALL "CALENDARDTO"
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedCalendars = Assert.IsType<List<CalendarDto>>(okResult.Value);
            Assert.Equal(2, returnedCalendars.Count);
        }

        // TEST TO VERIFY THAT "GETCALENDARBYID" RETURNS CALENDAR WHEN CALENDAR EXISTS
        [Fact]
        public async Task GetCalendarById_WhenCalendarExists_ReturnsCalendar()
        {
            // ARRANGE - SETUP MOCK "ICALENDARSERVICE" AND "IMAPPER" TO RETURN A SPECIFIC "CALENDAR" AND "CALENDARDTO"
            var calendar = new Calendar { CalendarId = 1, Name = "Calendar1" };
            var calendarDto = new CalendarDto { CalendarId = 1, Name = "Calendar1" };

            _mockCalendarService.Setup(service => service.GetCalendarById(1)).ReturnsAsync(calendar);
            _mockMapper.Setup(mapper => mapper.Map<CalendarDto>(calendar)).Returns(calendarDto);

            // ACT - CALL "GETCALENDARBYID" METHOD WITH A VALID CALENDAR ID
            var result = await _controller.GetCalendarById(1);

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OKOBJECTRESULT" WITH EXPECTED "CALENDARDTO"
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedCalendar = Assert.IsType<CalendarDto>(okResult.Value);
            Assert.Equal("Calendar1", returnedCalendar.Name);
        }

        // TEST TO VERIFY THAT "CREATECALENDAR" METHOD RETURNS "CREATEDATACTION" WHEN CALLED WITH VALID DATA
        [Fact]
        public async Task CreateCalendar_WhenCalled_ReturnsCreatedAtAction()
        {
            // ARRANGE - SETUP MOCK "ICALENDARSERVICE" AND "IMAPPER" FOR CALENDAR CREATION
            var calendarDto = new CalendarDto { Name = "NewCalendar" };
            var calendar = new Calendar { CalendarId = 3, Name = "NewCalendar" };


            _mockCalendarService.Setup(x => x.CreateCalendar(It.IsAny<Calendar>())).ReturnsAsync(calendar);
            _mockMapper.Setup(x => x.Map<Calendar>(It.IsAny<CalendarDto>())).Returns(calendar);
            _mockMapper.Setup(x => x.Map<CalendarDto>(It.IsAny<Calendar>())).Returns(calendarDto);

            // ACT - CALL "CREATECALENDAR" METHOD TO CREATE A NEW CALENDAR
            var result = await _controller.CreateCalendar(calendarDto);

            // ASSERT - VERIFY THAT METHOD RETURNS A "CREATEDATACTIONRESULT" POINTING TO "GETCALENDARBYID"
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal("GetCalendarById", actionResult.ActionName);
            Assert.NotNull(actionResult.Value);
            var resultValue = actionResult.Value as CalendarDto;
            Assert.NotNull(resultValue);
            Assert.Equal(calendarDto.CalendarId, resultValue.CalendarId);
        }

        //TODO: ADD A TEST TO VERIFY THAT "UPDATECALENDAR" RETURNS "OKOBJECTRESULT" WITH UPDATED DATA WHEN OPERATION SUCCEEDS
        //TODO: ADD A TEST TO VERIFY THAT "DELETECALENDAR" RETURNS "NOCONTENTRESULT" WHEN A CALENDAR IS SUCCESSFULLY DELETED
        //TODO: ADD A TEST TO VERIFY THAT "CREATECALENDAR" RETURNS "BADREQUEST" WHEN CALENDAR CREATION FAILS
        //TODO: ADD A TEST TO VERIFY THAT "GETCALENDARBYID" RETURNS "NOTFOUND" WHEN NO CALENDAR IS FOUND WITH PROVIDED ID
        //TODO: ADD A TEST TO VERIFY THAT "UPDATECALENDAR" RETURNS "NOTFOUND" WHEN NO CALENDAR TO UPDATE IS FOUND WITH PROVIDED ID

    }
}
