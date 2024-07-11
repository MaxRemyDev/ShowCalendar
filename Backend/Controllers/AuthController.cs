using Microsoft.AspNetCore.Mvc;
using Backend.Interfaces;
using Backend.Dtos;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Models;
using Backend.Dtos.Responses;
using Microsoft.Extensions.Logging;
using System.Dynamic;

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
        private readonly ILogger<AuthController> _logger;

        // CONSTRUCTOR INITIALIZING DEPENDENCIES
        public AuthController(IAuthService authService, IMapper mapper, ILogger<AuthController> logger)
        {
            _authService = authService;
            _mapper = mapper;
            _logger = logger;
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

            if (userToCreate == null)
            {
                return BadRequest("User information is invalid.");
            }

            var result = await _authService.Register(userToCreate, registrationDto.Password);
            if (!result.IsSuccess || result.Value == null)
            {
                return BadRequest(result.Error);
            }

            var userToReturn = _mapper.Map<UserDto>(result.Value);
            if (userToReturn == null)
            {
                return BadRequest("Failed to map the created user.");
            }

            var token = _authService.GenerateJwtToken(result.Value) ?? string.Empty;
            var refreshToken = await _authService.GenerateRefreshToken(result.Value) ?? string.Empty;

            return Ok(new RegisterResponse
            {
                User = userToReturn,
                Token = token,
                RefreshToken = refreshToken
            });
        }

        // USER LOGIN (POST)
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto loginDto)
        {
            _logger.LogInformation("Login attempt for username: {Username}", loginDto.Username);

            var userFromService = await _authService.Login(loginDto.Username, loginDto.Password);
            if (!userFromService.IsSuccess || userFromService.Value == null)
            {
                _logger.LogWarning("Login failed for username: {Username}", loginDto.Username);
                return Unauthorized(userFromService.Error);
            }

            var token = _authService.GenerateJwtToken(userFromService.Value) ?? string.Empty;
            var refreshToken = await _authService.GenerateRefreshToken(userFromService.Value) ?? string.Empty;

            return Ok(new LoginResponse
            {
                User = _mapper.Map<UserDto>(userFromService.Value),
                Token = token,
                RefreshToken = refreshToken
            });
        }

        // USER LOGOUT (POST)
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] UserLogoutDto userLogoutDto)
        {
            var result = await _authService.Logout(userLogoutDto.UserId);
            if (!result.IsSuccess)
            {
                return BadRequest(new { error = result.Error });
            }

            dynamic response = new ExpandoObject();
            response.message = "Logout successful";
            return Ok(response);
        }


        // REFRESH JWT TOKEN (POST)
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
            try
            {
                var newTokenResult = await _authService.RefreshJwtToken(refreshToken);
                if (newTokenResult == null || !newTokenResult.IsSuccess || newTokenResult.Value == null)
                {
                    return Unauthorized(newTokenResult?.Error ?? "Token refresh failed.");
                }

                return Ok(new LoginResponse { Token = newTokenResult.Value, RefreshToken = refreshToken });
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }
}
