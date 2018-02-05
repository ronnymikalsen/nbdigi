import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { MyActivityRoutingModule } from './my-activity-routing.module';
import { MyActivityPageComponent } from './containers/my-activity-page';
import { MyActivityComponent } from './components/my-activity/my-activity.component';

@NgModule({
  imports: [SharedModule, RouterModule, MyActivityRoutingModule],
  declarations: [MyActivityPageComponent, MyActivityComponent],
  providers: []
})
export class MyActivityModule {}
