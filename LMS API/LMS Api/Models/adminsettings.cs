using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LMS_Api.Models
{
    public class adminsettings
    {
        public int id { get; set; }

        public bool IsAdminPermissionRequiredForLeaveApproval { get; set; }
    }
}