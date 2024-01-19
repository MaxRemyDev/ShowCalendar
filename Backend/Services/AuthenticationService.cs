using Backend.Data;
using Backend.Interfaces;
using Backend.Models;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Services
{
    // SERVICE FOR AUTHENTICATION PROCESSES (REGISTER, LOGIN)
    public class AuthenticationService : IAuthService
    {
        // DATABASE CONTEXT FOR ACCESSING DATABASE VIA ENTITY FRAMEWORK
        private readonly ApplicationDbContext _context;

        // CONSTRUCTOR FOR INITIALIZING DATABASE CONTEXT VIA DEPENDENCY INJECTION
        public AuthenticationService(ApplicationDbContext context)
        {
            _context = context;
        }

        // REGISTER A NEW USER WITH USERNAME AND PASSWORD (POST)
        public async Task<User> Register(User user, string password)
        {
            if (await UserExists(user.Username))
            {
                throw new Exception("User already exists.");
            }

            // CREATING PASSWORD HASH AND SALT FOR STORING IN DATABASE
            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        // LOGIN A USER WITH USERNAME AND PASSWORD (POST)
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username);
            if (user == null || !VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                throw new Exception("Username or password is incorrect.");
            }

            return user ?? throw new KeyNotFoundException("User not found");
        }

        // CREATE HASH AND SALT FOR A PASSWORD TO BE STORED IN DATABASE
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        // VERIFY IF PROVIDED PASSWORD MATCHES STORED HASH AND SALT IN DATABASE
        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
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
}
