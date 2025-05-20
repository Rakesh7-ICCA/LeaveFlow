using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Models.Dto;

public class Login
{
    [Required, MaxLength(40, ErrorMessage = "Username is too long")]
    public string Username { get; set; }
    public string Password { get; set; }
}