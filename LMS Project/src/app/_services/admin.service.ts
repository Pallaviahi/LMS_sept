import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User, types, applyLeaveModel, approvedLeaveModel } from '../_models/index';
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
        let  headers = new Headers({ 'Content-Type': 'application/json' });
        let  options = new RequestOptions({ headers: headers });
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
        return this.http.get(this._baseUrl + '/admin/LoadusersForAdmin', options)
            .map((response: Response) => {
                let users = response.json();
                // console.log(leaverequests);
                return users;
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