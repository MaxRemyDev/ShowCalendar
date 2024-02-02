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
                    return;  // DATA ALREADY SEEDED
                }

                // ADD USERS
                var user1 = new User { Username = "user1", Email = "user1@example.com", PasswordHash = Encoding.UTF8.GetBytes("user1"), PasswordSalt = Encoding.UTF8.GetBytes("user1") };
                var user2 = new User { Username = "user2", Email = "user2@example.com", PasswordHash = Encoding.UTF8.GetBytes("user2"), PasswordSalt = Encoding.UTF8.GetBytes("user2") };

                context.Users.AddRange(user1, user2);
                context.SaveChanges(); // SAVE USERS TO GENERATE IDS

                // ADD CALENDARS
                var calendar1 = new Calendar { Name = "Work schedule", UserId = user1.UserId };
                var calendar2 = new Calendar { Name = "Personal calendar", UserId = user1.UserId };

                context.Calendars.AddRange(calendar1, calendar2);
                context.SaveChanges(); // SAVE CALENDARS TO GENERATE IDS

                // ADD APPOINTMENTS
                var appointment1 = new Appointment { Title = "Business meeting", CalendarId = calendar1.CalendarId };
                var appointment2 = new Appointment { Title = "Medical appointment", CalendarId = calendar2.CalendarId };

                context.Appointments.AddRange(appointment1, appointment2);

                // ADD NOTIFICATIONS
                var notification1 = new Notification { Type = "Appointment", Message = "Business meeting", UserId = user1.UserId, IsRead = false };
                var notification2 = new Notification { Type = "Appointment", Message = "Medical appointment", UserId = user2.UserId, IsRead = true };

                context.Notifications.AddRange(notification1, notification2);
                context.SaveChanges(); // SAVE APPOINTMENTS AND NOTIFICATIONS TO GENERATE IDS
            }
        }
    }
}
