using System.Data;
using Api_Layer.DataLayer;
using Backend.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.LeaveFlowManagement;

[ApiController]
[Route("api/[controller]")]
public class BatchSectionController : ControllerBase
{
    [HttpPost("CreateBatch")]
    public IActionResult CreateBatch(BatchDto bd)
    {
        Guid batchId = Guid.NewGuid();
        string query = $"insert into batch values ('{batchId}',(select orgid from organizationService where userid = '{bd.orgId}'), '{bd.batchName}')";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "New Batch Created!", batchId });
        }

        return Ok(res);
    }

    [HttpGet("GetBatch")]
    public IActionResult GetBatch([FromQuery] Guid orgId)
    {
        string query =
            $"select * from batch where organizationId= (select orgid from organizationService where userid = '{orgId}') order by batchName";
        DataTable dt = DbManager.queryExecuteWithResult(query);
        List<object> batches = new List<object>();
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                List<string> section = new List<string>();
                query =
                    $"select * from batch b inner join section s on s.batchid = b.batchid where b.batchid='{dr["batchid"]}' order by batchName";
                DataTable dt2 = DbManager.queryExecuteWithResult(query);

                if (dt2.Rows.Count > 0)
                {
                    foreach (DataRow dr2 in dt2.Rows)
                    {
                        section.Add(
                            dr2["sectionName"].ToString()
                        );
                    }
                }

                batches.Add(new
                {
                    batchId = dr["batchId"],
                    section = section,
                    batchName = dr["batchName"].ToString(),
                    orgId = Guid.Parse(dr["organizationId"].ToString()),
                });
            }

            return Ok(new { message = "Batches were found", batches });
        }

        return Ok(new { message = "No batch found!" });
    }
    
    [HttpGet("GetBatchByOrg")]
    public IActionResult GetBatchByOrg([FromQuery] Guid orgId)
    {
        string query =
            $"select * from batch where organizationId= '{orgId}' order by batchName";
        DataTable dt = DbManager.queryExecuteWithResult(query);
        List<object> batches = new List<object>();
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                

                batches.Add(new
                {
                    batchId = dr["batchId"],
                    batchName = dr["batchName"].ToString(),
                    orgId = Guid.Parse(dr["organizationId"].ToString()),
                });
            }

            return Ok(new { message = "Batches were found", batches });
        }

        return Ok(new { message = "No batch found!" });
    }

    [HttpGet("GetSections")]
    public IActionResult GetSections([FromQuery]Guid batchId)
    {
        string query = $"select * from section where batchid='{batchId}' order by sectionName";
        DataTable dt = DbManager.queryExecuteWithResult(query);
        List<object> sections = new List<object>();
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow dr in dt.Rows)
            {
                sections.Add(new
                {
                    sectionId = dr["sectionId"],
                    sectionName = dr["sectionName"].ToString(),
                    batchId = Guid.Parse(dr["batchId"].ToString()),
                });
            }
            return Ok(new { message = "Sections were found", sections });
        }
        return Ok(new { message = "No Section found!" });
    }
    
    [HttpPost("DeleteSection")]
    public IActionResult DeleteSection([FromQuery]Guid sectionId)
    {
        string query = $"delete from section where sectionid='{sectionId}'";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Specified section deleted!" });
        }

        return Ok(res);
    }

    [HttpPost("AddSection")]
    public IActionResult AddSection([FromQuery] Guid batchId, [FromQuery] string sectionName)
    {
        string query = $"insert into section (batchId, sectionName) values ('{batchId}', '{sectionName}')";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            return Ok(new { message = "Specified section added!" });
        }
        return Ok(res);
    }

    [HttpPost("DeleteBatch")]
    public IActionResult DeleteBatch([FromQuery] Guid batchId)
    {
        string query = $"delete from section where batchid='{batchId}'";
        string res = DbManager.queryExecute(query);
        if (res == "true")
        {
            query = $"delete from batch where batchid='{batchId}'";
            res = DbManager.queryExecute(query);
            if (res == "true")
            {
                return Ok(new { message = "Specified batch deleted!" });
            }
        }
        return Ok(res);
    }
}