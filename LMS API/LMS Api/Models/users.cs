using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LMS_Api.Models
{
    public class UserModel
    {
        public int id { get; set; }

        public string email { get; set; }

        public string firstName { get; set; }

        public string lastName { get; set; }

        public string password { get; set; }

        public int designationTypeId { get; set; }

        public int? reportingToUserId { get; set; }
    }
}