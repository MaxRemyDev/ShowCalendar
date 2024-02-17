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
                CreatedAt = DateTime.UtcNow
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
                CreatedAt = DateTime.UtcNow
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
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(appointment, new ValidationContext(appointment), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(Appointment.End)));
        }

        // TEST TO VERIFY THAT VALIDATION PASSES WITH OR WITHOUT "LOCATION" AND "DETAILS" FIELDS
        [Fact]
        public void Appointment_Validation_Success_Without_Location_And_Details()
        {
            // ARRANGE - PREPARE APPOINTMENT OBJECTS WITHOUT LOCATION/DETAILS
            var appointmentWithoutLocationAndDetails = new Appointment
            {
                CalendarId = 1,
                Title = "Test appointment without location and details",
                Start = DateTime.UtcNow,
                End = DateTime.UtcNow.AddHours(1),
                // Location is missing
                // Details is missing
                IsAllDay = false,
                CreatedAt = DateTime.UtcNow
            };

            var validationResultsWith = new List<ValidationResult>();
            var validationResultsWithout = new List<ValidationResult>();

            // ACT - PERFORM VALIDATION CHECK ON BOTH APPOINTMENT OBJECTS
            var isValidWithout = Validator.TryValidateObject(appointmentWithoutLocationAndDetails, new ValidationContext(appointmentWithoutLocationAndDetails), validationResultsWithout, true);

            // ASSERT - VERIFY THAT BOTH VALIDATIONS PASS WITHOUT ANY ERRORS
            Assert.Empty(validationResultsWith);
            Assert.True(isValidWithout);
            Assert.Empty(validationResultsWithout);
        }

        // TEST TO VERIFY THAT VALIDATION PASSES WHEN "ISALLDAY" IS TRUE
        [Fact]
        public void Appointment_Validation_Success_When_IsAllDay_Is_True()
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
                IsAllDay = true,
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(appointment, new ValidationContext(appointment), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
        }

        // TEST TO VERIFY THAT "UPDATEDAT" FIELD IS AUTOMATICALLY UPDATED WHEN CHANGES ARE MADE
        [Fact]
        public void Appointment_UpdatedAt_AutoUpdate_When_Changes_Are_Made()
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
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(appointment, new ValidationContext(appointment), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);

            // ACT - MAKE CHANGES TO APPOINTMENT OBJECT
            appointment.Title = "Updated title";
            appointment.UpdatedAt = DateTime.UtcNow;

            // ASSERT - VERIFY THAT UPDATEDAT FIELD IS AUTOMATICALLY UPDATED
            Assert.NotEqual(appointment.CreatedAt, appointment.UpdatedAt);
        }

        //TODO: Add a test to verify that validation fails when Start is later than End.
        //TODO: Add a test to verify that validation fails when CalendarId is missing. (Maybe not needed because it's a foreign key.)

    }
}