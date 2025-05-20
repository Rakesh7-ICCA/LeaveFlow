using System.Data;
using Api_Layer.DataLayer;
using Backend.Models.Dto;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthoController: ControllerBase
{
    [HttpPost("login")]
    public IActionResult VerifyUser([FromBody]Login lg)
    {
        string query = $"exec LOGINHELPER '{lg.Username}', '{lg.Password}'";

        DataTable dt = DbManager.queryExecuteWithResult(query);
        if (dt.Rows.Count > 0)
        {
            DataRow dr = dt.Rows[0];
            if (dr["SCOPE"].ToString() == "ORGHEAD")
            {
                query = $"select 1 from organizationService where userid = '{dr["userid"]}' and Granted = 1";
                DataTable dt2 = DbManager.queryExecuteWithResult(query);
                if (dt2.Rows.Count > 0)
                {
                    return Ok(new { message = "Login Success", result = new {id = dr["userId"],username = lg.Username, email = dr["EMAIL"].ToString(), Role = dr["scope"].ToString() } });
                }
                else
                {
                    return Ok(new { message = "Waiting for approval" });
                }
            }
            else if (dr["SCOPE"].ToString() == "CLASS")
            {
                query = $"select 1 from Teacher where userid = '{dr["userid"]}' and Granted = 1";
                DataTable dt2 = DbManager.queryExecuteWithResult(query);
                if (dt2.Rows.Count > 0)
                {
                    return Ok(new { message = "Login Success", result = new {id = dr["userId"],username = lg.Username, email = dr["EMAIL"].ToString(), Role = dr["scope"].ToString() } });
                }
                else
                {
                    return Ok(new { message = "Waiting for approval" });
                }
            }
            else
            {
                return Ok(new { message = "Login Success", result = new {id = dr["userId"],username = lg.Username, email = dr["EMAIL"].ToString(), Role = dr["scope"].ToString() } });

            }
        }
        
        return Ok(new { message = "Login Failed" });
    }
}