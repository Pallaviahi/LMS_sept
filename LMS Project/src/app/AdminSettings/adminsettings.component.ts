
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { adminsettingsModel } from '../_models/index';
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
    public IsAdminPermissionRequiredForLeaveApproval: boolean;
    model: adminsettingsModel = new adminsettingsModel;

    ngOnInit() {
        //this.loadLeaveRequests();
        this.LoadAdminSettings();
    }

    constructor(private adminService: AdminService, private globalVar: GlobalService, public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
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
                    if (v.Setting == 'IsAdminPermissionRequiredForLeaveApproval') {
                        this.model.id = 1;
                        this.model.IsAdminPermissionRequiredForLeaveApproval = v.SettingValue;
                    }
                }
                //console.log('these are admin settings');
                //console.log(this.IsAdminPermissionRequiredForLeaveApproval);
            });
    }

    public SaveAdminSettings() {
        this.globalVar.loading = true;
        this.adminService.UpdateAdminSettings(this.model)
            .subscribe(
            data => {
                this.globalVar.loading = false;
                if (data.status == 200) {
                    this.toastr.success('Setting Updated Successfully !');
                }
                else {
                    this.toastr.success("Something went wrong");
                }
                // for (var v of data) {
                //    if(v.Setting == 'IsAdminPermissionRequiredForLeaveApproval')
                //    {
                //         this.IsAdminPermissionRequiredForLeaveApproval = v.SettingValue;
                //    }
                // }
                // console.log('these are admin settings');
                // console.log(this.IsAdminPermissionRequiredForLeaveApproval);
            });
    }
}