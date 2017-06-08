//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace LMS_Api
{
    using System;
    using System.Collections.Generic;
    
    public partial class Leave_Approval_Matrix
    {
        public int Id { get; set; }
        public int userId { get; set; }
        public System.DateTime startDate { get; set; }
        public System.DateTime endDate { get; set; }
        public int daysCount { get; set; }
        public string reason { get; set; }
        public int status { get; set; }
        public int approverId { get; set; }
        public int LeaveTypeId { get; set; }
        public Nullable<int> LevelId { get; set; }
        public int LeaveRemarksId { get; set; }
        public System.DateTime createdDate { get; set; }
        public System.DateTime updateDate { get; set; }
    
        public virtual ApprovalLevel ApprovalLevel { get; set; }
        public virtual User User { get; set; }
        public virtual User User1 { get; set; }
        public virtual LeaveStatu LeaveStatu { get; set; }
        public virtual LeaveType LeaveType { get; set; }
    }
}
