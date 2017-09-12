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
using System.IO;

namespace LMS_Api.Controllers
{
    [RoutePrefix("api/user")]
    public class UsersController : ApiController
    {
        private pllmsEntities db = new pllmsEntities();

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
            try
            {
                User user = db.Users.Where(x => x.email == userCredentails.username && x.password == userCredentails.password && x.IsDeleted != true).FirstOrDefault();
                if (user == null)
                {
                    return NotFound();
                }
                else
                {
                    UserModel usermodel = new UserModel();
                    usermodel.id = user.Id;
                    usermodel.username = user.email;
                    usermodel.firstName = user.firstName;
                    usermodel.designationId = user.designationTypeId;
                    usermodel.lastName = user.lastName;
                    usermodel.reportingToId = user.reportingToUserId;
                    usermodel.email = user.email.ToString();
                    
                    return Ok(usermodel);
                }
            }
            catch (Exception e)
            {
                throw;
            }
        }


        //GET: api/LeaveTypes
        [HttpGet]
        [Route("LeaveTypes/{userId}")]
        [ResponseType(typeof(List<leaveType>))]
        public IHttpActionResult getLeaveTypes(int userId)
        {
            //var leaveType = db.LeaveTypes.ToList();
           
            // var user = db.Users.ToList();
            //var leaveType = new LeaveType();
            var user = db.Users.Where(x => x.Id == userId).FirstOrDefault();
            string genderLeave = string.Empty;
            if(user.Gender=="F")
            {
                genderLeave = "Paternity Leave";
            }
            else
            {
                genderLeave = "Maternity Leave";
            }
            var leaveType = db.LeaveTypes.Where(x => x.LeaveType1 != genderLeave.ToString()).ToList();
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
                objLeave_Approval_Matrix.daysCount = (objLeave_Approval_Matrix.endDate - objLeave_Approval_Matrix.startDate).Days + 1;
                objLeave_Approval_Matrix.reason = objLeaveMatrix.reason;
                objLeave_Approval_Matrix.status = 1;
                objLeave_Approval_Matrix.approverId = objLeaveMatrix.approverId;
                objLeave_Approval_Matrix.LevelId = 1;
                objLeave_Approval_Matrix.LeaveTypeId = objLeaveMatrix.LeaveTypeId;
                objLeave_Approval_Matrix.createdDate = DateTime.Now;
                objLeave_Approval_Matrix.updateDate = DateTime.Now;

                db.Leave_Approval_Matrix.Add(objLeave_Approval_Matrix);
                db.SaveChanges();

                //////////////////////Sending Mail////////////////////////////
                var approver_email = db.Users.Find(objLeaveMatrix.approverId).email;

                using (MailMessage mail = new MailMessage())
                {
                    mail.From = new MailAddress(System.Configuration.ConfigurationManager.AppSettings["emailFrom"]);
                    mail.To.Add(approver_email);
                    mail.Subject = System.Configuration.ConfigurationManager.AppSettings["leaveRequestsubject"] + " " + "from" + " " + db.Users.Where(x => x.Id == objLeaveMatrix.userId).FirstOrDefault().firstName + " " + db.Users.Where(x => x.Id == objLeaveMatrix.userId).FirstOrDefault().lastName;
                    mail.Body = replaceLeaveApplicationContentHTML(objLeaveMatrix);
                    mail.IsBodyHtml = true;

                    using (SmtpClient smtp = new SmtpClient(System.Configuration.ConfigurationManager.AppSettings["smtpAddress"], Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["portNumber"])))
                    {
                        smtp.Credentials = new NetworkCredential(mail.From.ToString(), System.Configuration.ConfigurationManager.AppSettings["password"]);
                        smtp.EnableSsl = Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["enableSSL"]);
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
            double AllotedLeaves = 0;
            double balance = 0;
            List<leaveBalance> objListLeaveBalance = new List<leaveBalance>();
            var user = db.Users.Where(x => x.Id == userId).FirstOrDefault();

            if (user != null)
            {
                var typeOfLeave = db.LeaveTypes.ToList();
               //// var typeOfleavestatus = (from lt in db.LeaveTypes
               //                         join lam in db.Leave_Approval_Matrix on lt.Id equals lam.LeaveTypeId
               //                         group new { lt.LeaveType1, lam.status,lt.Id } by new { lt.LeaveType1, lam.status, lt.Id } into g
               //                          select new
               //                            {
               //                                g.Key.LeaveType1,  
               //                                g.Key.status,
               //                                g.Key.Id
               //                          });
                 var leaveStatus = db.Leave_Approval_Matrix.ToList();

                 DateTime? date = user.DateOfJoining;
                if (date.Value.Day < 15) { AllotedLeaves = 0.58; }
                else { AllotedLeaves = 0.29; }
                var year = DateTime.Now.Year - date.Value.Year;
                var month = DateTime.Now.Month - date.Value.Month;
                //var days = DateTime.Now.Day;

                if (year > 0) { AllotedLeaves = AllotedLeaves + year * 12 * 0.58; }
                AllotedLeaves = Math.Round(( AllotedLeaves + month * 0.58),2);

                foreach (var item in typeOfLeave)
                {
                    //foreach(var items in leaveStatus)
                    //{ 
                    if (item.LeaveType1 == "Casual Leave" ) 
                    {
                        var appliedleaves = db.Leave_Approval_Matrix.Where(x => x.userId == userId && x.LeaveTypeId == item.Id).ToList();
                        if (appliedleaves.Count > 0) { 
                        foreach (var items in appliedleaves)
                        {
                            if (items.status == 3)
                                balance = Math.Round(AllotedLeaves - appliedleaves.Sum(x => x.daysCount), 2);
                            else
                               balance = Math.Round(AllotedLeaves, 2);
                        }
                        }
                        else {
                            balance = AllotedLeaves;
                        }
                        //Calculation Casual Leave Balance
                        leaveBalance objleaveBalance = new leaveBalance();
                        objleaveBalance.LeaveName = item.LeaveType1;
                        objleaveBalance.AccruedLeaves = AllotedLeaves;
                        objleaveBalance.LeaveBalance = balance;
                        objListLeaveBalance.Add(objleaveBalance);
                       
                    }
                    if (item.LeaveType1 == "Sick Leave" )
                    {
                        var appliedleaves = db.Leave_Approval_Matrix.Where(x => x.userId == userId && x.LeaveTypeId == item.Id).ToList();
                        if (appliedleaves.Count > 0)
                        {
                            foreach (var items in appliedleaves)
                            {
                                if (items.status == 3)
                                    balance = Math.Round(AllotedLeaves - appliedleaves.Sum(x => x.daysCount), 2);
                                else
                                    balance = Math.Round(AllotedLeaves, 2);
                            }
                        }
                        else
                        {
                            balance = AllotedLeaves;
                        }
                        //Calculation Casual Leave Balance
                        leaveBalance objleaveBalance = new leaveBalance();
                        objleaveBalance.LeaveName = item.LeaveType1;
                        objleaveBalance.AccruedLeaves = AllotedLeaves;
                        objleaveBalance.LeaveBalance = balance;
                        objListLeaveBalance.Add(objleaveBalance);

                    }
                    if ( item.LeaveType1 == "Earned Leave")
                    {
                        var appliedleaves = db.Leave_Approval_Matrix.Where(x => x.userId == userId && x.LeaveTypeId == item.Id).ToList();
                        if (appliedleaves.Count > 0 )
                        {
                            foreach (var items in appliedleaves)
                            {
                                if (items.status == 3)
                                    balance = Math.Round(AllotedLeaves - appliedleaves.Sum(x => x.daysCount), 2);
                                else
                                    balance = Math.Round(AllotedLeaves, 2);
                            }
                        }
                        else
                        {
                            balance = AllotedLeaves;
                        }
                        //Calculation Casual Leave Balance
                        leaveBalance objleaveBalance = new leaveBalance();
                        objleaveBalance.LeaveName = item.LeaveType1;
                        objleaveBalance.AccruedLeaves = AllotedLeaves;
                        objleaveBalance.LeaveBalance = balance;
                        objListLeaveBalance.Add(objleaveBalance);

                    }
                    if (item.LeaveType1=="optional leave" )
                    {
                        var appliedleaves = db.Leave_Approval_Matrix.Where(x => x.userId == userId && x.LeaveTypeId == item.Id).ToList();

                        //Calculation optional Leave Balance
                        leaveBalance objleaveBalance = new leaveBalance();
                        objleaveBalance.LeaveName = item.LeaveType1;
                        objleaveBalance.AccruedLeaves = 2;
                        objleaveBalance.LeaveBalance = objleaveBalance.AccruedLeaves - appliedleaves.Sum(x => x.daysCount);

                        objListLeaveBalance.Add(objleaveBalance);
                    }
                    if (user.Gender == "F" && item.LeaveType1 == "Maternity Leave" )
                    {
                        var appliedleaves = db.Leave_Approval_Matrix.Where(x => x.userId == userId && x.LeaveTypeId == item.Id).ToList();

                        //Calculation Casual Leave Balance
                        leaveBalance objleaveBalance = new leaveBalance();
                        objleaveBalance.LeaveName = item.LeaveType1;
                        objleaveBalance.AccruedLeaves = 183;
                        objleaveBalance.LeaveBalance = objleaveBalance.AccruedLeaves - appliedleaves.Sum(x => x.daysCount);

                        objListLeaveBalance.Add(objleaveBalance);
                    }
                    if (user.Gender == "M" && item.LeaveType1 == "Paternity Leave" )
                    {
                        var appliedleaves = db.Leave_Approval_Matrix.Where(x => x.userId == userId && x.LeaveTypeId == item.Id).ToList();

                        //Calculation Casual Leave Balance
                        leaveBalance objleaveBalance = new leaveBalance();
                        objleaveBalance.LeaveName = item.LeaveType1;
                        objleaveBalance.AccruedLeaves = 5;
                        objleaveBalance.LeaveBalance = objleaveBalance.AccruedLeaves - appliedleaves.Sum(x => x.daysCount);

                        objListLeaveBalance.Add(objleaveBalance);
                    }
               // }
            }
            }
            return Ok(objListLeaveBalance);
        }

        //DateTime date = System.DateTime.Now;

        //var firstDayOfMonth = new DateTime(date.Year, date.Month, 1);
        //var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
        //if (date == lastDayOfMonth)
        //{

        //    var dOJ = (from k in db.Users
        //               where k.Id == userId
        //               select new
        //               {
        //                   dateOfJoining = k.DateOfJoining
        //               });
        //    //var dateOfJoining = db.Users.Where(x => x.Id == userId);
        //    String currentMonth = DateTime.Now.ToString("MM");
        //    String monthOnly = Convert.ToDateTime(dOJ).Month.ToString();
        //    double CL = 0;
        //    double SL = 0;
        //    if (monthOnly.Equals(currentMonth))
        //    {
        //        DateTime dateOnly = Convert.ToDateTime(dOJ).Date;
        //        if (dateOnly.Equals(15))
        //        {
        //            CL = +.58;
        //            SL = +.58;
        //        }
        //        else
        //        {
        //            CL = CL + .29;
        //            SL = SL + .29;
        //        }
        //    }
        //    else
        //    {
        //        CL = CL + .58;
        //        SL = SL + .58;
        //    }

        //    var availableLeaves = from lt in db.LeaveTypes
        //                          join lam in db.Leave_Approval_Matrix on lt.Id equals lam.LeaveTypeId
        //                          join tlc in db.AccruedLeaveCounts on lam.LeaveTypeId equals tlc.LeaveTypeId
        //                          where lam.userId == userId
        //                          group new { lt.LeaveType1, tlc.Count, lam.daysCount } by new { lt.LeaveType1, tlc.Count, lam.daysCount } into g
        //                          select new
        //                          {
        //                              g.Key.LeaveType1,
        //                              g.Key.Count,
        //                              LeaveBalance = g.Key.Count - g.Sum(x => x.daysCount)
        //                          };
        //    AccruedLeaveCount objLeave_Leavecount = new AccruedLeaveCount();
        //    objLeave_Leavecount.Count = CL;
        //    db.AccruedLeaveCounts.Add(objLeave_Leavecount);

        //    db.SaveChanges();
        //    return Ok("Saved");

        //}
        //else
        //{

        //    var appliedLeaves = from lt in db.LeaveTypes
        //                        join lam in db.Leave_Approval_Matrix on lt.Id equals lam.LeaveTypeId
        //                        //join tlc in db.AccruedLeaveCounts on lam.LeaveTypeId equals tlc.LeaveTypeId
        //                        where lam.userId == userId
        //                        group new { lt.LeaveType1, lam.daysCount, lam.userId } by new { lt.LeaveType1, lam.daysCount, lam.userId } into g
        //                        select new
        //                        {
        //                            g.Key.userId,
        //                            g.Key.LeaveType1,
        //                            g.Key.daysCount,
        //                            //  LeaveBalance = g.Key.Count - g.Sum(x => x.daysCount)
        //                        };
        //    var accruedLeaves = (from al in db.AccruedLeaveCounts
        //                         where al.UserId == userId
        //                         select new
        //                         {
        //                             userId = al.UserId,
        //                             LeavetypeId = al.LeaveTypeId,
        //                             count = al.Count
        //                         });

        //    if (accruedLeaves == null)
        //    {
        //        return NotFound();
        //    }
        //    else
        //    {
        //        List<AccruedLeaveCount> objLeave_Leavecount = new List<AccruedLeaveCount>();
        //        foreach (var item in accruedLeaves.Where(n => n.userId == userId))
        //        {
        //            AccruedLeaveCount objleavebal = new AccruedLeaveCount();
        //            objleavebal.LeaveTypeId = item.LeavetypeId;
        //            //   objleavebal.LeaveTypeId = item.userId;
        //            objleavebal.Count = 3;
        //            // objleavebal.Count = item.Count;
        //            // db.AccruedLeaveCounts.Add(objleavebal);
        //            objLeave_Leavecount.Add(objleavebal);

        //        }

        //        // db.AccruedLeaveCounts.Add(objLeave_Leavecount);

        //        // db.AccruedLeaveCounts.SaveChanges();
        //        return Ok("Saved");
        //    }



        //  return Ok();


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
                                //join ls in db.LeaveStatus on k.status equals ls.Id
                                join al in db.ApprovalLevels on k.LevelId equals al.Id
                                where k.userId == userId
                                select new
                                {
                                    date = k.startDate,
                                    endDate = k.endDate,
                                    leaveCategory = lt.LeaveType1,
                                    approver = "",//u.firstName + " " + u.lastName,
                                    reason = k.reason,
                                    status = k.status,
                                    approverId = k.approverId
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
                    objleaveMatrix.endDate = item.endDate.ToString("dd-MM-yyyy");
                    objleaveMatrix.reason = item.reason;

                    var user = db.Users.Where(x => x.Id == item.approverId).FirstOrDefault();
                    objleaveMatrix.Approver = user.firstName + " " + user.lastName;

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

            List<appliedleave> leaaverequests = (from k in db.Leave_Approval_Matrix
                                                 join lt in db.LeaveTypes on k.LeaveTypeId equals lt.Id
                                                 join u in db.Users on k.userId equals u.Id
                                                 //join ls in db.LeaveStatus on k.status equals ls.Id
                                                 join al in db.ApprovalLevels on k.LevelId equals al.Id
                                                 where k.approverId == userId && k.status == 1 || k.status == 5 || k.status == 4
                                                 select new appliedleave
                                                 {
                                                     id = k.Id,
                                                     name = u.firstName + " " + u.lastName,
                                                     email = u.email,
                                                     date = k.startDate,
                                                     enddate = k.endDate,
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
                    objleaveMatrix.endDate = item.enddate.ToString("dd-MM-yyyy");
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
                    if (db.AdminSettings.FirstOrDefault().SettingValue == true)
                    {
                        if (objApprovedLeaveMatrix.status == 5 || objApprovedLeaveMatrix.status == 4) { approvedleave.LevelId = 2; }
                        approvedleave.status = objApprovedLeaveMatrix.status;

                    }
                    if (db.AdminSettings.FirstOrDefault().SettingValue == false)
                    {
                        //if (objApprovedLeaveMatrix.status == 5 || objApprovedLeaveMatrix.status == 4) { approvedleave.LevelId = 2; }
                        if (objApprovedLeaveMatrix.status == 4)
                            approvedleave.status = 3;
                        if (objApprovedLeaveMatrix.status == 5)
                            approvedleave.status = 2;
                    }

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

        public string replaceLeaveApplicationContentHTML(appliedleave objLeaveMatrix)
        {
            string body = string.Empty;
            //using streamreader for reading my htmltemplate   

            using (StreamReader reader = new StreamReader(System.Web.Hosting.HostingEnvironment.MapPath("~/HtmlTemplate/Email_HTML.html")))
            {
                body = reader.ReadToEnd();
            }

            body = body.Replace("{ApporverFirst name}", db.Users.FirstOrDefault(x => x.Id == objLeaveMatrix.approverId).firstName); //replacing the required things  

            body = body.Replace("{ApporverLast Name}", db.Users.FirstOrDefault(x => x.Id == objLeaveMatrix.approverId).lastName);

            body = body.Replace("{requesterFirst Name}", db.Users.FirstOrDefault(x => x.Id == objLeaveMatrix.userId).firstName);

            body = body.Replace("{requesterLast Name}", db.Users.FirstOrDefault(x => x.Id == objLeaveMatrix.userId).lastName);

            body = body.Replace("{reason}", objLeaveMatrix.reason);

            return body;

        }

        //// PUT: api/Users/5
        //[ResponseType(typeof(void))]
        //public IHttpActionResult PutUser(int id, User user)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != user.Id)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(user).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!UserExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        //// POST: api/Users
        //[ResponseType(typeof(User))]
        //public IHttpActionResult PostUser(User user)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Users.Add(user);
        //    db.SaveChanges();

        //    return CreatedAtRoute("DefaultApi", new { id = user.Id }, user);
        //}

        //// DELETE: api/Users/5
        //[ResponseType(typeof(User))]
        //public IHttpActionResult DeleteUser(int id)
        //{
        //    User user = db.Users.Find(id);
        //    if (user == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Users.Remove(user);
        //    db.SaveChanges();

        //    return Ok(user);
        //}

        //protected override void Dispose(bool disposing)
        //{
        //    if (disposing)
        //    {
        //        db.Dispose();
        //    }
        //    base.Dispose(disposing);
        //}

        //private bool UserExists(int id)
        //{
        //    return db.Users.Count(e => e.Id == id) > 0;
        //}
    }
}