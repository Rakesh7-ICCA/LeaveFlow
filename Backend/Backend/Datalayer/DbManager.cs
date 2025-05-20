using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Api_Layer.DataLayer;

public class DbManager
{
    // public static string ConnectionString =
    //     "Server=ROCY\\SQLEXPRESS;Database=AbsentManagement_final;Trusted_Connection=True; trustservercertificate=true";
    public static string ConnectionString = "Server= sql.bsite.net\\MSSQL2016;Database=rakesh11_LeaveFlow;User Id=rakesh11_LeaveFlow;Password=Rakesh$1; TrustServerCertificate=True";

    // A function to execute a query by accepting it, and returns the number of rows affeected 
    public static string queryExecute(string query)
    {
        SqlConnection con = new SqlConnection(ConnectionString);
        con.Open();
        SqlCommand cmd = new SqlCommand(query, con);
        try
        {
            cmd.ExecuteNonQuery();
            con.Close();
            return "true";
        }
        catch (Exception ex)
        {
            con.Close();
            return ex.Message;
        }

    }

    public static DataTable queryExecuteWithResult(string query)
    {
        SqlConnection con = new SqlConnection(ConnectionString);
        con.Open();
        SqlCommand cmd = new SqlCommand(query, con);
        SqlDataAdapter da = new SqlDataAdapter(cmd);
        DataTable dt = new DataTable();
        da.Fill(dt);
        con.Close();
        return dt;
    }   


}