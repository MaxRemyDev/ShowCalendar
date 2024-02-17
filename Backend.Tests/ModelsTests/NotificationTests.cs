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

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
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

        // TEST TO VERIFY THAT "IsRead" PROPERTY BEHAVES AS EXPECTED
        [Fact]
        public void Notification_IsRead_Property_Behavior()
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

            // ACT - SET ISREAD PROPERTY TO TRUE
            notification.IsRead = true;

            // ASSERT - VERIFY THAT ISREAD PROPERTY IS SET TO TRUE
            Assert.True(notification.IsRead);
        }


        // TEST TO VERIFY THAT VALIDATION PASSES WHEN "DATE" FIELD IS MISSING
        [Fact]
        public void Notification_Date_Property_Validation()
        {
            // ARRANGE - PREPARE NOTIFICATION OBJECT WITH VALID DATA FOR TESTING
            var notification = new Notification
            {
                UserId = 1,
                Type = "info",
                Message = "This is a test notification",
                // Date is missing
                IsRead = false
            };

            // ACT - PERFORM VALIDATION CHECK ON NOTIFICATION OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(notification, new ValidationContext(notification), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
        }

        // TEST TO VERIFY THAT NOTIFICATION AND USER ARE RELATED
        [Fact]
        public void Notification_User_Relationship()
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

            // ACT - SET USER PROPERTY TO A VALID USER OBJECT
            notification.User = new User();

            // ASSERT - VERIFY THAT USER PROPERTY IS NOT NULL
            Assert.NotNull(notification.User);
        }

        //TODO: Add a test to verify that validation fails when UserId is missing. (Maybe not needed because it's a foreign key.)

    }
}