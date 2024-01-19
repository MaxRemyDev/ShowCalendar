using Backend.Interfaces;
using Backend.Models;
using Backend.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

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
        public async Task<User> CreateUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
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
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
