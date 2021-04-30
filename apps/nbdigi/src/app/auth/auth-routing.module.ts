import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards';

const routes: Routes = [
  { path: '',
    redirectTo: 'login',
    pathMatch: 'full' },
  {
    path: 'createaccount',
    loadChildren: () => import('./create-account/create-account.module').then(m => m.CreateAccountModule)
  },
  {
    path: 'resetpassword',
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
