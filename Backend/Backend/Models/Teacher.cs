namespace Backend.Models.Dto;

public class Teacher:PersonDto
{
    public Guid TeacherId { get; set; }
    
    public string Name { get; set; }
    
    public DateOnly DOB { get; set; }
    
    public string AdharNumber { get; set; }
    
    public string ClassYear { get; set; }
    
    public string ClassSection { get; set; }
    
    public Guid OrganizationId { get; set; }
    
    public bool Granted { get; set; }
}