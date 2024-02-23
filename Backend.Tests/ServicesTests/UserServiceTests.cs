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
            var testUser1 = new User { Username = "TestUser1", Email = "test1@example.com", PasswordHash = Encoding.UTF8.GetBytes("TestUser1"), PasswordSalt = Encoding.UTF8.GetBytes("TestUser1") };
            var testUser2 = new User { Username = "TestUser2", Email = "test2@example.com", PasswordHash = Encoding.UTF8.GetBytes("TestUser2"), PasswordSalt = Encoding.UTF8.GetBytes("TestUser2") };

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

        //TODO: ADD A TEST FOR CREATEUSER TO VERIFY THAT A NEW USER IS CORRECTLY ADDED WITH A PASSWORD HASH AND SALT
        //TODO: ADD A TEST FOR CREATEUSER TO ENSURE AN EXCEPTION IS THROWN IF USERNAME ALREADY EXISTS
        //TODO: ADD A TEST FOR UPDATEUSER TO VERIFY THAT AN EXISTING USER'S DETAILS ARE CORRECTLY UPDATED
        //TODO: ADD A TEST FOR UPDATEUSER TO VERIFY THAT AN EXCEPTION IS THROWN IF USER TO UPDATE DOES NOT EXIST
        //TODO: ADD A TEST FOR DELETEUSER TO CONFIRM THAT A USER IS SUCCESSFULLY DELETED FROM DATABASE
        //TODO: ADD A TEST FOR DELETEUSER TO ENSURE THAT AN EXCEPTION IS THROWN IF USER TO BE DELETED DOES NOT EXIST
        //TODO: ADD A TEST FOR USEREXISTS TO VERIFY THAT IT RETURNS TRUE WHEN USER EXISTS
        //TODO: ADD A TEST FOR USEREXISTS TO VERIFY THAT IT RETURNS FALSE WHEN USER DOES NOT EXIST

    }
}
