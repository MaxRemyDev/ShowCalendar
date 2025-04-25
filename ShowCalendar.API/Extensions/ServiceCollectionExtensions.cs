using ShowCalendar.API.Interfaces;
using ShowCalendar.API.Models;
using ShowCalendar.API.Services;

namespace ShowCalendar.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        // ADD GOOGLE CALENDAR SERVICES
        public static IServiceCollection AddGoogleCalendarServices(this IServiceCollection services, IConfiguration configuration)
        {
            // CONFIGURE GOOGLE CALENDAR CONFIG FROM ENVIRONMENT VARIABLES
            services.Configure<GoogleCalendarConfig>(config =>
                    {
                        config.ClientId = Environment.GetEnvironmentVariable("GCP_CLIENT_ID") ?? string.Empty;
                        config.ClientSecret = Environment.GetEnvironmentVariable("GCP_CLIENT_SECRET") ?? string.Empty;
                        config.ApplicationName = Environment.GetEnvironmentVariable("GCP_APPLICATION_NAME") ?? string.Empty;
                        config.RefreshToken = Environment.GetEnvironmentVariable("GCP_REFRESH_TOKEN") ?? string.Empty;
                        config.Scopes = new[] { "https://www.googleapis.com/auth/calendar.readonly" };
                    });

            // REGISTER GOOGLE CALENDAR SERVICE
            services.AddScoped<ICalendarService, GoogleCalendarService>(); 

            return services;
        }
    }
}
