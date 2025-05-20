using System.Data;
using Api_Layer.DataLayer;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.LeaveFlowManagement;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    //Just for the drop down loader
    [HttpGet("GetRoles")]
    public IActionResult GetRoles([FromQuery] string Related)
    {
        string query = $"exec getRelatedRoles '{Related}'";
        
        List<object> data = new List<object>();
        DataTable dt = DbManager.queryExecuteWithResult(query);
        foreach (DataRow dr in dt.Rows)
        {
            data.Add(new {RoleId = (int)dr["RoleId"], RoleName = dr["Designation"].ToString()});
        }
        
        return Ok(data);
    }
}