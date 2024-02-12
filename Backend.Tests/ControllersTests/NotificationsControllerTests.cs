using AutoMapper;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Backend.Tests.ControllersTests
{
    // UNIT TESTS - NOTIFICATION CONTROLLER
    public class NotificationsControllerTests
    {
        // DECLARES PRIVATE READ-ONLY FIELDS FOR "NOTIFICATIONSCONTROLLER", MOCK OF INOTIFICATIONSERVICE, AND MOCK OF "IMAPPER"
        private readonly NotificationsController _controller;
        private readonly Mock<INotificationService> _mockNotificationService;
        private readonly Mock<IMapper> _mockMapper;

        // CONSTRUCTOR FOR "NotificationsControllerTests" INITIALIZES MOCKS FOR "INOTIFICATIONSERVICE" AND "IMAPPER", AND CREATES AN INSTANCE OF "NOTIFICATIONSCONTROLLER" WITH THESE MOCKS
        public NotificationsControllerTests()
        {
            _mockNotificationService = new Mock<INotificationService>();
            _mockMapper = new Mock<IMapper>();
            _controller = new NotificationsController(_mockNotificationService.Object, _mockMapper.Object);
        }

        // TEST TO VERIFY THAT "GETALLNOTIFICATIONS" METHOD RETURNS "OKOBJECTRESULT" WITH LIST OF "NOTIFICATIONDTO"
        [Fact]
        public async Task GetAllNotifications_ReturnsOkObjectResult_WithListOfNotificationDtos()
        {
            // ARRANGE - SETUP MOCK "INOTIFICATIONSERVICE" TO RETURN A LIST OF NOTIFICATIONS AND "IMAPPER" TO CONVERT TO "NOTIFICATIONDTO"s
            var notifications = new List<Notification>
            {
                new Notification { NotificationId = 1, UserId = 1, Type = "Type1", Message = "Message1", Date = System.DateTime.Now, IsRead = false },
                new Notification { NotificationId = 2, UserId = 1, Type = "Type2", Message = "Message2", Date = System.DateTime.Now, IsRead = true }
            };
            var notificationDtos = new List<NotificationDto>
            {
                new NotificationDto { NotificationId = 1, Type = "Type1", Message = "Message1", Date = System.DateTime.Now, IsRead = false },
                new NotificationDto { NotificationId = 2, Type = "Type2", Message = "Message2", Date = System.DateTime.Now, IsRead = true }
            };
            _mockNotificationService.Setup(service => service.GetAllNotifications()).ReturnsAsync(notifications);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<NotificationDto>>(notifications)).Returns(notificationDtos);

            // ACT - CALL "GETALLNOTIFICATIONS" METHOD
            var result = await _controller.GetAllNotifications();

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OKOBJECTRESULT" WITH ALL "NOTIFICATIONDTO"
            var actionResult = Assert.IsType<OkObjectResult>(result);
            var returnedNotifications = Assert.IsAssignableFrom<IEnumerable<NotificationDto>>(actionResult.Value);
            Assert.Equal(2, ((List<NotificationDto>)returnedNotifications).Count);
        }

        // TEST TO VERIFY THAT "GETNOTIFICATIONBYID" RETURNS "OKOBJECTRESULT" WHEN NOTIFICATION EXISTS
        [Fact]
        public async Task GetNotificationById_WhenNotificationExists_ReturnsOkObjectResult()
        {
            // ARRANGE - SETUP MOCK "INOTIFICATIONSERVICE" TO RETURN A SPECIFIC NOTIFICATION AND "IMAPPER" TO CONVERT TO "NOTIFICATIONDTO"
            var notification = new Notification { NotificationId = 1, UserId = 1, Type = "Reminder", Message = "Test Message", Date = DateTime.Now, IsRead = false };
            _mockNotificationService.Setup(service => service.GetNotificationById(1)).ReturnsAsync(notification);
            _mockMapper.Setup(mapper => mapper.Map<NotificationDto>(notification)).Returns(new NotificationDto { NotificationId = 1, Type = "Reminder", Message = "Test Message", Date = DateTime.Now, IsRead = false });

            // ACT - CALL "GETNOTIFICATIONBYID" METHOD WITH A VALID NOTIFICATION ID
            var result = await _controller.GetNotificationById(1);

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OKOBJECTRESULT" WITH EXPECTED "NOTIFICATIONDTO"
            var actionResult = Assert.IsType<OkObjectResult>(result);
            var returnedNotification = Assert.IsType<NotificationDto>(actionResult.Value);
            Assert.Equal("Reminder", returnedNotification.Type);
        }

        // TEST TO VERIFY THAT "CREATENOTIFICATION" RETURNS "CREATEDATACTION" WITH "NOTIFICATIONDTO"
        [Fact]
        public async Task CreateNotification_ReturnsCreatedAtAction_WithNotificationDto()
        {
            // ARRANGE - SETUP MOCK "IMAPPER" AND "INOTIFICATIONSERVICE" FOR NOTIFICATION CREATION
            var notificationDto = new NotificationDto { UserId = 1, Type = "Reminder", Message = "New Notification", Date = DateTime.Now, IsRead = false };
            var notification = new Notification { NotificationId = 1, UserId = 1, Type = "Reminder", Message = "New Notification", Date = DateTime.Now, IsRead = false };

            _mockMapper.Setup(m => m.Map<Notification>(notificationDto)).Returns(notification);
            _mockNotificationService.Setup(s => s.CreateNotification(It.IsAny<Notification>())).ReturnsAsync(notification);
            _mockMapper.Setup(m => m.Map<NotificationDto>(notification)).Returns(notificationDto);

            // ACT - CALL "CREATENOTIFICATION" METHOD TO CREATE A NEW NOTIFICATION
            var result = await _controller.CreateNotification(notificationDto);

            // ASSERT - VERIFY THAT METHOD RETURNS A "CREATEDATACTIONRESULT" POINTING TO "GETNOTIFICATIONBYID"
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnedDto = Assert.IsType<NotificationDto>(actionResult.Value);
            Assert.Equal("New Notification", returnedDto.Message);
        }

        // TEST TO VERIFY THAT "UPDATENOTIFICATION" RETURNS "OKOBJECTRESULT" WHEN NOTIFICATION EXISTS
        [Fact]
        public async Task UpdateNotification_WhenNotificationExists_ReturnsOkObjectResult()
        {
            // ARRANGE - SETUP MOCK "INotificationService" FOR NOTIFICATION UPDATE
            var notificationUpdateDto = new NotificationUpdateDto { Type = "Updated", Message = "Updated Message", Date = DateTime.Now, IsRead = true };
            var updatedNotification = new Notification { NotificationId = 1, UserId = 1, Type = "Updated", Message = "Updated Message", Date = DateTime.Now, IsRead = true };

            _mockNotificationService.Setup(s => s.GetNotificationById(1)).ReturnsAsync(new Notification());
            _mockNotificationService.Setup(s => s.UpdateNotification(1, It.IsAny<Notification>())).ReturnsAsync(updatedNotification);
            _mockMapper.Setup(m => m.Map<NotificationUpdateDto>(updatedNotification)).Returns(notificationUpdateDto);

            // ACT - CALL "UPDATENOTIFICATION" METHOD WITH A VALID NOTIFICATION ID AND UPDATE DATA
            var result = await _controller.UpdateNotification(1, notificationUpdateDto);

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OKOBJECTRESULT" WITH UPDATED "NOTIFICATIONUPDATEDTO"
            var actionResult = Assert.IsType<OkObjectResult>(result);
            var returnedDto = Assert.IsType<NotificationUpdateDto>(actionResult.Value);
            Assert.Equal("Updated Message", returnedDto.Message);
        }

        // TEST TO VERIFY THAT "DELETENOTIFICATION" RETURNS "NOCONTENTRESULT" WHEN NOTIFICATION EXISTS
        [Fact]
        public async Task DeleteNotification_WhenNotificationExists_ReturnsNoContentResult()
        {
            // ARRANGE - SETUP MOCK "INOTIFICATIONSERVICE" TO SIMULATE NOTIFICATION DELETION
            _mockNotificationService.Setup(s => s.DeleteNotification(1)).ReturnsAsync(true);

            // ACT - CALL "DeleteNotification" METHOD WITH A VALID NOTIFICATION ID
            var result = await _controller.DeleteNotification(1);

            // ASSERT - VERIFY THAT METHOD RETURNS A "NOCONTENTRESULT"
            Assert.IsType<NoContentResult>(result);
        }

        //TODO: ADD A TEST TO CHECK BADREQUEST RESPONSE WHEN CREATING A NOTIFICATION FAILS
        //TODO: ADD A TEST TO CHECK NOTFOUND RESPONSE WHEN UPDATENOTIFICATION IS CALLED WITH A NON-EXISTENT ID
        //TODO: ADD A TEST TO CHECK BADREQUEST RESPONSE WHEN UPDATING A NOTIFICATION FAILS
        //TODO: ADD A TEST TO CHECK NOTFOUND RESPONSE WHEN TRYING TO DELETE A NON-EXISTING NOTIFICATION
        //TODO: ADD A TEST TO CHECK BEHAVIOR OF GETALLNOTIFICATIONS WHEN NO NOTIFICATIONS EXIST
        //TODO: ADD A TEST TO CHECK BEHAVIOR OF GETNOTIFICATIONBYID FOR A NOTIFICATION NOT FOUND (RETURNS NOTFOUND)

    }
}
