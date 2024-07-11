using AutoMapper;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Dtos.Responses;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Microsoft.Extensions.Logging;
using System.Dynamic;

namespace Backend.Tests.ControllersTests
{
    // UNIT TEST - AUTHENTICATION CONTROLLER
    public class AuthControllerTests
    {
        // DECLARES PRIVATE READ-ONLY FIELDS - "AUTHCONTROLLER", MOCK OF IAUTHSERVICE, AND MOCK OF "IMAPPER"
        private readonly AuthController _controller;
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ILogger<AuthController>> _mockLogger;

        // CONSTRUCTOR - INITIALIZES MOCKS AND CREATES AN INSTANCE WITH THESE MOCKS
        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>(); // INITIALIZES MOCK "IAUTHSERVICE"
            _mockMapper = new Mock<IMapper>(); // INITIALIZES MOCK "IMAPPER"
            _mockLogger = new Mock<ILogger<AuthController>>(); // INITIALIZES MOCK "ILOGGER<AUTHCONTROLLER>"
            _controller = new AuthController(_mockAuthService.Object, _mockMapper.Object, _mockLogger.Object); // CREATES AN INSTANCE OF "AUTHCONTROLLER", INJECTING MOCKED SERVICES
        }

        // TEST TO VERIFY THAT "REGISTER" METHOD RETURNS "OKOBJECTRESULT" WITH TOKEN WHEN CALLED WITH VALID CREDENTIALS
        [Fact]
        public async Task Register_WhenCalled_ReturnsOkObjectResult()
        {
            // ARRANGE - SETUP MOCKS TO RETURN EXPECTED VALUES
            var userRegistrationDto = new UserRegistrationDto { Username = "testUser", Password = "testPassword", Email = "newuser@example.com" };
            var user = new User { UserId = 1, Username = "testUser" };
            var userDto = new UserDto { UserId = 1, Username = "testUser", Email = "newuser@example.com" };
            var token = "fake-jwt-token";
            var refreshToken = "fake-refresh-token";

            // SETUP MOCKS TO RETURN EXPECTED VALUES
            _mockMapper.Setup(x => x.Map<User>(It.IsAny<UserRegistrationDto>())).Returns(user);
            _mockAuthService.Setup(x => x.Register(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(Result<User>.Success(user));
            _mockMapper.Setup(x => x.Map<UserDto>(It.IsAny<User>())).Returns(userDto);
            _mockAuthService.Setup(x => x.GenerateJwtToken(It.IsAny<User>())).Returns(token);
            _mockAuthService.Setup(x => x.GenerateRefreshToken(It.IsAny<User>())).ReturnsAsync(refreshToken);

            // ACT - CALL "REGISTER" METHOD WITH VALID REGISTRATION DATA
            var result = await _controller.Register(userRegistrationDto);
            var okResult = Assert.IsType<OkObjectResult>(result);
            var resultValue = okResult.Value as RegisterResponse;

            // ASSERT - VERIFY THAT METHOD RETURNS "OKOBJECTRESULT" WITH EXPECTED VALUES
            Assert.NotNull(resultValue);
            Assert.NotNull(resultValue.User);
            Assert.Equal(userDto.Username, resultValue.User.Username);
            Assert.NotNull(resultValue.Token);
            Assert.Equal(token, resultValue.Token);
            Assert.NotNull(resultValue.RefreshToken);
            Assert.Equal(refreshToken, resultValue.RefreshToken);
        }

        // TEST TO VERIFY THAT "LOGIN" METHOD RETURNS "OKOBJECTRESULT" WITH TOKEN WHEN CALLED WITH VALID CREDENTIALS
        [Fact]
        public async Task Login_WhenCalled_ReturnsOkObjectResultWithToken()
        {
            // ARRANGE - SETUP MOCK AUTH SERVICE TO RETURN A USER AND TOKEN ON SUCCESSFUL LOGIN
            var userLoginDto = new UserLoginDto { Username = "testUser", Password = "testPassword" };
            var userFromService = new User
            {
                UserId = 1,
                Username = "testUser",
                PasswordHash = Encoding.UTF8.GetBytes("testUser"),
                PasswordSalt = Encoding.UTF8.GetBytes("testUser")
            };
            var token = "fake-jwt-token";
            var refreshToken = "fake-refresh-token";

            _mockAuthService.Setup(x => x.Login(userLoginDto.Username, userLoginDto.Password)).ReturnsAsync(Result<User>.Success(userFromService));
            _mockAuthService.Setup(x => x.GenerateJwtToken(It.IsAny<User>())).Returns(token);
            _mockAuthService.Setup(x => x.GenerateRefreshToken(It.IsAny<User>())).ReturnsAsync(refreshToken);
            _mockMapper.Setup(x => x.Map<UserDto>(userFromService)).Returns(new UserDto
            {
                UserId = userFromService.UserId,
                Username = userFromService.Username,
                Email = "newuser@example.com"
            });

            // ACT - CALL "LOGIN" METHOD WITH VALID CREDENTIALS
            var result = await _controller.Login(userLoginDto);
            var okResult = Assert.IsType<OkObjectResult>(result);
            var resultValue = okResult.Value as LoginResponse;

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OKOBJECTRESULT" WITH EXPECTED TOKEN
            Assert.NotNull(resultValue);
            Assert.NotNull(resultValue.User);
            Assert.Equal(userFromService.UserId, resultValue.User.UserId);
            Assert.NotNull(resultValue.Token);
            Assert.Equal(token, resultValue.Token);
            Assert.NotNull(resultValue.RefreshToken);
            Assert.Equal(refreshToken, resultValue.RefreshToken);
        }

        // TEST TO VERIFY THAT "LOGOUT" METHOD RETURNS "OKOBJECTRESULT" WITH MESSAGE WHEN CALLED WITH VALID USER ID
        [Fact]
        public async Task Logout_WhenCalled_ReturnsOkObjectResult()
        {
            // ARRANGE - SETUP MOCK AUTH SERVICE TO RETURN A USER AND TOKEN ON SUCCESSFUL LOGIN
            var userLogoutDto = new UserLogoutDto { UserId = 1 };
            _mockAuthService.Setup(x => x.Logout(It.IsAny<int>())).ReturnsAsync(Result<User>.Success(new User()));

            // ACT - CALL "LOGOUT" METHOD WITH VALID USER ID
            var result = await _controller.Logout(userLogoutDto);

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OKOBJECTRESULT" WITH EXPECTED MESSAGE
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
            var responseValue = okResult.Value as IDictionary<string, object>;
            Assert.NotNull(responseValue);
            Assert.True(responseValue.ContainsKey("message"));
            Assert.Equal("Logout successful", responseValue["message"]);
        }

        //TODO: ADD A TEST TO VERIFY THAT REGISTER RETURNS BADREQUEST WHEN MODELSTATE IS INVALID
        //TODO: ADD A TEST TO VERIFY THAT REGISTER RETURNS BADREQUEST IF USER CREATION FAILS
        //TODO: ADD A TEST TO VERIFY THAT LOGIN RETURNS UNAUTHORIZED WHEN ATTEMPTING TO LOG IN WITH INVALID CREDENTIALS
        //TODO: ADD A TEST TO CHECK SUCCESS OF TOKEN RENEWAL WITH REFRESHTOKEN
        //TODO: ADD A TEST TO CHECK REFRESHTOKEN'S UNAUTHORIZED RESPONSE WITH INVALID CREDENTIALS
    }
}
