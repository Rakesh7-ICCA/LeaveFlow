using System.Data;
using System.Net;
using System.Net.Mail;
using Api_Layer.DataLayer;
using Backend.Models;
using Backend.Models.Dto;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.LeaveFlowManagement;

[ApiController]
[Route("api/[controller]")]
public class RequestController:ControllerBase
{

    [HttpPost("addRequest")]
    public IActionResult AcceptRequest([FromBody] RequestDto requestDto)
    {
        string query = $"exec manageRequest @operation = 'CREATE', @requestedName='{requestDto.Req_name}'," +
                       $" @requestedEmail='{requestDto.Req_email}', @requestedCollege='{requestDto.Req_College}'";
        
        string res = DbManager.queryExecute(query);
        return res == "true" ? Ok(new { message = "Requested Successfully"}) :Ok(new {message = res });
    }

    [HttpGet("{requestId}")]
    public IActionResult GetRequest(string requestId)
    {
        string query = $"EXEC ManageRequest @operation = 'READ',  @requestId = '{requestId}'";
        DataTable dt = DbManager.queryExecuteWithResult(query);
        if (dt.Rows.Count > 0)
        {
            DataRow dr = dt.Rows[0];
            return Ok(new { name = dr[1].ToString(), email = dr[3].ToString(), college = dr[2].ToString() });

        }

        return NotFound();
    }

    
    [HttpGet("getAllRequests")]
    public IActionResult GetAllRequests()
    {
        try
        {
            List<Request> requests = new List<Request>();
            string query = $"EXEC ManageRequest @operation = 'READ'";
        
            DataTable dt = DbManager.queryExecuteWithResult(query);
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    Request req = new Request();
                    req.Req_name = dr["RequestedName"].ToString();
                    req.Req_email = dr["RequestedEmail"].ToString();
                    req.Req_College = dr["RequestedCollege"].ToString();
                    req.ReqId = dr["RequestId"].ToString();
                    req.BrouchureSent = bool.Parse(dr["BrochureSent"].ToString());
                    requests.Add(req);
                }

                return Ok(new { message = "Universities Retrieved Successfully", data = requests });
            }
        
            return Ok(new { message = "Universities Not Found" , data=new List<RequestDto>()});
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
        
    }

    
    [HttpPost("SendBrochure")]
    public IActionResult sendBrochure([FromBody] MailDto mailDto)
    {
        string mailId = "sukelanaz@gmail.com";
        string pw = "bjcmuggkzikjppva";
        var Client = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true, 
            Credentials = new NetworkCredential(mailId, pw)
        };
        string msg = System.IO.File.ReadAllText(Path.Join(Directory.GetCurrentDirectory(),"Resources", "Mails", "Confirmation.html"));
        msg  = msg.Replace("[Recipient’s Name]", mailDto.Name);
        msg  = msg.Replace("[userId]", mailDto.requestId);
        try
        {
            MailMessage msgObj = new MailMessage();
            msgObj.From = new MailAddress(mailId);
            msgObj.Body = msg;
            msgObj.IsBodyHtml = true;
            msgObj.Subject = "Meeting with Leave Flow";
            msgObj.To.Add(mailDto.Email);
            Client.Send(msgObj);

            string query = $"exec BrochureSentToUser '{mailDto.requestId}'";
            string res = DbManager.queryExecute(query);
            if (res != "true")
            {
                return BadRequest(new { message = "Brochure sent, while updating error occured" });
            }
            return Ok(new { message = "Mail Sent Successfully" });

        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpPost("FixMeeting")]
    public IActionResult FixMeeting([FromBody] MeetingDto mtdto)
    {
        Console.WriteLine(mtdto.ScheduledDate);
        string query = $"exec ManageMeeting @operation = 'CREATE', @RequestId = '{mtdto.RequestId}', @Scheduled = '{mtdto.ScheduledDate.ToString("yyyy-MM-dd")} {mtdto.ScheduledTime}', @Reason = '{mtdto.MeetingReason}'";
        
           
        string res = DbManager.queryExecute(query);
        return res == "true" ? Ok(new { message = "Meeting Scheduled Successfully"}) :Ok(new {message = res });
    }
    

    
}