
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { LocalDataSource } from 'ng2-smart-table';
import { approvedLeaveModel } from '../_models/index';
import { GlobalService } from '../global';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AdminService, } from '../_services/index';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'adminsettings.component.html'
})

export class AdminSettingsComponent implements OnInit {

    public adminSettings: any[] = [];
    public IsAdminPermissionRequiredForLeaveApproval : boolean;
    ngOnInit() {
        //this.loadLeaveRequests();
        this.LoadAdminSettings();
    }

    constructor(private adminService: AdminService,public toastr: ToastsManager) {
        //this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    // private loadAdminSettings(){
    //     this.adminService.LoadAdminSettings()
    //         .subscribe(
    //         data => {
    //              for (var v of data) {
    //                 this.adminSettings = [];
    //                 this.adminSettings.push(v);
    //              }
    //             }
    //         });
    // }

    private LoadAdminSettings() {
        //var test = this.userService.leaveTypes().subscribe(res => this.testTypes = res);
        this.adminService.LoadAdminSettings()
            .subscribe(
            data => {
                for (var v of data) {
                   if(v.Setting == 'IsAdminPermissionRequiredForLeaveApproval')
                   {
                        this.IsAdminPermissionRequiredForLeaveApproval = v.SettingValue;
                   }
                }
                console.log('these are admin settings');
                console.log(this.IsAdminPermissionRequiredForLeaveApproval);
            });
    }
}