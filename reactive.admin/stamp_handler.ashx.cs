using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System.IO;
using System.Data;
using System.Data.SqlClient;
using System.Data.Common;

namespace reactive.admin
{
    /// <summary>
    /// Summary description for stamp_handler
    /// </summary>
    public class stamp_handler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string strJson = new StreamReader(context.Request.InputStream).ReadToEnd();

            standar_input std_input = JsonConvert.DeserializeObject<standar_input>(strJson);

            switch (std_input.method)
            {
                case "fetch_data":
                    {
                        fetch_tables_list(context, std_input.data);

                    }break;
            }
            
        }


        public bool IsReusable
        {
            get
            {
                return false;
            }
        }


        void fetch_tables_list(HttpContext context, string model)
        {            
            string strJson = new StreamReader(context.Request.InputStream).ReadToEnd();

            SqlConnection conn = new SqlConnection("Data Source=SQL5017.Smarterasp.net;Initial Catalog=DB_9E3241_seyaobey;Integrated Security=false;Trusted_Connection=False;Persist Security Info=True;User Id=DB_9E3241_seyaobey_admin;Password=JazzTheSoul1.");

            conn.Open();

            SqlDataAdapter adp = new SqlDataAdapter( string.Format("SELECT * FROM {0}", model), conn);

            DataSet ds = new DataSet();

            adp.Fill(ds);

            var list = new List<Dictionary<string, object>>();

            DataTable tbl = ds.Tables[0];
            
            foreach (DataRow row in tbl.Rows)
            {
                var dict = new Dictionary<string, object>();
                
                foreach (DataColumn col in tbl.Columns)
                {
                    dict[col.ColumnName] = Convert.ToString(row[col]);
                }

                list.Add(dict);
            }

            var json = JsonConvert.SerializeObject(list);

            conn.Close();

            context.Response.Write(json);

        }

        void sql_to_mysql() {

            //MySql.Data.MySqlClient.MySqlConnection conn = new MySql.Data.MySqlClient.MySqlConnection("");
            //MySql.Data.MySqlClient.MySqlDataAdapter
        }
    }


    


    class standar_input
    {
        public string method;

        public string data; 

    }
}