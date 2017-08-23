using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LMS_Api.Models
{
    public class leaveBalance
    {
        public string LeaveName { get; set; }
        public double AccruedLeaves { get; set; }
        public double LeaveBalance { get; set; }
        public int status { get; set; }

    }
}