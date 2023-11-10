import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './components/login.component';
import { LoginPageComponent } from './containers/login-page';
import { LoginRoutingModule } from './login-routing.module';
import { DividerComponent } from './components/divider/divider.component';

@NgModule({
  imports: [SharedModule, RouterModule, LoginRoutingModule],
  declarations: [LoginComponent, LoginPageComponent, DividerComponent],
  providers: [],
})
export class LoginModule {}
