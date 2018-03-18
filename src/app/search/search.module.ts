import { ItemsSectionModule } from './../items-section/items-section.module';
import { NgModule } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SharedModule } from '../shared/shared.module';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './components/search/search.component';
import { SearchPageComponent } from './containers/search-page';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MediaTypeButtonComponent } from './components/media-type-button/media-type-button.component';
import { MediaTypeOptionComponent } from './components/media-type-option/media-type-option.component';
import { DebugModule } from './../debug/debug.module';
import { SearchBoxModule } from '../search-box/search-box.module';

@NgModule({
  imports: [
    InfiniteScrollModule,
    SharedModule,
    SearchBoxModule,
    SearchRoutingModule,
    ItemsSectionModule,
    DebugModule
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
