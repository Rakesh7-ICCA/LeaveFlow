using System.Data;
using System.Net;
using System.Net.Mail;
using Api_Layer.DataLayer;
using Backend.Models;
using Backend.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.LeaveFlowManagement;

[ApiController]
[Route("api/[controller]")]
public class OrganizationsController : ControllerBase
{
    [HttpGet("GetOrganizations")]
    public IActionResult GetOrganizations()
    {
        string query = "exec ManageOrganization @Action='READ'";
        List<Organizations> orgs = new List<Organizations>();
        DataTable dt = DbManager.queryExecuteWithResult(query);
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                Organizations o = new Organizations();
                o.OrgId = Guid.Parse(dr["OrgId"].ToString());
                o.OrgName = dr["OrgName"].ToString();
                o.OrgHead = dr["OrgHead"].ToString();
                o.Amount = dr["Amount"].ToString();
                o.SubPlanId = Guid.Parse(dr["SubPlanId"].ToString());
                o.Handled = Guid.Parse(dr["Handeled"].ToString());
                o.Granted = bool.Parse(dr["Granted"].ToString());
                orgs.Add(o);
            }

            return Ok(new {message = "Data Found", institutes = orgs});
        }
        else
        {
            return Ok(new { message = "No data found." });
        }
    }

    [HttpGet("GetOrganizationByOrgId/{orgId}")]
    public IActionResult GetOrganizationByOrgId(Guid orgId)
    {
        string query = $"exec ManageOrganization @Action='READ', @OrgId = '{orgId}'";
        DataTable dt = DbManager.queryExecuteWithResult(query);
        string file = dt.Rows[0]["PaymentAttachment"].ToString().Replace("\\", "/");
        Organizations o = new Organizations();
        o.email = dt.Rows[0]["Email"].ToString();
        o.Handler = dt.Rows[0]["username"].ToString();
        o.PlanName = dt.Rows[0]["PlanName"].ToString();
        o.paymentProof = $"{Request.Scheme}://{Request.Host}/{file}";
        o.Granted = bool.Parse(dt.Rows[0]["Granted"].ToString());
        o.MeetingDate = DateOnly.FromDateTime(DateTime.Parse(dt.Rows[0]["meetingCompleted"].ToString()));
        string agd = dt.Rows[0]["GRantedDate"].ToString();
        
        o.AgreedDate = agd.Length>0 ? DateOnly.FromDateTime(DateTime.Parse(agd)):null;
        return Ok(o);
    }

    [HttpPost("GrantOrganization")]
    public IActionResult GrantOrganization([FromQuery] Guid orgId)
    {   
        Guid tempGuid = Guid.NewGuid(); 
        
        string query = $"exec GrantOrganization @orgId='{orgId}', @grant=1";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            query = $"exec ManageOrganization @Action='READ', @OrgId = '{orgId}'";
            DataTable dt = DbManager.queryExecuteWithResult(query);
            

            if (dt.Rows.Count > 0)
            {
                MailDto mailDto = new MailDto();
                mailDto.Email = dt.Rows[0]["Email"].ToString();
                mailDto.Name = dt.Rows[0]["OrgName"].ToString();

                query = $"exec UserUniqueValidations '{mailDto.Email}'";
                DataTable temp = DbManager.queryExecuteWithResult(query);
                if(temp.Rows.Count > 0)
                {
                    return BadRequest(new { message = "Email already exists." });
                }
                
                query = $"exec UserUniqueValidations @username = '{mailDto.Name}'";
                temp = DbManager.queryExecuteWithResult(query);
                if(temp.Rows.Count > 0)
                {
                    return BadRequest(new { message = "Username already exists." });
                }
                
                
                string password = GeneratePassword();
                verify(mailDto, orgId, password);
                query = $"exec ManageUser @Action='CREATE', @UserId = '{tempGuid}', @userName = '{orgId.ToString()}', @email='{mailDto.Email}', @Password='{password}', @RoleId=2";
                res = DbManager.queryExecute(query);
                if (res == "true")
                {
                    query =
                        $"update organizationService set userid = (select userid from [User] where username = '{orgId.ToString()}') where orgId = '{orgId}' ";
                    res = DbManager.queryExecute(query);
                    if (res == "true")
                    {
                        return Ok(new { message = "Organization granted" });
                    }
                    else
                    {
                        return Ok(new { message = "While updating issues arised" });
                    }
                }
                else
                {
                    return BadRequest(new { message = "Error Occured while Creating User" });
                }
            }
        }
        else
        {
            return Ok(new { message = "Organization not yet granted" });
        }
        
        return BadRequest(new {message = "Some error occured" });
    }

    private IActionResult verify(MailDto md, Guid userName, string password)
    {
        string mailId = "sukelanaz@gmail.com";
        string pw = "bjcmuggkzikjppva";
        var Client = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(mailId, pw)
        };
        string msg =
            System.IO.File.ReadAllText(Path.Join(Directory.GetCurrentDirectory(), "Resources", "Mails",
                "Welcome.html"));
        msg = msg.Replace("$username$", md.Name);
        msg = msg.Replace("$user$", userName.ToString());
        msg = msg.Replace("$pass$", password);
        try
        {
            MailMessage msgObj = new MailMessage();
            msgObj.From = new MailAddress(mailId);
            msgObj.Body = msg;
            msgObj.IsBodyHtml = true;
            msgObj.Subject = "Welcome to LeaveFlow";
            msgObj.To.Add(md.Email);
            Client.Send(msgObj);

            return Ok(new { message = "Mail Sent Successfully" });
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //it will block the service
    [HttpGet("BlockService")]
    public IActionResult BlockService([FromQuery] Guid orgId)
    {
        string query = $"exec GrantOrganization @orgId='{orgId}', @grant=0";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Organization Service is blocked" });
        }
        else
        {
            return Ok(new { message = "Some error occured, Contact Adminstrator" });
        }
        
    }
    
    public static string GeneratePassword()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        char[] password = new char[6];
        
        for (int i = 0; i < 6; i++)
        {
            password[i] = chars[random.Next(chars.Length)];
        }
        
        return new string(password);
    }

    //for username is unique or not
    [HttpGet("usernameExist")]
    public IActionResult UsernameExist([FromQuery] string username)
    {
        string query = $"exec UserUniqueValidations @username = '{username}'";
        DataTable temp = DbManager.queryExecuteWithResult(query);
        if (temp.Rows.Count > 0)
        {
            return Ok(new { message = "Username already exists." });
        }
        else
        {
            return Ok();
        }
    }
    
    //for update the username
    [HttpGet("{userid}/UpdateUser")]
    public IActionResult UpdateUser([FromRoute] Guid userid, [FromQuery] string username)
    {
        string query = $"update [user] set username = '{username}' where userid = '{userid}'";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "User updated successfully" });
        }
        else
        {
            return Ok(new { message = "Some error occured" });
        }
    }
    
    //
    [HttpGet("{userid}/UpdatePassword")]
    public IActionResult UpdatePassword([FromRoute] Guid userid, [FromQuery] string odp, [FromQuery] string nwp)
    {
        string query = $"select password from [user] where userid = '{userid}'";
        DataTable temp = DbManager.queryExecuteWithResult(query);
        if (temp.Rows[0][0].ToString() == odp)
        {
            query = $"update [user] set password = '{nwp}' where userid = '{userid}'";
            string res = DbManager.queryExecute(query);
            if (res == "true")
            {
                return Ok(new { message = "Password updated successfully" });
            }
            else
            {
                return Ok(new { message = "Some error occured" });
            }
        }
        else
        {
            return Ok(new { message = "Specified Old password does not match" });
        }
        
    }
    
    
    [HttpPost("addOrganizationPic")]
    public IActionResult AddEmployeePic([FromForm] ImageDto img, [FromQuery] Guid id)
    {
        try
        {
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Images",
                img.Name + "_profile.jpg");
            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                img.img.CopyTo(stream);
                string query =
                    $@"exec updateOrganizationProfile @id = '{id}', @path = '{Path.Combine("Uploads", "Images", img.Name + "_profile.jpg")}'";
                string res = DbManager.queryExecute(query);
                if (res == "true")
                    return Ok(new { message = "Profile Pic added Successfully" });
                else
                {
                    return Ok(new { message = "profile Pic Not Added Successfully - " + res });
                }
            }
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

    [HttpGet("removeOrganizationPic")]
    public IActionResult RemoveEmployeePic([FromQuery] Guid id)
    {
        string query =
            $@"exec updateOrganizationProfile @remove=1, @id = '{id}'";
        string res = DbManager.queryExecute(query);
        if (res == "true")
            return Ok(new { message = "Profile pic Removed" });
        else
        {
            return Ok(new { message = "Not able to remove profile pic - " + res });
        }
    }
}