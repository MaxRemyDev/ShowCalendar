using Backend.Helpers;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<Result<User>> GetUserById(int id);
        Task<Result<User>> CreateUser(User user, string password);
        Task<Result<User>> UpdateUser(int id, User user);
        Task<bool> DeleteUser(int id);
    }
}
