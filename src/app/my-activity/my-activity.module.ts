import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { CriteriaListItemModule } from './../criteria-list-item/criteria-list-item.module';
import { ItemListModule } from './../item-list/item-list.module';
import { ItemActivityComponent } from './components/item-activity/item-activity.component';
import { MyActivityComponent } from './components/my-activity/my-activity.component';
import { SearchActivityComponent } from './components/search-activity/search-activity.component';
import { MyActivityPageComponent } from './containers/my-activity-page';
import { MyActivityRoutingModule } from './my-activity-routing.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    MyActivityRoutingModule,
    CriteriaListItemModule,
    ItemListModule
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
