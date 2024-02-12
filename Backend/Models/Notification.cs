using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    // NOTIFICATION MODEL DEFINITION
    public class Notification
    {
        // NOTIFICATION IDENTIFIER
        public int NotificationId { get; set; }

        // USER IDENTIFIER ASSOCIATED WITH NOTIFICATION
        public int UserId { get; set; }

        // NOTIFICATION TYPE FIELD
        [Column(TypeName = "varchar(255)")]
        [Required(ErrorMessage = "The notification type is required.")]
        public string? Type { get; set; }

        // NOTIFICATION MESSAGE FIELD
        [Column(TypeName = "varchar(255)")]
        [Required(ErrorMessage = "The notification message is required.")]
        public string? Message { get; set; }

        // TIMESTAMP FOR WHEN NOTIFICATION WAS GENERATED
        public DateTime Date { get; set; }

        // INDICATOR IF NOTIFICATION HAS BEEN READ
        public bool IsRead { get; set; }

        // RELATIONSHIP WITH USER

        public User? User { get; set; }
    }
}
