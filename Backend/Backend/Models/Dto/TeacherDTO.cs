namespace Backend.Models.Dto;

public class TeacherDTO:PersonDto
{
    
    public string Name { get; set; }
    
    public DateOnly DOB { get; set; }
    
    public string AdharNumber { get; set; }
    
    public string ClassYear { get; set; }
    
    public string ClassSection { get; set; }
    
    public Guid OrganizationId { get; set; }
 
}