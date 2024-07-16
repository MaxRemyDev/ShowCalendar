using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{

    public class UserDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsRememberMe { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime? LastLogout { get; set; }
        public List<UserDetailsDto> Details { get; set; } = new List<UserDetailsDto>();
        public List<UserStatusDto> Status { get; set; } = new List<UserStatusDto>();
    }

    public class UserDetailsDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public DateOnly? DateOfBirth { get; set; }
        public string Language { get; set; } = string.Empty;
        public string Font { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public List<string> Websites { get; set; } = new List<string>();
        public string Location { get; set; } = string.Empty;
        public string Theme { get; set; } = string.Empty;
    }

    public class UserStatusDto
    {
        public bool IsOnline { get; set; } = false;
        public bool IsEmailVerified { get; set; } = false;
        public bool IsPremium { get; set; } = false;
        public bool IsEnterprise { get; set; } = false;
        public bool IsBanned { get; set; } = false;
        public bool IsAdmin { get; set; } = false;
    }

    public class UserUpdateDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsRememberMe { get; set; } = false;
        public List<UserDetailsDto> Details { get; set; } = new List<UserDetailsDto>();
        public List<UserStatusDto> Status { get; set; } = new List<UserStatusDto>();
    }

    public class UserRegistrationDto
    {
        public int UserId { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(1000, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }

    public class UserLoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UserLogoutDto
    {
        public int UserId { get; set; }
    }
}
