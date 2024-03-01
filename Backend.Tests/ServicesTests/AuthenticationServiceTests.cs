using Backend.Data;
using Backend.Interfaces;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Text;
using Xunit;

namespace Backend.Tests.ServicesTests
{
    // UNIT TEST - AUTHENTICATION SERVICE
    public class AuthenticationServiceTests
    {
        // DECLARES PRIVATE READ-ONLY FIELDS FOR "AUTHENTICATIONSERVICE", "APPLICATIONDBCONTEXT", AND MOCK OF "IENVIRONMENTSERVICE"
        private readonly AuthenticationService _authService;
        private readonly ApplicationDbContext _context;
        private readonly Mock<IEnvironmentService> _environmentServiceMock = new Mock<IEnvironmentService>();

        // CONSTRUCTOR FOR "AUTHENTICATIONSERVICETESTS" SETS UP IN-MEMORY DATABASE AND INITIALIZES "AUTHENTICATIONSERVICE" WITH A MOCKED "IENVIRONMENTSERVICE"
        public AuthenticationServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"InMemoryDbForTesting{Guid.NewGuid()}")
                .Options;
            _context = new ApplicationDbContext(options);

            _environmentServiceMock.Setup(m => m.GetJwtSecret()).Returns("BackendTests_ServicesTests_AuthenticationServiceTests_SecretKey");
            _authService = new AuthenticationService(_context, _environmentServiceMock.Object);
        }

        // TEST TO VERIFY THAT "REGISTER" METHOD SHOULD ADD USER WHEN USER DOES NOT EXIST
        [Fact]
        public async Task Register_ShouldAddUser_WhenUserDoesNotExist()
        {
            var user = new User
            {
                Username = "newUser",
                Email = "newUser@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("someHash"),
                PasswordSalt = Encoding.UTF8.GetBytes("someSalt")
            };
            string password = "TestPassword123";

            var registeredUser = await _authService.Register(user, password);

            Assert.NotNull(registeredUser);
            Assert.NotNull(registeredUser.Value);
            Assert.Equal(user.Username, registeredUser.Value!.Username);
            Assert.NotEmpty(registeredUser.Value.PasswordHash);
            Assert.NotEmpty(registeredUser.Value.PasswordSalt);
        }

        // TEST TO VERIFY THAT "LOGIN" METHOD SHOULD RETURN USER WHEN CREDENTIALS ARE CORRECT
        [Fact]
        public async Task Login_ShouldReturnUser_WhenCredentialsAreCorrect()
        {
            string username = "existingUser";
            string password = "Password123";
            var user = new User
            {
                Username = username,
                Email = "existingUser@example.com",
                PasswordHash = Encoding.UTF8.GetBytes("someHash"),
                PasswordSalt = Encoding.UTF8.GetBytes("someSalt")
            };

            await _authService.Register(user, password);
            var loggedInUser = await _authService.Login(username, password);

            Assert.NotNull(loggedInUser);
            Assert.NotNull(loggedInUser.Value);
            Assert.Equal(username, loggedInUser.Value.Username);
        }

        // TEST TO VERIFY THAT "GENERATEJWTTOKEN" METHOD SHOULD RETURN TOKEN WHEN USER IS VALID
        [Fact]
        public async Task GenerateJwtToken_ShouldReturnToken_WhenUserIsValid()
        {
            var user = new User
            {
                Username = "userGeneratedToken",
                UserId = 1,
                Email = "userGeneratedToken@exemple.com",
                PasswordHash = Encoding.UTF8.GetBytes("userGeneratedToken"),
                PasswordSalt = Encoding.UTF8.GetBytes("userGeneratedToken")
            };

            await _authService.Register(user, "password");

            var token = _authService.GenerateJwtToken(user);

            Assert.NotNull(token);
            Assert.NotEmpty(token);
        }

        // TEST TO VERIFY THAT "REFRESHJWTTOKEN" METHOD SHOULD RETURN TOKEN WHEN USER IS VALID
        [Fact]
        public async Task RefreshJwtToken_ShouldReturnToken_WhenUserIsValid()
        {
            var user = new User
            {
                Username = "userRefreshedToken",
                UserId = 1,
                Email = "",
                PasswordHash = Encoding.UTF8.GetBytes("userRefreshedToken"),
                PasswordSalt = Encoding.UTF8.GetBytes("userRefreshedToken")
            };

            await _authService.Register(user, "password");

            var token = _authService.RefreshJwtToken(user);

            Assert.NotNull(token);
            Assert.NotEmpty(token);
        }

        //TODO: ADD A TEST TO VERIFY THAT AN EXCEPTION IS THROWN WHEN REGISTERING AN ALREADY EXISTING USER
        //TODO: ADD A TEST TO CHECK RESPONSE IF PASSWORD VERIFICATION FAILS DURING LOGIN
        //TODO: ADD A TEST TO VERIFY THAT USER'S LASTLOGIN FIELD IS UPDATED UPON LOGIN
        //TODO: ADD A TEST TO ENSURE USEREXISTS RETURNS TRUE FOR AN EXISTING USER
        //TODO: ADD A TEST TO ENSURE THAT USEREXISTS RETURNS FALSE FOR A USER THAT DOES NOT EXIST
        //TODO: ADD A TEST TO VERIFY CORRECT CREATION OF PASSWORD HASH AND SALT
        //TODO: ADD A TEST TO VERIFY CORRECT PASSWORD HASH AND SALT VERIFICATION
        //TODO: ADD A TEST FOR REFRESHJWTTOKEN TO CHECK BEHAVIOR WHEN USER NO LONGER HAS PERMISSION TO LOG IN

    }
}
