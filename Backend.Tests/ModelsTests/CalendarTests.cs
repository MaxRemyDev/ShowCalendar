using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Backend.Models;
using Xunit;

namespace Backend.Tests.ModelsTests
{
    // UNIT TESTS - CALENDAR MODEL
    public class CalendarTests
    {
        // TEST TO ENSURE THAT CALENDAR VALIDATION PASSES WHEN ALL REQUIRED FIELDS ARE PROVIDED WITH VALID VALUES
        [Fact]
        public void Calendar_Validation_Success_When_All_Fields_Are_Valid()
        {
            // ARRANGE - PREPARE CALENDAR OBJECT WITH VALID DATA FOR TESTING
            var calendar = new Calendar
            {
                Name = "Mon Calendrier",
                Description = "Description de mon calendrier",
                Color = "#FFFFFF",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON CALENDAR OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(calendar, new ValidationContext(calendar), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
        }

        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "NAME" FIELD IS MISSING
        [Fact]
        public void Calendar_Validation_Fails_When_Name_Is_Missing()
        {
            // ARRANGE - PREPARE CALENDAR OBJECT WITH VALID DATA FOR TESTING
            var calendar = new Calendar
            {
                // Name is missing
                Description = "Description sans nom",
                Color = "#FFFFFF",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON CALENDAR OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(calendar, new ValidationContext(calendar), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(Calendar.Name)));
        }

        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "COLOR" FIELD IS IN WRONG FORMAT
        [Fact]
        public void Calendar_Validation_Fails_When_Color_Is_In_Wrong_Format()
        {
            // ARRANGE - PREPARE CALENDAR OBJECT WITH VALID DATA FOR TESTING
            var calendar = new Calendar
            {
                Name = "Calendrier Couleur",
                Description = "Couleur invalide",
                Color = "123456",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON CALENDAR OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(calendar, new ValidationContext(calendar), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.False(isValid);
        }

        //TODO: Add a test to verify that validation fails when UserId is missing.
        //TODO: Add a test to check specific error message when Color format is invalid.
        //TODO: Add a test to verify correct updating of UpdatedAt when changing calendar.
        //TODO: Add a test to check association between Calendar and User.
        //TODO: Add a test to check association between Calendar and Appointments.

    }
}
