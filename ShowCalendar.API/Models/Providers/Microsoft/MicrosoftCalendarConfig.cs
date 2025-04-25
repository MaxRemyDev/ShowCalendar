namespace ShowCalendar.API.Models.Providers.Microsoft
{
    public class MicrosoftCalendarConfig
    {
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string ApplicationName { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public string[] Scopes { get; set; } = Array.Empty<string>();
        public bool Enabled { get; set; } = false;
    }
} 
