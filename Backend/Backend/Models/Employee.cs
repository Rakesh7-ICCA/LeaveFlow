using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Employee : Person
{
    [Required]
    public Guid EmployeeId { get; set; }
    [Required]
    public string UserName { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public DateOnly DateOfBirth { get; set; }
    [Required]
    public string Adhar { get; set; }
}