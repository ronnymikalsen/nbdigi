import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreateAccountPageComponent } from './containers/create-account-page';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: CreateAccountPageComponent }])
  ],
  exports: [RouterModule]
})
export class CreateAccountRoutingModule {}
