import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CriteriaListItemModule } from '../shared/criteria-list-item/criteria-list-item.module';
import { ItemListModule } from '../shared/item-list/item-list.module';
import { SharedModule } from '../shared/shared.module';
import { ItemActivityComponent } from './components/item-activity/item-activity.component';
import { MyActivityComponent } from './components/my-activity/my-activity.component';
import { SearchActivityComponent } from './components/search-activity/search-activity.component';
import { MyActivityPageComponent } from './containers/my-activity-page';
import { MyActivityRoutingModule } from './my-activity-routing.module';
import { SettingsModule } from './settings/settings.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    MyActivityRoutingModule,
    CriteriaListItemModule,
    ItemListModule,
    SettingsModule
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
