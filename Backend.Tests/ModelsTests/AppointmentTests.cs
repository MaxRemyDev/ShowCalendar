using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Backend.Models;
using Xunit;

namespace Backend.Tests.ModelsTests
{
    // UNIT TESTS - APPOINTMENT MODEL
    public class AppointmentTests
    {
        // TEST TO ENSURE THAT APPOINTMENT VALIDATION PASSES WHEN ALL REQUIRED FIELDS ARE PROVIDED WITH VALID VALUES
        [Fact]
        public void Appointment_Validation_Success_When_All_Fields_Are_Valid()
        {
            // ARRANGE - PREPARE APPOINTMENT OBJECT WITH VALID DATA FOR TESTING
            var appointment = new Appointment
            {
                CalendarId = 1,
                Title = "Test appointment",
                Start = DateTime.UtcNow,
                End = DateTime.UtcNow.AddHours(1),
                Location = "Test location",
                Details = "Test details",
                IsAllDay = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(appointment, new ValidationContext(appointment), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
        }

        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "TITLE" FIELD IS MISSING
        [Fact]
        public void Appointment_Validation_Fails_When_Title_Is_Missing()
        {
            // ARRANGE - PREPARE APPOINTMENT OBJECT WITH VALID DATA FOR TESTING
            var appointment = new Appointment
            {
                CalendarId = 1,
                // Title is missing
                Start = DateTime.UtcNow,
                End = DateTime.UtcNow.AddHours(1),
                Location = "Test location",
                Details = "Test details",
                IsAllDay = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(appointment, new ValidationContext(appointment), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(Appointment.Title)));
        }

        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "START" FIELD IS MISSING
        [Fact]
        public void Appointment_Validation_Fails_When_Start_Is_Missing()
        {
            // ARRANGE - PREPARE APPOINTMENT OBJECT WITH VALID DATA FOR TESTING
            var appointment = new Appointment
            {
                CalendarId = 1,
                Title = "Test appointment",
                // Start is missing
                End = DateTime.UtcNow.AddHours(1),
                Location = "Test location",
                Details = "Test details",
                IsAllDay = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(appointment, new ValidationContext(appointment), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(Appointment.Start)));
        }

        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "END" FIELD IS MISSING
        [Fact]
        public void Appointment_Validation_Fails_When_End_Is_Missing()
        {
            // ARRANGE - PREPARE APPOINTMENT OBJECT WITH VALID DATA FOR TESTING
            var appointment = new Appointment
            {
                CalendarId = 1,
                Title = "Test appointment",
                Start = DateTime.UtcNow,
                // End is missing
                Location = "Test location",
                Details = "Test details",
                IsAllDay = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(appointment, new ValidationContext(appointment), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(Appointment.End)));
        }

        //TODO: Add a test to verify that validation fails when CalendarId is missing.
        //TODO: Add a test to check behavior of Location and Details when provided.
        //TODO: Add a test to check behavior of IsAllDay, particularly on Start and End validations.
        //TODO: Add a test to verify that validation fails when Start is later than End.
        //TODO: Add a test to check automatic updating of UpdatedAt when changes are made.

    }
}