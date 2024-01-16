using Microsoft.EntityFrameworkCore;
using Backend.Models;

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
        }
    }
}
