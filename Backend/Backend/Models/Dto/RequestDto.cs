using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Dto;

public class RequestDto
{
    [Required]
    public string Req_name { get; set; }
    [Required]
    public string Req_email { get; set; }
    [Required]
    public string Req_College { get; set; }
}