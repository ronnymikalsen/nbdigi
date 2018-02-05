import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExplorePageComponent } from './containers/explore-page';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: ExplorePageComponent }])],
  exports: [RouterModule]
})
export class ExploreRoutingModule {}
