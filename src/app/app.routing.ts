import { Routes, RouterModule } from '@angular/router';

import { InicioComponent } from './inicio';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    { path: '', component: InicioComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },

    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);