import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { SearchRoutingModule } from './search-routing.module';
import { SearchBoxModule } from './components/search-box/search-box.module';
import { SearchComponent } from './components/search/search.component';
import { SearchPageComponent } from './containers/search-page';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ItemsSectionComponent } from './components/items-section/items-section.component';

@NgModule({
  imports: [SharedModule, SearchBoxModule, SearchRoutingModule],
  declarations: [SearchPageComponent, SearchComponent, ToolbarComponent, ItemsSectionComponent],
  providers: []
})
export class SearchModule {}
