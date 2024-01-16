using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    // APPOINTMENT MODEL DEFINITION
    public class Appointment
    {
        // APPOINTMENT IDENTIFIER
        public int AppointmentId { get; set; }

        // CALENDAR IDENTIFIER ASSOCIATED WITH APPOINTMENT
        public int CalendarId { get; set; }

        // APPOINTMENT TITLE FIELD
        [Column(TypeName = "varchar(255)")]
        public string? Title { get; set; }

        // START TIME OF APPOINTMENT
        public DateTime Start { get; set; }

        // END TIME OF APPOINTMENT
        public DateTime End { get; set; }

        // APPOINTMENT LOCATION FIELD
        [Column(TypeName = "varchar(255)")]
        public string? Location { get; set; }

        // APPOINTMENT DETAILS FIELD
        [Column(TypeName = "varchar(255)")]
        public string? Details { get; set; }

        // INDICATOR FOR ALL-DAY APPOINTMENT
        public bool IsAllDay { get; set; }

        // APPOINTMENT CREATION TIMESTAMP
        public DateTime CreatedAt { get; set; }

        // APPOINTMENT LAST UPDATE TIMESTAMP
        public DateTime UpdatedAt { get; set; }

        // REFERENCE TO ASSOCIATED CALENDAR
        public Calendar? Calendar { get; set; }
    }
}
