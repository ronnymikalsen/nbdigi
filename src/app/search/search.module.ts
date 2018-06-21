import { NgModule } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SharedModule } from '../shared/shared.module';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './components/search/search.component';
import { SearchPageComponent } from './containers/search-page';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MediaTypeButtonComponent } from './components/media-type-button/media-type-button.component';
import { MediaTypeOptionComponent } from './components/media-type-option/media-type-option.component';
import { DebugModule } from './../shared/debug/debug.module';
import { SearchBoxModule } from '../shared/search-box/search-box.module';
import { ItemsSectionModule } from './../shared/items-section/items-section.module';
import { CriteriaListItemModule } from './../shared/criteria-list-item/criteria-list-item.module';

@NgModule({
  imports: [
    InfiniteScrollModule,
    SharedModule,
    SearchBoxModule,
    SearchRoutingModule,
    ItemsSectionModule,
    DebugModule,
    CriteriaListItemModule
  ],
  declarations: [
    SearchPageComponent,
    SearchComponent,
    ToolbarComponent,
    MediaTypeButtonComponent,
    MediaTypeOptionComponent
  ],
  providers: []
})
export class SearchModule {}
