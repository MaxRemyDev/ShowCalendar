using System.Text;
using System.Web;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ShowCalendar.API.Models;

namespace ShowCalendar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly GoogleCalendarConfig _googleConfig;
        private const string AuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        private const string RedirectUrl = "http://localhost:5169/api/auth/google/callback";

        public AuthController(IOptions<GoogleCalendarConfig> googleConfig)
        {
            _googleConfig = googleConfig.Value;
        }

        // GOOGLE LOGIN ENDPOINT
        [HttpGet("google/login")]
        public IActionResult GoogleLogin()
        {
            // GOOGLE QUERY PARAMS
            var queryParams = new Dictionary<string, string>
            {
                {"client_id", _googleConfig.ClientId},
                {"redirect_uri", RedirectUrl},
                {"scope", string.Join(" ", _googleConfig.Scopes)},
                {"response_type", "code"},
                {"access_type", "offline"},
                {"prompt", "consent"},
            };

            var urlBuilder = new StringBuilder(AuthUrl); // GOOGLE AUTH URL BUILDER

            var query = string.Join("&", queryParams.Select(param =>
                $"{HttpUtility.UrlEncode(param.Key)}={HttpUtility.UrlEncode(param.Value)}")); // GOOGLE QUERY PARAMS

            var url = $"{AuthUrl}?{query}"; // GOOGLE AUTH URL

            return Redirect(url); // REDIRECT TO GOOGLE AUTH URL
        }

        // GOOGLE CALLBACK ENDPOINT
        [HttpGet("google/callback")]
        public async Task<IActionResult> GoogleCallback([FromQuery] string code, [FromQuery] string? error = null)
        {
            // CHECK FOR ERRROR
            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest($"Error during authentication: {error}");
            }

            // TRY TO EXCHANGE CODE FOR TOKEN
            try
            {
                // CREATE AUTHENTICATION FLOW
                var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = new ClientSecrets
                    {
                        ClientId = _googleConfig.ClientId,
                        ClientSecret = _googleConfig.ClientSecret
                    },
                    Scopes = _googleConfig.Scopes
                });

                // EXCHANGE CODE FOR TOKEN
                var token = await flow.ExchangeCodeForTokenAsync(
                        "user",
                        code,
                        RedirectUrl,
                        CancellationToken.None
                    );

                // CREATE RESULT WITH ACCESS TOKEN AND REFRESH TOKEN
                var result = new
                {
                    AccessToken = token.AccessToken,
                    RefreshToken = token.RefreshToken,
                    Message = "Keep this RefreshToken in a safe place and add it to GCP_REFRESH_TOKEN environnement variables",
                    ExpireIn = token.ExpiresInSeconds
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error has occurred: {ex.Message}");
            }
        }
    }
}
