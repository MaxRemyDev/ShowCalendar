using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Interfaces;
using Backend.Dtos;
using Backend.Models;
using AutoMapper;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    // CONTROLLER FOR MANAGING USERS (GET, POST, PUT, DELETE)
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] //! UNCOMMENT THIS LINE TO REQUIRE AUTHENTICATION FOR ALL ROUTES IN THIS CONTROLLER OR COMMENT THIS LINE TO ALLOW ANONYMOUS ACCESS TO ALL ROUTES IN THIS CONTROLLER
    public class UsersController : ControllerBase
    {
        // DEPENDENCY INJECTION FOR USER SERVICE AND AUTOMAPPER
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        // CONSTRUCTOR INITIALIZING DEPENDENCIES
        public UsersController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        // GET ALL USERS (GET)
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();
            var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);
            return Ok(userDtos);
        }

        // GET USER BY ID (GET)
        [HttpGet("{id}", Name = "GetUserById")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var result = await _userService.GetUserById(id);
            if (!result.IsSuccess)
            {
                return NotFound(new { message = "User not found" });
            }

            var userDto = _mapper.Map<UserDto>(result.Value);
            return Ok(userDto);
        }

        // CREATE A NEW USER (POST)
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            var result = await _userService.CreateUser(user, userDto.Password);

            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }

            var newUserDto = _mapper.Map<UserDto>(result.Value);
            return CreatedAtAction(nameof(GetUserById), new { id = newUserDto.UserId }, newUserDto);
        }

        // UPDATE AN EXISTING USER BY ID (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDto userUpdateDto)
        {
            var resultGetUser = await _userService.GetUserById(id);
            if (!resultGetUser.IsSuccess)
            {
                return NotFound(resultGetUser.Error);
            }

            var userToUpdate = resultGetUser.Value;
            if (userToUpdate == null)
            {
                return NotFound();
            }

            _mapper.Map(userUpdateDto, userToUpdate);

            var resultUpdateUser = await _userService.UpdateUser(id, userToUpdate);
            if (!resultUpdateUser.IsSuccess)
            {
                return BadRequest(resultUpdateUser.Error);
            }

            var updatedUserDto = _mapper.Map<UserDto>(resultUpdateUser.Value);
            return Ok(updatedUserDto);
        }

        // DELETE A USER BY ID (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            bool deleted = await _userService.DeleteUser(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
