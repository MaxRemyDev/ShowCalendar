using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;
using Xunit;

namespace Backend.Tests.ModelsTests
{
    // UNIT TESTS - USER MODEL
    public class UserTests
    {
        // TEST TO ENSURE THAT USER VALIDATION PASSES WHEN ALL REQUIRED FIELDS ARE PROVIDED WITH VALID VALUES
        [Fact]
        public void User_Validation_Success_When_All_Fields_Are_Valid()
        {
            // ARRANGE - PREPARE USER OBJECT WITH VALID DATA FOR TESTING
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = new byte[0],
                PasswordSalt = new byte[0],
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(user, new ValidationContext(user), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
        }


        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "EMAIL" FIELD IS MISSING
        [Fact]
        public void User_Validation_Fails_When_Email_Is_Missing()
        {
            // ARRANGE - PREPARE USER OBJECT WITHOUT AN "EMAIL" FOR TESTING
            var user = new User
            {
                Username = "testUser",
                //  Email is missing
                PasswordHash = new byte[0],
                PasswordSalt = new byte[0],
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(user, new ValidationContext(user), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION FAILS DUE TO MISSING EMAIL
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(User.Email)));
        }

        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "USERNAME" FIELD IS EMPTY
        [Fact]
        public void User_Validation_Fails_When_Username_Is_Empty()
        {
            // ARRANGE - PREPARE USER OBJECT WITHOUT A "USERNAME" FOR TESTING
            var user = new User
            {
                // Username is missing
                Email = "test@example.com",
                PasswordHash = new byte[0],
                PasswordSalt = new byte[0],
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            var isValid = Validator.TryValidateObject(user, context, validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION FAILS DUE TO EMPTY USERNAME
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(User.Username)));
        }

        //TODO: ADD A TEST TO VERIFY THAT VALIDATION FAILS WHEN EMAIL FORMAT IS INVALID
        //TODO: ADD A TEST TO VERIFY THAT VALIDATION FAILS WHEN PASSWORDHASH IS MISSING
        //TODO: ADD A TEST TO VERIFY THAT VALIDATION FAILS WHEN PASSWORDSALT IS MISSING
        //TODO: ADD A TEST TO CHECK EXPECTED BEHAVIOR OF UPDATEDAT
        //TODO: ADD A TEST TO CHECK EXPECTED BEHAVIOR OF LASTLOGIN
        //TODO: ADD A TEST TO VERIFY THAT NOTIFICATIONS AND CALENDARS COLLECTIONS ARE INITIALIZED CORRECTLY

    }
}
