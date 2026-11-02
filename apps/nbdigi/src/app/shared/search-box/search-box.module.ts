import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { ChatResultGrid } from './components/chat-result-grid/chat-result-grid';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { SearchBoxPageComponent } from './containers/search-box-page';

@NgModule({
  imports: [SharedModule, ChatResultGrid, RouterModule],
  declarations: [SearchBoxComponent, SearchBoxPageComponent],
  exports: [SearchBoxPageComponent],
  providers: [],
})
export class SearchBoxModule {}
