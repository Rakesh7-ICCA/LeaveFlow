using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Dto;

public class EmployeeDto : PersonDto
{
    
    [Required]
    public string UserName { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public DateOnly DateOfBirth { get; set; }
    [Required]
    public string Adhar { get; set; }
    
}