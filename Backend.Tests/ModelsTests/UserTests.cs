using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
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
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(user, new ValidationContext(user), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
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
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
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

        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "EMAIL" FIELD IS MISSING
        [Fact]
        public void User_Validation_Fails_When_Email_Is_Missing()
        {
            // ARRANGE - PREPARE USER OBJECT WITHOUT AN "EMAIL" FOR TESTING
            var user = new User
            {
                Username = "testUser",
                // Email is missing
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(user, new ValidationContext(user), validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION FAILS DUE TO MISSING EMAIL
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(User.Email)));
        }

        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "EMAIL" FIELD IS EMPTY
        [Fact]
        public void User_Validation_Fails_When_Email_Format_Is_Invalid()
        {
            // ARRANGE - PREPARE USER OBJECT WITH INVALID EMAIL FORMAT FOR TESTING
            var user = new User
            {
                Username = "testUser",
                Email = "testexample.com", // Invalid email format
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            var isValid = Validator.TryValidateObject(user, context, validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION FAILS DUE TO INVALID EMAIL FORMAT
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(User.Email)));
        }

        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "PASSWORDHASH" FIELD IS MISSING
        [Fact]
        public void User_Validation_Fails_When_PasswordHash_Is_Missing()
        {
            // ARRANGE - PREPARE USER OBJECT WITHOUT A "PASSWORDHASH" FOR TESTING
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow
            };

            // SET PASSWORDHASH TO NULL
            typeof(User).GetProperty(nameof(User.PasswordHash))!.SetValue(user, null);

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            var isValid = Validator.TryValidateObject(user, context, validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION FAILS DUE TO MISSING PASSWORDHASH
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(User.PasswordHash)));
        }

        // TEST TO VERIFY THAT VALIDATION FAILS WHEN "PASSWORDSALT" FIELD IS MISSING
        [Fact]
        public void User_Validation_Fails_When_PasswordSalt_Is_Missing()
        {
            // ARRANGE - PREPARE USER OBJECT WITHOUT A "PASSWORDSALT" FOR TESTING
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow
            };

            // SET PASSWORDSALT TO NULL
            typeof(User).GetProperty(nameof(User.PasswordSalt))!.SetValue(user, null);

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            var isValid = Validator.TryValidateObject(user, context, validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION FAILS DUE TO MISSING PASSWORDSALT
            Assert.False(isValid);
            Assert.Contains(validationResults, vr => vr.MemberNames.Contains(nameof(User.PasswordSalt)));
        }

        // TEST TO VERIFY THAT "UPDATEDAT" FIELD IS NULL WHEN NOT SET
        [Fact]
        public void User_UpdatedAt_Is_Null_When_Not_Set()
        {
            // ARRANGE - PREPARE USER OBJECT WITHOUT AN "UPDATEDAT" FOR TESTING
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            var isValid = Validator.TryValidateObject(user, context, validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
            Assert.Null(user.UpdatedAt);
        }

        // TEST TO VERIFY THAT "UPDATEDAT" FIELD IS WORKING AS EXPECTED
        [Fact]
        public void User_UpdatedAt_Is_Working_As_Expected()
        {
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            var isValid = Validator.TryValidateObject(user, context, validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
            Assert.NotNull(user.UpdatedAt);
        }

        // TEST TO VERIFY THAT "LASTLOGIN" FIELD IS NULL WHEN NOT SET
        [Fact]
        public void User_LastLogin_Is_Null_When_Not_Set()
        {
            // ARRANGE - PREPARE USER OBJECT WITHOUT A "LASTLOGIN" FOR TESTING
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            var isValid = Validator.TryValidateObject(user, context, validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
            Assert.Null(user.LastLogin);
        }

        // TEST TO VERIFY THAT "LASTLOGIN" FIELD IS WORKING AS EXPECTED
        [Fact]
        public void User_LastLogin_Is_Working_As_Expected()
        {
            // ARRANGE - PREPARE USER OBJECT WITH "LASTLOGIN" SET FOR TESTING
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            var isValid = Validator.TryValidateObject(user, context, validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
            Assert.NotNull(user.LastLogin);
        }

        // TEST TO VERIFY THAT NOTIFICATIONS AND CALENDARS COLLECTIONS ARE INITIALIZED CORRECTLY
        [Fact]
        public void User_Notifications_And_Calendars_Collections_Are_Initialized_Correctly()
        {
            // ARRANGE - PREPARE USER OBJECT FOR TESTING
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            var isValid = Validator.TryValidateObject(user, context, validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
            Assert.NotNull(user.Notifications);
            Assert.NotNull(user.Calendars);
        }

        // TEST TO VERIFY THAT NOTIFICATIONS AND CALENDARS COLLECTIONS ARE EMPTY WHEN NOT SET
        [Fact]
        public void User_Notifications_And_Calendars_Collections_Are_Empty_When_Not_Set()
        {
            // ARRANGE - PREPARE USER OBJECT WITHOUT NOTIFICATIONS AND CALENDARS FOR TESTING
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            var isValid = Validator.TryValidateObject(user, context, validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
            Assert.Empty(user.Notifications);
            Assert.Empty(user.Calendars);
        }

        // TEST TO VERIFY THAT USER DETAILS LIST IS INITIALIZED AND CAN BE MANIPULATED
        [Fact]
        public void User_Details_List_Is_Initialized_And_Can_Be_Manipulated()
        {
            // ARRANGE - PREPARE USER OBJECT WITH DETAILS
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow,
                Details = new List<UserDetails>
                {
                    new UserDetails
                    {
                        FullName = "Test User",
                        Avatar = "https://example.com/avatar.png",
                        DateOfBirth = new DateOnly(1990, 1, 1),
                        Language = "English",
                        Font = "Arial",
                        Bio = "This is a test user.",
                        Websites = new List<string> { "https://testuser.com" },
                        Location = "Test City",
                        Theme = "light"
                    }
                }
            };

            // ACT - ADD ANOTHER DETAIL
            user.Details.Add(new UserDetails
            {
                FullName = "Test User 2",
                Avatar = "https://example.com/avatar2.png",
                DateOfBirth = new DateOnly(1992, 2, 2),
                Language = "French",
                Font = "Helvetica",
                Bio = "This is another test user.",
                Websites = new List<string> { "https://testuser2.com" },
                Location = "Test City 2",
                Theme = "dark"
            });

            // ASSERT - VERIFY THAT DETAILS LIST IS INITIALIZED AND MANIPULATED CORRECTLY
            Assert.NotNull(user.Details);
            Assert.Equal(2, user.Details.Count);
            Assert.Equal("Test User", user.Details[0].FullName);
            Assert.Equal("Test User 2", user.Details[1].FullName);
        }

        // TEST TO VERIFY THAT USER STATUS LIST IS INITIALIZED AND CAN BE MANIPULATED
        [Fact]
        public void User_Status_List_Is_Initialized_And_Can_Be_Manipulated()
        {
            // ARRANGE - PREPARE USER OBJECT WITH STATUS
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow,
                Status = new List<UserStatus>
                {
                    new UserStatus
                    {
                        IsOnline = true,
                        IsEmailVerified = true,
                        IsPremium = false,
                        IsEnterprise = false,
                        IsBanned = false,
                        IsAdmin = false
                    }
                }
            };

            // ACT - ADD ANOTHER STATUS
            user.Status.Add(new UserStatus
            {
                IsOnline = false,
                IsEmailVerified = false,
                IsPremium = true,
                IsEnterprise = true,
                IsBanned = true,
                IsAdmin = true
            });

            // ASSERT - VERIFY THAT STATUS LIST IS INITIALIZED AND MANIPULATED CORRECTLY
            Assert.NotNull(user.Status);
            Assert.Equal(2, user.Status.Count);
            Assert.True(user.Status[0].IsOnline);
            Assert.False(user.Status[1].IsOnline);
        }

        // TEST TO VERIFY THAT USER DETAILS LIST IS EMPTY WHEN NOT SET
        [Fact]
        public void User_Details_List_Is_Empty_When_Not_Set()
        {
            // ARRANGE - PREPARE USER OBJECT WITHOUT DETAILS FOR TESTING
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            var isValid = Validator.TryValidateObject(user, context, validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
            Assert.Empty(user.Details);
        }

        // TEST TO VERIFY THAT USER STATUS LIST IS EMPTY WHEN NOT SET
        [Fact]
        public void User_Status_List_Is_Empty_When_Not_Set()
        {
            // ARRANGE - PREPARE USER OBJECT WITHOUT STATUS FOR TESTING
            var user = new User
            {
                Username = "testUser",
                Email = "test@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser"),
                CreatedAt = DateTime.UtcNow
            };

            // ACT - PERFORM VALIDATION CHECK ON USER OBJECT
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(user);
            var isValid = Validator.TryValidateObject(user, context, validationResults, true);

            // ASSERT - VERIFY THAT VALIDATION PASSES WITHOUT ANY ERRORS
            Assert.True(isValid);
            Assert.Empty(validationResults);
            Assert.Empty(user.Status);
        }
    }
}
