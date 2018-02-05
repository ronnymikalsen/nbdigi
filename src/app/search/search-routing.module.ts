import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchPageComponent } from './containers/search-page';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: SearchPageComponent }])],
  exports: [RouterModule]
})
export class SearchRoutingModule {}
