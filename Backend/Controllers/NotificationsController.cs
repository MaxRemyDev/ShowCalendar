using Microsoft.AspNetCore.Mvc;
using Backend.Interfaces;
using Backend.Services;
using Backend.Dtos;
using Backend.Models;
using AutoMapper;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Backend.Controllers
{
    // CONTROLLER FOR MANAGING NOTIFICATIONS (GET, POST, PUT, DELETE)
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        // DEPENDENCY INJECTION FOR NOTIFICATION SERVICE AND AUTOMAPPER
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;

        // CONSTRUCTOR INITIALIZING DEPENDENCIES
        public NotificationsController(INotificationService notificationService, IMapper mapper)
        {
            _notificationService = notificationService;
            _mapper = mapper;
        }

        // GET ALL NOTIFICATIONS (GET)
        [HttpGet]
        public async Task<IActionResult> GetAllNotifications()
        {
            var notifications = await _notificationService.GetAllNotifications();
            var notificationDtos = _mapper.Map<IEnumerable<NotificationDto>>(notifications);
            return Ok(notificationDtos);
        }

        // GET NOTIFICATION BY ID (GET)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotificationById(int id)
        {
            var notification = await _notificationService.GetNotificationById(id);
            if (notification == null) return NotFound();

            var notificationDto = _mapper.Map<NotificationDto>(notification);
            return Ok(notificationDto);
        }

        // CREATE A NEW NOTIFICATION (POST)
        [HttpPost]
        public async Task<IActionResult> CreateNotification(NotificationDto notificationDto)
        {
            var notification = _mapper.Map<Notification>(notificationDto);
            var newNotification = await _notificationService.CreateNotification(notification);
            if (newNotification == null) return BadRequest("Notification creation failed");

            var newNotificationDto = _mapper.Map<NotificationDto>(newNotification);
            return CreatedAtAction(nameof(GetNotificationById), new { id = newNotificationDto.NotificationId }, newNotificationDto);
        }

        // UPDATE AN EXISTING NOTIFICATION BY ID (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNotification(int id, NotificationDto notificationDto)
        {
            var notificationToUpdate = await _notificationService.GetNotificationById(id);
            if (notificationToUpdate == null) return NotFound();

            _mapper.Map(notificationDto, notificationToUpdate);
            var updatedNotification = await _notificationService.UpdateNotification(id, notificationToUpdate);
            if (updatedNotification == null) return BadRequest("Notification update failed");

            var updatedNotificationDto = _mapper.Map<NotificationDto>(updatedNotification);
            return Ok(updatedNotificationDto);
        }

        // DELETE A NOTIFICATION BY ID (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            bool deleted = await _notificationService.DeleteNotification(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
