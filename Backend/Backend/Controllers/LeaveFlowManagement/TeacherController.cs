using System.Data;
using Api_Layer.DataLayer;
using Backend.Models.Dto;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.LeaveFlowManagement;

[ApiController]
[Route("api/[controller]")]
public class TeacherController : ControllerBase
{
    [HttpPost("RegisterTeacher")]
    public IActionResult RegisterTeacher(TeacherDTO t)
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
            $"exec ManageTeacher @Action='CREATE', @userN='{t.UserName}', @pass = '{t.Password}', @email = '{t.Email}', @name='{t.Name}', @DateOfBirth='{t.DOB.ToString("yyyy-MM-dd")}'" +
            $", @AdharNumber = '{t.AdharNumber}', @classyear='{t.ClassYear}', @classSection='{t.ClassSection}', @orgid = '{t.OrganizationId}'";

        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Teacher Registered Successfully" });
        }

        return Ok(new { message = res });
    }

    //Get the Count on dashboard
    [HttpGet("GetCount")]
    public IActionResult GetCount([FromQuery] Guid orgId)
    {
        string query = $"exec OrganizationCounts '{orgId}'";
        DataTable temp = DbManager.queryExecuteWithResult(query);
        if (temp.Rows.Count > 0)
            return Ok(new { membersCount = temp.Rows[0][0].ToString() });
        else
        {
            return Ok(new { message = "Staff Not Found" });
        }
    }

    [HttpPost("addTeacherPic")]
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
                    $@"exec updateProfile @id = '{id}', @path = '{Path.Combine("Uploads", "Images", img.Name + "_profile.jpg")}'";
                string res = DbManager.queryExecute(query);
                if (res == "true")
                    return Ok(new { message = "Teacher Pic added Successfully" });
                else
                {
                    return Ok(new { message = "Teacher Pic Not Added Successfully - " + res });
                }
            }
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

    [HttpGet("RemoveTeacherPic")]
    public IActionResult RemoveEmployeePic([FromQuery] Guid id)
    {
        string query =
            $@"exec updateProfile @remove=1, @id = '{id}'";
        string res = DbManager.queryExecute(query);
        if (res == "true")
            return Ok(new { message = "Profile pic Removed" });
        else
        {
            return Ok(new { message = "Not able to remove profile pic - " + res });
        }
    }
    //Organization head/principal Dashboard
    [HttpGet("LoadDashboard")]
    public IActionResult LoadDashboard([FromQuery] Guid userId)
    {
        string query = $"exec LoadOrgHead '{userId}'";
        DataTable temp = DbManager.queryExecuteWithResult(query);
        if (temp.Rows.Count > 0)
        {
            query = $"exec OrganizationCounts '{userId}'";
            DataTable temp1 = DbManager.queryExecuteWithResult(query);
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
                name = dr["orgname"], OrgEmail = dr["email"], Head = dr["orgHead"],profilePic = $"{Request.Scheme}://{Request.Host}/{temp2}",
                membersCount = temp1.Rows[0][0].ToString(), leavesCount = temp1.Rows[0][1].ToString(), BatchCount = temp1.Rows[0][2].ToString(),
            });
        }
        else
        {
            return Ok(new { message = "Staff Not Found" });
        }

    }

    //Load Staff by the userid at Organizatioin side
    [HttpGet("loadStaff")]
    public IActionResult LoadStaff([FromQuery] Guid userId)
    {
        string query = $"exec LoadStaff '{userId}'";
        DataTable temp = DbManager.queryExecuteWithResult(query);
        List<object> objs = new List<object>();
        if (temp.Rows.Count > 0)
        {
            foreach (DataRow dr in temp.Rows)
            {
                objs.Add(new
                {
                    teacherId = dr["teacherid"].ToString(),
                    teacherName = dr["name"].ToString(),
                    teacherUsername = dr["username"].ToString(),
                    DateofBirth = dr["dateofbirth"].ToString(),
                    ADHARNumber = dr["adharnumber"].ToString(),
                    Email = dr["email"].ToString(),
                    Granted = dr["granted"],
                    classInfo = dr["batchname"].ToString() + ", " + dr["sectionname"].ToString() + " Section"
                });
            }

            return Ok(new { message = objs });
        }

        return Ok();
    }
    
    //Oganizatioin head allows the user to grant or revoke the teacher
    [HttpPost("GrantTeacher")]
    public IActionResult GrantTeacher([FromQuery] Guid id)
    {
        string query = $"exec GrantTeacher '{id}', 0";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Teacher Grant" });
        }
        else
        {
            return Ok(new { message = "Some error occured" });
        }
    }
    
    //Oganizatioin head allows the user to grant or revoke the teacher
    [HttpPost("RevokeTeacher")]
    public IActionResult RevokeTeacher([FromQuery] Guid id)
    {
        string query = $"exec GrantTeacher '{id}', 1";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Teacher Revoked" });
        }
        else
        {
            return Ok(new { message = "Some error occured" });
        }
    }
    
    

    //Class Teacher
    //Dashboard
    [HttpGet("LoadClassDashboard")]
    public IActionResult LoadClassDashboard([FromQuery] Guid userId)
    {
        string query = $"exec LoadClass '{userId}'";
        DataTable temp = DbManager.queryExecuteWithResult(query);
        if (temp.Rows.Count > 0)
        {
            // query = $"exec OrganizationCounts '{userId}'";
            // DataTable temp1 = DbManager.queryExecuteWithResult(query);
            DataRow dr = temp.Rows[0];
            string temp1 = $"{dr["profilepic"]}";
            if (temp1.Length <= 0)
            {
                temp1 = "uploads/DefaultProfile.png";
            }
            else
            {
                temp1 = $"{dr["profilepic"].ToString().Replace(@"\", @"/")}";
            }
            return Ok(new
            {
                name = dr["name"],
                OrgEmail = dr["email"],
                classInfo = dr["classyear"].ToString() + ", " + dr["classsection"].ToString() + " Section",
                username = dr["username"].ToString(),
                studentsCount = dr["studentCount"],
                leaveCount = dr["leaveCount"],
                profilePic = $"{Request.Scheme}://{Request.Host}/{temp1}"
            });
        }
        else
        {
            return Ok(new { message = "Staff Not Found" });
        }

    }
    
    //load Registered students
    [HttpGet("LoadRegisteredStudents")]
    public IActionResult LoadRegisteredStudents([FromQuery] Guid userId)
    {
        string query = $"exec LoadRegisteredStudents '"+userId+"'";
        List<object> students = new List<object>();
        DataTable temp = DbManager.queryExecuteWithResult(query);

        if (temp.Rows.Count > 0)
        {
            foreach (DataRow dr in temp.Rows)
            {
                students.Add(new
                {
                    stuId = dr["studentId"], 
                   name = dr["name"],
                   username = dr["username"].ToString(),
                   granted = dr["granted"].ToString(),
                   email = dr["email"].ToString(),
                   adharnumber = dr["adharnumber"].ToString(),
                   dateofbirth = DateOnly.FromDateTime((DateTime)dr["dateofbirth"]).ToString("dd-MM-yyyy"),
                });
                
            }
            return Ok(new { message = "Registered Students Retrieved", students });
        }
        else
        {
            return Ok(new { message = "No newly registered students" });
        }
    }
    
    [HttpPost("GrantStudent")]
    public IActionResult GrantStudent([FromQuery] Guid id)
    {
        string query = $"exec GrantStudent '{id}', 0";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Student Grant" });
        }
        else
        {
            return Ok(new { message = "Some error occured" });
        }
    }
    
    [HttpPost("RevokeStudent")]
    public IActionResult RevokeStudent([FromQuery] Guid id)
    {
        string query = $"exec GrantStudent '{id}', 0";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Student Grant" });
        }
        else
        {
            return Ok(new { message = "Some error occured" });
        }
    }   
}