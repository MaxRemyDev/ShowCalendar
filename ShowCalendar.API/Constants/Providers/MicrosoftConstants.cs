namespace ShowCalendar.API.Constants.Providers
{
    public static class MicrosoftConstants
    {
        public const string AUTH_ENDPOINT = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
        public const string TOKEN_ENDPOINT = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
        public const string CALLBACK_PATH = "/api/auth/microsoft/callback";
        
        public static readonly string[] DEFAULT_SCOPES = new[]
        {
            "https://graph.microsoft.com/User.Read",
            "https://graph.microsoft.com/Calendars.Read",
            "https://graph.microsoft.com/Calendars.ReadWrite",
            "offline_access",
        };
    }
} 
