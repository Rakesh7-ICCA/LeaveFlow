using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class University
{
    [Required]
    public Guid UniversityId { get; set; }
    public string UniversityName { get; set; }
    public string Location { get; set; }
    public string Type { get; set; }
    public string Speciality { get; set; }
    public int EstablishedYear { get; set; }
    public string Websitelink { get; set; }
}