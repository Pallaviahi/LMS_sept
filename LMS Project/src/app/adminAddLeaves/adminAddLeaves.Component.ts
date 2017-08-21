import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { User, newLeave } from '../_models/index';
import { AdminService } from '../_services/index';

import { GlobalService } from '../global';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'AdminAddLeaves.Component.html'
})



export class AdminAddLeavesComponent implements OnInit {
    currentUser: User;
    public ReportingLeadsList: any[] = [];
    public DesignationList: any[] = [];
    model: newLeave = new newLeave;

    @ViewChild('myModal') modal: ModalComponent;

    constructor(private adminService: AdminService, private globalVar: GlobalService, public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {

    }

    

    register() {
        this.globalVar.loading = true;
        this.adminService.RegisterLeave(this.model)
            .subscribe(
            data => {
                this.globalVar.loading = false;
                if (data.text() == "true") {
                    this.toastr.success('Leave Created Successfully !');
                }
                else {
                    this.toastr.success("LeaveType Already Exists");
                }
                //this.loadLeaveRequests();
            },
            error => {
                this.globalVar.loading = false;
                this.toastr.error('Something went wrong !');
            });
    }

    


}