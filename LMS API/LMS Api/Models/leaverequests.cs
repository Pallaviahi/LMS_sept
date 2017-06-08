using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LMS_Api.Models
{

    public class leaverequests
    {
        public int id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string startDate { get; set; }
        public string reason { get; set; }
        public int status { get; set; }
        //public string leaveStatus { get; set; }
        //   public int approverId { get; set; } 
        //   public int LeaveTypeId { get; set; } 
        public string LeaveCategory { get; set; }
        //  public string Approver { get; set; }    
    }
}