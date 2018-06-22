import { NgModule } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SearchBoxModule } from '../shared/search-box/search-box.module';
import { SharedModule } from '../shared/shared.module';
import { CriteriaListItemModule } from './../shared/criteria-list-item/criteria-list-item.module';
import { DebugModule } from './../shared/debug/debug.module';
import { ItemsSectionModule } from './../shared/items-section/items-section.module';
import { MediaTypeButtonComponent } from './components/media-type-button/media-type-button.component';
import { MediaTypeOptionComponent } from './components/media-type-option/media-type-option.component';
import { SearchComponent } from './components/search/search.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SearchPageComponent } from './containers/search-page';
import { SearchRoutingModule } from './search-routing.module';

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
  entryComponents: [],
  exports: [],
  providers: []
})
export class SearchModule {}
