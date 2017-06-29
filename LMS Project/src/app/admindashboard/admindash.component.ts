import { Component, OnInit, ViewChild } from '@angular/core';
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
    userModel : User = new User;
    public leaveRequests: any[] = [];
    public adminUsers: any[] = [];
    public ReportingLeadsList: any[] = [];
    public DesignationList: any[] = [];
    public filterQuery = "";
    leaveRequestId: number;
    userToUpdateId: number;
    @ViewChild('myModal') modal: ModalComponent;
    @ViewChild('updateUser') updateUser: ModalComponent;

    constructor(private adminService: AdminService, private globalVar: GlobalService, public toastr: ToastsManager) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //this.userModel =this.currentUser; 
    }

    ngOnInit() {
        this.loadLeaveRequests();
        this.LoadusersForAdmin();
    }

    open(recordId: number) {
        this.modal.open();
        this.leaveRequestId = recordId;
    }

    openUserUpdateModel(empId: number) {
        this.updateUser.open();
        this.userToUpdateId = empId;
        this.LoadReportingLeads();
        this.LoadDesignation();
        this.LoadUpdateUserDetails();
    }


    LoadUpdateUserDetails(){
        this.adminService.LoadUpdateUserDetails(this.userToUpdateId)
            .subscribe(
            data => {
                this.userModel = data;
                console.log(this.userModel);
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
                for (var v of data) {
                    if (v.status == 1) { v.status = "Pending" }
                    if (v.status == 2) { v.status = "Rejected " }
                    if (v.status == 3) { v.status = "Approved" }
                    if (v.status == 4) { v.status = "1st Level Approved" }
                    if (v.status == 5) { v.status = "Ist Level Rejected" }
                    this.leaveRequests = [];
                    this.leaveRequests.push(v);
                }
                console.log('these are leave requests');
                console.log(this.leaveRequests);
            });
    }

    private updateLeaveApplication(LeaveStatus: number) {
        // var userDetails = JSON.parse(localStorage.getItem('currentUser'));
        //setting the required properties;  
        var errMessage = '';
        this.model.id = this.leaveRequestId;
        this.model.status = LeaveStatus;
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
}