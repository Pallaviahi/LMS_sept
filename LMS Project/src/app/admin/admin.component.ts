import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'admin.component.html'
})

export class AdminComponent implements OnInit {

    ngOnInit() {
            console.log("Hello World");
        }

}