using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace Backend.Tests.ServicesTests
{
    // UNIT TEST - NOTIFICATION SERVICE
    public class NotificationServiceTests
    {
        // DECLARES PRIVATE READ-ONLY FIELDS FOR "NOTIFICATIONSERVICE" AND "APPLICATIONDBCONTEXT"
        private readonly NotificationService _notificationService;
        private readonly ApplicationDbContext _context;

        // CONSTRUCTOR FOR "NOTIFICATIONSERVICETESTS" SETS UP IN-MEMORY DATABASE FOR TESTING AND INITIALIZES "NOTIFICATIONSERVICE"
        public NotificationServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"InMemoryDbForTesting{Guid.NewGuid()}")
                .Options;
            _context = new ApplicationDbContext(options);

            _notificationService = new NotificationService(_context);

            // POPULATES TEST DATA INTO IN-MEMORY DATABASE
            PopulateTestData(_context);
        }

        // STATIC METHOD TO POPULATE TEST DATA INTO APPLICATIONDBCONTEXT
        private static void PopulateTestData(ApplicationDbContext context)
        {
            var testNotification1 = new Notification { UserId = 1, Type = "TestNotification1", Message = "TestNotification1Message", Date = DateTime.Now, IsRead = false };
            var testNotification2 = new Notification { UserId = 2, Type = "TestNotification2", Message = "TestNotification2Message", Date = DateTime.Now, IsRead = false };

            context.Notifications.Add(testNotification1);
            context.Notifications.Add(testNotification2);
            context.SaveChanges();
        }

        // TEST TO VERIFY THAT "GETALLNOTIFICATIONS" METHOD SHOULD RETURN ALL NOTIFICATIONS
        [Fact]
        public async Task GetAllNotifications_ShouldReturnAllNotifications()
        {
            var notifications = await _notificationService.GetAllNotifications();
            Assert.Equal(2, notifications.Count());
        }

        [Fact]
        // TEST TO VERIFY THAT "GETNOTIFICATIONBYID" METHOD SHOULD RETURN SPECIFIC NOTIFICATION
        public async Task GetNotificationById_ShouldReturnNotification()
        {
            var notification = await _notificationService.GetNotificationById(1);
            Assert.Equal("TestNotification1", notification.Type);
        }

        //TODO: ADD A TEST FOR CREATENOTIFICATION TO VERIFY THAT A NEW NOTIFICATION IS CORRECTLY ADDED TO DATABASE
        //TODO: ADD A TEST FOR UPDATENOTIFICATION TO VERIFY THAT DETAILS OF AN EXISTING NOTIFICATION ARE CORRECTLY UPDATED
        //TODO: ADD A TEST FOR UPDATENOTIFICATION TO VERIFY THAT AN EXCEPTION IS THROWN IF NOTIFICATION TO UPDATE DOES NOT EXIST
        //TODO: ADD A TEST FOR DELETENOTIFICATION TO CONFIRM THAT A NOTIFICATION IS CORRECTLY DELETED FROM DATABASE
        //TODO: ADD A TEST FOR DELETENOTIFICATION TO ENSURE THAT AN EXCEPTION IS THROWN IF NOTIFICATION TO DELETE DOES NOT EXIST
        //TODO: ADD A TEST TO ENSURE THAT GETALLNOTIFICATIONS RETURNS AN EMPTY LIST WHEN NO NOTIFICATIONS EXIST
        //TODO: ADD A TEST FOR GETNOTIFICATIONBYID TO CHECK BEHAVIOR WHEN REQUESTED NOTIFICATION DOES NOT EXIST (RETURNS KEYNOTFOUNDEXCEPTION)

    }
}
