using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Dto;

public class MeetingAllDetails
{
    [Required]
    public Guid MeetingId { get; set; }
    
    [Required]
    public string Name { get; set; }
    
    [Required]
    public string Email { get; set; }
    
    [Required]
    public DateOnly ScheduledDate { get; set; }
    
    [Required]
    public TimeOnly ScheduledTime { get; set; }
    
    [Required]
    public string MeetingReason { get; set; }
    
    [Required]
    public string Handling{get;set;}
    
    
}