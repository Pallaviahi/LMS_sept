import { Component, OnInit, ViewChild,ViewContainerRef } from '@angular/core';
import { types } from '../_models/index';
import { User } from '../_models/index';
import { AdminService, } from '../_services/index';
import { ApplyLeaveComponent } from '../applyleave/index';
import { approvedLeaveModel } from '../_models/index';
import { GlobalService } from '../global';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
//import { ApplyLeaveComponent } from '../applyleave/applyleave.component';
//import {NG2DataTableModule} from 'angular2-datatable-pagination';
@Component({
    moduleId: module.id.toString(),
    templateUrl: 'admindash.component.html'
})

export class AdminDashComponent implements OnInit {
    currentUser: User;

    model: approvedLeaveModel = new approvedLeaveModel;
    userModel: User = new User;
    leavetypeModel: types = new types;
   
    public leaveRequests: any[] = [];
    public adminUsers: any[] = [];
    public adminLeaves: any[] = [];
    public ReportingLeadsList: any[] = [];
    public DesignationList: any[] = [];
    public filterQuery = "";
    leaveRequestId: number;
    leaveRequestStatus : number;
    userToUpdateId: number;
    userToDeleteId: number;
    LeaveToDeleteId:number;
    LeavetoUpdateId: number;
    @ViewChild('myModal') modal: ModalComponent;
    @ViewChild('updateUser') updateUser: ModalComponent;
    @ViewChild('updateLeave') updateLeave: ModalComponent;
    @ViewChild('DeleteUserPopup') DeleteUserPopup: ModalComponent;
    @ViewChild('DeleteLeavePopup') DeleteLeavePopup: ModalComponent;

    constructor(private adminService: AdminService, private globalVar: GlobalService, public toastr: ToastsManager,vcr: ViewContainerRef) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //this.userModel =this.currentUser; 
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.loadLeaveRequests();
        this.LoadusersForAdmin();
        this.LoadleavesForAdmin();
    }

    // open(recordId: number) {
    //     this.modal.open();
    //     this.leaveRequestId = recordId;
    // }

   
 open(recordId: number, event:any) {
        this.modal.open();
        this.leaveRequestId = recordId;
        if(event.target.id == "btnReject"){this.leaveRequestStatus = 2}
        if(event.target.id == "btnAccept"){this.leaveRequestStatus = 3}
    }    

    OpenDeleteUserModal(empId: number) {
        this.DeleteUserPopup.open();
        this.userToDeleteId = empId;
    }

    OpenDeleteLeaveModal(leaveId:number){
      this.DeleteLeavePopup.open();
        this.LeaveToDeleteId = leaveId;  
    }

    openUserUpdateModel(empId: number) {
        this.updateUser.open();
        this.userToUpdateId = empId;
        this.LoadReportingLeads();
        this.LoadDesignation();
        this.LoadUpdateUserDetails();
       
    }
  

    openLeaveUpdateModel(Id: number) {
        this.updateLeave.open();
         this.LeavetoUpdateId = Id;
        this.LoadUpdateLeaveDetails();
        // this.userToUpdateId = empId;
        // this.LoadReportingLeads();
        // this.LoadDesignation();
        // this.LoadUpdateUserDetails();
    }


    LoadUpdateUserDetails() {
        this.adminService.LoadUpdateUserDetails(this.userToUpdateId)
            .subscribe(
            data => {
                this.userModel = data;
                console.log(this.userModel);
            });
    }
     LoadUpdateLeaveDetails() {
        this.adminService.LoadUpdateLeaveDetails(this.LeavetoUpdateId)
            .subscribe(
            data => {
                this.leavetypeModel = data;
                console.log(this.leavetypeModel);
            });
    }

    LoadusersForAdmin() {
        //var test = this.userService.leaveTypes().subscribe(res => this.testTypes = res);
        this.adminService.LoadusersForAdmin()
            .subscribe(
            data => {
                for (var v of data) {
                    this.adminUsers.push(v);
                }
                 console.log(data);
            });
    }

 LoadleavesForAdmin() {
        //var test = this.userService.leaveTypes().subscribe(res => this.testTypes = res);
        this.adminService.LoadleavesForAdmin()
            .subscribe(
            data => {
                for (var v of data) {
                    this.adminLeaves.push(v);
                }
                console.log(data);
            });
    }

    LoadReportingLeads() {
        this.ReportingLeadsList = [];

        this.adminService.LoadReportingLeads()
            .subscribe(
            data => {
                for (var v of data) {
                    this.ReportingLeadsList.push(v);
                }
            });
    }

    LoadDesignation() {
        this.DesignationList = [];
        this.adminService.LoadDesignation()
            .subscribe(
            data => {
                for (var v of data) {
                    this.DesignationList.push(v);
                }
            });
    }


    loadLeaveRequests() {
        //var test = this.userService.leaveTypes().subscribe(res => this.testTypes = res);
        this.adminService.LeaveRequests()
            .subscribe(
            data => {
                this.leaveRequests = [];
                for (var v of data) {
                    if (v.status == 1) { v.status = "Pending" }
                    if (v.status == 2) { v.status = "Rejected " }
                    if (v.status == 3) { v.status = "Approved" }
                    if (v.status == 4) { v.status = "1st Level Approved" }
                    if (v.status == 5) { v.status = "Ist Level Rejected" }
                    this.leaveRequests.push(v);
                }
                console.log('these are leave requests');
                console.log(this.leaveRequests);
            });
    }

    private updateLeaveApplication() {
        // var userDetails = JSON.parse(localStorage.getItem('currentUser'));
        //setting the required properties;  
        var errMessage = '';
        this.model.id = this.leaveRequestId;
        this.model.status = this.leaveRequestStatus;
        this.globalVar.loading = true;

        this.adminService.updateLeaveApplicationService(this.model)
            .subscribe(
            data => {
                this.globalVar.loading = false;
                this.toastr.success('Leave Application updated Successfully !');
                this.loadLeaveRequests();
            },
            error => {
                this.globalVar.loading = false;
                this.toastr.error('Something went wrong !');
            });
    }

    updateUserInfo() {
        this.globalVar.loading = true;
        this.adminService.UpdateUser(this.userModel)
            .subscribe(
            data => {
                this.globalVar.loading = false;
                if (data.text() == "true") {
                    this.toastr.success('User Updated Successfully !');
                }
                else {
                    this.toastr.success("User Already Exists");
                }
                //this.loadLeaveRequests();
            },
            error => {
                this.globalVar.loading = false;
                this.toastr.error('Something went wrong !');
            });
    }

    updateLeaveType() {
        this.globalVar.loading = true;
        this.adminService.updateLeave(this.leavetypeModel)
            .subscribe(
            data => {
                this.globalVar.loading = false;
                if (data.text() == "true") {
                    this.toastr.success('Leave Type Successfully !');
                }
                else {
                    this.toastr.success("Leave Type Already Exists");
                }
                //this.loadLeaveRequests();
            },
            error => {
                this.globalVar.loading = false;
                this.toastr.error('Something went wrong !');
            });
    }

    deleteUser() {
        this.globalVar.loading = true;
        this.adminService.DeleteUser(this.userToDeleteId)
            .subscribe(
            data => {
                this.globalVar.loading = false;
                if (data.text() == "true") {
                    this.toastr.success('User Deleted Successfully !');
                }
                else {
                    this.toastr.success("Something went wrong");
                }
                this.adminUsers = [];
                this.LoadusersForAdmin();
            },
            error => {
                this.globalVar.loading = false;
                this.toastr.error('Something went wrong !');
            });
    }

    deleteLeave() {
        this.globalVar.loading = true;
        this.adminService.DeleteLeave(this.LeaveToDeleteId)
            .subscribe(
            data => {
                this.globalVar.loading = false;
                if (data.text() == "true") {
                    this.toastr.success('User Deleted Successfully !');
                }
                else {
                    this.toastr.success("Something went wrong");
                }
                this.adminUsers = [];
                this.LoadusersForAdmin();
            },
            error => {
                this.globalVar.loading = false;
                this.toastr.error('Something went wrong !');
            });
    }
}