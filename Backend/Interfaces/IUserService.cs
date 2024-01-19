using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUserById(int id);
        Task<User> CreateUser(User user);
        Task<User> UpdateUser(int id, User user);
        Task<bool> DeleteUser(int id);
    }
}
