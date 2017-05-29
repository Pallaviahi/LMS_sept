import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../_services/index';
import { Observable } from 'rxjs/Observable';
import { types } from '../_models/index';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'applyleave.component.html'
})

export class ApplyLeaveComponent implements OnInit {

    public testTypes: any[] = [];
    public approvers: any[] = [];
    selectedLeaveType: any;
    constructor(private router: Router, private userService: UserService) {
        //this.testTypes = [];
    }

    //selectedCountry:Country = new Country(2, 'India');
    // countries = [
    //     new Country(1, 'USA' ),
    //     new Country(2, 'India' ),
    //     new Country(3, 'Australia' ),
    //     new Country(4, 'Brazil')
    // ];

    ngOnInit() {
        //console.log("Hello World");
        this.loadLeaveTypes();
        this.loadapproverList();
    }

    loadLeaveTypes() {
        //var test = this.userService.leaveTypes().subscribe(res => this.testTypes = res);
        this.userService.leaveTypes()
            .subscribe(
            data  =>  {
                for (var  v  of  data) {
                    this.testTypes.push(v);
                }
            });
    }

    loadapproverList() {
        this.userService.approverList()
            .subscribe(
            dataapprover => {
                for (var v of dataapprover) {
                    this.approvers.push(v);
                }
                console.log(dataapprover);
                console.log('helloapprover');
            });

    }
    // private loadLeaveTypes() {
    //     this.userService.leaveTypes().subscribe(
    //             data => {
    //                  this.leaveTypes.push(data);
    //             },
    //             error => {

    //             });
    //     console.log(this.leaveTypes);
    // }    
}

export class Country {
    constructor(public id: number, public name: string) { }
}


// import { Component } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'about-home',
//   template: `<h3>About Home</h3>`
// })
// export class AboutHomeComponent { }

// @Component({
//   selector: 'about-item',
//   template: `<h3>About Item Id: {{id}}</h3>`
// })
// export class AboutItemComponent { 
//   id: any;
//   paramsSub: any;

//   constructor(private activatedRoute: ActivatedRoute) { }

//   ngOnInit() {
//     this.paramsSub = this.activatedRoute.params.subscribe(params => this.id = +params['id']);
//   }

//   ngOnDestroy() {
//     this.paramsSub.unsubscribe();
//   }
// }

// @Component({
//   selector: 'app-about',
//   template: `
//     <h2>About</h2>
//     <a [routerLink]="['/about']">Home</a>
//     <a [routerLink]="['/about/item', 1]">Item 1</a>
//     <a [routerLink]="['/about/item', 2]">Item 2</a>
//     <div class="inner-outlet">
//       <router-outlet></router-outlet>
//     </div>
//   `
// })
// export class AboutComponent { }

// @Component({
//     selector: 'app-about',
//   template: `
//     <p>Apply Leave<p>

//   `
// })
// export class ApplyLeaveComponent { }
