using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Text;

namespace Backend.Data
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (context.Users.Any())
                {
                    return; // DATA ALREADY SEEDED
                }

                // CREATE AND ADD NEW USERS TO DATABASE
                var user1 = new User
                {
                    Username = "user1",
                    Email = "user1@example.com",
                    PasswordHash = Encoding.UTF8.GetBytes("user1"),
                    PasswordSalt = Encoding.UTF8.GetBytes("user1"),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    LastLogin = DateTime.UtcNow,
                };
                var user2 = new User
                {
                    Username = "user2",
                    Email = "user2@example.com",
                    PasswordHash = Encoding.UTF8.GetBytes("user2"),
                    PasswordSalt = Encoding.UTF8.GetBytes("user2"),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    LastLogin = DateTime.UtcNow,
                };
                context.Users.AddRange(user1, user2);
                context.SaveChanges(); // SAVE USERS TO GENERATE IDS

                // CREATE AND ADD NEW CALENDARS TO DATABASE
                var calendar1 = new Calendar
                {
                    Name = "Work schedule",
                    Description = "My work calendar",
                    Color = "#FFFFFF",
                    UserId = user1.UserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                var calendar2 = new Calendar
                {
                    Name = "Personal calendar",
                    Description = "My Personal calendar",
                    Color = "#000000",
                    UserId = user1.UserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                context.Calendars.AddRange(calendar1, calendar2);
                context.SaveChanges(); // SAVE CALENDARS TO GENERATE IDS

                // CREATE AND ADD NEW APPOINTMENTS TO DATABASE
                var appointment1 = new Appointment
                {
                    Title = "Business meeting",
                    CalendarId = calendar1.CalendarId,
                    Location = "Office",
                    Details = "Discuss new project",
                    Start = DateTime.UtcNow.AddDays(1),
                    End = DateTime.UtcNow.AddDays(1).AddHours(1),
                    IsAllDay = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                var appointment2 = new Appointment
                {
                    Title = "Medical appointment",
                    CalendarId = calendar2.CalendarId,
                    Location = "Hospital",
                    Details = "Checkup",
                    Start = DateTime.UtcNow.AddDays(2),
                    End = DateTime.UtcNow.AddDays(2).AddHours(1),
                    IsAllDay = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                context.Appointments.AddRange(appointment1, appointment2);
                context.SaveChanges(); // SAVE APPOINTMENTS TO GENERATE IDS

                // CREATE AND ADD NEW NOTIFICATIONS TO DATABASE
                var notification1 = new Notification
                {
                    Type = "Appointment",
                    Message = "Business meeting",
                    UserId = user1.UserId,
                    Date = DateTime.UtcNow,
                    IsRead = false
                };
                var notification2 = new Notification
                {
                    Type = "Appointment",
                    Message = "Medical appointment",
                    UserId = user2.UserId,
                    Date = DateTime.UtcNow,
                    IsRead = true
                };
                context.Notifications.AddRange(notification1, notification2);
                context.SaveChanges(); // SAVE NOTIFICATIONS TO GENERATE IDS
            }
        }
    }
}
