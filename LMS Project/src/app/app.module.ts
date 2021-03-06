﻿import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { fakeBackendProvider } from './_helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService, AdminService } from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { AdminComponent } from './admin/index';
import { ApplyLeaveComponent } from './applyleave/index';
import { RegisterComponent } from './register/index';
import { ConfigService } from './config/apiconfig';
import { GlobalService } from './global';
import { UserComponent } from './userdashboard/index';
import { AdminDashComponent } from './admindashboard/index';
import { AdminSettingsComponent } from './adminsettings/index';
import { DatePickerModule } from 'ng2-datepicker';
import { AdminAddLeavesComponent } from './AdminAddLeaves/index';
import { AdminUploadFileComponent } from './AdminUploadPDF/index';
import { GenerateReportComponent } from './GenerateReport/index';
import { AdminAddUserComponent } from './AdminAddUser/index';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipe } from './_helpers/data-filter.pipe';
import { LeaveTypesFilterPipe } from './_helpers/LeaveTypesdata-filter.pipe';
import { AppliedLeaveFilterPipe } from './_helpers/appliedLeave-filter.pipe';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomFormsModule } from 'ng2-validation';
import { ToastModule, ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { NguiPopupComponent, NguiPopupModule } from '@ngui/popup';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';


export class CustomOptions extends ToastOptions {
    animate = 'fade';
    dismiss = 'auto';
    showCloseButton = true;
    newestOnTop = true;
    enableHTML = true;
    positionClass: 'toast-bottom-center';
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        DatePickerModule,
        DataTableModule,
        Ng2SmartTableModule,
        CustomFormsModule,
        ToastModule.forRoot(),
        BrowserAnimationsModule,
        //NguiPopupModule,
        Ng2Bs3ModalModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        AdminComponent,
        ApplyLeaveComponent,
        UserComponent,
        AdminDashComponent,
        DataFilterPipe,
        AdminSettingsComponent,
        LeaveTypesFilterPipe,
        AppliedLeaveFilterPipe,
        AdminAddUserComponent,
        AdminAddLeavesComponent,
       AdminUploadFileComponent,
       GenerateReportComponent
 ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        AdminService,
        ConfigService,
        GlobalService,
        // providers used to create fake backend
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions,
        { provide: ToastOptions, useClass: CustomOptions }
    ],
    bootstrap: [AppComponent],
    //entryComponents: [NguiPopupComponent]
})

export class AppModule { }

