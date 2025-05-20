namespace Backend.Models;

public class Request
{
    public string ReqId { get; set; }
    public string Req_name { get; set; }
    public string Req_email { get; set; }
    public string Req_College { get; set; }
    
    public bool BrouchureSent { get; set; }
}