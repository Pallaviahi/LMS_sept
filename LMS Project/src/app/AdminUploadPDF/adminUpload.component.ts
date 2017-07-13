
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
    templateUrl: 'adminUpload.component.html'
})

export class AdminUploadFileComponent implements OnInit {
    private isUploadBtn: boolean = true;


    ngOnInit() {

    }

    constructor(private http: Http, private adminService: AdminService, private globalVar: GlobalService, public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    //file upload event  
    uploadFiles(event: any) {
        debugger;
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            this.adminService.uploadFiles(formData)
            .subscribe(
                data => {
                    this.globalVar.loading = false;
                    this.toastr.success('File Uploaded Successfully !');

                },
                error => {
                    this.globalVar.loading = false;
                    this.toastr.error("Something went wrong");
                }
            )
        }
    }
}