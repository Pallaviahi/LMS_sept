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
    
    public partial class User
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public User()
        {
            this.Leave_Approval_Matrix = new HashSet<Leave_Approval_Matrix>();
            this.Leave_Approval_Matrix1 = new HashSet<Leave_Approval_Matrix>();
        }
    
        public int Id { get; set; }
        public string email { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string password { get; set; }
        public int designationTypeId { get; set; }
        public Nullable<int> reportingToUserId { get; set; }
        public System.DateTime createdDate { get; set; }
        public System.DateTime updatedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
    
        public virtual Designation Designation { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Leave_Approval_Matrix> Leave_Approval_Matrix { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Leave_Approval_Matrix> Leave_Approval_Matrix1 { get; set; }
    }
}
