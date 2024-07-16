using Backend.Data;
using Backend.Interfaces;
using Backend.Models;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Backend.Helpers;
using Microsoft.Extensions.Logging;

namespace Backend.Services
{
    // SERVICE FOR AUTHENTICATION PROCESSES (REGISTER, LOGIN)
    public class AuthenticationService : IAuthService
    {
        // DATABASE CONTEXT FOR ACCESSING DATABASE VIA ENTITY FRAMEWORK
        private readonly ApplicationDbContext _context;
        private readonly IEnvironmentService _environmentService;
        private readonly ILogger<AuthenticationService> _logger;

        public AuthenticationService(ApplicationDbContext context, IEnvironmentService environmentService, ILogger<AuthenticationService> logger)
        {
            _context = context;
            _environmentService = environmentService;
            _logger = logger;
        }

        // GENERATE A JWT TOKEN FOR A USER
        public string GenerateJwtToken(User user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_environmentService.GetJwtSecret());
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddHours(1), // EXPIRATION OF TOKEN (1 HOUR)
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // VALIDATE JWT TOKEN FOR A USER
        public User ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_environmentService.GetJwtSecret());
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userId = int.Parse(jwtToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);

            return _context.Users.SingleOrDefault(u => u.UserId == userId) ?? throw new AuthenticationException("User not found");
        }

        // GENERATE A REFRESH TOKEN FOR A USER
        public async Task<string> GenerateRefreshToken(User user)
        {
            _logger.LogInformation("Generating refresh token for user {UserId}", user.UserId);
            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Refresh token generated successfully for user {UserId}", user.UserId);
            return refreshToken;
        }

        // REFRESH JWT TOKEN FOR A USER
        public async Task<Result<string>> RefreshJwtToken(string refreshToken)
        {
            // CHECK IF REFRESH TOKEN IS VALID
            _logger.LogInformation("Refreshing JWT token using refresh token");
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken && u.RefreshTokenExpiryTime > DateTime.UtcNow);
            if (user == null)
            {
                _logger.LogWarning("Invalid or expired refresh token");
                return Result<string>.Failure("Invalid or expired refresh token");
            }

            // GENERATE NEW JWT TOKEN FOR USER
            var newToken = GenerateJwtToken(user);
            _logger.LogInformation("JWT token refreshed successfully for user {UserId}", user.UserId);
            return Result<string>.Success(newToken);
        }

        // REGISTER A NEW USER
        public async Task<Result<User>> Register(User user, string password)
        {

            _logger.LogInformation("Registering new user {Username}", user.Username);
            var errors = new List<string>();

            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
            {
                errors.Add("Username already exists.");
                _logger.LogWarning("Username {Username} already exists", user.Username);
            }

            // IF EMAIL ALREADY EXISTS RETURN LOGGING ERROR
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                errors.Add("Email already exists.");
                _logger.LogWarning("Email {Email} already exists", user.Email);
            }

            // IF THERE ARE ERRORS RETURN FAILURE
            if (errors.Any())
            {
                return Result<User>.Failure(string.Join("; ", errors));
            }

            // CREATING PASSWORD HASH AND SALT FOR STORING IN DATABASE
            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("User {Username} registered successfully", user.Username);
            return Result<User>.Success(user);
        }

        // LOGIN A USER WITH USERNAME AND PASSWORD (POST)
        public async Task<Result<User>> Login(string username, string password)
        {
            // CHECK IF USERNAME EXISTS
            _logger.LogInformation("User {Username} attempting to log in", username);
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username);
            if (user == null)
            {
                _logger.LogWarning("Login failed for user {Username} - username does not exist", username);
                return Result<User>.Failure("Username does not exist.");
            }

            // CHECK IF PASSWORD MATCHES
            if (!VerifyPasswordHashInternal(password, user.PasswordHash, user.PasswordSalt))
            {
                _logger.LogWarning("Login failed for user {Username} - incorrect password", username);
                return Result<User>.Failure("Incorrect password.");
            }

            // UPDATE LAST LOGIN TIME
            user.LastLogin = DateTime.UtcNow;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _logger.LogInformation("User {Username} logged in successfully", username);
            return Result<User>.Success(user);
        }

        // VERIFY IF PASSWORD MATCHES HASH AND SALT
        private static bool VerifyPasswordHashInternal(string password, byte[] storedHash, byte[] storedSalt)
        {
            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }
            return true;
        }

        // CREATE PASSWORD HASH AND SALT
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        // LOGOUT A USER
        public async Task<Result<User>> Logout(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return Result<User>.Failure("User not found.");
            }

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;

            _context.Users.Update(user);

            // UPDATE LAST LOGOUT TIME
            user.LastLogout = DateTime.UtcNow;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _logger.LogInformation("User {UserId} logged out successfully", userId);
            return Result<User>.Success(user);
        }
    }

    public class AuthenticationException : Exception
    {
        public AuthenticationException(string message) : base(message)
        {
        }
    }
}
