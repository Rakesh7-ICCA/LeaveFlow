using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Dto;

public class UniversityDto
{
    [Required]
    public string UniversityName { get; set; }
    [Required]
    public string Location { get; set; }
    [Required]
    public string Type { get; set; }
    [Required]
    public string Speciality { get; set; }
    [Required]
    public int EstablishedYear { get; set; }
    [Required]
    public string Websitelink { get; set; }
}