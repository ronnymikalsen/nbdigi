import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ResetPasswordPageComponent } from './containers/reset-password-page';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: ResetPasswordPageComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class ResetPasswordRoutingModule {}
