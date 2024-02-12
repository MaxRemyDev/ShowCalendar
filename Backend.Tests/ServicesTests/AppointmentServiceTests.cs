using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace Backend.Tests.ServicesTests
{
    // UNIT TEST - APPOINTMENT SERVICE
    public class AppointmentServiceTests
    {
        // DECLARES PRIVATE READ-ONLY FIELDS FOR "APPOINTMENTSERVICE" AND "APPLICATIONDBCONTEXT"
        private readonly AppointmentService _appointmentService;
        private readonly ApplicationDbContext _context;

        // CONSTRUCTOR FOR "APPOINTMENTSERVICETESTS" SETS UP IN-MEMORY DATABASE FOR TESTING AND INITIALIZES "APPOINTMENTSERVICE"
        public AppointmentServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"InMemoryDbForTesting{Guid.NewGuid()}")
                .Options;
            _context = new ApplicationDbContext(options);

            _appointmentService = new AppointmentService(_context);

            // POPULATES TEST DATA INTO IN-MEMORY DATABASE
            PopulateTestData(_context);
        }

        // STATIC METHOD TO POPULATE TEST DATA INTO APPLICATIONDBCONTEXT
        private static void PopulateTestData(ApplicationDbContext context)
        {
            var testAppointment1 = new Appointment { Title = "TestAppointment1", Start = DateTime.Now, End = DateTime.Now.AddHours(1) };
            var testAppointment2 = new Appointment { Title = "TestAppointment2", Start = DateTime.Now, End = DateTime.Now.AddHours(1) };

            context.Appointments.Add(testAppointment1);
            context.Appointments.Add(testAppointment2);
            context.SaveChanges();
        }

        // TEST TO VERIFY THAT "GETALLAPPOINTMENTS" METHOD SHOULD RETURN ALL APPOINTMENTS
        [Fact]
        public async Task GetAllAppointments_ShouldReturnAllAppointments()
        {
            var appointments = await _appointmentService.GetAllAppointments();
            Assert.Equal(2, appointments.Count());
        }

        // TEST TO VERIFY THAT "GETAPPOINTMENTBYID" METHOD SHOULD RETURN SPECIFIC APPOINTMENT
        [Fact]
        public async Task GetAppointmentById_ShouldReturnAppointment()
        {
            var appointment = await _appointmentService.GetAppointmentById(1);
            Assert.Equal("TestAppointment1", appointment.Title);
        }

        //TODO: ADD A TEST FOR CREATEAPPOINTMENT TO VERIFY THAT A NEW APPOINTMENT IS CORRECTLY ADDED TO DATABASE
        //TODO: ADD A TEST FOR UPDATEAPPOINTMENT TO VERIFY THAT DETAILS OF AN EXISTING APPOINTMENT ARE CORRECTLY UPDATED
        //TODO: ADD A TEST FOR UPDATEAPPOINTMENT TO VERIFY THAT AN EXCEPTION IS THROWN IF APPOINTMENT TO UPDATE DOES NOT EXIST
        //TODO: ADD A TEST FOR DELETEAPPOINTMENT TO CONFIRM THAT AN APPOINTMENT IS CORRECTLY DELETED FROM DATABASE
        //TODO: ADD A TEST FOR DELETEAPPOINTMENT TO ENSURE THAT AN EXCEPTION IS THROWN IF APPOINTMENT TO BE DELETED DOES NOT EXIST
        //TODO: ADD A TEST TO ENSURE THAT GETALLAPPOINTMENTS RETURNS AN EMPTY LIST WHEN NO APPOINTMENTS EXIST
        //TODO: ADD A TEST FOR GETAPPOINTMENTBYID TO CHECK BEHAVIOR WHEN REQUESTED APPOINTMENT DOES NOT EXIST (RETURNS KEYNOTFOUNDEXCEPTION)

    }
}
