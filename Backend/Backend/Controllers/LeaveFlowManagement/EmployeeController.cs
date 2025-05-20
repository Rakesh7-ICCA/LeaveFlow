using System.Data;
using Api_Layer.DataLayer;
using Backend.Models;
using Backend.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.LeaveFlowManagement;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    [HttpPost("AddEmployee")]
    public IActionResult AddEmployee(EmployeeDto employee)
    {
        string query =
            $"exec ManageEmployee 'INSERT', NULL, '{employee.Name}', '{employee.UserName}', '{employee.Password}', '{employee.Email}', '{employee.DateOfBirth.ToString("yyyy-MM-dd")}', {employee.RoleId}, '{employee.Adhar}', Null";

        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Employee Added Successfully" });
        }
        else
        {
            return BadRequest("Employee Not Added Successfully " + res);
        }
    }


    //It gets the all employees
    [HttpGet("GetAll")]
    public IActionResult GetAll()
    {
        List<Object> employees = new List<Object>();
        string query = $"exec ManageEmployee 'SELECT'";
        DataTable dt = DbManager.queryExecuteWithResult(query);
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                string file = dr["ProfilePic"].ToString().Replace(@"\", @"/");
                employees.Add(
                    new
                    {
                        EmployeeId = Guid.Parse(dr["EmployeeId"].ToString()),
                        Name = dr["Name"].ToString(),
                        DateOfBirth = DateOnly.FromDateTime((DateTime)dr["DateOfBirth"]),
                        Adhar = dr["Adhar"].ToString(),
                        UserId = Guid.Parse(dr["UserId"].ToString()),

                        ProfilePicture = $"{Request.Scheme}://{Request.Host}/{file}"
                    }
                );
            }

            return Ok(employees);
        }
        else
        {
            return NotFound();
        }
    }


    [HttpGet("GetEmployeesWithUser")]
    public IActionResult GetEmployeesWithUser()
    {
        List<Object> employees = new List<Object>();
        string query = $"exec GetEmployeeWithUserById";
        DataTable dt = DbManager.queryExecuteWithResult(query);
        foreach (DataRow dr in dt.Rows)
        {
            string file = dr["ProfilePic"].ToString().Replace(@"\", @"/");
            employees.Add(
                new
                {
                    EmployeeId = Guid.Parse(dr["EmployeeId"].ToString()),
                    Name = dr["Name"].ToString(),
                    DateOfBirth = DateOnly.FromDateTime((DateTime)dr["DateOfBirth"]),
                    Adhar = dr["Adhar"].ToString(),
                    UserId = Guid.Parse(dr["UserId"].ToString()),
                    email = dr["EMAIL"].ToString(),
                    roleId = dr["ROLEID"].ToString(),
                    roleName = dr["Designation"].ToString(),
                    ProfilePicture = $"{Request.Scheme}://{Request.Host}/{file}"
                });
        }

        return Ok(employees);
    }


    [HttpGet("GetEmployeeById/{employeeId}")]
    public IActionResult GetEmployeeById([FromRoute] Guid employeeId)
    {
        string query = $"exec GetEmployeeWithUserById '{employeeId}'";
        DataTable dt = DbManager.queryExecuteWithResult(query);
        DataRow dr = dt.Rows[0];
        EmployeeDto employee = new EmployeeDto();
        employee.Adhar = dr["Adhar"].ToString();
        employee.DateOfBirth = DateOnly.FromDateTime((DateTime)dr["DateOfBirth"]);
        employee.Email = dr["Email"].ToString();
        employee.Name = dr["Name"].ToString();
        employee.RoleId = int.Parse(dr["ROLEID"].ToString());
        employee.UserName = dr["USERNAME"].ToString();
        return Ok(employee);
    }

    //This is a type of utitlies
    [HttpGet("EmployeeUniqueExist")]
    public IActionResult EmployeeUniqueExist([FromQuery] string email = "", [FromQuery] string username = "",
        [FromQuery] string adhar = "")
    {
        string query = $"exec EmployeeUniqueContraint @userName = '{username}', @email='{email}', @adhar = '{adhar}'";
        DataTable dt = DbManager.queryExecuteWithResult(query);

        return Ok(new { message = dt.Rows[0][0] });
    }


    //POST : update the Role of the employee
    [HttpPost("UpdateEmployeeRole")]
    public IActionResult UpdateEmployeeRole([FromQuery] Guid id, [FromQuery] int roleId)
    {
        string query = $"UPDATE [user] SET ROLEID = {roleId} WHERE userId  = '{id}' ";
        string res = DbManager.queryExecute(query);

        if (res == "true")
        {
            return Ok(new { message = "Employee Role Updated" });
        }
        else
        {
            return Ok(new { message = "Employee Role Not Updated" });
        }
    }

    [HttpPost("DeleteEmployee")]
    public async Task<IActionResult> DeleteUser([FromQuery] Guid userId)
    {
        string query = $"exec ManageEmployee @Action = 'DELETE', @userId = '{userId}'";
        string res = DbManager.queryExecute(query);
        if(res == "true")
            return Ok(new {message = "User Deleted Successfully"});
        else
            return Conflict(new {message = "User Deleted Unsuccessfully"+res});
    }

    //this controller for add employee pic
    [HttpPost("addEmployeePic")]
    public IActionResult AddEmployeePic([FromForm] ImageDto img)
    {
        try
        {
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Images",
                img.Name + "_profile.jpg");
                using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                img.img.CopyTo(stream);
                string query =
                    $@"exec EmployeeProfilePic @action='UPDATE_PIC', @userName = '{img.Name}', @path = '{Path.Combine("Uploads", "Images", img.Name + "_profile.jpg")}'";
                string res = DbManager.queryExecute(query);
                if (res == "true")
                    return Ok(new { message = "Employee Pic added Successfully" });
                else
                {
                    return Ok(new { message = "Employee Pic Not Added Successfully - " + res });
                }
            }
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }
}