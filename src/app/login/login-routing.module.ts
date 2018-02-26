import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginPageComponent } from './containers/login-page';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: LoginPageComponent }])
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
