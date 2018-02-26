import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordPageComponent } from './containers/reset-password-page';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  imports: [SharedModule, ResetPasswordRoutingModule],
  declarations: [ResetPasswordPageComponent, ResetPasswordComponent]
})
export class ResetPasswordModule {}
