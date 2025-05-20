namespace Backend.Models.Dto;

public class ConsultMeetings
{
    public Guid MeetingId { get; set; }
    public string Name { get; set; }
    
    public string CollegeName { get; set; }
    
    public string Email { get; set; }
    public DateTime Scheduled { get; set; }
    public string Reason { get; set; }
    
    public string  Completed { get; set; }
}