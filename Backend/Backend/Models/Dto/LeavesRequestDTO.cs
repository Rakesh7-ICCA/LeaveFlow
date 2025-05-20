namespace Backend.Models.Dto;

public class LeavesRequestDTO
{
    public string LeaveType { get; set; }
    
    public DateOnly StartDate { get; set; }
    
    public DateOnly EndDate { get; set; }
    
    public string Reason { get; set; }
    
    public string Contact { get; set; }
    
    public Guid FromUserId { get; set; }
    
    
    
}