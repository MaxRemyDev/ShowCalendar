namespace ShowCalendar.API.Models.Providers.Microsoft
{
    public class MicrosoftCalendarConfig
    {
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string TenantId { get; set; } = string.Empty;
        public string ApplicationName { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public string RedirectUri { get; set; } = string.Empty;
        public bool Enabled { get; set; } = false;
        public string? UserEmail { get; set; }
    }
} 
