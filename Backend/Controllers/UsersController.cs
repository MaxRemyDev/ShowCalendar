using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Interfaces;
using Backend.Dtos;
using Backend.Models;
using AutoMapper;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Backend.Controllers
{
    // CONTROLLER FOR MANAGING USERS (GET, POST, PUT, DELETE)
    [ApiController]
    [Route("api/[controller]")]
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
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null) return NotFound();

            var userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        // CREATE A NEW USER (POST)
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            var newUser = await _userService.CreateUser(user);
            if (newUser == null) return BadRequest("User creation failed");

            var newUserDto = _mapper.Map<UserDto>(newUser);
            return CreatedAtAction(nameof(GetUserById), new { id = newUserDto.UserId }, newUserDto);
        }

        // UPDATE AN EXISTING USER BY ID (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDto userDto)
        {
            var userToUpdate = await _userService.GetUserById(id);
            if (userToUpdate == null) return NotFound();

            _mapper.Map(userDto, userToUpdate);
            var updatedUser = await _userService.UpdateUser(id, userToUpdate);
            if (updatedUser == null) return BadRequest("User update failed");

            var updatedUserDto = _mapper.Map<UserDto>(updatedUser);
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
