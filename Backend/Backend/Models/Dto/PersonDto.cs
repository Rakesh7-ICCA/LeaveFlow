﻿using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Dto;

public class PersonDto
{  
    [Required]
    public string Email { get; set; }
    [Required]
    public string UserName { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    public int RoleId { get; set; }   
}