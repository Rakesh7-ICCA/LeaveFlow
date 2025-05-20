namespace Backend.Models.Dto;

public class Organizations
{
    public Guid OrgId { get; set; }
    public string OrgName { get; set; }
    public string OrgHead { get; set; }
    
    public string Handler  { get; set; }
    public string  email { get; set; }
    
    public string paymentProof { get; set; }
    
    public string Amount { get; set; }
    public Guid Handled{get;set;}
    public bool Granted { get; set; }
    public Guid SubPlanId { get; set; }
    
    public DateOnly MeetingDate { get; set; }
    public DateOnly? AgreedDate { get; set; }
    public string PlanName { get; set; }
}