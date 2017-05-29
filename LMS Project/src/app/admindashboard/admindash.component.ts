import { Component, OnInit } from '@angular/core';
import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { ApplyLeaveComponent } from '../applyleave/index';
//import { ApplyLeaveComponent } from '../applyleave/applyleave.component';
//import {NG2DataTableModule} from 'angular2-datatable-pagination';
@Component({
    moduleId: module.id.toString(),
    templateUrl: 'admindash.component.html'
})



export class AdminDashComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    public appliedLeave: any[] = [];
    public testTypes: any[] = [];
    public leaveRequests: any[] = [];
    public usersLeaves: any[] = [];

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
        this.loadAppliedLeave();
        this.loadLeaveTypes();
        this.loadLeaveRequests();
        this.loadUserLeaves();
    }

    loadLeaveTypes() {
        //var test = this.userService.leaveTypes().subscribe(res => this.testTypes = res);
        this.userService.leaveTypes()
            .subscribe(
            data  =>  {
                for (var  v  of  data) {
                    this.testTypes.push(v);
                }
                console.log(data);
            });
    }

    loadAppliedLeave() {
        //var test = this.userService.leaveTypes().subscribe(res => this.testTypes = res);
        this.userService.AppliedLeave(this.currentUser.id)
            .subscribe(
            data  =>  {
                for (var  v  of  data) {
                    this.appliedLeave.push(v);
                }
            });
    }

    loadLeaveRequests() {
        //var test = this.userService.leaveTypes().subscribe(res => this.testTypes = res);
        this.userService.LeaveRequests(this.currentUser.id)
            .subscribe(
            data  =>  {
                for (var  v  of  data) {
                    this.leaveRequests.push(v);
                }
            });
    }


    private  loadUserLeaves() {
        this.userService.loadUserLeaves(this.currentUser.id).subscribe(data  =>  {
            for  (var  v  of  data) {
                this.usersLeaves.push(v);
            }
            console.log(this.usersLeaves);
            console.log('helloapprover');
        });
        console.log('Leave Types');
        console.log(this.loadUserLeaves);
    }


    deleteUser(id: number) {
        this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
}