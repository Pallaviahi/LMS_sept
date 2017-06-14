using LMS_Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace LMS_Api.Controllers
{
    [RoutePrefix("api/admin")]
    public class AdminController : ApiController
    {
        private Entities db = new Entities();

        //GET: api/LeaveRequests
        [HttpGet]
        [Route("LeaveRequests")]
        [ResponseType(typeof(List<appliedleave>))]
        public IHttpActionResult getLeaveRequests()
        {
            //var appliedleave = db.Leave_Approval_Matrix.Where(x => x.userId == userId).ToList();

            List<appliedleave> leaaverequests = (from k in db.Leave_Approval_Matrix
                                                 join lt in db.LeaveTypes on k.LeaveTypeId equals lt.Id
                                                 join u in db.Users on k.userId equals u.Id
                                                 //join ls in db.LeaveStatus on k.status equals ls.Id
                                                 join al in db.ApprovalLevels on k.LevelId equals al.Id
                                                 where k.status == 1 || k.status == 5 || k.status == 4
                                                 select new appliedleave
                                                 {
                                                     id = k.Id,
                                                     name = u.firstName + " " + u.lastName,
                                                     email = u.email,
                                                     date = k.startDate,
                                                     leavetype = lt.LeaveType1,
                                                     reason = k.reason,
                                                     status = k.status,
                                                     approverId = k.approverId,
                                                     //leaveStatus = ls.Status + " with " + al.Approver,
                                                     // action = 
                                                 }).ToList();



            if (leaaverequests == null)
            {
                return NotFound();
            }
            else
            {
                List<leaverequests> listofLeaveRequests = new List<Models.leaverequests>();
                foreach (var item in leaaverequests)
                {
                    leaverequests objleaveMatrix = new Models.leaverequests();
                    objleaveMatrix.id = item.id;
                    objleaveMatrix.name = item.name;
                    objleaveMatrix.email = item.email;
                    objleaveMatrix.startDate = item.date.ToString("dd-MM-yyyy");
                    objleaveMatrix.reason = item.reason;
                    objleaveMatrix.LeaveCategory = item.leavetype;
                    objleaveMatrix.status = item.status;
                    listofLeaveRequests.Add(objleaveMatrix);
                }

                return Ok(listofLeaveRequests);
            }
        }


        //Leaveapproved
        [HttpPost]
        [Route("ApprovedLeave")]
        public IHttpActionResult LeaveApproved(leaveapproved objApprovedLeaveMatrix)
        {
            try
            {
                //Leave_Approval_Matrix objLeave_Approval_Matrix = new Leave_Approval_Matrix();
                var approvedleave = db.Leave_Approval_Matrix.Where(x => x.Id == objApprovedLeaveMatrix.id).FirstOrDefault();
                if (approvedleave == null)
                {
                    return NotFound();
                }
                else
                {
                    //approvedleave.Remarks = objApprovedLeaveMatrix.remarks;
                    if (objApprovedLeaveMatrix.status == 3 || objApprovedLeaveMatrix.status == 2)
                    approvedleave.status = objApprovedLeaveMatrix.status;

                    //adding approver comments to remarks table
                    LeaveRemark objLeaveRemark = new LeaveRemark();
                    objLeaveRemark.LeaveId = objApprovedLeaveMatrix.id;
                    objLeaveRemark.remarks = objApprovedLeaveMatrix.remarks;
                    db.LeaveRemarks.Add(objLeaveRemark);

                    db.SaveChanges();
                    return Ok("Saved");
                }
            }
            catch (Exception e)
            {
                return Ok(e.InnerException);

            }
        }

    }
}
