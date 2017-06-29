import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
    
    _apiURI : string;

    constructor() {
        //This should be changed accourding to API Url.
        this._apiURI = 'http://localhost:60227/api/';
        //this._apiURI = 'http://lms.gear.host/api/';
     }

     getApiURI() {
         return this._apiURI;
     }

     getApiHost() {
         return this._apiURI.replace('api/','');
     }
}