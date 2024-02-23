using AutoMapper;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Backend.Tests.ControllersTests
{
    // UNIT TESTS - USERS CONTROLLER
    public class UsersControllerTests
    {
        // DECLARES PRIVATE READ-ONLY FIELDS - USERSCONTROLLER, MOCK OF IUSERSERVICE, MOCK OF IMAPPER
        private readonly UsersController _controller;
        private readonly Mock<IUserService> _mockUserService;
        private readonly Mock<IMapper> _mockMapper;

        // CONSTRUCTOR - INITIALIZES MOCKS AND CREATES AN INSTANCE WITH THESE MOCKS
        public UsersControllerTests()
        {
            _mockUserService = new Mock<IUserService>(); // INITIALIZES MOCK IUSERSERVICE
            _mockMapper = new Mock<IMapper>(); // INITIALIZES MOCK IMAPPER
            _controller = new UsersController(_mockUserService.Object, _mockMapper.Object); // CREATES AN INSTANCE OF USERSCONTROLLER, INJECTING MOCKED SERVICES
        }

        // TEST TO VERIFY THAT "GETALLUSERS" METHOD RETURNS ALL USERS WHEN CALLED
        [Fact]
        public async Task GetAllUsers_WhenCalled_ReturnsAllUsers()
        {
            // ARRANGE - PREPARE MOCK USER SERVICE TO RETURN A LIST OF USERS AND MAPPER TO CONVERT TO DTOs
            var users = new List<User>
            {
                new User { UserId = 1, Username = "User1", Email = "user1@example.com", PasswordHash = new byte[0], PasswordSalt = new byte[0] },
                new User { UserId = 2, Username = "User2", Email = "user2@example.com", PasswordHash = new byte[0], PasswordSalt = new byte[0] }
            };
            var userDtos = new List<UserDto>
            {
                new UserDto { UserId = 1, Username = "User1", Email = "user1@example.com" },
                new UserDto { UserId = 2, Username = "User2", Email = "user2@example.com" }
            };

            _mockUserService.Setup(s => s.GetAllUsers()).ReturnsAsync(users);
            _mockMapper.Setup(m => m.Map<IEnumerable<UserDto>>(users)).Returns(userDtos);

            // ACT - CALL "GETALLUSERS" METHOD
            var result = await _controller.GetAllUsers();

            // ASSERT - VERIFY THAT METHOD RETURNS AN OKOBJECTRESULT WITH ALL USER DTOs
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<UserDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        // TEST TO VERIFY THAT "GETUSERBYID" RETURNS CORRECT USER WHEN USER EXISTS
        [Fact]
        public async Task GetUserById_WhenUserExists_ReturnsUser()
        {
            // ARRANGE - PREPARE MOCK USER SERVICE AND MAPPER TO RETURN A SPECIFIC USER DTO.
            var user = new User { UserId = 1, Username = "User1", Email = "user1@example.com", PasswordHash = new byte[0], PasswordSalt = new byte[0] };
            var userDto = new UserDto { UserId = 1, Username = "User1", Email = "user1@example.com" };

            _mockMapper.Setup(m => m.Map<User>(It.IsAny<UserDto>())).Returns(new User());
            _mockUserService.Setup(s => s.GetUserById(1)).ReturnsAsync(Result<User>.Success(user));
            _mockMapper.Setup(m => m.Map<UserDto>(user)).Returns(userDto);

            // ACT - CALL "GETUSERBYID" METHOD WITH A VALID USER ID.
            var result = await _controller.GetUserById(1);

            // ASSERT - VERIFY THAT METHOD RETURNS AN OKOBJECTRESULT WITH EXPECTED USER DTO.
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<UserDto>(okResult.Value);
            Assert.Equal("User1", returnValue.Username);
        }

        // TEST TO VERIFY THAT "CREATEUSER" METHOD RETURNS CREATEDATACTIONRESULT WHEN CALLED WITH VALID DATA.
        [Fact]
        public async Task CreateUser_WhenCalled_ReturnsCreatedAtActionResult()
        {
            // ARRANGE - PREPARE MOCK MAPPER AND USER SERVICE TO SIMULATE USER CREATION.
            var userDto = new UserDto { Username = "NewUser", Email = "newuser@example.com", Password = "password" };

            _mockMapper.Setup(m => m.Map<User>(It.IsAny<UserDto>())).Returns(new User());
            _mockUserService.Setup(s => s.CreateUser(It.IsAny<User>(), It.IsAny<string>()))
                            .ReturnsAsync(Result<User>.Success(new User()));
            _mockMapper.Setup(m => m.Map<UserDto>(It.IsAny<User>())).Returns(userDto);

            // ACT - CALL "CREATEUSER" METHOD TO CREATE A NEW USER.
            var result = await _controller.CreateUser(userDto);

            // ASSERT - VERIFY THAT METHOD RETURNS A CREATEDATACTIONRESULT POINTING TO "GETUSERBYID".
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal("GetUserById", createdAtActionResult.ActionName);
            var returnValue = Assert.IsType<UserDto>(createdAtActionResult.Value);
            Assert.Equal("NewUser", returnValue.Username);
        }

        // TEST TO VERIFY THAT "UPDATEUSER" METHOD RETURNS OKOBJECTRESULT WHEN CALLED WITH VALID DATA.
        [Fact]
        public async Task UpdateUser_WhenCalled_ReturnsOkObjectResult()
        {
            // ARRANGE - SETUP MOCK SERVICES AND MAPPER FOR USER UPDATE OPERATION.
            _mockUserService.Setup(x => x.GetUserById(3)).ReturnsAsync(Result<User>.Success(new User { Username = "NewUser", Email = "newuser@example.com", PasswordHash = new byte[0], PasswordSalt = new byte[0] }));
            _mockUserService.Setup(x => x.UpdateUser(3, It.IsAny<User>())).ReturnsAsync(Result<User>.Success(new User { UserId = 3, Username = "NewUser", Email = "newuser@example.com", PasswordHash = new byte[0], PasswordSalt = new byte[0] }));
            _mockMapper.Setup(x => x.Map<User>(It.IsAny<UserUpdateDto>()));
            _mockMapper.Setup(x => x.Map<UserDto>(It.IsAny<User>())).Returns(new UserDto { UserId = 3, Username = "NewUser", Email = "newuser@example.com", Password = "password" });

            // ACT - CALL "UPDATEUSER" METHOD TO UPDATE A USER.
            var result = await _controller.UpdateUser(3, new UserUpdateDto());

            // ASSERT - VERIFY THAT METHOD RETURNS AN OKOBJECTRESULT WITH UPDATED USER DTO.
            var okObjectResult = Assert.IsType<OkObjectResult>(result);
            var resultValue = Assert.IsType<UserDto>(okObjectResult.Value);
            Assert.NotNull(resultValue);
        }

        // TEST TO VERIFY THAT "DELETEUSER" METHOD RETURNS NOCONTENTRESULT WHEN CALLED WITH A VALID USER ID.
        [Fact]
        public async Task DeleteUser_WhenCalled_ReturnsNoContentResult()
        {
            // ARRANGE - SETUP MOCK USER SERVICE TO SIMULATE USER DELETION.
            _mockUserService.Setup(s => s.DeleteUser(1)).ReturnsAsync(true);

            // ACT - CALL "DELETEUSER" METHOD TO DELETE A USER.
            var result = await _controller.DeleteUser(1);

            // ASSERT - VERIFY THAT METHOD RETURNS A NOCONTENTRESULT INDICATING SUCCESSFUL DELETION.
            Assert.IsType<NoContentResult>(result);
        }

        // TEST TO VERIFY THAT "CREATEUSER" METHOD RETURNS BADREQUESTRESULT WHEN USER CREATION FAILS.
        [Fact]
        public async Task CreateUser_CreationFails_ReturnsBadRequest()
        {
            // ARRANGE - SETUP MOCK SERVICES AND MAPPER FOR USER CREATION FAILURE.
            var userDto = new UserDto { Username = "NewUser", Email = "newuser@example.com", Password = "password" };
            _mockMapper.Setup(m => m.Map<User>(It.IsAny<UserDto>())).Returns(new User());
            _mockUserService.Setup(s => s.CreateUser(It.IsAny<User>(), It.IsAny<string>()))
                .ReturnsAsync(Result<User>.Failure("User creation failed"));

            // ACT - CALL "CREATEUSER" METHOD TO CREATE A NEW USER.
            var result = await _controller.CreateUser(userDto);

            // ASSERT - VERIFY THAT METHOD RETURNS A BADREQUESTRESULT WITH ERROR MESSAGE.
            Assert.IsType<BadRequestObjectResult>(result);
        }

        // TEST TO VERIFY THAT "GETUSERBYID" RETURNS NOTFOUNDRESULT WHEN CALLED WITH A NON-EXISTENT USER ID.
        [Fact]
        public async Task GetUserById_NonExistentId_ReturnsNotFoundResult()
        {
            // ARRANGE - SETUP MOCK USER SERVICE TO RETURN FAILURE WHEN USER DOES NOT EXIST.
            int nonExistentUserId = 999;
            _mockUserService.Setup(s => s.GetUserById(nonExistentUserId))
                            .ReturnsAsync(Result<User>.Failure("User not found"));

            // ACT - CALL "GETUSERBYID" METHOD WITH A NON-EXISTENT USER ID.
            var result = await _controller.GetUserById(nonExistentUserId);

            // ASSERT - VERIFY THAT METHOD RETURNS A NOTFOUNDRESULT WITH ERROR MESSAGE.
            Assert.IsType<NotFoundObjectResult>(result);
        }

        // TEST TO VERIFY THAT "UPDATEUSER" RETURNS NOTFOUNDRESULT WHEN CALLED WITH A NON-EXISTENT USER ID.
        [Fact]
        public async Task UpdateUser_NonExistingId_ReturnsNotFoundResult()
        {
            // ARRANGE - SETUP MOCK USER SERVICE TO RETURN FAILURE WHEN USER DOES NOT EXIST.
            int nonExistingUserId = 999;
            var userUpdateDto = new UserUpdateDto { Username = "UpdatedUser", Email = "updateduser@example.com" };
            _mockUserService.Setup(s => s.GetUserById(nonExistingUserId))
                            .ReturnsAsync(Result<User>.Failure("User not found"));

            // ACT - CALL "UPDATEUSER" METHOD WITH A NON-EXISTENT USER ID.
            var result = await _controller.UpdateUser(nonExistingUserId, userUpdateDto);

            // ASSERT - VERIFY THAT METHOD RETURNS A NOTFOUNDRESULT WITH ERROR MESSAGE.
            Assert.IsType<NotFoundObjectResult>(result);
        }

        // TEST TO VERIFY THAT "UPDATEUSER" RETURNS BADREQUESTRESULT WHEN USER UPDATE FAILS.
        [Fact]
        public async Task UpdateUser_UpdateFails_ReturnsBadRequestResult()
        {
            // ARRANGE - SETUP MOCK USER SERVICE TO RETURN FAILURE WHEN USER UPDATE FAILS.
            int existingUserId = 1;
            var userUpdateDto = new UserUpdateDto { Username = "UpdatedUserFail", Email = "updateduserfail@example.com" };
            _mockUserService.Setup(s => s.GetUserById(existingUserId))
                            .ReturnsAsync(Result<User>.Success(new User()));
            _mockUserService.Setup(s => s.UpdateUser(existingUserId, It.IsAny<User>()))
                            .ReturnsAsync(Result<User>.Failure("Error updating user."));

            // ACT - CALL "UPDATEUSER" METHOD TO UPDATE AN EXISTING USER.
            var result = await _controller.UpdateUser(existingUserId, userUpdateDto);

            // ASERT - VERIFY THAT METHOD RETURNS A BADREQUESTRESULT WITH ERROR MESSAGE.
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
            Assert.Equal("Error updating user.", badRequestResult.Value.ToString());
        }

        // TEST TO VERIFY THAT "CREATEUSER" RETURNS BADREQUESTRESULT WHEN CALLED WITH INVALID DATA.
        [Fact]
        public async Task CreateUser_InvalidData_ReturnsBadRequestResult()
        {
            // ARRANGE - SETUP MOCK SERVICES AND MAPPER FOR USER CREATION WITH INVALID DATA.
            var userDto = new UserDto
            {
                Username = "InvalidUser",
                Email = "invalidemail",
                Password = "pw"
            };

            // ACT - CALL "CREATEUSER" METHOD TO CREATE A NEW USER WITH INVALID DATA.
            _mockMapper.Setup(m => m.Map<User>(It.IsAny<UserDto>())).Returns(new User());
            _mockUserService.Setup(s => s.CreateUser(It.IsAny<User>(), It.IsAny<string>()))
                            .ReturnsAsync(Result<User>.Failure("User creation error"));
            var result = await _controller.CreateUser(userDto);

            // ASSERT - VERIFY THAT METHOD RETURNS A BADREQUESTRESULT WITH ERROR MESSAGE.
            Assert.IsType<BadRequestObjectResult>(result);
        }

        // TEST TO VERIFY THAT "DELETEUSER" RETURNS NOTFOUNDRESULT WHEN CALLED WITH A NON-EXISTENT USER ID
        [Fact]
        public async Task DeleteUser_NonExistingId_ReturnsNotFoundResult()
        {
            // ARRANGE - SETUP MOCK USER SERVICE TO RETURN FALSE WHEN USER DELETION FAILS
            int nonExistingUserId = 999;
            _mockUserService.Setup(s => s.DeleteUser(nonExistingUserId))
                            .ReturnsAsync(false);

            // ACT - CALL "DELETEUSER" METHOD TO DELETE A NON-EXISTENT USER
            var result = await _controller.DeleteUser(nonExistingUserId);

            // ASSERT - VERIFY THAT METHOD RETURNS A NOTFOUNDRESULT
            Assert.IsType<NotFoundResult>(result);
        }

    }
}
