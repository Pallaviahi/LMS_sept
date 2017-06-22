import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../_models/index';
import { AdminService} from '../_services/index';
import { approvedLeaveModel } from '../_models/index';
import { GlobalService } from '../global';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
 
@Component({
    moduleId: module.id.toString(),
    templateUrl: 'AdminAddUser.Component.html'
})



export class AdminAddUserComponent implements OnInit {
    currentUser: User;

    model: approvedLeaveModel = new approvedLeaveModel;
 
    @ViewChild('myModal') modal: ModalComponent;

    constructor(private adminService: AdminService, private globalVar: GlobalService, public toastr: ToastsManager) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
         
    }

    open(recordId: number) {
       
    }
}