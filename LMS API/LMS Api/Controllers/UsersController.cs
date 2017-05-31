using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using LMS_Api;
using LMS_Api.Models;
using System.Data.Entity.Core.Objects;
using System.Net.Mail;

namespace LMS_Api.Controllers
{
    [RoutePrefix("api/user")]
    public class UsersController : ApiController
    {
        private PLLMSEntities1 db = new PLLMSEntities1();

        // GET: api/Users
        public IQueryable<User> GetUsers()
        {
            return db.Users;
        }

        [HttpGet]
        [Route("sertest")]
        public string test()
        {
            return "running";
        }

        // GET: api/Users/5
        [HttpPost]
        [Route("Login")]
        [ResponseType(typeof(User))]
        public IHttpActionResult GetUser(UserModel userCredentails)
        {
            User user = db.Users.Where(x => x.email == userCredentails.email && x.password == userCredentails.password).FirstOrDefault();
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                UserModel usermodel = new UserModel();
                usermodel.id = user.Id;
                usermodel.email = user.email;
                usermodel.designationTypeId = user.designationTypeId;
                usermodel.lastName = user.lastName;
                usermodel.reportingToUserId = user.reportingToUserId;
                return Ok(usermodel);
            }
        }


        //GET: api/LeaveTypes
        [HttpGet]
        [Route("LeaveTypes")]
        [ResponseType(typeof(List<leaveType>))]
        public IHttpActionResult getLeaveTypes()
        {
            var leaveType = db.LeaveTypes.ToList();
            if (leaveType == null)
            {
                return NotFound();
            }
            else
            {
                List<leaveType> listofLeaveTypes = new List<Models.leaveType>();
                foreach (var item in leaveType)
                {
                    leaveType objleaveType = new Models.leaveType();
                    objleaveType.id = item.Id;
                    objleaveType.typeOfLeave = item.LeaveType1;
                    listofLeaveTypes.Add(objleaveType);
                }

                return Ok(listofLeaveTypes);
            }
        }

        
        //Leaveapplication
        [HttpPost]
        [Route("LeaveApplication")]
        [ResponseType(typeof(string))]
        public IHttpActionResult LeaveApplication(appliedleave objLeaveMatrix)
        {
            try
            {
                Leave_Approval_Matrix objLeave_Approval_Matrix = new Leave_Approval_Matrix();
                objLeave_Approval_Matrix.userId = objLeaveMatrix.userId;
                objLeave_Approval_Matrix.startDate = Convert.ToDateTime(objLeaveMatrix.startDate);
                objLeave_Approval_Matrix.endDate = Convert.ToDateTime(objLeaveMatrix.endDate);
                objLeave_Approval_Matrix.daysCount = (objLeave_Approval_Matrix.endDate - objLeave_Approval_Matrix.startDate).Days;
                objLeave_Approval_Matrix.reason = objLeaveMatrix.reason;
                objLeave_Approval_Matrix.status = 0;
                objLeave_Approval_Matrix.approverId = objLeaveMatrix.approverId;
                //  objLeave_Approval_Matrix.Remarks = objLeaveMatrix.Remarks;
                objLeave_Approval_Matrix.LeaveTypeId = objLeaveMatrix.LeaveTypeId;
                objLeave_Approval_Matrix.createdDate = DateTime.Now;
                objLeave_Approval_Matrix.updateDate = DateTime.Now;

                db.Leave_Approval_Matrix.Add(objLeave_Approval_Matrix);
                db.SaveChanges();

                //////////////////////Sending Mail////////////////////////////
                var approver_email = db.Users.Find(objLeaveMatrix.approverId).email;
                string smtpAddress = "smtp.office365.com";
                int portNumber = 587;
                bool enableSSL = true;

                string emailFrom = "qurratulain.saleem@premierlogic.com";
                string password = "Aftab1968@@";
                string emailTo = approver_email;
                string subject = "Hello";
                string body = "Hello, I'm just writing this to say Hi!";

                using (MailMessage mail = new MailMessage())
                {
                    mail.From = new MailAddress(emailFrom);
                    mail.To.Add(emailTo);
                    mail.Subject = subject;
                    mail.Body = body;
                    mail.IsBodyHtml = false;
                    // Can set to false, if you are sending pure text.

                    //mail.Attachments.Add(new Attachment("C:\\SomeFile.txt"));
                    //mail.Attachments.Add(new Attachment("C:\\SomeZip.zip"));

                    using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber))
                    {
                        smtp.Credentials = new NetworkCredential(emailFrom, password);
                        smtp.EnableSsl = enableSSL;
                        smtp.Send(mail);
                    }



                    return Ok("Saved");
                }
            }
            catch (Exception e)
            {
                return Ok(e.InnerException);

            }
        }
               
        



        //GET: api/AvailableLeavesDetails
        [HttpGet]
        [Route("AvailableLeavesDetails/{userId}")]
        //[ResponseType(typeof(List<leaveType>))]
        public IHttpActionResult AvailableLeavesDetails(int userId)
        {
            var availableLeaves = from lt in db.LeaveTypes
                                  join lam in db.Leave_Approval_Matrix on lt.Id equals lam.LeaveTypeId
                                  join tlc in db.TotalLeaveCounts on lam.LeaveTypeId equals tlc.LeaveTypeId
                                  where lam.userId == userId
                                  group new { lt.LeaveType1, tlc.Count, lam.daysCount } by new { lt.LeaveType1, tlc.Count, lam.daysCount } into g
                                  select new
                                  {
                                      g.Key.LeaveType1,
                                      g.Key.Count,
                                      LeaveBalance = g.Key.Count - g.Sum(x => x.daysCount)
                                  };


            return Ok(availableLeaves);
        }

        //GET: api/approverlist
        [HttpGet]
        [Route("ApproverList")]
        [ResponseType(typeof(List<User>))]
        public IHttpActionResult getApproverList()
        {
            var approverList = db.Users.Where(x => x.designationTypeId != 4 && x.designationTypeId != 5).ToList();
            if (approverList == null)
            {
                return NotFound();
            }
            else
            {
                List<Models.UserModel> listofapproverList = new List<Models.UserModel>();
                foreach (var item in approverList)
                {
                    UserModel objuser = new UserModel();
                    objuser.id = item.Id;
                    objuser.firstName = item.firstName;
                    objuser.lastName = item.lastName;
                    listofapproverList.Add(objuser);
                }

                return Ok(listofapproverList);
            }
        }

        //GET: api/leavematrix
        [HttpGet]
        [Route("AppliedLeave/{userId}")]
        [ResponseType(typeof(List<appliedleave>))]
        public IHttpActionResult getAppliedLeave(int userId)
        {
            //var appliedleave = db.Leave_Approval_Matrix.Where(x => x.userId == userId).ToList();

            var appliedleave = (from k in db.Leave_Approval_Matrix
                                join lt in db.LeaveTypes on k.LeaveTypeId equals lt.Id
                                join u in db.Users on k.userId equals u.Id
                                where k.userId == userId
                                select new
                                {
                                    date = k.startDate,
                                    leaveCategory = lt.LeaveType1,
                                    approver = u.firstName + " " + u.lastName,
                                    reason = k.reason,
                                    status = k.status
                                }).ToList();

            if (appliedleave == null)
            {
                return NotFound();
            }
            else
            {
                List<appliedleave> listofAppliedLeave = new List<Models.appliedleave>();
                foreach (var item in appliedleave)
                {
                    appliedleave objleaveMatrix = new Models.appliedleave();
                    //objleaveMatrix.id = item.Id;
                    //objleaveMatrix.userId = item.userId;
                    objleaveMatrix.startDate = item.date.ToString("dd-MM-yyyy");
                    objleaveMatrix.reason = item.reason;
                    objleaveMatrix.Approver = item.approver;
                    objleaveMatrix.LeaveCategory = item.leaveCategory;
                    objleaveMatrix.status = item.status;
                    listofAppliedLeave.Add(objleaveMatrix);
                }

                return Ok(listofAppliedLeave);
            }
        }


        //GET: api/LeaveRequests
        [HttpGet]
        [Route("LeaveRequests/{userId}")]
        [ResponseType(typeof(List<appliedleave>))]
        public IHttpActionResult getLeaveRequests(int userId)
        {
            //var appliedleave = db.Leave_Approval_Matrix.Where(x => x.userId == userId).ToList();

            var leaaverequests = (from k in db.Leave_Approval_Matrix
                                  join lt in db.LeaveTypes on k.LeaveTypeId equals lt.Id
                                  join u in db.Users on k.userId equals u.Id
                                  where k.userId == userId
                                  select new
                                  {
                                      id = k.Id,
                                      name = u.firstName + " " + u.lastName,
                                      email = u.email,
                                      date = k.startDate,
                                      leavetype = lt.LeaveType1,
                                      reason = k.reason,
                                      status = k.status,
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
                    approvedleave.reason = objApprovedLeaveMatrix.remarks;
                    approvedleave.status = objApprovedLeaveMatrix.status;
                    // db.Leave_Approval_Matrix.Add(objLeave_Approval_Matrix);
                    db.SaveChanges();
                    return Ok("Saved");
                }
            }
            catch (Exception e)
            {
                return Ok(e.InnerException);

            }
        }

        // PUT: api/Users/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUser(int id, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.Id)
            {
                return BadRequest();
            }

            db.Entry(user).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Users
        [ResponseType(typeof(User))]
        public IHttpActionResult PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Users.Add(user);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        public IHttpActionResult DeleteUser(int id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            db.SaveChanges();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.Id == id) > 0;
        }
    }
}