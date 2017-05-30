import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_guards/index';
import { AdminComponent } from './admin/index';
import { ApplyLeaveComponent } from './applyleave/index';
import { UserComponent } from './userdashboard/index';
import { AdminDashComponent } from './admindashboard/index';

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
            }
        ]
    },
    // { path: 'applyleave', component: ApplyLeaveComponent,canActivate: [AuthGuard]},
    // otherwise redirect to home
    { path: '**', redirectTo: '' }

];

export const routing = RouterModule.forRoot(appRoutes); 