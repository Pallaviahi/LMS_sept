import { Component, OnInit } from '@angular/core';
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
    // users: User[] = [];
    model: approvedLeaveModel = new approvedLeaveModel;
    // public appliedLeave: any[] = [];
    // public testTypes: any[] = [];
    public leaveRequests: any[] = [];
    // public usersLeaves: any[] = [];
    public filterQuery = "";

    constructor(private adminService: AdminService, private globalVar: GlobalService, public toastr: ToastsManager) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadLeaveRequests();
    }



    loadLeaveRequests() {
        //var test = this.userService.leaveTypes().subscribe(res => this.testTypes = res);
        this.adminService.LeaveRequests()
            .subscribe(
            data => {
                for (var v of data) {
                    if (v.status == 1) { v.status = "Pending" }
                    if (v.status == 2) { v.status = "Approved" }
                    if (v.status == 3) { v.status = "Rejected" }
                    if (v.status == 4) { v.status = "1st Level Approved" } 
                    this.leaveRequests.push(v);
                }
                console.log('these are leave requests');
                console.log(this.leaveRequests);
            });
    }

    // private updateLeaveApplication(LeaveStatus: number) {
    //     // var userDetails = JSON.parse(localStorage.getItem('currentUser'));
    //     //setting the required properties;  
    //     var errMessage = '';
    //     this.model.id = 15;
    //     this.model.status = LeaveStatus;

    //     this.globalVar.loading = true;

    //     this.userService.updateLeaveApplicationService(this.model)
    //         .subscribe(
    //         data => {
    //             this.globalVar.loading = false;
    //             this.toastr.success('Leave Application Approved!');
    //             this.loadLeaveRequests();
    //         },
    //         error => {
    //             this.globalVar.loading = false;
    //             this.toastr.error('Something went wrong !');
    //         });
    // }
}