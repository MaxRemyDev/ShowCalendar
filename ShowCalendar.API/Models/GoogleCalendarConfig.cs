namespace ShowCalendar.API.Models
{
    public class GoogleCalendarConfig
    {
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string ApplicationName { get; set; } = "ShowCalendar";
        public string RefreshToken { get; set; } = string.Empty;
        public string[] Scopes { get; set; } = { "https://www.googleapis.com/auth/calendar.readonly" };
    }
}
