using Microsoft.EntityFrameworkCore;
using Backend.Models;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        // CONSTRUCTOR WITH OPTIONS
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DBSETS FOR MODELS
        public DbSet<User> Users { get; set; }
        public DbSet<Calendar> Calendars { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var userDetailsValueComparer = new ValueComparer<List<UserDetails>>(
                (c1, c2) => JsonSerializer.Serialize(c1, (JsonSerializerOptions?)null) == JsonSerializer.Serialize(c2, (JsonSerializerOptions?)null),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => JsonSerializer.Deserialize<List<UserDetails>>(JsonSerializer.Serialize(c, (JsonSerializerOptions?)null), (JsonSerializerOptions?)null) ?? new List<UserDetails>());

            var userStatusValueComparer = new ValueComparer<List<UserStatus>>(
                (c1, c2) => JsonSerializer.Serialize(c1, (JsonSerializerOptions?)null) == JsonSerializer.Serialize(c2, (JsonSerializerOptions?)null),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => JsonSerializer.Deserialize<List<UserStatus>>(JsonSerializer.Serialize(c, (JsonSerializerOptions?)null), (JsonSerializerOptions?)null) ?? new List<UserStatus>());

            // RELATION USER - CALENDAR (ONE-TO-MANY)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Calendars)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId);

            // RELATION CALENDAR - APPOINTMENT (ONE-TO-MANY)
            modelBuilder.Entity<Calendar>()
                .HasMany(c => c.Appointments)
                .WithOne(a => a.Calendar)
                .HasForeignKey(a => a.CalendarId);

            // RELATION USER - NOTIFICATION (ONE-TO-MANY)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Notifications)
                .WithOne(n => n.User)
                .HasForeignKey(n => n.UserId);

            // RELATION USER - DETAILS (ONE-TO-MANY)
            modelBuilder.Entity<User>()
                .Property(u => u.Details)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<UserDetails>>(v, (JsonSerializerOptions?)null) ?? new List<UserDetails>())
                .Metadata.SetValueComparer(userDetailsValueComparer);

            // RELATION USER - STATUS (ONE-TO-MANY)
            modelBuilder.Entity<User>()
                .Property(u => u.Status)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<UserStatus>>(v, (JsonSerializerOptions?)null) ?? new List<UserStatus>())
                .Metadata.SetValueComparer(userStatusValueComparer);
        }
    }
}
