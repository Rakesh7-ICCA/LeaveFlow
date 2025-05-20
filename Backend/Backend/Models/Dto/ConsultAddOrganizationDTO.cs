namespace Backend.Models.Dto;

public class ConsultAddOrganizationDTO
{
    public string orgName { get; set; }
    
    public string orgOwner { get; set; }
    
    public string mailId { get; set; }
    
    public string orgHead { get; set; }
    
    public Guid planId { get; set; }
    
    public Guid Handeled { get; set; }
    
}