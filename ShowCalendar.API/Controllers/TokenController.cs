using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Services;
using Microsoft.Extensions.Options;
using ShowCalendar.API.Models.Providers.Google;
using ShowCalendar.API.Models.Providers.Apple;
using ShowCalendar.API.Models.Providers.Microsoft;
using ShowCalendar.API.Services.Common;

namespace ShowCalendar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TokenController : ControllerBase
    {
        private readonly CalendarServiceFactory _calendarServiceFactory;
        private readonly IOptions<GoogleCalendarConfig> _googleConfig;
        private readonly IOptions<AppleCalendarConfig> _appleConfig;
        private readonly IOptions<MicrosoftCalendarConfig> _microsoftConfig;

        public TokenController(
            CalendarServiceFactory calendarServiceFactory,
            IOptions<GoogleCalendarConfig> googleConfig,
            IOptions<AppleCalendarConfig> appleConfig,
            IOptions<MicrosoftCalendarConfig> microsoftConfig)
        {
            _calendarServiceFactory = calendarServiceFactory;
            _googleConfig = googleConfig;
            _appleConfig = appleConfig;
            _microsoftConfig = microsoftConfig;
        }

        // TEST TOKEN ACCESS ENDPOINT
        [HttpGet("test")]
        public async Task<IActionResult> TestTokenAccess([FromQuery] string accessToken, [FromQuery] string provider = "Google")
        {
            // CHECK IF ACCESS TOKEN IS PROVIDED
            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Access token is required");
            }

            // VERIFY PROVIDER EXISTS AND IS ENABLED
            var providerServices = _calendarServiceFactory.GetServicesByProvider(provider).ToList();
            if (!providerServices.Any())
            {
                return NotFound($"Provider '{provider}' not found or not enabled");
            }

            return provider.ToLowerInvariant() switch
            {
                "google" => await TestGoogleToken(accessToken),
                "apple" => await TestAppleToken(accessToken),
                "microsoft" => await TestMicrosoftToken(accessToken),
                _ => BadRequest($"Unknown provider: {provider}")
            };
        }

        // TEST GOOGLE TOKEN ENDPOINT
        private async Task<IActionResult> TestGoogleToken(string accessToken)
        {
            // TRY TO USE ACCESS TOKEN FOR AUTHENTICATION
            try
            {
                // USE ACCESS TOKEN DIRECTLY FOR AUTHENTICATION
                var credential = GoogleCredential.FromAccessToken(accessToken);

                // CREATE CALENDAR SERVICE
                var service = new CalendarService(new BaseClientService.Initializer
                {
                    HttpClientInitializer = credential,
                    ApplicationName = _googleConfig.Value.ApplicationName
                });

                // TEST SIMPLE GET CALENDAR LIST
                var calendarList = await service.CalendarList.List().ExecuteAsync();

                return Ok(new
                {
                    Success = true,
                    Provider = "Google",
                    CalendarCount = calendarList.Items?.Count ?? 0,
                    Message = "Authentication successful with access token"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Success = false,
                    Provider = "Google",
                    Error = ex.Message,
                    StrackTrace = ex.StackTrace
                });
            }
        }

        // TEST APPLE TOKEN ENDPOINT
        private async Task<IActionResult> TestAppleToken(string accessToken)
        {
            // THIS IS A PLACEHOLDER IMPLEMENTATION
            if (_appleConfig.Value.Enabled)
            {
                return Ok(new
                {
                    Success = true,
                    Provider = "Apple",
                    Message = "Token validation is not yet implemented for Apple Calendar. This is a placeholder."
                });
            }
            else
            {
                return Ok(new
                {
                    Success = false,
                    Provider = "Apple",
                    Error = "Apple Calendar provider is not enabled",
                    Note = "This is a placeholder implementation."
                });
            }
        }

        // TEST MICROSOFT TOKEN ENDPOINT
        private async Task<IActionResult> TestMicrosoftToken(string accessToken)
        {
            // THIS IS A PLACEHOLDER IMPLEMENTATION
            if (_microsoftConfig.Value.Enabled)
            {
                return Ok(new
                {
                    Success = true,
                    Provider = "Microsoft",
                    Message = "Token validation is not yet implemented for Microsoft Calendar. This is a placeholder."
                });
            }
            else
            {
                return Ok(new
                {
                    Success = false,
                    Provider = "Microsoft",
                    Error = "Microsoft Calendar provider is not enabled",
                    Note = "This is a placeholder implementation."
                });
            }
        }

        // GET ENVIRONEMENT VARIABLE ENDPOINT FOR DEBUGGING
        [HttpGet("env")]
        public IActionResult GetEnvironmentVariables()
        {
            var providers = _calendarServiceFactory.GetEnabledServices().ToList();
            var envVars = new Dictionary<string, object>();

            foreach (var provider in providers)
            {
                switch (provider.ProviderName)
                {
                    case "Google":
                        envVars.Add("Google", new
                        {
                            ClientId = Environment.GetEnvironmentVariable("GCP_CLIENT_ID")?.Substring(0, 5) + "...",
                            ClientSecret = Environment.GetEnvironmentVariable("GCP_CLIENT_SECRET")?.Substring(0, 5) + "...",
                            RefreshToken = Environment.GetEnvironmentVariable("GCP_REFRESH_TOKEN")?.Substring(0, 5) + "..."
                        });
                        break;
                    case "Apple":
                        envVars.Add("Apple", new
                        {
                            ClientId = Environment.GetEnvironmentVariable("APPLE_CLIENT_ID")?.Substring(0, 5) + "...",
                            ClientSecret = Environment.GetEnvironmentVariable("APPLE_CLIENT_SECRET")?.Substring(0, 5) + "...",
                            RefreshToken = Environment.GetEnvironmentVariable("APPLE_REFRESH_TOKEN")?.Substring(0, 5) + "..."
                        });
                        break;
                    case "Microsoft":
                        envVars.Add("Microsoft", new
                        {
                            ClientId = Environment.GetEnvironmentVariable("MS_CLIENT_ID")?.Substring(0, 5) + "...",
                            ClientSecret = Environment.GetEnvironmentVariable("MS_CLIENT_SECRET")?.Substring(0, 5) + "...",
                            RefreshToken = Environment.GetEnvironmentVariable("MS_REFRESH_TOKEN")?.Substring(0, 5) + "..."
                        });
                        break;
                }
            }

            return Ok(envVars);
        }
    }
}
