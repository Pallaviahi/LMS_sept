
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { LocalDataSource } from 'ng2-smart-table';
import { approvedLeaveModel } from '../_models/index';
import { GlobalService } from '../global';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {

    currentUser: User;
    users: User[] = [];
    usersLeaves: any[] = [];
    model: approvedLeaveModel = new approvedLeaveModel;
    public appliedLeave: any[] = [];
    public testTypes: any[] = [];
    public leaveRequests: any[] = [];
    public filterQuery = "";
    leaveRequestId: number;

    message: string;
    @ViewChild('myModal') modal: ModalComponent;

    //@ViewChild(NguiPopupComponent) popup: NguiPopupComponent;

    constructor(private userService: UserService, private globalVar: GlobalService, public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadAllUsers();
        this.loadUserLeaves();
        this.loadAppliedLeave();
        this.loadLeaveTypes();
        this.loadLeaveRequests();
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // 
    }

    open(recordId: number) {
        this.modal.open();
        this.leaveRequestId = recordId;
    }

    deleteUser(id: number) {
        this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }

    private loadUserLeaves() {
        this.userService.loadUserLeaves(this.currentUser.id).subscribe(data => {
            for (var v of data) {
                this.usersLeaves.push(v);
            }
        });
    }

    private updateLeaveApplication(LeaveStatus: number) {
        // var userDetails = JSON.parse(localStorage.getItem('currentUser'));
        //setting the required properties;  
        var errMessage = '';
        this.model.id = this.leaveRequestId;
        this.model.status = LeaveStatus;
        this.globalVar.loading = true;

        this.userService.updateLeaveApplicationService(this.model)
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

    loadLeaveTypes() {
        //var test = this.userService.leaveTypes().subscribe(res => this.testTypes = res);
        this.userService.leaveTypes()
            .subscribe(
            data => {
                for (var v of data) {
                    this.testTypes.push(v);
                }
            });
    }

    loadAppliedLeave() {
        //var test = this.userService.leaveTypes().subscribe(res => this.testTypes = res);
        this.userService.AppliedLeave(this.currentUser.id)
            .subscribe(
            data => {
                for (var v of data) {
                    // if (v.status == 0) { v.status = "Pending" }
                    // if (v.status == 1) { v.status = "Approved" }
                    // if (v.status == 2) { v.status = "Rejected" }
                    // if (v.status == 3) { v.status = "1st Level Approved" }
                    this.appliedLeave.push(v);
                }
            });
    }

    loadLeaveRequests() {
        //var test = this.userService.leaveTypes().subscribe(res => this.testTypes = res);
        this.userService.LeaveRequests(this.currentUser.id)
            .subscribe(
            data => {
                for (var v of data) {
                    // if (v.status == 0) { v.status = "Pending" }
                    // if (v.status == 1) { v.status = "Approved" }
                    // if (v.status == 2) { v.status = "Rejected" }
                    // if (v.status == 3) { v.status = "1st Level Approved" }
                    this.leaveRequests.push(v);
                }
            });
    }

    /* openPopup(size: number) {
         this.popup.open(NguiMessagePopupComponent, {
             classNames: size,
             title: "Hello Small Popup",
             message: "This is message given using popup.open()",
             buttons: {
                 CANCEL: () => {
                     this.message = "Cancel button is pressed";
                     this.popup.close();
                 },
                 OK: () => {
                     this.message = "Ok button is pressed";
                 },
             }
         });
     }*/
}