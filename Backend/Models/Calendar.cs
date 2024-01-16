using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    // CALENDAR MODEL DEFINITION
    public class Calendar
    {
        // CALENDAR IDENTIFIER
        public int CalendarId { get; set; }

        // USER IDENTIFIER ASSOCIATED WITH CALENDAR
        public int UserId { get; set; }

        // CALENDAR NAME FIELD
        [Column(TypeName = "varchar(255)")]
        public string? Name { get; set; }

        // CALENDAR DESCRIPTION FIELD
        [Column(TypeName = "varchar(255)")]
        public string? Description { get; set; }

        // CALENDAR COLOR FIELD
        [Column(TypeName = "varchar(7)")]
        public string? Color { get; set; }

        // CALENDAR CREATION TIMESTAMP
        public DateTime CreatedAt { get; set; }

        // CALENDAR LAST UPDATE TIMESTAMP
        public DateTime UpdatedAt { get; set; }

        // REFERENCE TO ASSOCIATED USER
        public User? User { get; set; }

        // COLLECTION OF APPOINTMENTS IN CALENDAR
        public ICollection<Appointment>? Appointments { get; set; }
    }
}
