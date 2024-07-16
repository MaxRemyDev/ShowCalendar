using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text;
using Xunit;

namespace Backend.Tests.ServicesTests
{
    // UNIT TEST - USER SERVICE
    public class UserServiceTests
    {
        // DECLARES PRIVATE READ-ONLY FIELDS FOR "USERSERVICE" AND "APPLICATIONDBCONTEXT"
        private readonly UserService _userService;
        private readonly ApplicationDbContext _context;

        // CONSTRUCTOR FOR "USERSERVICETESTS" SETS UP IN-MEMORY DATABASE FOR TESTING AND INITIALIZES "USERSERVICE"
        public UserServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"InMemoryDbForTesting{Guid.NewGuid()}")
                .Options;
            _context = new ApplicationDbContext(options);

            _userService = new UserService(_context);

            // POPULATES TEST DATA INTO IN-MEMORY DATABASE
            PopulateTestData(_context);
        }

        // STATIC METHOD TO POPULATE TEST DATA INTO APPLICATIONDBCONTEXT
        private static void PopulateTestData(ApplicationDbContext context)
        {
            var testUser1 = new User
            {
                Username = "TestUser1",
                Email = "test1@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("TestUser1"),
                PasswordSalt = Encoding.UTF8.GetBytes("TestUser1"),
                Details = new List<UserDetails> { new UserDetails {
                    FullName = "Test User 1",
                    Avatar = "https://example.com/avatar1.png",
                    DateOfBirth = new DateOnly(1990, 1, 1),
                    Language = "en",
                    Font = "arial",
                    Bio = "I am a test user.",
                    Websites = ["www.test.com", "www.website.com"],
                    Location = "Testville, USA",
                    Theme = "dark",
                }},
                Status = new List<UserStatus> { new UserStatus {
                    IsOnline = true,
                    IsEmailVerified = true,
                    IsPremium = false,
                    IsEnterprise = false,
                    IsBanned = false,
                    IsAdmin = false,
                }}
            };

            var testUser2 = new User
            {
                Username = "TestUser2",
                Email = "test2@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("TestUser2"),
                PasswordSalt = Encoding.UTF8.GetBytes("TestUser2"),
                Details = new List<UserDetails> { new UserDetails {
                    FullName = "Test User 2",
                    Avatar = "https://example.com/avatar2.png",
                    DateOfBirth = new DateOnly(2010, 10, 5),
                    Language = "fr",
                    Font = "arial",
                    Bio = "I am a test user.",
                    Websites = ["test.com", "website.com"],
                    Location = "Testville, USA",
                    Theme = "light",
                }},
                Status = new List<UserStatus> { new UserStatus {
                    IsOnline = true,
                    IsEmailVerified = true,
                    IsPremium = true,
                    IsEnterprise = false,
                    IsBanned = false,
                    IsAdmin = true,
                }}
            };

            context.Users.Add(testUser1);
            context.Users.Add(testUser2);
            context.SaveChanges();
        }

        // TEST TO VERIFY THAT "GETALLUSERS" METHOD SHOULD RETURN ALL USERS
        [Fact]
        public async Task GetAllUsers_ShouldReturnAllUsers()
        {
            var users = await _userService.GetAllUsers();
            Assert.Equal(2, users.Count());
        }

        // TEST TO VERIFY THAT "GETUSERBYID" METHOD SHOULD RETURN SPECIFIC USER
        [Fact]
        public async Task GetUserById_ShouldReturnUser()
        {
            // ACT - CALLS "GETUSERBYID" METHOD TO GET USER WITH ID 1
            var result = await _userService.GetUserById(1);
            var user = result.Value;

            // ASSERT - VERIFIES THAT THE SPECIFIC USER IS RETURNED
            Assert.Equal("TestUser1", user?.Username);
        }

        // TEST TO VERIFY THAT "CREATEUSER" METHOD ADDS A NEW USER CORRECTLY
        [Fact]
        public async Task CreateUser_ShouldAddNewUser()
        {
            // ARRANGE - CREATES A NEW USER OBJECT
            var newUser = new User
            {
                Username = "NewUser",
                Email = "NewUser@example.com",
            };

            // ACT - CALLS "CREATEUSER" METHOD TO CREATE NEW USER
            var result = await _userService.CreateUser(newUser, "NewUser");

            // ASSERT - VERIFIES THAT THE USER WAS SUCCESSFULLY CREATED
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Value);
            Assert.Equal("NewUser", result.Value.Username);
            Assert.NotNull(result.Value.PasswordHash);
            Assert.NotNull(result.Value.PasswordSalt);
        }

        // TEST TO VERIFY THAT "CREATEUSER" METHOD THROWS AN EXCEPTION IF USERNAME ALREADY EXISTS
        [Fact]
        public async Task CreateUser_ShouldThrowExceptionIfUserAlreadyExists()
        {
            var newUser = new User
            {
                Username = "TestUser1",
                Email = "duplicate@example.com",
            };

            var result = await _userService.CreateUser(newUser, "password");

            Assert.False(result.IsSuccess);
            Assert.Equal("Username already exists", result.Error);
        }

        // TEST TO VERIFY THAT "UPDATEDUSER" METHOD THROWS AN EXISTANT USER DETAILS CORRECTLY
        [Fact]
        public async Task UpdateUser_ShouldUpdateExistingUser()
        {
            // ARRANGE - CREATES A NEW USER OBJECT
            var userToUpdate = new User
            {
                Username = "UpdatedUser",
                Email = "UpdatedUser@example.com",
                Details = new List<UserDetails> { new UserDetails {
                    FullName = "Updated User",
                    Avatar = "https://example.com/avatar.png",
                    DateOfBirth = new DateOnly(2010, 10, 5),
                    Language = "de",
                    Font = "arial",
                    Bio = "I am a updated user.",
                    Websites = ["updated.com", "website.com"],
                    Location = "Updated ville, USA",
                    Theme = "light",
                }},
                Status = new List<UserStatus> { new UserStatus {
                    IsOnline = true,
                    IsEmailVerified = true,
                    IsPremium = true,
                    IsEnterprise = false,
                    IsBanned = false,
                    IsAdmin = true,
                }},
            };

            // ACT - CALLS "UPDATEUSER" METHOD TO UPDATE EXISTING USER
            var result = await _userService.UpdateUser(1, userToUpdate);

            // ASSERT - VERIFIES THAT THE USER WAS SUCCESSFULLY UPDATED
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Value);
            Assert.Equal("UpdatedUser", result.Value.Username);
            Assert.Equal("UpdatedUser@example.com", result.Value.Email);
            Assert.Equal("Updated User", result.Value.Details[0].FullName);
        }

        // TEST TO VERIFY THAT "UPDATEUSER" METHOD THROWS AN EXCEPTION IF USER DOES NOT EXIST
        [Fact]
        public async Task UpdateUser_ShouldThrowException_WhenUserDoesNotExist()
        {
            // ARRANGE -
            var userToUpdate = new User
            {
                Username = "UpdatedUser",
                Email = "UpdatedUser@example.com",
            };

            // ACT -
            var result = await _userService.UpdateUser(100, userToUpdate);

            // ASSERT -
            Assert.False(result.IsSuccess);
            Assert.Equal("User not found", result.Error);
        }

        // TESt TO VERIFY THAT "DELETEUSER" METHOD DELETES A USER SUCCESSFULLY
        [Fact]
        public async Task DeleteUser_ShouldDeleteUser()
        {
            // ACT - CALLS "DELETEUSER" METHOD TO DELETE USER WITH ID 1
            var result = await _userService.DeleteUser(1);
            var user = await _userService.GetUserById(1);

            // ASSERT - VERIFIES THAT THE USER WAS SUCCESSFULLY DELETED
            Assert.True(result);
            Assert.Null(user.Value);

        }

        // TEST TO VERIFY THAT "DELETEUSER" METHOD THROWS AN EXCEPTION IF USER DOES NOT EXIST
        [Fact]
        public async Task DeleteUser_ShouldThrowException_WhenUserDoesNotExist()
        {
            // ACT - CALLS "DELETEUSER" METHOD TO DELETE USER WITH ID 999
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _userService.DeleteUser(999));
        }

        // TEST TO VERIFY THAT "USEREXIST" METHOD RETURNS TRUE WHEN USER EXISTS
        [Fact]
        public async Task UserExists_ShouldReturnTrue_WhenUserExists()
        {
            // ACT - CALLS "USEREXIST" METHOD TO VERIFY THAT USER EXISTS
            var exists = await _userService.UserExists("TestUser1");

            // ASSERT - VERIFIES THAT USER EXISTS
            Assert.True(exists);
        }

        // TEST TO VERIFY THAT "USEREXIST" METHOD RETURNS FALSE WHEN USER DOES NOT EXIST
        [Fact]
        public async Task UserExists_ShouldReturnFalse_WhenUserDoesNotExist()
        {
            // ACT - CALLS "USEREXIST" METHOD TO VERIFY THAT USER DOES NOT EXIST
            var exists = await _userService.UserExists("NonExistentUser");

            // ASSERT - VERIFIES THAT USER DOES NOT EXIST
            Assert.False(exists);
        }

        // TEST TO VERIFY THAT DETAILS LIST IS INITIALIZED AND CAN BE MANIPULATED
        [Fact]
        public async Task Details_ShouldReturnInitializedList_And_CanBeManipulated()
        {
            // ARRANGE - CREATES A NEW USER OBJECT
            var userResult = await _userService.GetUserById(1);
            var user = userResult.Value;

            // ASSERT - VERIFIES THAT USER EXISTS
            if (user == null)
            {
                Assert.Fail("User not found");
                return;
            }

            // ASSERT - VERIFIES THAT DETAILS LIST IS INITIALIZED
            Assert.NotNull(user.Details);
            Assert.Single(user.Details);

            // ACT - ADDS ANOTHER DETAIL
            user.Details.Add(new UserDetails
            {
                FullName = "Test User",
                Avatar = "https://example.com/avatar.png",
                DateOfBirth = new DateOnly(2010, 10, 5),
                Language = "en",
                Font = "arial",
                Bio = "I am a test user.",
                Websites = new List<string> { "example.com", "website.com" },
                Location = "Test ville, USA",
                Theme = "light",
            });

            // ASSERT - VERIFIES THAT DETAILS LIST HAS BEEN UPDATED
            var result = await _userService.UpdateUser(1, user);

            // ASSERT - VERIFIES THAT USER WAS SUCCESSFULLY UPDATED
            Assert.True(result.IsSuccess);
            Assert.Equal(2, result.Value?.Details.Count);
            Assert.Equal("Test User", result.Value?.Details[1].FullName);
        }

        // TEST TO VERIFY THAT USER STATUSES LIST IS INITIALIZED AND CAN BE MANIPULATED
        [Fact]
        public async Task Statuses_ShouldReturnInitializedList_And_CanBeManipulated()
        {
            // ARRANGE - CREATES A NEW USER OBJECT
            var userResult = await _userService.GetUserById(1);
            var user = userResult.Value;

            // ASSERT - VERIFIES THAT USER EXISTS
            if (user == null)
            {
                Assert.Fail("User not found");
                return;
            }

            // ASSERT - VERIFIES THAT USER STATUSES LIST IS INITIALIZED
            Assert.NotNull(user.Status);
            Assert.Single(user.Status);

            // ACT - ADDS ANOTHER STATUS
            user.Status.Add(new UserStatus
            {
                IsOnline = true,
                IsEmailVerified = true,
                IsPremium = true,
                IsEnterprise = false,
                IsBanned = false,
                IsAdmin = true,
            });

            // ASSERT - VERIFIES THAT USER STATUSES LIST HAS BEEN UPDATED
            var result = await _userService.UpdateUser(1, user);

            // ASSERT - VERIFIES THAT USER WAS SUCCESSFULLY UPDATED
            Assert.True(result.IsSuccess);
            Assert.Equal(2, result.Value?.Status.Count);
            Assert.True(result.Value?.Status[1].IsAdmin);
        }
    }
}
