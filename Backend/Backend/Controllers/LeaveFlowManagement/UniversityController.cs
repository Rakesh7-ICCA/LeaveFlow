using System.Data;
using Api_Layer.DataLayer;
using Backend.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.LeaveFlowManagement;


[ApiController]
[Route("api/[controller]")]

public class UniversityController:ControllerBase
{

    [HttpPost("addUniversity")]
    public IActionResult AddUniversity([FromBody] UniversityDto universityDto)
    {
        string query = $"EXEC ManageUniversity @operation = 'CREATE', @u_name = '{universityDto.UniversityName}', @u_location = '{universityDto.Location}'" +
                       $", @u_type = '{universityDto.Type}', @u_specialization = '{universityDto.Speciality}', @u_established = {universityDto.EstablishedYear}" +
                       $", @u_website = '{universityDto.Websitelink}'";

        string res = DbManager.queryExecute(query);
        return res == "true" ? Ok(new { message = "University Added Successfully"}) :Ok(new {message = res });
    }

    [HttpGet("getAllUniversity")]
    public IActionResult GetAllUniversity()
    {
        List<UniversityDto> universityDtos = new List<UniversityDto>();
        string query = $"EXEC ManageUniversity @operation = 'READ'";
        
        DataTable dt = DbManager.queryExecuteWithResult(query);
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                UniversityDto uni_Dto = new UniversityDto();
                uni_Dto.UniversityName = dr["name"].ToString();
                uni_Dto.Location = dr["location"].ToString();
                uni_Dto.Type = dr["type"].ToString();
                uni_Dto.Speciality = dr["Specialization"].ToString();
                uni_Dto.EstablishedYear = int.Parse(dr["established_year"].ToString());
                uni_Dto.Websitelink = dr["website"].ToString();

                universityDtos.Add(uni_Dto);
            }

            return Ok(new { message = "Universities Retrieved Successfully", data = universityDtos });
        }
        
        return NotFound(new { message = "Universities Not Found" });
    }
    
    [HttpGet("getAllUniversityIdName")]
    public IActionResult GetAllUniversityIdName()
    {
        List<Object> universityDtosOnlyIdName = new List<Object>();
        string query = $"EXEC ManageUniversity @operation = 'READ'";
        
        DataTable dt = DbManager.queryExecuteWithResult(query);
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                universityDtosOnlyIdName.Add(new { universityName = dr["name"].ToString(), universityId = dr["id"].ToString() });
            }

            return Ok(new { message = "Universities Retrieved Successfully", data = universityDtosOnlyIdName });
        }
        
        return NotFound(new { message = "Universities Not Found" });
    }

    [HttpPost("updateUniversity")]
    public IActionResult UpdateUniversity([FromBody] UniversityDto universityDto, [FromQuery] Guid id)
    {
        string query = $"EXEC ManageUniversity @operation = 'UPDATE',@u_id = '{id}',@u_name = '{universityDto.UniversityName}', @u_location = '{universityDto.Location}'" +
                       $", @u_type = '{universityDto.Type}', @u_specialization = '{universityDto.Speciality}', @u_established = {universityDto.EstablishedYear}" +
                       $", @u_website = '{universityDto.Websitelink}'";
        
        string res = DbManager.queryExecute(query);
        return res == "true" ? Ok(new { message = "University Updated Successfully"}) :Ok(new {message = res });
        
    }
    
    
    //COllege/Organization Controller
    
    [HttpGet("GetOrganizations")]
    public IActionResult GetOrganizations()
    {
        string query = $"EXEC ManageOrganization @action = 'READ'";
        List<Organizations> orgs = new List<Organizations>();
        DataTable dt = DbManager.queryExecuteWithResult(query);
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                Organizations organization = new Organizations()
                {
                    OrgId = Guid.Parse(dr["orgid"].ToString()),
                    OrgName = dr["orgname"].ToString(),
                };
                orgs.Add(organization);
            }
            return Ok(new { message = "Organizations Retrieved Successfully", Organizations = orgs });
        }
        return NotFound(new { message = "Organizations Not Found" });
    }
    
}