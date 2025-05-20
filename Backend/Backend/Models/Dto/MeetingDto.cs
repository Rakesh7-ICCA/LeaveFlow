using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Dto;

public class MeetingDto
{
    [Required]
    public Guid MeetingId { get; set; }
    
    [Required]
    public Guid RequestId { get; set; }
    
    [Required]
    public DateOnly ScheduledDate { get; set; }
    
    [Required]
    public TimeOnly ScheduledTime { get; set; }
    
    [Required]
    public string MeetingReason { get; set; }
    
    
}