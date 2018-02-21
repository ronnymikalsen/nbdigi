import { NgModule } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SharedModule } from '../shared/shared.module';
import { SearchRoutingModule } from './search-routing.module';
import { SearchBoxModule } from './components/search-box/search-box.module';
import { SearchComponent } from './components/search/search.component';
import { SearchPageComponent } from './containers/search-page';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ItemsSectionComponent } from './components/items-section/items-section.component';
import { DefaultItemCardComponent } from './components/default-item-card/default-item-card.component';
import { MediaTypeButtonComponent } from './components/media-type-button/media-type-button.component';
import { MediaTypeOptionComponent } from './components/media-type-option/media-type-option.component';

@NgModule({
  imports: [
    InfiniteScrollModule,
    SharedModule,
    SearchBoxModule,
    SearchRoutingModule
  ],
  declarations: [
    SearchPageComponent,
    SearchComponent,
    ToolbarComponent,
    ItemsSectionComponent,
    DefaultItemCardComponent,
    MediaTypeButtonComponent,
    MediaTypeOptionComponent
  ],
  providers: []
})
export class SearchModule {}
