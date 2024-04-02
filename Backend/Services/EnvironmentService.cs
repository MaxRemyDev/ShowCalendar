using Backend.Interfaces;

namespace Backend.Services
{
    public class EnvironmentService : IEnvironmentService
    {
        public string GetJwtSecret()
        {
            var secret = Environment.GetEnvironmentVariable("JWT_SECRET");
            if (string.IsNullOrEmpty(secret))
            {
                throw new InvalidOperationException("JWT Secret is not set in environment variables");
            }
            return secret;
        }

    }
}