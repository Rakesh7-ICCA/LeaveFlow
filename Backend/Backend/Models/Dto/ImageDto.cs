using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Dto;

public class ImageDto
{
    [Required]
    public IFormFile img { get; set; }
    
    [Required]
    public string Name { get; set; }
    
}