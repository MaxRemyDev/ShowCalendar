using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ShowCalendar.API.Models.Providers.Google;
using ShowCalendar.API.Services.Providers.Microsoft;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;

namespace ShowCalendar.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly MicrosoftAuthService _microsoftAuthService;
        private readonly GoogleCalendarConfig _googleConfig;
        private const string GoogleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        private const string GoogleRedirectUrl = "http://localhost:5169/api/auth/google/callback";

        public AuthController(
            MicrosoftAuthService microsoftAuthService,
            IOptions<GoogleCalendarConfig> googleConfig,
            ILogger<AuthController> logger)
        {
            _microsoftAuthService = microsoftAuthService;
            _googleConfig = googleConfig.Value;
            _logger = logger;
        }

        // MICROSOFT LOGIN ENDPOINT
        [HttpGet("microsoft/login")]
        public IActionResult MicrosoftLogin()
        {
            try
            {
                var authUrl = _microsoftAuthService.GetAuthorizationUrl();
                return Redirect(authUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate Microsoft auth URL");
                return StatusCode(500, "Failed to generate authorization URL");
            }
        }

        // MICROSOFT CALLBACK ENDPOINT
        [HttpGet("microsoft/callback")]
        public async Task<IActionResult> MicrosoftCallback([FromQuery] string? code = null, [FromQuery] string? error = null, [FromQuery] string? error_description = null)
        {
            try
            {
                if (!string.IsNullOrEmpty(error))
                {
                    _logger.LogError($"Microsoft auth callback error: {error} - {error_description}");
                    _logger.LogError($"Full query string: {HttpContext.Request.QueryString}");

                    return BadRequest(new 
                    {
                        error,
                        error_description,
                        message = $"Authentication failed: {error} - {error_description}"
                    });
                }

                if (string.IsNullOrEmpty(code))
                {
                    _logger.LogError("Microsoft auth callback received with no code and no error");
                    return BadRequest("No authorization code provided");
                }

                var tokenResponse = await _microsoftAuthService.GetTokensFromAuthCodeAsync(code);

                return Ok(new 
                {
                    message = "Successfully authenticated with Microsoft",
                    tokenResponse.AccessToken,
                    tokenResponse.RefreshToken,
                    tokenResponse.ExpiresIn,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Microsoft auth callback");
                return StatusCode(500, "Authentication process failed");
            }
        }

        // GOOGLE LOGIN ENDPOINT
        [HttpGet("google/login")]
        public IActionResult GoogleLogin()
        {
            var queryParams = new Dictionary<string, string>
            {
                {"client_id", _googleConfig.ClientId},
                {"redirect_uri", GoogleRedirectUrl},
                {"scope", string.Join(" ", _googleConfig.Scopes)},
                {"response_type", "code"},
                {"access_type", "offline"},
                {"prompt", "consent"},
            };

            var urlBuilder = new StringBuilder(GoogleAuthUrl);

            var query = string.Join("&", queryParams.Select(param =>
                $"{HttpUtility.UrlEncode(param.Key)}={HttpUtility.UrlEncode(param.Value)}"));

            var url = $"{GoogleAuthUrl}?{query}";

            return Redirect(url);
        }

        // GOOGLE CALLBACK ENDPOINT
        [HttpGet("google/callback")]
        public async Task<IActionResult> GoogleCallback([FromQuery] string code, [FromQuery] string? error = null, [FromQuery] string? error_description = null)
        {
            if (!string.IsNullOrEmpty(error))
            {
                _logger.LogError($"Google auth callback error: {error} - {error_description}");
                _logger.LogError($"Full query string: {HttpContext.Request.QueryString}");

                return BadRequest(new 
                {
                    error,
                    error_description,
                    message = $"Authentication failed: {error} - {error_description}"
                });
            }

            if (string.IsNullOrEmpty(code))
            {
                _logger.LogError("Google auth callback received with no code and no error");
                return BadRequest("No authorization code provided");
            }

            try
            {
                var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = new ClientSecrets
                    {
                        ClientId = _googleConfig.ClientId,
                        ClientSecret = _googleConfig.ClientSecret
                    },
                    Scopes = _googleConfig.Scopes
                });

                var tokenResponse = await flow.ExchangeCodeForTokenAsync(
                        "user",
                        code,
                        GoogleRedirectUrl,
                        CancellationToken.None
                    );

                return Ok(new
                {
                    message = "Successfully authenticated with Google",
                    tokenResponse.AccessToken,
                    tokenResponse.RefreshToken,
                    tokenResponse.ExpiresInSeconds
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Google auth callback");
                return StatusCode(500, "Authentication process failed");
            }
        }
    }
}
