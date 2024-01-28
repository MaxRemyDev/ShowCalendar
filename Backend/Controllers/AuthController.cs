using Microsoft.AspNetCore.Mvc;
using Backend.Interfaces;
using Backend.Dtos;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Models;

namespace Backend.Controllers
{
    // CONTROLLER FOR AUTHENTICATION PROCESSES (REGISTER, LOGIN)
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        // DEPENDENCY INJECTION FOR AUTHENTICATION SERVICE AND AUTOMAPPER
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        // CONSTRUCTOR INITIALIZING DEPENDENCIES
        public AuthController(IAuthService authService, IMapper mapper)
        {
            _authService = authService;
            _mapper = mapper;
        }

        // USER REGISTRATION (POST)
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationDto registrationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userToCreate = _mapper.Map<User>(registrationDto);

            var createdUser = await _authService.Register(userToCreate, registrationDto.Password);
            if (createdUser == null)
                return BadRequest("User could not be created");

            var userToReturn = _mapper.Map<UserDto>(createdUser);
            return CreatedAtRoute("GetUserById", new { id = userToReturn.UserId }, userToReturn);
        }

        // USER LOGIN (POST)
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto loginDto)
        {
            var userFromService = await _authService.Login(loginDto.Username, loginDto.Password);
            if (userFromService == null)
                return Unauthorized("Invalid username or password");

            var token = _authService.GenerateJwtToken(userFromService);
            return Ok(new { token = token });
        }
    }
}
