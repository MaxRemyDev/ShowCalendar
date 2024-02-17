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
                Name = "My Calendar",
                Description = "Description of my calendar",
                Color = "#FFFFFF",
                CreatedAt = DateTime.UtcNow
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
                Description = "Description without name",
                Color = "#FFFFFF",
                CreatedAt = DateTime.UtcNow
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
                Name = "My Calendar",
                Description = "Calendar with invalid color format",
                Color = "123456",
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON CALENDAR OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(calendar, new ValidationContext(calendar), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.False(isValid);
        }

        // TEST TO VERIFY THAT VALIDATION FAILS WITH SPECIFIC ERROR MESSAGE WHEN "COLOR" FIELD IS IN WRONG FORMAT
        [Fact]
        public void Calendar_Validation_Checks_Color_Format_ErrorMessage()
        {
            // ARRANGE - CREATE A CALENDAR WITH INVALID COLOR FORMAT
            var calendar = new Calendar
            {
                Name = "My Calendar",
                Description = "Calendar with invalid color format",
                Color = "ZZZ999", // Invalid color format
                CreatedAt = DateTime.UtcNow,
            };

            // ACT - PERFORM VALIDATION CHECK ON CALENDAR OBJECT
            var validationResults = new List<ValidationResult>();
            Validator.TryValidateObject(calendar, new ValidationContext(calendar), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION FAILS WITH SPECIFIC ERROR MESSAGE
            Assert.Contains(validationResults, vr => vr.ErrorMessage == "The color format is invalid.");
        }

        // TEST TO VERIFY THAT "UPDATEDAT" IS CORRECTLY UPDATED WHEN CALENDAR CHANGES
        [Fact]
        public void Calendar_UpdatedAt_Is_Correctly_Updated_When_Calendar_Changes()
        {
            // ARRANGE - CREATE A NEW CALENDAR
            var calendar = new Calendar
            {
                Name = "My Calendar",
                Description = "My Description",
                Color = "#FFFFFF",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // ACT - UPDATE CALENDAR
            calendar.Name = "Updated My Calendar";
            calendar.Description = "Updated Description";
            calendar.UpdatedAt = DateTime.UtcNow.AddHours(1);

            // ASSERT - VERIFY THAT "UPDATEDAT" IS GREATER THAN CreatedAt
            Assert.True(calendar.UpdatedAt > calendar.CreatedAt, "UpdatedAt should be greater than CreatedAt after updates.");
        }

        //TODO: Add a test to check association between Calendar and User. (need relation of DB)
        //TODO: Add a test to check association between Calendar and Appointments. (need relation of DB)
        //TODO: Add a test to verify that validation fails when UserId is missing. (Maybe not needed because it's a foreign key.)

    }
}
