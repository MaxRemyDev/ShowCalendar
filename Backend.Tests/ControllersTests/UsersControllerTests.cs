using AutoMapper;
using Backend.Controllers;
using Backend.Dtos;
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

            _mockUserService.Setup(s => s.GetUserById(1)).ReturnsAsync(user);
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
            var user = new User { UserId = 3, Username = "NewUser", Email = "newuser@example.com", PasswordHash = new byte[0], PasswordSalt = new byte[0] };

            _mockMapper.Setup(m => m.Map<User>(It.IsAny<UserDto>())).Returns(user);
            _mockUserService.Setup(s => s.CreateUser(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(user);
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
            _mockUserService.Setup(x => x.GetUserById(3)).ReturnsAsync(new User { Username = "NewUser", Email = "newuser@example.com", PasswordHash = new byte[0], PasswordSalt = new byte[0] });
            _mockUserService.Setup(x => x.UpdateUser(3, It.IsAny<User>())).ReturnsAsync(new User { UserId = 3, Username = "NewUser", Email = "newuser@example.com", PasswordHash = new byte[0], PasswordSalt = new byte[0] });
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

        // TODO: ADD A TEST TO CHECK RESPONSE WHEN USER CREATION FAILS.
        // TODO: ADD A TEST TO CHECK NOTFOUND RESPONSE WHEN GETUSERBYID IS CALLED WITH A NON-EXISTENT ID.
        // TODO: ADD A TEST TO CHECK NOTFOUND RESPONSE WHEN UPDATEUSER IS CALLED WITH A NON-EXISTING ID.
        // TODO: ADD A TEST TO CHECK BADREQUEST RESPONSE WHEN USER UPDATE FAILS.
        // TODO: ADD TEST TO CHECK BADREQUEST RESPONSE WHEN CREATING USER WITH INVALID DATA.
        // TODO: ADD A TEST TO CHECK NOTFOUND RESPONSE WHEN DELETEUSER IS CALLED WITH A NON-EXISTENT ID.
    }
}
