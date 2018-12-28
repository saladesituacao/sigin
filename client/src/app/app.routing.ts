/**
 * Created by griga on 7/11/16.
 */

import {Routes, RouterModule} from '@angular/router';
import {MainLayoutComponent} from "./shared/layout/app-layouts/main-layout.component";
import {EmptyLayoutComponent} from "./shared/layout/app-layouts/empty-layout.component";
import {ModuleWithProviders} from "@angular/core";
import {LoginComponent} from './auth/login.component';
import {AuthenticationService} from './services/authentication.service';

export const routes: Routes = [
  { path: '', component: EmptyLayoutComponent, loadChildren: 'app/site/site.module#SiteModule'},
  { path: 'admin', component: MainLayoutComponent, loadChildren: 'app/admin/admin.module#AdminModule', canActivate: [AuthenticationService]},
  { path: 'login', component: LoginComponent},
  {path: '**', redirectTo: ''}
//
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
