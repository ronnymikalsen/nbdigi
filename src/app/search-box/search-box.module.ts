import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { SearchBoxPageComponent } from './containers/search-box-page';

@NgModule({
  imports: [SharedModule],
  declarations: [SearchBoxComponent, SearchBoxPageComponent],
  exports: [SearchBoxPageComponent],
  providers: []
})
export class SearchBoxModule {}
