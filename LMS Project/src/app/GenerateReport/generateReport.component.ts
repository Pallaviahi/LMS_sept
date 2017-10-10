
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { adminsettingsModel } from '../_models/index';
import { LocalDataSource } from 'ng2-smart-table';
import { approvedLeaveModel } from '../_models/index';
import { GlobalService } from '../global';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AdminService, } from '../_services/index';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'generateReport.component.html'
})

export class GenerateReportComponent implements OnInit {
    private isUploadBtn: boolean = true;


    ngOnInit() {

    }

    constructor(private http: Http, private adminService: AdminService, private globalVar: GlobalService, public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }}