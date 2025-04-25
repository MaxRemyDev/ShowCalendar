using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Services;

namespace ShowCalendar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TokenController : ControllerBase
    {
        // TEST TOKEN ACCESS ENDPOINT
        [HttpGet("test")]
        public async Task<IActionResult> TestTokenAccess([FromQuery] string accessToken)
        {
            // CHECK IF ACCESS TOKEN IS PROVIDED
            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Access token is required");
            }

            // TRY TO USE ACCESS TOKEN FOR AUTHENTICATION
            try
            {
                // USE ACCESS TOKEN DIRECTLY FOR AUTHENTICATION
                var credential = GoogleCredential.FromAccessToken(accessToken);

                // CREATE CALENDAR SERVICE
                var service = new CalendarService(new BaseClientService.Initializer
                {
                    HttpClientInitializer = credential,
                    ApplicationName = "ShowCalendar"
                });

                // TEST SIMPLE GET CALENDAR LIST
                var calendarList = await service.CalendarList.List().ExecuteAsync();

                return Ok(new
                {
                    Success = true,
                    CalendarCount = calendarList.Items?.Count ?? 0,
                    Message = "Authentication successfull with access token"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Success = false,
                    Error = ex.Message,
                    StrackTrace = ex.StackTrace
                });
            }
        }

        // GET ENVIRONEMENT VARIABLE ENDPOINT FOR DEBUGGING
        [HttpGet("env")]
        public IActionResult GetEnvironmentVariables()
        {
            return Ok(new
            {
                ClientIdConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GCP_CLIENT_ID")),
                ClientSecretConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GCP_CLIENT_SECRET")),
                RefreshTokenConfigured = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GCP_REFRESH_TOKEN")),
                ClientId = Environment.GetEnvironmentVariable("GCP_CLIENT_ID")?.Substring(0, 5) + "...",
                ClientSecret = Environment.GetEnvironmentVariable("GCP_CLIENT_SECRET")?.Substring(0, 5) + "...",
                RefreshToken = Environment.GetEnvironmentVariable("GCP_REFRESH_TOKEN")?.Substring(0, 5) + "...",
            });
        }
    }
}
