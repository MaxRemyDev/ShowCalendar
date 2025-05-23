namespace ShowCalendar.API.Models.Providers.Google
{
    public class GoogleCalendarConfig
    {
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string ApplicationName { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public string[] Scopes { get; set; } = Array.Empty<string>();
        public bool Enabled { get; set; } = true;
        public string? UserEmail { get; set; }
    }
} 
