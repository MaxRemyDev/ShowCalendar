namespace Backend.Dtos.Responses
{
    public class RegisterResponse
    {
        public UserDto User { get; set; } = new UserDto();
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
    }
}
