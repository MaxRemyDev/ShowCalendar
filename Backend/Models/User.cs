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
        [Required(ErrorMessage = "Username is required.")]
        public string Username { get; set; } = string.Empty;

        // EMAIL FIELD
        [Column(TypeName = "varchar(255)")]
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "The email format is invalid.")]
        public string? Email { get; set; }

        // PASSWORD HASH FIELD
        [Required(ErrorMessage = "PasswordHash is required.")]
        public byte[] PasswordHash { get; set; } = new byte[0];

        // PASSWORD SALT FIED
        [Required(ErrorMessage = "PasswordSalt is required.")]
        public byte[] PasswordSalt { get; set; } = new byte[0];

        // ACCOUNT CREATION TIMESTAMP
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // LAST ACCOUNT UPDATE TIMESTAMP
        public DateTime? UpdatedAt { get; set; }

        // LAST LOGIN TIMESTAMP
        public DateTime? LastLogin { get; set; }

        // REFRESH TOKEN
        public string? RefreshToken { get; set; }

        // REFRESH TOKEN EXPIRY TIMESTAMP
        public DateTime? RefreshTokenExpiryTime { get; set; }

        // INFO: Why removed "?" from end of (ICollection<Notification>?) and (ICollection<Calendar>?) for nullable type collection
        // INFO: Because we are using default empty collection for Notifications and Calendars, so no need to use nullable type collection NORMALLY !
        // COLLECTION OF USER NOTIFICATIONS
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>(); //! OLD VERSION : with "?" at end of (ICollection<Notification>?) for nullable type collection
        // COLLECTION OF USER CALENDARS
        public ICollection<Calendar> Calendars { get; set; } = new List<Calendar>(); //! OLD VERSION : with "?" at end of (ICollection<Calendar>?) for nullable type collection
    }
}
