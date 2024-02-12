using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IEnvironmentService
    {
        string GetJwtSecret();
    }
}
