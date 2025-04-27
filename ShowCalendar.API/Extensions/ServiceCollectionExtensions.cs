using ShowCalendar.API.Interfaces;
using ShowCalendar.API.Models;
using ShowCalendar.API.Models.Providers.Google;
using ShowCalendar.API.Models.Providers.Apple;
using ShowCalendar.API.Models.Providers.Microsoft;
using ShowCalendar.API.Services.Providers.Google;
using ShowCalendar.API.Services.Providers.Apple;
using ShowCalendar.API.Services.Providers.Microsoft;
using ShowCalendar.API.Services.Common;

namespace ShowCalendar.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        // ADD CALENDAR SERVICES
        public static IServiceCollection AddCalendarServices(this IServiceCollection services, IConfiguration configuration)
        {
            // BIND CALENDAR PROVIDERS CONFIGURATION
            services.Configure<CalendarProvidersConfig>(configuration.GetSection("CalendarProviders"));
            
            // CONFIGURE PROVIDER SETTINGS
            ConfigureProviderSettings(services, configuration);

            // REGISTER ALL CALENDAR SERVICES
            RegisterCalendarServices(services);

            // REGISTER FACTORY
            services.AddScoped<CalendarServiceFactory>();

            return services;
        }

        private static void ConfigureProviderSettings(IServiceCollection services, IConfiguration configuration)
        {
            // CONFIGURE GOOGLE CALENDAR
            services.Configure<GoogleCalendarConfig>(config =>
            {
                // LOAD FROM ENVIRONMENT VARIABLES OR CONFIG
                config.ClientId = Environment.GetEnvironmentVariable("GCP_CLIENT_ID") ?? string.Empty;
                config.ClientSecret = Environment.GetEnvironmentVariable("GCP_CLIENT_SECRET") ?? string.Empty;
                config.ApplicationName = Environment.GetEnvironmentVariable("GCP_APPLICATION_NAME") ?? string.Empty;
                config.RefreshToken = Environment.GetEnvironmentVariable("GCP_REFRESH_TOKEN") ?? string.Empty;
                config.Scopes = new[] { "https://www.googleapis.com/auth/calendar.readonly" };
                
                // ENABLED STATE FROM CONFIG OR ENVIRONMENT VARIABLE
                var enabledFromConfig = configuration.GetValue<bool?>("CalendarProviders:Google:Enabled");
                var enabledFromEnv = Environment.GetEnvironmentVariable("GCP_ENABLED");
                config.Enabled = enabledFromConfig ?? 
                    (enabledFromEnv != null ? bool.Parse(enabledFromEnv) : true);
            });

            // CONFIGURE APPLE CALENDAR
            services.Configure<AppleCalendarConfig>(config =>
            {
                // LOAD FROM ENVIRONMENT VARIABLES OR CONFIG
                config.ClientId = Environment.GetEnvironmentVariable("APPLE_CLIENT_ID") ?? string.Empty;
                config.ClientSecret = Environment.GetEnvironmentVariable("APPLE_CLIENT_SECRET") ?? string.Empty;
                config.RefreshToken = Environment.GetEnvironmentVariable("APPLE_REFRESH_TOKEN") ?? string.Empty;
                
                // ENABLED STATE FROM CONFIG OR ENVIRONMENT VARIABLE
                var enabledFromConfig = configuration.GetValue<bool?>("CalendarProviders:Apple:Enabled");
                var enabledFromEnv = Environment.GetEnvironmentVariable("APPLE_ENABLED");
                config.Enabled = enabledFromConfig ?? 
                    (enabledFromEnv != null ? bool.Parse(enabledFromEnv) : false);
            });

            // CONFIGURE MICROSOFT CALENDAR
            services.Configure<MicrosoftCalendarConfig>(config =>
            {
                // LOAD FROM ENVIRONMENT VARIABLES OR CONFIG
                config.ClientId = Environment.GetEnvironmentVariable("MS_CLIENT_ID") ?? string.Empty;
                config.ClientSecret = Environment.GetEnvironmentVariable("MS_CLIENT_SECRET") ?? string.Empty;
                config.TenantId = Environment.GetEnvironmentVariable("MS_TENANT_ID") ?? string.Empty;
                config.ApplicationName = Environment.GetEnvironmentVariable("MS_APPLICATION_NAME") ?? string.Empty;
                config.RefreshToken = Environment.GetEnvironmentVariable("MS_REFRESH_TOKEN") ?? string.Empty;
                
                // ENABLED STATE FROM CONFIG OR ENVIRONMENT VARIABLE
                var enabledFromConfig = configuration.GetValue<bool?>("CalendarProviders:Microsoft:Enabled");
                var enabledFromEnv = Environment.GetEnvironmentVariable("MS_ENABLED");
                config.Enabled = enabledFromConfig ?? 
                    (enabledFromEnv != null ? bool.Parse(enabledFromEnv) : false);
            });
        }

        private static void RegisterCalendarServices(IServiceCollection services)
        {
            // REGISTER PROVIDER IMPLEMENTATIONS
            services.AddScoped<ICalendarService, GoogleCalendarService>();
            services.AddScoped<ICalendarService, AppleCalendarService>();
            services.AddScoped<ICalendarService, MicrosoftCalendarService>();
            
            // REGISTER AUTH SERVICES
            services.AddScoped<MicrosoftAuthService>();
        }
    }
}
