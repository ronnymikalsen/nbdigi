import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetPasswordPageComponent } from './containers/reset-password-page';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';

@NgModule({
  imports: [SharedModule, ResetPasswordRoutingModule],
  declarations: [ResetPasswordPageComponent, ResetPasswordComponent],
})
export class ResetPasswordModule {}
