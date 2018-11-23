import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] },
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'explore',
    loadChildren: './explore/explore.module#ExploreModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    loadChildren: './search/search.module#SearchModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'mylibrary',
    loadChildren: './my-library/my-library.module#MyLibraryModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'myactivity',
    loadChildren: './my-activity/my-activity.module#MyActivityModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule'
  },
  {
    path: 'createaccount',
    loadChildren: './create-account/create-account.module#CreateAccountModule'
  },
  {
    path: 'resetpassword',
    loadChildren: './reset-password/reset-password.module#ResetPasswordModule'
  },
  { path: 'login', loadChildren: './login/login.module#LoginModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
