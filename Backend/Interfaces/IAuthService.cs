using Backend.Helpers;
using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IAuthService
    {
        Task<Result<User>> Register(User user, string password);
        Task<Result<User>> Login(string username, string password);
        string GenerateJwtToken(User user);
        Task<string> GenerateRefreshToken(User user);
        Task<Result<string>> RefreshJwtToken(string refreshToken);
        Task<Result<User>> Logout(int userId);
    }
}
