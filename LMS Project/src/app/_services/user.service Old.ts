import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User,types } from '../_models/index';
import { ConfigService } from '../config/apiconfig';
import {Observable} from 'rxjs/Observable';
 

@Injectable()
export class UserService {

    _baseUrl: string = '';

    constructor(private http: Http,private _webapi:ConfigService) { 
        this._baseUrl = _webapi.getApiURI();
    }

    getAll() {
        return this.http.get('/api/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post('/api/users', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    leaveTypes() {   
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });   
        return this.http.get(this._baseUrl +'/user/LeaveTypes',options)
            .map((response: Response) => {
                let typeOfLeaves = response.json();
               // console.log(typeOfLeaves);
                return typeOfLeaves;
            });
    }

    approverList() {   
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });   
        return this.http.get(this._baseUrl +'/user/ApproverList',options)
            .map((response: Response) => {
                let listofApprovers = response.json();
             //   console.log(listofApprovers);
                return listofApprovers;
            });
    }

//    leaveTypes() : Observable<types[]> { 
//         return this.http.get(this._baseUrl +'/user/LeaveTypes')
//             .map(res => res.json())  
            
//     }   
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

 