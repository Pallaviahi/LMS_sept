using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LMS_Api.Models
{
    public class leavesummaryuser
    {
        public int id { get; set; }
        public int userid { get; set; }
        public float CL_Allotted { get; set; }
        public float CL_Balance { get; set; }
        public float SL_Allotted { get; set; }
        public float SL_Balance { get; set; }
        public float PL_Allotted { get; set; }
	    public float PL_Balance { get; set; }
        public float ML_Allotted { get; set; }
        public float ML_Balance { get; set; }
        public float OL_Allotted { get; set; }
        public float OL_Balance { get; set; }
        public float EL_Allotted { get; set; }
        public float EL_Balance { get; set; }
        public int status { get; set; }
    }
    
}