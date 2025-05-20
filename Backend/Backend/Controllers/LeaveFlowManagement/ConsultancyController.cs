using System.Data;
using System.Net;
using System.Net.Mail;
using Api_Layer.DataLayer;
using Backend.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.LeaveFlowManagement;

[ApiController]
[Route("api/[controller]/")]
public class ConsultancyController : ControllerBase
{
    [HttpGet("IntialLoad")]
    public IActionResult GetIntialLoad([FromQuery] Guid userId)
    {
        List<object> dashboardData = new List<object>();
        string query = $"exec GetEmployeeWithUserById @userId ='{userId}'";
        DataTable dt = DbManager.queryExecuteWithResult(query);
        if (dt.Rows.Count > 0)
        {
            DataRow dr1 = dt.Rows[0], dr2;

            query = $"exec UsersMeetingsDetails'{userId}'";
            dt = DbManager.queryExecuteWithResult(query);
            dr2 = dt.Rows[0];
            return Ok(new
            {
                message = "Dashboard loaded", result =
                    new
                    {
                        name = dr1["Name"].ToString(),
                        username = dr1["USERNAME"].ToString(),
                        email = dr1["EMAIL"].ToString(),
                        employeeId = dr1["EmployeeId"].ToString(),
                        profileImage =
                            $"{Request.Scheme}://{Request.Host}/{dr1["ProfilePic"].ToString()?.Replace("\\", "/")}",
                        stats = new
                        {
                            totalMeetings = dr2["TotalMeetings"].ToString(),
                            completedMeetings = dr2["CompletedMeetings"].ToString(),
                            incompletedMeetings = dr2["IncompletedMeetings"].ToString(),
                        }
                    }
            });
        }

        return Ok(new { message = "Internal error" });
    }


    [HttpPost("SetNewPassword/{userId:guid}")]
    public IActionResult SetNewPassword([FromRoute] Guid userId, [FromQuery] string opswd, [FromQuery] string npswd)
    {
        string query = $"\nexec ChangePassword @userId='{userId}', @oldpwd='{opswd}', @newpwd='{npswd}'";
        string dt = DbManager.queryExecute(query);

        if (dt == "true")
        {
            return Ok(new { message = "Password changed" });
        }
        else
        {
            return Ok(new { message = dt });

        }


    }

    [HttpGet("UpcomingMeetings")]
    public IActionResult GetUpcomingMeetings([FromQuery] Guid userId, [FromQuery] bool completed = false)
    {
        string query = completed ? $"exec ConsultancyMeetings '{userId}', 1" : $"exec ConsultancyMeetings '{userId}'";
        DataTable dt = DbManager.queryExecuteWithResult(query);
        List<ConsultMeetings> meetings = new List<ConsultMeetings>();


        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                ConsultMeetings meeting = new ConsultMeetings();
                meeting.MeetingId = Guid.Parse(dr["MeetingId"].ToString());
                meeting.Name = dr["RequestedName"].ToString();
                meeting.Email = dr["RequestedEmail"].ToString();
                meeting.CollegeName = dr["RequestedCollege"].ToString();
                meeting.Scheduled = DateTime.Parse(dr["Scheduled"].ToString());
                meeting.Reason = dr["Reason"].ToString();
                meeting.Completed = dr["Done"].ToString();
                meetings.Add(meeting);

            }

            return Ok(meetings);
        }

        return NoContent();


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
        string msg = System.IO.File.ReadAllText(Path.Join(Directory.GetCurrentDirectory(), "Resources", "Mails",
            "Confirmation.html"));
        msg = msg.Replace("[Recipient’s Name]", mailDto.Name);
        msg = msg.Replace("[userId]", mailDto.requestId);
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


    [HttpPost("{meetingId}/MeetingCompleted/")]
    public IActionResult MeetingCompleted([FromRoute] Guid meetingId)
    {
        string query = $"exec MeetingCompleted '{meetingId}'";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Meeting completed" });
        }
        else
        {
            return Ok(new { message = res });
        }
    }

    [HttpGet("getplans")]
    public IActionResult getPlans()
    {
        string query = $"select * from SubscriptionPlan";
        List<object> plans = new List<object>();
        DataTable dt = DbManager.queryExecuteWithResult(query);
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                plans.Add( new
                {
                    planId = dr["subplanId"].ToString(),
                    planName = dr["PlanName"].ToString(),
                    amount = dr["Amount"].ToString(),
                });
            }
            
            return Ok(plans);
        }
        return NoContent();
    }


    [HttpPost("InsertInstitution")]
    public IActionResult InsertInstitution(ConsultAddOrganizationDTO cad)
    {
        
        string query = $"exec UserUniqueValidations '{cad.mailId}'";
        DataTable temp = DbManager.queryExecuteWithResult(query);
        if(temp.Rows.Count > 0)
        {
            return BadRequest(new { message = "Email already exists." });
        }
                
         query = $"exec ManageOrganization @Action='CREATE', @OrgName = '{cad.orgName}', @OrgOwner= '{cad.orgOwner}', @email='{cad.mailId}', @OrgHead='{cad.orgHead}'" +
                       $", @Handeled='{cad.Handeled}', @PlanId='{cad.planId}'";
        
        DataTable dt = DbManager.queryExecuteWithResult(query);
        if (dt.Rows.Count > 0)
        {
            return Ok(new { message = "Institution Inserted Successfully", id=dt.Rows[0]["id"] });
        }
        else
        {
            return Ok(new { message = "Institution Not Inserted", status=000});
        }
    }
    
    [HttpPost("PaidReceipt")]
    public IActionResult PaidReceipt([FromForm] ImageDto img, [FromQuery]Guid id)
    {
        try
        {
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "BillReciepts",
                id.ToString() + "_paid.jpg");
            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                img.img.CopyTo(stream);
                string query =
                    $@"exec InstiutionPaidReceipt @action='UPDATE_PIC', @id = '{id}', @path = '{Path.Combine("Uploads", "BillReciepts", id + "_paid.jpg")}'";
                string res = DbManager.queryExecute(query);
                if (res == "true")
                    return Ok(new { message = "Receipt Sent Successfully" });
                else
                {
                    return Ok(new { message = "Receipt not sent Successfully - " + res });
                }
            }
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }
    
    
    
}