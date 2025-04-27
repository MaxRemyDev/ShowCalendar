using System;
using System.Text.Json.Serialization;

namespace ShowCalendar.API.Models.Providers.Microsoft
{
    public class MicrosoftTokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; } = string.Empty;
        
        [JsonPropertyName("refresh_token")]
        public string? RefreshToken { get; set; }
        
        [JsonPropertyName("expires_in")]
        public double ExpiresIn { get; set; }
        
        [JsonPropertyName("scope")]
        public string? Scope { get; set; }
    }
} 
