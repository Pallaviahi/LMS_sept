using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LMS_Api.Models
{
    public class appliedleave
    {
        public int id { get; set; }

        public int userId { get; set; }

        public string startDate { get; set; }

        public string endDate { get; set; }

        public string reason { get; set; }

        public int status { get; set; }

        //public string leaveStatus { get; set; }

        public int approverId { get; set; }

        public int LeaveTypeId { get; set; }

        public string LeaveCategory { get; set; }

        public string Approver { get; set; }

        public string email { get; set; }

        public DateTime date { get; set; }

        public string name { get; set; }

        public string leavetype { get; set; }
    }
}