using System.Data;
using Api_Layer.DataLayer;
using Backend.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.LeaveFlowManagement;

[ApiController]
[Route("api/[controller]")]
public class MeetingController : ControllerBase
{
    [HttpGet("AvailMeetings")]
    public IActionResult GetMeetings()
    {
        string query = $"exec GetAllMeetingDetails";
        List<MeetingAllDetails> meetings = new List<MeetingAllDetails>();

        DataTable dt = DbManager.queryExecuteWithResult(query);
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                MeetingAllDetails met = new MeetingAllDetails();
                met.MeetingId = Guid.Parse(dr["MeetingId"].ToString());
                met.Name = dr["RequestedName"].ToString();
                met.Email = dr["RequestedEmail"].ToString();
                met.ScheduledDate = DateOnly.FromDateTime((DateTime)(dr["Scheduled"]));
                met.ScheduledTime = TimeOnly.FromDateTime((DateTime)(dr["Scheduled"]));
                met.MeetingReason = dr["Reason"].ToString();
                met.Handling = (dr["Handler"].ToString());
                meetings.Add(met);
            }

            return Ok(new { message = "Meetings Retrieved Successfully", data = meetings });
        }


        return Ok(new { message = "No meetings are at this moment", data = new List<RequestDto>() });
    }
    [HttpPost("AssignMeeting")]
    public IActionResult AssignMeeting([FromQuery]Guid meetingId, Guid  userId)
    {
        string query = $"exec ManageMeeting @operation='UPDATE',  @meetingId = '{meetingId}', @Assign ='{userId}'";   
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Meeting Assigned Successfully" });
        }
        else
        {
            return Ok(new { message = res });
        }
    }

}