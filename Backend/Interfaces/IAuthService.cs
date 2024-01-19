using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IAuthService
    {
        Task<User> Register(User user, string password);
        Task<User> Login(string username, string password);
    }
}
