import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_guards/index';
import { AdminComponent } from './admin/index';
import { ApplyLeaveComponent } from './applyleave/index';
import { UserComponent } from './userdashboard/index';
import { AdminDashComponent } from './admindashboard/index';
import { AdminSettingsComponent } from './adminsettings/index';
import { AdminAddUserComponent } from './AdminAddUser/index';
import { AdminAddLeavesComponent } from './AdminAddLeaves/index';
import { AdminUploadFileComponent } from './AdminUploadPDF/index';
import { GenerateReportComponent } from './GenerateReport/index';
const appRoutes: Routes = [
    {
        path: '', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            {
                path: 'applyleave',
                component: ApplyLeaveComponent,
            },
            {
                path: 'userdashboard',
                component: UserComponent,
            },
        ]
    },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'admin', component: AdminComponent, canActivate: [AuthGuard],
        children: [
            {
                path: 'admindashboard',
                component: AdminDashComponent,
            },
            {
                path: 'adminsettings',
                component: AdminSettingsComponent,
            },
            {
                path: 'AdminAddUser',
                component: AdminAddUserComponent,
            },
            {

                path: 'AdminAddLeaves',
                component: AdminAddLeavesComponent,
            },
            {
                path: 'AdminUploadPDF',
                component: AdminUploadFileComponent,

            },
             {
                path: 'GenerateReport',
                component: GenerateReportComponent,

            }
        ]
    },
    // { path: 'applyleave', component: ApplyLeaveComponent,canActivate: [AuthGuard]},
    // otherwise redirect to home
    { path: '**', redirectTo: '' }

];

export const routing = RouterModule.forRoot(appRoutes); 