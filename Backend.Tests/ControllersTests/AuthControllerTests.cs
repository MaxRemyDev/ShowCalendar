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

namespace Backend.Tests.ControllersTests
{
    // UNIT TEST - AUTHENTICATION CONTROLLER
    public class AuthControllerTests
    {
        // DECLARES PRIVATE READ-ONLY FIELDS - "AUTHCONTROLLER", MOCK OF IAUTHSERVICE, AND MOCK OF "IMAPPER"
        private readonly AuthController _controller;
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly Mock<IMapper> _mockMapper;

        // CONSTRUCTOR - INITIALIZES MOCKS AND CREATES AN INSTANCE WITH THESE MOCKS
        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>(); // INITIALIZES MOCK "IAUTHSERVICE"
            _mockMapper = new Mock<IMapper>(); // INITIALIZES MOCK "IMAPPER"
            _controller = new AuthController(_mockAuthService.Object, _mockMapper.Object); // CREATES AN INSTANCE OF "AUTHCONTROLLER", INJECTING MOCKED SERVICES
        }

        // TEST TO VERIFY THAT "REGISTER" METHOD RETURNS "CREATEDATROUTERESULT" WHEN CALLED WITH VALID REGISTRATION DATA.
        [Fact]
        public async Task Register_WhenCalled_ReturnsCreatedAtRouteResult()
        {
            // ARRANGE - SETUP MOCKS TO RETURN EXPECTED VALUES
            var userRegistrationDto = new UserRegistrationDto { Username = "testUser", Password = "testPassword", Email = "newuser@example.com" };
            var user = new User { UserId = 1, Username = "testUser" };
            var userDto = new UserDto { UserId = 1, Username = "testUser", Email = "newuser@example.com" };

            // SETUP MOCKS TO RETURN EXPECTED VALUES
            _mockMapper.Setup(x => x.Map<User>(It.IsAny<UserRegistrationDto>())).Returns(user);
            _mockAuthService.Setup(x => x.Register(It.IsAny<User>(), It.IsAny<string>()))
                            .ReturnsAsync(Result<User>.Success(user));
            _mockMapper.Setup(x => x.Map<UserDto>(It.IsAny<User>())).Returns(userDto);

            // ACT - CALL "REGISTER" METHOD WITH VALID REGISTRATION DATA
            var result = await _controller.Register(userRegistrationDto);

            // ASSERT - VERIFY THAT METHOD RETURNS "CREATEDATROUTERESULT" WITH EXPECTED USER DTO
            var actionResult = Assert.IsType<CreatedAtRouteResult>(result);
            Assert.Equal("GetUserById", actionResult.RouteName);
            var resultValue = Assert.IsType<UserDto>(actionResult.Value);
            Assert.Equal(userRegistrationDto.Username, resultValue.Username);
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
            var token = "BackendTests_ControllerTests_AuthControllerTests_SecretKey";

            _mockAuthService.Setup(x => x.Login(userLoginDto.Username, userLoginDto.Password)).ReturnsAsync(Result<User>.Success(userFromService));
            _mockAuthService.Setup(x => x.GenerateJwtToken(It.IsAny<User>())).Returns(token);

            // ACT - CALL "LOGIN" METHOD WITH VALID CREDENTIALS
            var result = await _controller.Login(userLoginDto);

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OKOBJECTRESULT" WITH EXPECTED TOKEN
            var okResult = Assert.IsType<OkObjectResult>(result);
            var resultValue = Assert.IsAssignableFrom<LoginResponse>(okResult.Value);
            Assert.Equal(token, resultValue.Token);
        }

        //TODO: ADD A TEST TO VERIFY THAT REGISTER RETURNS BADREQUEST WHEN MODELSTATE IS INVALID
        //TODO: ADD A TEST TO VERIFY THAT REGISTER RETURNS BADREQUEST IF USER CREATION FAILS
        //TODO: ADD A TEST TO VERIFY THAT LOGIN RETURNS UNAUTHORIZED WHEN ATTEMPTING TO LOG IN WITH INVALID CREDENTIALS
        //TODO: ADD A TEST TO VERIFY THAT LOGOUT RETURNS AN OK RESPONSE
        //TODO: ADD A TEST TO CHECK SUCCESS OF TOKEN RENEWAL WITH REFRESHTOKEN
        //TODO: ADD A TEST TO CHECK REFRESHTOKEN'S UNAUTHORIZED RESPONSE WITH INVALID CREDENTIALS
    }
}
