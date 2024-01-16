using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    // USER MODEL DEFINITION
    public class User
    {
        // USER IDENTIFIER
        public int UserId { get; set; }

        // USERNAME FIELD
        [Column(TypeName = "varchar(255)")]
        public string? Username { get; set; }

        // EMAIL FIELD
        [Column(TypeName = "varchar(255)")]
        public string? Email { get; set; }

        // PASSWORD HASH FIELD
        [Column(TypeName = "varchar(255)")]
        public string? PasswordHash { get; set; }

        // ACCOUNT CREATION TIMESTAMP
        public DateTime CreatedAt { get; set; }

        // LAST ACCOUNT UPDATE TIMESTAMP
        public DateTime? UpdatedAt { get; set; }

        // LAST LOGIN TIMESTAMP
        public DateTime? LastLogin { get; set; }

        // COLLECTION OF USER NOTIFICATIONS
        public ICollection<Notification>? Notifications { get; set; }

        // COLLECTION OF USER CALENDARS
        public ICollection<Calendar>? Calendars { get; set; }
    }
}
