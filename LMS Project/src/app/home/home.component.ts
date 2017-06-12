import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { GlobalService } from '../global';
@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html'
})



export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
     

    constructor(private userService: UserService,private globalVar:GlobalService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        // this.globalVar.loading = true;
        //this.loadAllUsers();
    }

    // deleteUser(id: number) {
    //     this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    // }

    // private loadAllUsers() {
    //     this.userService.getAll().subscribe(users => { this.users = users; });
    // }
}