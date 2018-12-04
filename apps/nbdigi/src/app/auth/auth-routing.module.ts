import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    canActivate: [AuthGuard]
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
