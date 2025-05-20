using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Dto;

public class MailDto
{
    [Required]
    public string Name { get; set; }
    
    [Required]
    public string Email { get; set; }
    
    public string requestId { get; set; }
    
}