namespace Backend.Dtos
{
    public class CalendarDto
    {
        public int UserId { get; set; }
        public int CalendarId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;

    }

    public class CalendarUpdateDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
    }
}
