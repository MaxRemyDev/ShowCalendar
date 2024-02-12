using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Backend.Models;
using Xunit;

namespace Backend.Tests.ModelsTests
{
    // UNIT TEST - NOTIFICATION MODEL
    public class NotificationTests
    {
        // TEST TO ENSURE THAT NOTIFICATION VALIDATION PASSES WHEN ALL REQUIRED FIELDS ARE PROVIDED WITH VALID VALUES
        [Fact]
        public void Notification_Validation_Success_When_All_Fields_Are_Valid()
        {
            // ARRANGE - PREPARE NOTIFICATION OBJECT WITH VALID DATA FOR TESTING
            var notification = new Notification
            {
                UserId = 1,
                Type = "info",
                Message = "This is a test notification",
                Date = DateTime.UtcNow,
                IsRead = false
            };

            // ACT - PERFORM VALIDATION CHECK ON NOTIFICATION OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(notification, new ValidationContext(notification), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
        }

        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "TYPE" FIELD IS MISSING
        [Fact]
        public void Notification_Validation_Fails_When_Type_Is_Missing()
        {
            // ARRANGE - PREPARE USER OBJECT WITHOUT AN "TYPE" FOR TESTING
            var notification = new Notification
            {
                UserId = 1,
                // Type is missing
                Message = "This is a test notification",
                Date = DateTime.UtcNow,
                IsRead = false
            };

            // ACT - PERFORM VALIDATION CHECK ON NOTIFICATION OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(notification, new ValidationContext(notification), validationResults, true);

            // ASSERT - 
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(Notification.Type)));
        }

        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "MESSAGE" FIELD IS EMPTY
        [Fact]
        public void Notification_Validation_Fails_When_Message_Is_Missing()
        {
            // ARRANGE - PREPARE USER OBJECT WITHOUT AN "MESSAGE" FOR TESTING
            var notification = new Notification
            {
                UserId = 1,
                Type = "info",
                // Message is missing
                Date = DateTime.UtcNow,
                IsRead = false
            };

            // ACT - // ACT - PERFORM VALIDATION CHECK ON NOTIFICATION OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(notification, new ValidationContext(notification), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(Notification.Message)));
        }

        //TODO: Add a test to verify that validation fails when UserId is missing.
        //TODO: Add a test to check behavior of IsRead property.
        //TODO: Add a test to check validation of Date property.
        //TODO: Add a test to check relationship between Notification and User.

    }
}