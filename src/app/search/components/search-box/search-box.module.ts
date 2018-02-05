import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { SearchBoxComponent } from './search-box.component';

@NgModule({
  imports: [SharedModule],
  exports: [SearchBoxComponent],
  declarations: [SearchBoxComponent],
  providers: []
})
export class SearchBoxModule {}
