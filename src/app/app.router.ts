import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { FirstPageComponent } from './first-page/first-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import {AuthGuard} from './auth.guard';

export const router: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardPageComponent , canActivate:[AuthGuard]},
    {path: 'profile', component: UserProfileComponent , canActivate:[AuthGuard]},
    {path: 'settings', component: UserSettingsComponent , canActivate:[AuthGuard]},
    {path: 'home', component: FirstPageComponent},
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
]

export const routes: ModuleWithProviders = RouterModule.forRoot(router);