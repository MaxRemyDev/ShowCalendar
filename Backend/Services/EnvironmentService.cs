using Backend.Interfaces;

namespace Backend.Services
{
    public class EnvironmentService : IEnvironmentService
    {
        public string GetJwtSecret()
        {
            return Environment.GetEnvironmentVariable("JWT_SECRET") ?? throw new InvalidOperationException("JWT Secret is not set in environment variables");
        }
    }
}