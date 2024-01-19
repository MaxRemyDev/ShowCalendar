using Backend.Interfaces;
using Backend.Models;
using Backend.Data;
using Backend.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Backend.Services
{
    // SERVICE CLASS FOR MANAGING USERS (GET, POST, PUT, DELETE)
    public class UserService : IUserService
    {
        // DATABASE CONTEXT FOR ACCESSING DATABASE VIA ENTITY FRAMEWORK
        private readonly ApplicationDbContext _context;

        // CONSTRUCTOR FOR INITIALIZING DATABASE CONTEXT VIA DEPENDENCY INJECTION
        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET ALL USERS FROM DATABASE (FOR TESTING PURPOSES)
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET A SPECIFIC USER BY ID FROM DATABASE
        public async Task<User> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user ?? throw new KeyNotFoundException("User not found");
        }

        // CREATE A NEW USER AND SAVE TO DATABASE (POST)
        public async Task<User> CreateUser(User user, string password)
        {
            if (await UserExists(user.Username))
            {
                throw new ArgumentException("Username already exists");
            }

            using var hmac = new HMACSHA512();

            user.PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            user.PasswordSalt = hmac.Key;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        // CHECK IF A USER EXISTS IN DATABASE
        public async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.Username == username);
        }

        // UPDATE AN EXISTING USER IN DATABASE (PUT)
        public async Task<User> UpdateUser(int id, User user)
        {
            var userToUpdate = await _context.Users.FindAsync(id);
            if (userToUpdate == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            // UPDATING USER DETAILS WITH UPDATED USER DETAILS
            userToUpdate.Username = user.Username;
            userToUpdate.Email = user.Email;

            _context.Entry(userToUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return userToUpdate;
        }

        // DELETE A USER FROM DATABASE (DELETE)
        public async Task<bool> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
