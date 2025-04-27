using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Services;
using Microsoft.Extensions.Options;
using ShowCalendar.API.Models.Providers.Google;
using ShowCalendar.API.Models.Providers.Apple;
using ShowCalendar.API.Models.Providers.Microsoft;
using ShowCalendar.API.Services.Common;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;

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
        public async Task<IActionResult> TestTokenAccess([FromQuery] string accessToken, [FromQuery] string provider = "auto")
        {
            // CHECK IF ACCESS TOKEN IS PROVIDED
            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Access token is required");
            }

            // IF PROVIDER IS AUTO OR EMPTY, TRY TO AUTO-DETECT
            if (provider.ToLowerInvariant() == "auto" || string.IsNullOrWhiteSpace(provider))
            {
                var detectionResult = await DetectProviderFromToken(accessToken);
                if (detectionResult.Success)
                {
                    provider = detectionResult.ProviderName;
                }
                else
                {
                    return BadRequest(new { 
                        Success = false, 
                        Error = "Could not automatically detect provider for the given token",
                        Details = detectionResult.ErrorMessage
                    });
                }
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
                "apple" => TestAppleToken(accessToken),
                "microsoft" => await TestMicrosoftToken(accessToken),
                _ => BadRequest($"Unknown provider: {provider}")
            };
        }

        // DETECT PROVIDER FROM TOKEN
        private async Task<(bool Success, string ProviderName, string ErrorMessage)> DetectProviderFromToken(string accessToken)
        {
            // LIST OF PROVIDERS TO TRY
            var providers = _calendarServiceFactory.GetEnabledServices()
                .Select(s => s.ProviderName.ToLowerInvariant())
                .Distinct()
                .ToList();

            var errors = new Dictionary<string, string>();

            // TRY GOOGLE
            if (providers.Contains("google"))
            {
                try
                {
                    var credential = GoogleCredential.FromAccessToken(accessToken);
                    var service = new CalendarService(new BaseClientService.Initializer
                    {
                        HttpClientInitializer = credential,
                        ApplicationName = _googleConfig.Value.ApplicationName
                    });

                    // TRY A SIMPLE API CALL
                    await service.CalendarList.List().ExecuteAsync();
                    return (true, "google", null);
                }
                catch (Exception ex)
                {
                    errors["google"] = ex.Message;
                }
            }

            // TRY MICROSOFT
            if (providers.Contains("microsoft"))
            {
                try
                {
                    using var httpClient = new HttpClient();
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await httpClient.GetAsync("https://graph.microsoft.com/v1.0/me/calendars");
                    
                    if (response.IsSuccessStatusCode)
                    {
                        return (true, "microsoft", null);
                    }
                    
                    errors["microsoft"] = $"Status code: {response.StatusCode}";
                }
                catch (Exception ex)
                {
                    errors["microsoft"] = ex.Message;
                }
            }

            // APPLE IS CURRENTLY NOT IMPLEMENTED FOR AUTO-DETECTION
            if (providers.Contains("apple"))
            {
                // PLACEHOLDER FOR APPLE TOKEN VALIDATION
                errors["apple"] = "Apple token validation not implemented for auto-detection";
            }

            // IF WE GET HERE, NO PROVIDER MATCHED
            return (false, null, $"Token validation failed for all providers: {JsonSerializer.Serialize(errors)}");
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
        private IActionResult TestAppleToken(string accessToken)
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
            if (!_microsoftConfig.Value.Enabled)
            {
                return Ok(new
                {
                    Success = false,
                    Provider = "Microsoft",
                    Error = "Microsoft Calendar provider is not enabled"
                });
            }

            try
            {
                // CREATE HTTP CLIENT
                using var httpClient = new HttpClient();
                
                // ADD ACCESS TOKEN TO REQUEST HEADER
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                
                // MAKE REQUEST TO MICROSOFT GRAPH API TO GET CALENDARS
                var response = await httpClient.GetAsync("https://graph.microsoft.com/v1.0/me/calendars");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var calendarData = JsonSerializer.Deserialize<JsonElement>(content);
                    int calendarCount = 0;
                    
                    if (calendarData.TryGetProperty("value", out var calendars))
                    {
                        calendarCount = calendars.GetArrayLength();
                    }
                    
                    return Ok(new
                    {
                        Success = true,
                        Provider = "Microsoft",
                        CalendarCount = calendarCount,
                        Message = "Authentication successful with access token"
                    });
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, new
                    {
                        Success = false,
                        Provider = "Microsoft",
                        Error = $"API request failed with status {response.StatusCode}",
                        Details = errorContent
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Success = false,
                    Provider = "Microsoft",
                    Error = ex.Message,
                    StackTrace = ex.StackTrace
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
