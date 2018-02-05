import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginPageComponent } from './containers/login-page';
import { LoginComponent } from './components/login.component';

@NgModule({
  imports: [SharedModule, RouterModule, LoginRoutingModule],
  declarations: [LoginComponent, LoginPageComponent],
  providers: []
})
export class LoginModule {}
