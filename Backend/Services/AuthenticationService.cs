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

namespace Backend.Services
{
    // SERVICE FOR AUTHENTICATION PROCESSES (REGISTER, LOGIN)
    public class AuthenticationService : IAuthService
    {
        // DATABASE CONTEXT FOR ACCESSING DATABASE VIA ENTITY FRAMEWORK
        private readonly ApplicationDbContext _context;
        private readonly IEnvironmentService _environmentService;

        // CONSTRUCTOR FOR INITIALIZING DATABASE CONTEXT VIA DEPENDENCY INJECTION
        public AuthenticationService(ApplicationDbContext context, IEnvironmentService environmentService)
        {
            _context = context;
            _environmentService = environmentService;
        }

        // GENERATE A JWT TOKEN FOR A USER
        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var keyString = _environmentService.GetJwtSecret();
            var key = Encoding.ASCII.GetBytes(keyString);
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

        // GENERATE A REFRESH TOKEN FOR A USER
        public string RefreshJwtToken(User user)
        {
            //TODO: ADD A CHECK IF USER STILL HAS RIGHT TO LOGIN
            return GenerateJwtToken(user);
        }

        // REGISTER A NEW USER WITH USERNAME AND PASSWORD (POST)
        public async Task<Result<User>> Register(User user, string password)
        {
            if (await UserExists(user.Username))
            {
                throw new InvalidOperationException("User already exists.");
            }

            // CREATING PASSWORD HASH AND SALT FOR STORING IN DATABASE
            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return Result<User>.Success(user);
        }

        // LOGIN A USER WITH USERNAME AND PASSWORD (POST)
        public async Task<Result<User>> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username);
            if (user == null || !VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                throw new AuthenticationException("Username or password is incorrect.");
            }

            // UPDATE LASTLOGIN FIELD WITH CURRENT DATE AND TIME
            user.LastLogin = DateTime.UtcNow;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Result<User>.Success(user);
        }

        // CREATE HASH AND SALT FOR A PASSWORD TO BE STORED IN DATABASE
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        // VERIFY IF PROVIDED PASSWORD MATCHES STORED HASH AND SALT IN DATABASE
        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
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

        // CHECK IF A USER WITH A GIVEN USERNAME EXISTS IN DATABASE
        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.Username == username);
        }
    }

    public class AuthenticationException : Exception
    {
        public AuthenticationException(string message) : base(message)
        {
        }
    }
}
