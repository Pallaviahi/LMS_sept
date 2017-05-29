import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../_services/index';
import { Observable } from 'rxjs/Observable';
import { types } from '../_models/index';
import { applyLeaveModel } from '../_models/index';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'applyleave.component.html'
})

export class ApplyLeaveComponent implements OnInit {

    model: applyLeaveModel = new applyLeaveModel;
     
    public testTypes: any[] = [];
    public approvers: any[] = [];

    selectedLeaveType: any;
    options: DatePickerOptions = ({
        format: "DD-MM-YYYY",
        firstWeekdaySunday: false,
    });

    constructor(private router: Router, private userService: UserService, public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.options = new DatePickerOptions();
        this.toastr.setRootViewContainerRef(vcr);
    }


    ngOnInit() {
        this.loadLeaveTypes();
        this.loadapproverList();
    }

    loadLeaveTypes() {
        this.userService.leaveTypes()
            .subscribe(
            data => {
                for (var v of data) {
                    this.testTypes.push(v);
                }
                this.model.leaveTypeId = this.testTypes[0];
            });

    }

    loadapproverList() {
        this.userService.approverList()
            .subscribe(
            dataapprover => {
                for (var v of dataapprover) {
                    this.approvers.push(v);
                }
            });
    }

    applyLeave() {
        var userDetails = JSON.parse(localStorage.getItem('currentUser'));
        //setting the required properties;
        this.model.userId = userDetails.id;
        this.model.remarks = null;
        this.model.startDate = this.model.startDateModel.formatted;//this.model.startDate.momentObj.toDate();
        this.model.endDate = this.model.endDateModel.formatted;//this.model.endDate.momentObj.toDate();
        this.userService.leaveApplication(this.model)
            .subscribe(
            data => {
                if (data.status == 200) {
                    this.showSuccess();
                }
            });
    }

    showSuccess() {
        this.toastr.success('You have applied your leave Successfully !');
    }
}



