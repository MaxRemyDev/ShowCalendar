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
    // UNIT TEST - APPOINTMENTS CONTROLLER
    public class AppointmentsControllerTests
    {
        // DECLARES PRIVATE READ-ONLY FIELDS - "APPOINTMENTSCONTROLLER", MOCK OF "IAPPOINTMENTSERVICE", AND MOCK OF "IMAPPER"
        private readonly AppointmentsController _controller;
        private readonly Mock<IAppointmentService> _mockAppointmentService;
        private readonly Mock<IMapper> _mockMapper;

        // CONSTRUCTOR - "APPOINTMENTSCONTROLLERTESTS" INITIALIZES MOCKS FOR "IAPPOINTMENTSERVICE" AND "IMAPPER", AND CREATES AN INSTANCE OF "APPOINTMENTSCONTROLLER" WITH THESE MOCKS
        public AppointmentsControllerTests()
        {
            _mockAppointmentService = new Mock<IAppointmentService>(); // INITIALIZES MOCK "IAPPOINTMENTSERVICE"
            _mockMapper = new Mock<IMapper>(); // INITIALIZES MOCK "IMAPPER"
            _controller = new AppointmentsController(_mockAppointmentService.Object, _mockMapper.Object); // CREATES AN INSTANCE OF "APPOINTMENTSCONTROLLER", INJECTING MOCKED SERVICES
        }

        // TEST TO VERIFY THAT "GETALLAPPOINTMENTS" METHOD RETURNS ALL APPOINTMENTS WHEN CALLED
        [Fact]
        public async Task GetAllAppointments_WhenCalled_ReturnsAllAppointments()
        {
            // ARRANGE - SETUP MOCK "IAPPOINTMENTSERVICE" TO RETURN A LIST OF APPOINTMENTS AND "IMAPPER" TO CONVERT TO "APPOINTMENTDTO"
            var appointments = new List<Appointment>
            {
                new Appointment { AppointmentId = 1, Title = "Appointment1" },
                new Appointment { AppointmentId = 2, Title = "Appointment2" }
            };
            var appointmentDtos = new List<AppointmentDto>
            {
                new AppointmentDto { AppointmentId = 1, Title = "Appointment1" },
                new AppointmentDto { AppointmentId = 2, Title = "Appointment2" }
            };

            _mockAppointmentService.Setup(service => service.GetAllAppointments()).ReturnsAsync(appointments);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<AppointmentDto>>(appointments)).Returns(appointmentDtos);

            // ACT - CALL "GETALLAPPOINTMENTS" METHOD
            var result = await _controller.GetAllAppointments();

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OKOBJECTRESULT" WITH ALL "APPOINTMENTDTO"s
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedAppointments = Assert.IsType<List<AppointmentDto>>(okResult.Value);
            Assert.Equal(2, returnedAppointments.Count);
        }

        // TEST TO VERIFY THAT "GETAPPOINTMENTBYID" RETURNS APPOINTMENT WHEN APPOINTMENT EXISTS
        [Fact]
        public async Task GetAppointmentById_WhenAppointmentExists_ReturnsAppointment()
        {
            // ARRANGE - SETUP MOCK "IAPPOINTMENTSERVICE" AND "IMAPPER" TO RETURN A SPECIFIC "APPOINTMENT" AND "APPOINTMENTDTO"
            var appointment = new Appointment { AppointmentId = 1, Title = "Appointment1" };
            var appointmentDto = new AppointmentDto { AppointmentId = 1, Title = "Appointment1" };

            _mockAppointmentService.Setup(service => service.GetAppointmentById(1)).ReturnsAsync(appointment);
            _mockMapper.Setup(mapper => mapper.Map<AppointmentDto>(appointment)).Returns(appointmentDto);

            // ACT - CALL "GETAPPOINTMENTBYID" METHOD WITH A VALID APPOINTMENT ID
            var result = await _controller.GetAppointmentById(1);

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OKOBJECTRESULT" WITH EXPECTED "APPOINTMENTDTO"
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedAppointment = Assert.IsType<AppointmentDto>(okResult.Value);
            Assert.Equal("Appointment1", returnedAppointment.Title);
        }

        // TEST TO VERIFY THAT "CREATEAPPOINTMENT" METHOD RETURNS "CREATEDATACTION" WHEN CALLED WITH VALID DATA
        [Fact]
        public async Task CreateAppointment_WhenCalled_ReturnsCreatedAtAction()
        {
            // ARRANGE - SETUP MOCK "IAPPOINTMENTSERVICE" AND "IMAPPER" FOR APPOINTMENT CREATION
            var appointmentDto = new AppointmentDto { Title = "NewAppointment" };
            var appointment = new Appointment { AppointmentId = 3, Title = "NewAppointment" };


            _mockAppointmentService.Setup(x => x.CreateAppointment(It.IsAny<Appointment>())).ReturnsAsync(appointment);
            _mockMapper.Setup(x => x.Map<Appointment>(It.IsAny<AppointmentDto>())).Returns(appointment);
            _mockMapper.Setup(x => x.Map<AppointmentDto>(It.IsAny<Appointment>())).Returns(appointmentDto);

            // ACT - CALL "CREATEAPPOINTMENT" METHOD TO CREATE A NEW APPOINTMENT
            var result = await _controller.CreateAppointment(appointmentDto);

            // ASSERT - VERIFY THAT METHOD RETURNS A "CREATEDATACTIONRESULT" POINTING TO "GETAPPOINTMENTBYID"
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal("GetAppointmentById", actionResult.ActionName);
            Assert.NotNull(actionResult.Value);
            var resultValue = actionResult.Value as AppointmentDto;
            Assert.NotNull(resultValue);
            Assert.Equal(appointmentDto.AppointmentId, resultValue.AppointmentId);
        }

        //TODO: ADD A TEST TO CHECK BADREQUEST RESPONSE WHEN CREATING AN APPOINTMENT FAILS
        //TODO: ADD A TEST TO CHECK NOTFOUND RESPONSE WHEN GETAPPOINTMENTBYID IS CALLED WITH A NON-EXISTENT ID
        //TODO: ADD A TEST TO CHECK FOR AN APPOINTMENT UPDATE WITH UPDATEAPPOINTMENT
        //TODO: ADD A TEST TO CHECK BADREQUEST RESPONSE WHEN UPDATING AN APPOINTMENT FAILS
        //TODO: ADD A TEST TO CHECK DELETION OF AN APPOINTMENT WITH DELETEAPPOINTMENT
        //TODO: ADD A TEST TO CHECK NOTFOUND RESPONSE WHEN TRYING TO DELETE A NON-EXISTING APPOINTMENT

    }
}
