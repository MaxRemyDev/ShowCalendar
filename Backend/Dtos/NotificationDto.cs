namespace Backend.Dtos
{
    public class NotificationDto
    {
        public int NotificationId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public bool IsRead { get; set; }
    }
}
