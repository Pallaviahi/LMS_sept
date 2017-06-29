import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { User } from '../_models/index';
import { AdminService } from '../_services/index';

import { GlobalService } from '../global';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'AdminAddUser.Component.html'
})



export class AdminAddUserComponent implements OnInit {
    currentUser: User;
    public ReportingLeadsList: any[] = [];
    public DesignationList: any[] = [];
    public GenderArray : any[] = [] ;
    model: User = new User;

    @ViewChild('myModal') modal: ModalComponent;

    constructor(private adminService: AdminService, private globalVar: GlobalService, public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.LoadReportingLeads();
        this.LoadDesignation();
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.GenderArray.push("Male");
        this.GenderArray.push("Female");
    }

    LoadReportingLeads() {
        this.adminService.LoadReportingLeads()
            .subscribe(
            data => {
                for (var v of data) {
                    this.ReportingLeadsList.push(v);
                }
            });
    }

    LoadDesignation() {
        this.adminService.LoadDesignation()
            .subscribe(
            data => {
                for (var v of data) {
                    this.DesignationList.push(v);

                }

            });
    }

    register() {
        this.globalVar.loading = true;
        this.model.DateOfJoining = this.model.DateOfJoining.formatted;
        this.adminService.RegisterUser(this.model)
            .subscribe(
            data => {
                this.globalVar.loading = false;
                if (data.text() == "true") {
                    this.toastr.success('User Created Successfully !');
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