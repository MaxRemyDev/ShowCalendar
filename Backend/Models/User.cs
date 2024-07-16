using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

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

        // PASSWORD SALT FIELD
        [Required(ErrorMessage = "PasswordSalt is required.")]
        public byte[] PasswordSalt { get; set; } = new byte[0];

        public bool IsRememberMe { get; set; } = false;

        // REFRESH TOKEN FIELD
        public string? RefreshToken { get; set; }

        // REFRESH TOKEN EXPIRY TIME FIELD
        public DateTime? RefreshTokenExpiryTime { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // LAST ACCOUNT UPDATE TIMESTAMP
        public DateTime? UpdatedAt { get; set; }

        // LAST LOGIN TIMESTAMP
        public DateTime? LastLogin { get; set; }

        // LAST LOGOUT TIMESTAMP
        public DateTime? LastLogout { get; set; }

        // USER DETAILS FIELD
        [Column(TypeName = "json")]
        public List<UserDetails> Details { get; set; } = new List<UserDetails>();

        // USER STATUS FIELD
        [Column(TypeName = "json")]
        public List<UserStatus> Status { get; set; } = new List<UserStatus>();

        // USER STATUS FIELD
        [Column(TypeName = "json")]
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

        // USER STATUS FIELD
        [Column(TypeName = "json")]
        public ICollection<Calendar> Calendars { get; set; } = new List<Calendar>();
    }

    // USER DETAILS MODEL DEFINITION
    public class UserDetails
    {
        // USER FULL NAME FIELD
        public string FullName { get; set; } = string.Empty;

        // USER AVATAR FIELD
        public string Avatar { get; set; } = string.Empty;

        // USER DATE OF BIRTH FIELD
        public DateOnly? DateOfBirth { get; set; }

        // USER LANGUAGE FIELD
        public string Language { get; set; } = string.Empty;

        // USER FONT FIELD
        public string Font { get; set; } = string.Empty;

        // USER BIO FIELD
        public string Bio { get; set; } = string.Empty;

        // USER WEBSITES FIELD
        public List<string> Websites { get; set; } = new List<string>();

        // USER LOCATION FIELD
        public string Location { get; set; } = string.Empty;

        // USER THEME FIELD
        public string Theme { get; set; } = string.Empty;
    }

    // USER STATUS MODEL DEFINITION
    public class UserStatus
    {
        // USER ONLINE STATUS FIELD
        public bool IsOnline { get; set; } = false;

        // USER EMAIL VERIFIED FIELD
        public bool IsEmailVerified { get; set; } = false;

        // USER PREMIUM STATUS FIELD
        public bool IsPremium { get; set; } = false;

        // USER ENTERPRISE STATUS FIELD
        public bool IsEnterprise { get; set; } = false;

        // USER BANNED STATUS FIELD
        public bool IsBanned { get; set; } = false;

        // USER ADMIN STATUS FIELD
        public bool IsAdmin { get; set; } = false;
    }
}
