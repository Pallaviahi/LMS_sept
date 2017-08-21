import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { adminsettingsModel,User, types, applyLeaveModel, approvedLeaveModel,newLeave } from '../_models/index';

import { ConfigService } from '../config/apiconfig';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AdminService {

    _baseUrl: string = '';
    constructor(private http: Http, private _webapi: ConfigService) {
        this._baseUrl = _webapi.getApiURI();
    }

    LeaveRequests() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this._baseUrl + '/admin/LeaveRequests', options)
            .map((response: Response) => {
                let leaverequests = response.json();
                // console.log(leaverequests);
                return leaverequests;
            });
    }


    updateLeaveApplicationService(approvedleaveModel: approvedLeaveModel) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._baseUrl + '/admin/ApprovedLeave', approvedleaveModel, options)
            .map((response: Response) => {
                //   console.log(response);
            });
    }

    //Load Admin Settings
    LoadAdminSettings() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this._baseUrl + '/admin/LoadAdminSettings', options)
            .map((response: Response) => {
                let AdminSettings = response.json();
                // console.log(leaverequests);
                return AdminSettings;
            });
    }

    //Load Admin Settings
    LoadusersForAdmin() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this._baseUrl + '/admin/LoadUsersForAdmin', options)
            .map((response: Response) => {
                let users = response.json();
                // console.log(leaverequests);
                return users;
            });
    }

//load Types of leaves
    LoadleavesForAdmin(){
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this._baseUrl + '/admin/LoadLeavesForAdmin', options)
            .map((response: Response) => {
                let leaves = response.json();
                // console.log(leaverequests);
                return leaves;
            });
    }

    LoadUpdateUserDetails(empId: number) {   
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });    
        return this.http.get(this._baseUrl +'/admin/LoadUpdateUserDetails/' + empId,options)
            .map((response: Response) => {
                let user = response.json();
                return user;
            });
    }

    LoadReportingLeads() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this._baseUrl + '/admin/ReportingLeads', options)
            .map((response: Response) => {
                let leads = response.json();
                //   console.log(listofApprovers);
                return leads;
            });
    }

    LoadDesignation() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this._baseUrl + '/admin/Designations', options)
            .map((response: Response) => {
                let designation = response.json();
                //   console.log(listofApprovers);
                return designation;
            });
    }

    RegisterUser(user:User) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._baseUrl + '/admin/RegisterUser',user, options)
            .map((response: Response) => {
                //let designation = response.json();
                //   console.log(listofApprovers);
                return response;
            });
    }

    RegisterLeave(newleave:newLeave) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._baseUrl + '/admin/RegisterLeave',newleave, options)
            .map((response: Response) => {
                //let designation = response.json();
                //   console.log(listofApprovers);
                return response;
            });
    }

    UpdateUser(user:User) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._baseUrl + '/admin/UpdateUser',user, options)
            .map((response: Response) => {
                //let designation = response.json();
                //   console.log(listofApprovers);
                return response;
            });
    }

    UpdateAdminSettings(adminsettingsModel:adminsettingsModel) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._baseUrl + '/admin/UpdateAdminSettings',adminsettingsModel, options)
            .map((response: Response) => {
                //let designation = response.json();
                //   console.log(listofApprovers);
                return response;
            });
    }

    DeleteUser(empId: number) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this._baseUrl +'/admin/DeleteUser/' + empId,options)
            .map((response: Response) => {
                //let designation = response.json();
                //   console.log(listofApprovers);
                return response;
            });
    }


    DeleteLeave(leaveId: number) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this._baseUrl +'/admin/DeleteLeave/' + leaveId,options)
            .map((response: Response) => {
                //let designation = response.json();
                //   console.log(listofApprovers);
            });
    }
    //Upload Files
    uploadFiles(formData: any) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._baseUrl +'/admin/UploadFileApi/', formData,options)
            .map((response: Response) => {
                return response;
            });
    }

    // private helper methods
    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}