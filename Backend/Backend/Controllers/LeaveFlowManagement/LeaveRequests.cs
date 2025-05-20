using System.Data;
using Api_Layer.DataLayer;
using Backend.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.LeaveFlowManagement;

[ApiController]
[Route("api/[controller]")]
public class LeaveRequests:ControllerBase
{
    [HttpPost("AskRequest/{bb}")]
    public IActionResult AskRequest(LeavesRequestDTO lrd, [FromRoute] bool bb)
    {
        string query = $"exec ManageRequestLeaves @Action='CREATE', @leavetype='{lrd.LeaveType}', @startdate='{lrd.StartDate.ToString("yyyy-MM-dd")}', @endDate = '{lrd.EndDate.ToString("yyyy-MM-dd")}', @reason = '{lrd.Reason}', @contactinfo='{lrd.Contact}', @fromuser = '{lrd.FromUserId}', @teacherasking='{bb}'";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Request Sent Successfully" });
        }
        else
        {
            return Ok(new { message = res });
        }
    }

    
    [HttpGet("GetRequestedLeaves/{bb}")]
    public IActionResult GetLeaves([FromQuery] Guid toHigherId, [FromRoute] bool bb)
    {
        string query = $"exec ManageRequestLeaves @action='READ', @toHigher = '{toHigherId}', @teacherAsking='{bb}'";
        DataTable dt = DbManager.queryExecuteWithResult(query);
        List<object> leaves = new List<object>();
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                leaves.Add(new
                {
                    leaveId = dr["leaveId"].ToString(),
                    name = dr["Name"].ToString(),
                    classinfo = dr["batchName"].ToString()+"-"+dr["SEctionname"].ToString()+" Section",
                    leaveType = dr["LeaveType"].ToString(),
                    startDate = DateOnly.FromDateTime((DateTime)dr["startdate"]).ToString("dd-MM-yyyy"),
                    endDate = DateOnly.FromDateTime((DateTime)dr["enddate"]).ToString("dd-MM-yyyy"),
                    reason = dr["Reason"].ToString(),
                    contact = dr["Contactinfo"].ToString(),
                    granted = dr["Granted"].ToString().Length == 0 ? null: dr["Granted"],
                    requestedDate = DateOnly.FromDateTime((DateTime)dr["RequestedDate"]).ToString("dd-MM-yyyy"),
                });
            }
            
            return Ok(new {message = "Requestes Retrived", leaves});
        }
        else
        {
            return Ok(new { message = "No Request Received" });
        }
    }

    [HttpGet("GetRequestedLeavesOfTheUser")]
    public IActionResult GetRequestedLeavesOfTheUser([FromQuery] Guid fromMe)
    {
        string query = $"exec ManageRequestLeaves @action='READ', @fromuser = '{fromMe}'";
        DataTable dt = DbManager.queryExecuteWithResult(query);
        List<object> leaves = new List<object>();
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                leaves.Add(new
                {
                    leaveId = dr["leaveId"].ToString(),
                    // name = dr["Name"].ToString(),
                    // classinfo = dr["batchName"].ToString()+"-"+dr["SEctionname"].ToString()+" Section",
                    leaveType = dr["LeaveType"].ToString(),
                    startDate = DateOnly.FromDateTime((DateTime)dr["startdate"]).ToString("dd-MM-yyyy"),
                    endDate = DateOnly.FromDateTime((DateTime)dr["enddate"]).ToString("dd-MM-yyyy"),
                    reason = dr["Reason"].ToString(),
                    contact = dr["Contactinfo"].ToString(),
                    granted = dr["Granted"].ToString().Length == 0 ? null: dr["Granted"],
                    requestedDate = DateOnly.FromDateTime((DateTime)dr["RequestedDate"]).ToString("dd-MM-yyyy"),
                });
            }
            
            return Ok(new {message = "Requestes Retrived", leaves});
        }
        else
        {
            return Ok(new { message = "No Request Received" });
        }
    }
    
    
    [HttpPost("GrantLeave")]
    public IActionResult GrantLeave([FromQuery] Guid leaveId, [FromQuery] bool granted)
    {
        string query =  $"update RequestLeaves set granted = {(granted ? 1 : 0)}, rejected = {(granted ? 0 : 1)} where leaveId = '{leaveId}' ";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Request Granted Successfully" });
        }
        else
        {
            return Ok(new { message = res });
        }
    }
}