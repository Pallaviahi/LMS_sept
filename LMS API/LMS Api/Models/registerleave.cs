using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LMS_Api.Models
{
    public class registerleave
    {
        public string leavename { get; set; }
        public double? totalLeave { get; set; }
        public double? minLeave { get; set; }
        public double? maxLeave { get; set; }
    }
}