using Microsoft.Extensions.Options;
using ShowCalendar.API.Models.Providers.Microsoft;
using System.Text.Json;
using Microsoft.Graph;
using Microsoft.Kiota.Abstractions.Authentication;
using ShowCalendar.API.Constants.Providers;

namespace ShowCalendar.API.Services.Providers.Microsoft
{
    public class MicrosoftAuthService
    {
        private readonly MicrosoftCalendarConfig _config;
        private readonly ILogger<MicrosoftAuthService> _logger;
        private readonly HttpClient _httpClient;
        
        // USE THE CONSTANT INSTEAD OF REDEFINING
        private const string CALLBACK_PATH = MicrosoftConstants.CALLBACK_PATH;

        // USE THE CONSTANTS CLASS INSTEAD OF DEFINING LOCALLY
        private readonly string[] _defaultScopes = MicrosoftConstants.DEFAULT_SCOPES;

        public MicrosoftAuthService(
            IOptions<MicrosoftCalendarConfig> config,
            ILogger<MicrosoftAuthService> logger)
        {
            _config = config.Value;
            _logger = logger;
            _httpClient = new HttpClient();
        }

        // GENERATE AUTHORIZATION URL FOR MICROSOFT OAUTH FLOW
        public string GetAuthorizationUrl()
        {
            // USE THE DEFAULT SCOPES DEFINED AT CLASS LEVEL
            return GetAuthorizationUrl(_defaultScopes);
        }

        // GENERATE AUTHORIZATION URL FOR MICROSOFT OAUTH FLOW WITH CUSTOM SCOPES
        public string GetAuthorizationUrl(string[] scopes)
        {
            var redirectUri = GetRedirectUri();
            
            var scopesValue = string.Join(" ", scopes);

            // USE THE CONSTANT FOR THE AUTH ENDPOINT
            var url = $"{MicrosoftConstants.AUTH_ENDPOINT}?" +
                      $"client_id={_config.ClientId}" +
                      $"&response_type=code" +
                      $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                      $"&response_mode=query" +
                      $"&scope={Uri.EscapeDataString(scopesValue)}" +
                      $"&prompt=consent" +
                      $"&state=12345";

            return url;
        }

        // EXCHANGE AUTHORIZATION CODE FOR ACCESS AND REFRESH TOKENS
        public async Task<MicrosoftTokenResponse> GetTokensFromAuthCodeAsync(string authCode)
        {
            try
            {
                var redirectUri = GetRedirectUri(); // GET THE CORRECT REDIRECT URI
                var scopeValue = string.Join(" ", _defaultScopes); // USE THE DEFAULT SCOPES
                
                // PARAMETERS FOR TOKEN REQUEST
                var tokenRequestContent = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("client_id", _config.ClientId),
                    new KeyValuePair<string, string>("client_secret", _config.ClientSecret),
                    new KeyValuePair<string, string>("code", authCode),
                    new KeyValuePair<string, string>("redirect_uri", redirectUri),
                    new KeyValuePair<string, string>("grant_type", "authorization_code"),
                    new KeyValuePair<string, string>("scope", scopeValue)
                });

                string tokenUrl = MicrosoftConstants.TOKEN_ENDPOINT; // USE THE CONSTANT FOR THE TOKEN ENDPOINT
                var response = await _httpClient.PostAsync(tokenUrl, tokenRequestContent); // SEND THE TOKEN REQUEST
                
                // CHECK IF THE RESPONSE IS SUCCESSFUL
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Token request failed: {ErrorContent}", errorContent);
                    _logger.LogError("Token request status code: {StatusCode}", response.StatusCode);
                    _logger.LogError("Token request headers: {Headers}", string.Join(", ", response.Headers.Select(h => $"{h.Key}: {string.Join(", ", h.Value)}")));
                    
                    throw new Exception($"Failed to get tokens. Status code: {response.StatusCode}. Details: {errorContent}");
                }

                // PARSE THE RESPONSE
                var responseContent = await response.Content.ReadAsStringAsync();
                var tokenResponse = JsonSerializer.Deserialize<MicrosoftTokenResponse>(responseContent) 
                    ?? throw new Exception("Failed to deserialize token response");

                return new MicrosoftTokenResponse
                {
                    AccessToken = tokenResponse.AccessToken,
                    RefreshToken = tokenResponse.RefreshToken,
                    ExpiresIn = tokenResponse.ExpiresIn,
                    Scope = tokenResponse.Scope
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get tokens from auth code");
                throw;
            }
        }

        // REFRESH AN ACCESS TOKEN USING A REFRESH TOKEN
        public async Task<MicrosoftTokenResponse> RefreshAccessTokenAsync(string refreshToken)
        {
            try
            {
                var scopeValue = string.Join(" ", _defaultScopes); // USE THE DEFAULT SCOPES
                
                // PARAMETERS FOR REFRESH TOKEN REQUEST
                var refreshTokenRequestContent = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("client_id", _config.ClientId),
                    new KeyValuePair<string, string>("client_secret", _config.ClientSecret),
                    new KeyValuePair<string, string>("refresh_token", refreshToken),
                    new KeyValuePair<string, string>("grant_type", "refresh_token"),
                    new KeyValuePair<string, string>("scope", scopeValue)
                });

                string tokenUrl = MicrosoftConstants.TOKEN_ENDPOINT; // USE THE CONSTANT FOR THE TOKEN ENDPOINT
                var response = await _httpClient.PostAsync(tokenUrl, refreshTokenRequestContent); // SEND THE REFRESH TOKEN REQUEST
                
                // CHECK IF THE RESPONSE IS SUCCESSFUL
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Refresh token request failed: {ErrorContent}", errorContent);
                    throw new Exception($"Failed to refresh tokens. Status code: {response.StatusCode}");
                }

                var responseContent = await response.Content.ReadAsStringAsync(); // PARSE THE RESPONSE
                
                // PARSE THE RESPONSE
                var tokenResponse = JsonSerializer.Deserialize<MicrosoftTokenResponse>(responseContent) 
                    ?? throw new Exception("Failed to deserialize token response");

                return new MicrosoftTokenResponse
                {
                    AccessToken = tokenResponse.AccessToken,
                    RefreshToken = string.IsNullOrEmpty(tokenResponse.RefreshToken) ? refreshToken : tokenResponse.RefreshToken,
                    ExpiresIn = tokenResponse.ExpiresIn,
                    Scope = tokenResponse.Scope
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to refresh access token");
                throw;
            }
        }
        
        // GETS THE REDIRECT URI TO USE BASED ON THE CONFIGURED REDIRECTURI OR FALLS BACK TO A CONSTRUCTED ONE
        private string GetRedirectUri()
        {
            // PREFER THE CONFIGURED REDIRECT URI IF AVAILABLE
            if (!string.IsNullOrEmpty(_config.RedirectUri))
            {
                // MAKE SURE THE REDIRECT URI INCLUDES THE CALLBACK PATH
                if (!_config.RedirectUri.EndsWith(CALLBACK_PATH))
                {
                    return _config.RedirectUri.TrimEnd('/') + CALLBACK_PATH; // APPEND THE CALLBACK PATH IF IT'S NOT ALREADY THERE
                }
                return _config.RedirectUri;
            }
            
            return $"http://localhost:5169{CALLBACK_PATH}"; // OTHERWISE USE THE URI WITH CALLBACK PATH 
        }

        // NEW METHOD TO CREATE GRAPH CLIENT - MOVED FROM MicrosoftCalendarService
        public async Task<GraphServiceClient> GetGraphClientAsync(string refreshToken)
        {
            try
            {
                // GET ACCESS TOKEN USING THE REFRESH TOKEN
                var tokenResponse = await RefreshAccessTokenAsync(refreshToken);
                var accessToken = tokenResponse.AccessToken;
                
                // CREATE GRAPH CLIENT WITH AUTHENTICATION PROVIDER
                var authProvider = new BaseBearerTokenAuthenticationProvider(
                    new TokenProvider(accessToken, _logger));

                return new GraphServiceClient(authProvider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize Microsoft Graph client");
                throw;
            }
        }

        // TOKEN PROVIDER CLASS MOVED FROM MicrosoftCalendarService
        private class TokenProvider : IAccessTokenProvider
        {
            private readonly string _accessToken;
            private readonly ILogger? _logger;

            // CONSTRUCTOR
            public TokenProvider(string accessToken, ILogger? logger = null)
            {
                _accessToken = accessToken;
                _logger = logger;
            }

            // GETS AUTHORIZATION TOKEN
            public Task<string> GetAuthorizationTokenAsync(Uri uri, Dictionary<string, object>? additionalAuthenticationContext = null, CancellationToken cancellationToken = default)
            {
                return Task.FromResult(_accessToken);
            }

            public AllowedHostsValidator AllowedHostsValidator { get; } = new AllowedHostsValidator(); // ALLOW ALL HOSTS
        }
    }
} 
