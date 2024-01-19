namespace Backend.Dtos
{
    // 
    public class AppointmentDto
    {
        public int AppointmentId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;

    }
}
