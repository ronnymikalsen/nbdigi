import { CriteriaListItemModule } from './../criteria-list-item/criteria-list-item.module';
import { ItemActivityComponent } from './components/item-activity/item-activity.component';
import { SearchActivityComponent } from './components/search-activity/search-activity.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { MyActivityRoutingModule } from './my-activity-routing.module';
import { MyActivityPageComponent } from './containers/my-activity-page';
import { MyActivityComponent } from './components/my-activity/my-activity.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    MyActivityRoutingModule,
    CriteriaListItemModule
  ],
  declarations: [
    MyActivityPageComponent,
    MyActivityComponent,
    SearchActivityComponent,
    ItemActivityComponent
  ],
  providers: []
})
export class MyActivityModule {}
