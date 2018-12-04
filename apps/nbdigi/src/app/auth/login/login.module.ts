import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './components/login.component';
import { LoginPageComponent } from './containers/login-page';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [SharedModule, RouterModule, LoginRoutingModule],
  declarations: [LoginComponent, LoginPageComponent],
  providers: []
})
export class LoginModule {}
