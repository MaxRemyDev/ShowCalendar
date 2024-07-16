using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Security.Cryptography;
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

                // HELPER METHOD TO CREATE HASHED PASSWORD AND SALT
                (byte[] hash, byte[] salt) CreatePasswordHash(string password)
                {
                    using var hmac = new HMACSHA512();
                    var salt = hmac.Key;
                    var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                    return (hash, salt);
                }

                // CREATE AND ADD NEW USERS TO DATABASE
                var (hash1, salt1) = CreatePasswordHash("user1password");
                var user1 = new User
                {
                    Username = "user1",
                    Email = "user1@example.com",
                    PasswordHash = hash1,
                    PasswordSalt = salt1,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    LastLogin = DateTime.UtcNow,
                    Details = new List<UserDetails>
                    {
                        new UserDetails
                        {
                            FullName = "User One",
                            Avatar = "https://example.com/avatar1.png",
                            DateOfBirth = new DateOnly(1990, 1, 1),
                            Language = "English",
                            Font = "Arial",
                            Bio = "This is user one.",
                            Websites = new List<string> { "https://userone.com", "https://userone.com/blog" },
                            Location = "New York",
                            Theme = "light"
                        }
                    },
                    Status = new List<UserStatus>
                    {
                        new UserStatus
                        {
                            IsOnline = true,
                            IsEmailVerified = true,
                            IsPremium = false,
                            IsEnterprise = false,
                            IsBanned = false,
                            IsAdmin = false
                        }
                    }
                };

                var (hash2, salt2) = CreatePasswordHash("user2password");
                var user2 = new User
                {
                    Username = "user2",
                    Email = "user2@example.com",
                    PasswordHash = hash2,
                    PasswordSalt = salt2,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    LastLogin = DateTime.UtcNow,
                    Details = new List<UserDetails>
                    {
                        new UserDetails
                        {
                            FullName = "User Two",
                            Avatar = "https://example.com/avatar2.png",
                            DateOfBirth = new DateOnly(1992, 2, 2),
                            Language = "French",
                            Font = "Helvetica",
                            Bio = "This is user two.",
                            Websites = new List<string> { "https://usertwo.com", "https://usertwo.com/blog" },
                            Location = "Paris",
                            Theme = "dark"
                        }
                    },
                    Status = new List<UserStatus>
                    {
                        new UserStatus
                        {
                            IsOnline = false,
                            IsEmailVerified = false,
                            IsPremium = true,
                            IsEnterprise = false,
                            IsBanned = false,
                            IsAdmin = false
                        }
                    }
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
