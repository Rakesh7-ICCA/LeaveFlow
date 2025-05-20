using System.Data;
using Api_Layer.DataLayer;
using Backend.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.LeaveFlowManagement;

[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    [HttpPost("RegisterStudent")]
    public IActionResult RegisterStudent(TeacherDTO t)
    {
        string query = $"exec UserUniqueValidations '{t.Email}'";
        DataTable temp = DbManager.queryExecuteWithResult(query);
        if (temp.Rows.Count > 0)
        {
            return Ok(new { message = "Email already exists." });
        }

        query = $"exec UserUniqueValidations @userName = '{t.UserName}'";
        temp = DbManager.queryExecuteWithResult(query);
        if (temp.Rows.Count > 0)
        {
            return Ok(new { message = "Username is already exists." });
        }

        query =
            $"exec ManageStudent @Action='CREATE', @userN='{t.UserName}', @pass = '{t.Password}', @email = '{t.Email}', @name='{t.Name}', @DateOfBirth='{t.DOB.ToString("yyyy-MM-dd")}'" +
            $", @AdharNumber = '{t.AdharNumber}', @classyear='{t.ClassYear}', @classSection='{t.ClassSection}', @orgid = '{t.OrganizationId}'";

        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Student Registered Successfully" });
        }

        return Ok(new { message = res });
    }


    //Load dashboard of the student
    [HttpGet("LoadDashboard")]
    public IActionResult LoadDashboard([FromQuery] Guid userId)
    {
        string query = $"exec LoadStudentDashboard '{userId}'";
        DataTable temp = DbManager.queryExecuteWithResult(query);
        if (temp.Rows.Count > 0)
        {
            DataRow dr = temp.Rows[0];
            string temp2 = $"{dr["profilepic"]}";
            if (temp2.Length <= 0)
            {
                temp2 = "uploads/DefaultProfile.png";
            }
            else
            {
                temp2 = $"{dr["profilepic"].ToString().Replace(@"\", @"/")}";
            }
            return Ok(new
            {
                name = dr["Name"].ToString(),
                username = dr["Username"].ToString(),
                email = dr["Email"].ToString(),
                organization = dr["OrgName"].ToString(),
                className = dr["batchname"].ToString(),
                section=dr["sectionname"].ToString(),
                studentId = dr["studentid"].ToString(),
                classTeacher = dr["class Teacher"].ToString(),
                profilePic = $"{Request.Scheme}://{Request.Host}/{temp2}"
            });
        }
        else
        {
            return NoContent();
        }
    }
    
    
    [HttpPost("addStudentPic")]
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
                    $@"exec updateStudentProfile @id = '{id}', @path = '{Path.Combine("Uploads", "Images", img.Name + "_profile.jpg")}'";
                string res = DbManager.queryExecute(query);
                if (res == "true")
                    return Ok(new { message = "Profile Pic added Successfully" });
                else
                {
                    return Ok(new { message = "Profile Pic Not Added - " + res });
                }
            }
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }
    
    
    [HttpGet("RemoveStudentPic")]
    public IActionResult RemoveEmployeePic([FromQuery] Guid id)
    {
        string query =
            $@"exec updateStudentProfile @remove=1, @id = '{id}'";
        string res = DbManager.queryExecute(query);
        if (res == "true")
            return Ok(new { message = "Profile pic Removed" });
        else
        {
            return Ok(new { message = "Not able to remove profile pic - " + res });
        }
    }

}