
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { LocalDataSource } from 'ng2-smart-table';
import { NguiMessagePopupComponent, NguiPopupComponent } from '@ngui/popup';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    usersLeaves: any[] = [];

    public appliedLeave: any[] = [];
    public testTypes: any[] = [];
    public leaveRequests: any[] = [];
    public filterQuery = "";
    message: string;
    @ViewChild(NguiPopupComponent) popup: NguiPopupComponent;

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadAllUsers();
        this.loadUserLeaves();
        this.loadAppliedLeave();
        this.loadLeaveTypes();
        this.loadLeaveRequests();
    }

    ngOnInit() {
        // 
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
                    if (v.status == 0) { v.status = "Pending" }
                    if (v.status == 1) { v.status = "Approved" }
                    if (v.status == 2) { v.status = "Rejected" }
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
                    if (v.status == 0) { v.status = "Pending" }
                    if (v.status == 1) { v.status = "Approved" }
                    if (v.status == 2) { v.status = "Rejected" }
                    this.leaveRequests.push(v);
                }
            });
    }

    openPopup(size: number, title: string) {
        this.popup.open(NguiMessagePopupComponent, {
            classNames: size,
            title: title,
            message: "This is message given using popup.open()",
            buttons: {
                CANCEL: () => {
                    this.message = "Cancel button is pressed";
                    this.popup.close();
                }
            }
        });
    }
}