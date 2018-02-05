import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyActivityPageComponent } from './containers/my-activity-page';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: MyActivityPageComponent }])],
  exports: [RouterModule]
})
export class MyActivityRoutingModule {}
