import { Injectable } from '@angular/core';
import { Http ,Headers, Response,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/apiconfig';


@Injectable()
export class AuthenticationService {
    
     _baseUrl: string = '';

    
     constructor(private http: Http,private _webapi:ConfigService) {
        this._baseUrl = _webapi.getApiURI();
        
     }


    login(username: string, password: string) {   
        //var  headers = new Headers();

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });    
        return this.http.post(this._baseUrl +'/user/Login', JSON.stringify({ username: username, password: password }),options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                //if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    return user;
                //}
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}